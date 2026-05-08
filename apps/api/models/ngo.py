"""NGO model — NGO organization profiles."""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from core.database import Base


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    org_name = Column(String(255), nullable=False)
    registration_number = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    capacity = Column(Integer, nullable=False, default=100)  # max people they can serve
    current_load = Column(Integer, default=0)  # current people being served

    # Preferences
    food_preferences = Column(JSON, nullable=True)  # list of preferred food categories
    accepts_non_veg = Column(Boolean, default=True)

    # Location
    area_served = Column(String(255), nullable=True)
    service_radius_km = Column(Float, default=15.0)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    # Verification
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    documents = Column(JSON, nullable=True)

    # Stats
    total_received = Column(Integer, default=0)
    rating = Column(Float, default=5.0)
    total_ratings = Column(Integer, default=0)

    # Availability
    operating_hours = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="ngo_profile")
    deliveries = relationship("Delivery", back_populates="ngo", lazy="selectin")

    def __repr__(self):
        return f"<NGO {self.org_name}>"
