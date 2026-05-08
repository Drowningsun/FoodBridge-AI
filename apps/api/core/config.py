"""
Application configuration using pydantic-settings.
All secrets come from environment variables.
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "FoodBridge AI"
    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://foodbridge:foodbridge123@localhost:5432/foodbridge_db"
    DATABASE_URL_SYNC: str = "postgresql://foodbridge:foodbridge123@localhost:5432/foodbridge_db"

    # JWT
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    REFRESH_SECRET_KEY: str = "dev-refresh-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 10

    # ML Service
    ML_API_URL: str = "http://localhost:8001"

    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    class Config:
        env_file = "../../.env"
        case_sensitive = True


settings = Settings()
