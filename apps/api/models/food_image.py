"""Food Image model — stores uploaded images and AI analysis results."""

from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from core.database import Base


class FoodImage(Base):
    __tablename__ = "food_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    donation_id = Column(UUID(as_uuid=True), ForeignKey("donations.id"), nullable=False, index=True)
    url = Column(String(500), nullable=False)
    filename = Column(String(255), nullable=True)
    freshness_score = Column(Float, nullable=True)
    spoilage_probability = Column(Float, nullable=True)
    classification = Column(String(50), nullable=True)  # fresh, stale, spoiled
    analyzed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    donation = relationship("Donation", back_populates="food_images")

    def __repr__(self):
        return f"<FoodImage {self.filename} score={self.freshness_score}>"
