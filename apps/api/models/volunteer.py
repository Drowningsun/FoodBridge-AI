"""Volunteer model — volunteer profiles and tracking."""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from core.database import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    # Vehicle
    vehicle_type = Column(String(50), default="bike")  # bike, car, van, on_foot
    license_plate = Column(String(20), nullable=True)

    # Location
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    service_radius_km = Column(Float, default=10.0)

    # Availability
    availability = Column(JSON, nullable=True)  # schedule by day
    is_active = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)

    # Stats
    total_deliveries = Column(Integer, default=0)
    total_distance_km = Column(Float, default=0.0)
    points = Column(Integer, default=0)
    rating = Column(Float, default=5.0)
    total_ratings = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="volunteer_profile")
    deliveries = relationship("Delivery", back_populates="volunteer", lazy="selectin")

    def __repr__(self):
        return f"<Volunteer user={self.user_id} active={self.is_active}>"
