"""Notification model."""

from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum

from core.database import Base


class NotificationType(str, enum.Enum):
    DONATION_CREATED = "donation_created"
    NGO_MATCHED = "ngo_matched"
    PICKUP_ASSIGNED = "pickup_assigned"
    DELIVERY_COMPLETE = "delivery_complete"
    EXPIRY_WARNING = "expiry_warning"
    SYSTEM = "system"
    FRAUD_ALERT = "fraud_alert"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    type = Column(SAEnum(NotificationType), default=NotificationType.SYSTEM)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return f"<Notification {self.title} read={self.is_read}>"
