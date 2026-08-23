"""
app/config.py
─────────────
Centralized settings loaded from the .env file using pydantic-settings.
Any module in the app can do:  from app.config import settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    # ── App metadata ──────────────────────────────────────────────────────────
    app_name: str = "ShikshaAI"
    app_version: str = "1.0.0"
    debug: bool = True

    # ── Database ──────────────────────────────────────────────────────────────
    database_url: str = "sqlite:///./shikshaai.db"

    # ── JWT Auth ──────────────────────────────────────────────────────────────
    secret_key: str = "your_super_secret_jwt_key_default_change_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    # ── AI (Phase 2) ──────────────────────────────────────────────────────────
    gemini_api_key: str = "placeholder"

    # ── CORS ──────────────────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()  # Only reads .env once — cached for performance
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
