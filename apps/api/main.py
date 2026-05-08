"""
FoodBridge AI — Backend API
FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import structlog

from core.config import settings
from core.database import engine, Base
from routers import auth, donations, users, matching, routes, notifications, analytics, chatbot, volunteers, admin

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager."""
    logger.info("🚀 FoodBridge AI API starting up...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables created/verified")

    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    logger.info("✅ Upload directory ready")

    yield

    logger.info("👋 FoodBridge AI API shutting down...")
    await engine.dispose()


app = FastAPI(
    title="FoodBridge AI API",
    description="AI-powered food waste management platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(donations.router, prefix="/api/donations", tags=["Donations"])
app.include_router(matching.router, prefix="/api/matching", tags=["NGO Matching"])
app.include_router(routes.router, prefix="/api/routes", tags=["Route Optimization"])
app.include_router(volunteers.router, prefix="/api/volunteers", tags=["Volunteers"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "name": "FoodBridge AI API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "foodbridge-api"}
