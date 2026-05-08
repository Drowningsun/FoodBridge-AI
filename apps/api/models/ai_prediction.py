"""AI Prediction model — stores ML prediction results."""

from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from core.database import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), nullable=False)
    guest_count = Column(Integer, nullable=False)
    menu_type = Column(String(100), nullable=True)
    cuisine_type = Column(String(100), nullable=True)
    weather = Column(String(50), nullable=True)
    day_of_week = Column(Integer, nullable=True)
    hour = Column(Integer, nullable=True)
    predicted_quantity_kg = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=True)
    model_version = Column(String(50), default="v1.0")
    input_features = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<AIPrediction {self.predicted_quantity_kg}kg conf={self.confidence_score}>"
