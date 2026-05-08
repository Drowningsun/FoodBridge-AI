"""Authentication router — register, login, refresh, OAuth, password reset."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import uuid
import secrets

from core.database import get_db
from core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_refresh_token
from core.dependencies import get_current_user
from models.user import User, UserRole
from schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse, RefreshRequest,
    ForgotPasswordRequest, ResetPasswordRequest, UserResponse, UserUpdateRequest,
)

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user."""
    # Check if email exists
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        id=uuid.uuid4(),
        email=request.email,
        name=request.name,
        password_hash=hash_password(request.password),
        role=UserRole(request.role),
        phone=request.phone,
        address=request.address,
        city=request.city,
        state=request.state,
        lat=request.lat,
        lng=request.lng,
        verification_token=secrets.token_urlsafe(32),
    )
    db.add(user)
    await db.flush()

    # Generate tokens
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role.value,
            phone=user.phone,
            address=user.address,
            city=user.city,
            state=user.state,
            lat=user.lat,
            lng=user.lng,
            is_verified=user.is_verified,
            created_at=str(user.created_at) if user.created_at else None,
        ),
    )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    result = await db.execute(
        select(User).where(User.email == request.email, User.deleted_at.is_(None))
    )
    user = result.scalar_one_or_none()

    if not user or not user.password_hash or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role.value,
            avatar_url=user.avatar_url,
            phone=user.phone,
            address=user.address,
            city=user.city,
            state=user.state,
            lat=user.lat,
            lng=user.lng,
            is_verified=user.is_verified,
            created_at=str(user.created_at) if user.created_at else None,
        ),
    )


@router.post("/refresh", response_model=dict)
async def refresh_token(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token."""
    payload = decode_refresh_token(request.refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
    new_access_token = create_access_token(token_data)

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role.value,
        avatar_url=current_user.avatar_url,
        phone=current_user.phone,
        address=current_user.address,
        city=current_user.city,
        state=current_user.state,
        lat=current_user.lat,
        lng=current_user.lng,
        is_verified=current_user.is_verified,
        created_at=str(current_user.created_at) if current_user.created_at else None,
    )


@router.put("/me", response_model=UserResponse)
async def update_me(
    request: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user profile."""
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    current_user.updated_at = datetime.now(timezone.utc)
    await db.flush()

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role.value,
        avatar_url=current_user.avatar_url,
        phone=current_user.phone,
        address=current_user.address,
        city=current_user.city,
        state=current_user.state,
        lat=current_user.lat,
        lng=current_user.lng,
        is_verified=current_user.is_verified,
        created_at=str(current_user.created_at) if current_user.created_at else None,
    )


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Request password reset."""
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()

    if user:
        user.reset_token = secrets.token_urlsafe(32)
        from datetime import timedelta
        user.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=1)
        await db.flush()

    # Always return success to prevent email enumeration
    return {"message": "If the email exists, a password reset link has been sent."}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset password using token."""
    result = await db.execute(
        select(User).where(
            User.reset_token == request.token,
            User.reset_token_expires > datetime.now(timezone.utc),
        )
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user.password_hash = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    await db.flush()

    return {"message": "Password reset successful"}
