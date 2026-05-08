"""Users router — user management endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from core.database import get_db
from core.dependencies import get_current_user, require_roles
from models.user import User
from schemas.auth import UserResponse

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
async def list_users(
    role: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    """List all users (admin only)."""
    query = select(User).where(User.deleted_at.is_(None))
    if role:
        query = query.where(User.role == role)
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    users = result.scalars().all()

    return [
        UserResponse(
            id=u.id, email=u.email, name=u.name, role=u.role.value,
            avatar_url=u.avatar_url, phone=u.phone, city=u.city,
            is_verified=u.is_verified,
            created_at=str(u.created_at) if u.created_at else None,
        )
        for u in users
    ]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific user profile."""
    result = await db.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user.id, email=user.email, name=user.name, role=user.role.value,
        avatar_url=user.avatar_url, phone=user.phone, city=user.city,
        is_verified=user.is_verified,
        created_at=str(user.created_at) if user.created_at else None,
    )
