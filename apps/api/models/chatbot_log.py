"""Chatbot log model."""

from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from core.database import Base


class ChatbotLog(Base):
    __tablename__ = "chatbot_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    intent = Column(String(100), nullable=True)
    confidence = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<ChatbotLog {self.intent}>"
