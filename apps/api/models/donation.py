"""Donation model — food donation listings from donors."""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SAEnum, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from core.database import Base


class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    AI_VERIFIED = "ai_verified"
    NGO_MATCHED = "ngo_matched"
    PICKUP_ASSIGNED = "pickup_assigned"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class FoodCategory(str, enum.Enum):
    COOKED_MEAL = "cooked_meal"
    RAW_VEGETABLES = "raw_vegetables"
    FRUITS = "fruits"
    BAKERY = "bakery"
    DAIRY = "dairy"
    PACKAGED = "packaged"
    BEVERAGES = "beverages"
    OTHER = "other"


class Donation(Base):
    __tablename__ = "donations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    donor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    # Food details
    food_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Float, nullable=False)  # in kg
    quantity_unit = Column(String(20), default="kg")
    estimated_servings = Column(Integer, nullable=True)
    category = Column(SAEnum(FoodCategory), default=FoodCategory.COOKED_MEAL)
    is_veg = Column(Boolean, default=True)
    allergens = Column(JSON, nullable=True)  # list of allergen strings
    cuisine_type = Column(String(100), nullable=True)

    # Time
    preparation_time = Column(DateTime(timezone=True), nullable=True)
    expiry_time = Column(DateTime(timezone=True), nullable=False)

    # Location
    pickup_address = Column(Text, nullable=False)
    pickup_city = Column(String(100), nullable=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    # Status
    status = Column(SAEnum(DonationStatus), default=DonationStatus.PENDING, index=True)

    # AI
    ai_freshness_score = Column(Float, nullable=True)
    ai_spoilage_probability = Column(Float, nullable=True)

    # Media
    images = Column(JSON, nullable=True)  # list of image URLs

    notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    donor = relationship("User", back_populates="donations")
    delivery = relationship("Delivery", back_populates="donation", uselist=False, lazy="selectin")
    food_images = relationship("FoodImage", back_populates="donation", lazy="selectin")
    ratings = relationship("Rating", back_populates="donation", lazy="selectin")

    def __repr__(self):
        return f"<Donation {self.food_name} ({self.status})>"
