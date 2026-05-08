"""Chatbot router — rule-based AI assistant with keyword matching."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
import re

from core.database import get_db
from core.dependencies import get_optional_user
from models.user import User
from models.chatbot_log import ChatbotLog
from schemas.models import ChatMessage, ChatResponse

router = APIRouter()

# Knowledge base for the chatbot
KNOWLEDGE_BASE = {
    "donation": {
        "keywords": ["donate", "donation", "give", "food", "surplus", "leftover", "share"],
        "response": "To create a food donation:\n1. Go to Dashboard → New Donation\n2. Fill in food details (name, quantity, expiry)\n3. Add your pickup location\n4. Upload food images for AI verification\n5. Submit — we'll match you with a nearby NGO!\n\nYour food can save lives! 🍽️",
        "suggestions": ["How does matching work?", "What food can I donate?", "Track my donation"],
    },
    "ngo": {
        "keywords": ["ngo", "organization", "charity", "receive", "accept", "register ngo"],
        "response": "NGO Registration:\n1. Sign up with the 'NGO' role\n2. Complete your organization profile\n3. Set your capacity and food preferences\n4. Get verified by our admin team\n5. Start receiving matched donations!\n\nWe verify all NGOs to ensure food reaches those in need. 🏢",
        "suggestions": ["How to get verified?", "What capacity should I set?", "View incoming donations"],
    },
    "volunteer": {
        "keywords": ["volunteer", "delivery", "pickup", "drive", "help", "deliver"],
        "response": "Become a Volunteer:\n1. Register with the 'Volunteer' role\n2. Set your vehicle type and availability\n3. Accept delivery assignments near you\n4. Pick up and deliver food to NGOs\n5. Earn points and climb the leaderboard! 🏆\n\nEvery delivery makes a difference! 🚗",
        "suggestions": ["How do points work?", "Set my availability", "View leaderboard"],
    },
    "tracking": {
        "keywords": ["track", "status", "where", "delivery status", "follow"],
        "response": "Track your donations in real-time:\n• **Pending** → Waiting for AI verification\n• **AI Verified** → Quality checked ✅\n• **NGO Matched** → Paired with nearby NGO\n• **Pickup Assigned** → Volunteer on the way\n• **In Transit** → Food being delivered\n• **Delivered** → Successfully redistributed! 🎉\n\nCheck your dashboard for live updates.",
        "suggestions": ["View my donations", "Contact volunteer", "Report an issue"],
    },
    "ai": {
        "keywords": ["ai", "predict", "freshness", "spoilage", "quality", "machine learning", "artificial intelligence"],
        "response": "Our AI Systems:\n🧠 **Leftover Prediction** — Predicts surplus food quantity based on event type, guest count, and weather\n🔬 **Freshness Detection** — Analyzes food images to detect spoilage\n📊 **Smart Matching** — Finds the best NGO match using distance, capacity, and preferences\n🗺️ **Route Optimization** — Calculates the fastest delivery routes\n\nAll powered by machine learning! 🤖",
        "suggestions": ["Try prediction tool", "How accurate is the AI?", "Upload food image"],
    },
    "impact": {
        "keywords": ["impact", "save", "environment", "co2", "carbon", "sustainability", "waste"],
        "response": "Your Impact Matters!\n🍽️ Every 1 kg of food saved = 2 meals for someone in need\n🌍 Every 1 kg = 2.5 kg CO2 emissions prevented\n💧 Food waste reduction saves water and land resources\n\nCheck your personal impact score on the dashboard! Together, we've saved thousands of meals. 🌱",
        "suggestions": ["View my impact", "See global stats", "Share my impact"],
    },
    "help": {
        "keywords": ["help", "support", "how", "what", "guide", "tutorial", "faq"],
        "response": "How can I help you today? Here are some things I can assist with:\n\n🍲 **Donations** — Create, track, and manage food donations\n🏢 **NGOs** — Register and manage your organization\n🚗 **Volunteering** — Sign up and deliver food\n🤖 **AI Tools** — Predict leftovers, check freshness\n📊 **Analytics** — View your impact and stats\n\nJust ask me anything! 😊",
        "suggestions": ["How to donate?", "Register as NGO", "Become a volunteer", "AI prediction"],
    },
}

DEFAULT_RESPONSE = {
    "response": "I'm not sure I understand that. Could you rephrase? Here are some topics I can help with:\n\n• Food donations\n• NGO registration\n• Volunteering\n• Tracking deliveries\n• AI features\n• Impact metrics\n\nTry asking about any of these! 🤔",
    "intent": "unknown",
    "suggestions": ["How to donate?", "AI features", "My impact", "Help"],
}


def match_intent(message: str) -> dict:
    """Match user message to an intent using keyword matching."""
    message_lower = message.lower().strip()

    best_match = None
    best_score = 0

    for intent, data in KNOWLEDGE_BASE.items():
        score = sum(1 for kw in data["keywords"] if kw in message_lower)
        if score > best_score:
            best_score = score
            best_match = intent

    if best_match and best_score > 0:
        data = KNOWLEDGE_BASE[best_match]
        confidence = "high" if best_score >= 2 else "medium"
        return {
            "response": data["response"],
            "intent": best_match,
            "confidence": confidence,
            "suggestions": data.get("suggestions", []),
        }

    return DEFAULT_RESPONSE


@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatMessage,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    """Send a message to the AI chatbot."""
    session_id = request.session_id or str(uuid.uuid4())

    # Process message
    result = match_intent(request.message)

    # Log conversation
    log = ChatbotLog(
        id=uuid.uuid4(),
        user_id=current_user.id if current_user else None,
        session_id=session_id,
        message=request.message,
        response=result["response"],
        intent=result.get("intent", "unknown"),
        confidence=result.get("confidence", "low"),
    )
    db.add(log)
    await db.flush()

    return ChatResponse(
        response=result["response"],
        intent=result.get("intent", "unknown"),
        confidence=result.get("confidence", "low"),
        suggestions=result.get("suggestions"),
        session_id=session_id,
    )


@router.get("/history/{session_id}")
async def get_chat_history(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get chat history for a session."""
    from sqlalchemy import asc
    result = await db.execute(
        select(ChatbotLog)
        .where(ChatbotLog.session_id == session_id)
        .order_by(asc(ChatbotLog.created_at))
    )
    logs = result.scalars().all()

    return [
        {
            "message": log.message,
            "response": log.response,
            "intent": log.intent,
            "created_at": str(log.created_at) if log.created_at else None,
        }
        for log in logs
    ]
