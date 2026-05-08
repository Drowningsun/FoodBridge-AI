"""Rating model."""

from sqlalchemy import Column, Integer, Float, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from core.database import Base


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    donation_id = Column(UUID(as_uuid=True), ForeignKey("donations.id"), nullable=False)
    score = Column(Float, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    donation = relationship("Donation", back_populates="ratings")

    def __repr__(self):
        return f"<Rating {self.score}/5>"
