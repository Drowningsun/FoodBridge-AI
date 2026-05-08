"""Delivery model — tracks food delivery lifecycle."""

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SAEnum, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from core.database import Base


class DeliveryStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    donation_id = Column(UUID(as_uuid=True), ForeignKey("donations.id"), nullable=False, index=True)
    ngo_id = Column(UUID(as_uuid=True), ForeignKey("ngos.id"), nullable=False, index=True)
    volunteer_id = Column(UUID(as_uuid=True), ForeignKey("volunteers.id"), nullable=True, index=True)

    status = Column(SAEnum(DeliveryStatus), default=DeliveryStatus.PENDING)

    # Route
    route_data = Column(JSON, nullable=True)  # optimized route waypoints
    distance_km = Column(Float, nullable=True)
    estimated_time_min = Column(Float, nullable=True)

    # Tracking
    pickup_time = Column(DateTime(timezone=True), nullable=True)
    delivery_time = Column(DateTime(timezone=True), nullable=True)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)

    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    donation = relationship("Donation", back_populates="delivery")
    ngo = relationship("NGO", back_populates="deliveries")
    volunteer = relationship("Volunteer", back_populates="deliveries")

    def __repr__(self):
        return f"<Delivery {self.id} ({self.status})>"
