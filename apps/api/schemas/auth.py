"""Auth schemas — request/response models for authentication."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    role: str = Field(default="donor", pattern="^(donor|ngo|volunteer)$")
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token


class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    role: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_verified: bool = False
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    avatar_url: Optional[str] = None


# Resolve forward reference
TokenResponse.model_rebuild()
