"""User model — supports donor, ngo, volunteer, admin roles."""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Float, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from core.database import Base


class UserRole(str, enum.Enum):
    DONOR = "donor"
    NGO = "ngo"
    VOLUNTEER = "volunteer"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=True)  # nullable for OAuth users
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.DONOR)
    avatar_url = Column(String(500), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    # Auth
    google_id = Column(String(255), unique=True, nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    donations = relationship("Donation", back_populates="donor", lazy="selectin")
    ngo_profile = relationship("NGO", back_populates="user", uselist=False, lazy="selectin")
    volunteer_profile = relationship("Volunteer", back_populates="user", uselist=False, lazy="selectin")
    notifications = relationship("Notification", back_populates="user", lazy="selectin")

    def __repr__(self):
        return f"<User {self.email} ({self.role})>"
