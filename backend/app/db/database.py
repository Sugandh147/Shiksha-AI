"""
app/db/database.py
──────────────────
SQLAlchemy database engine, session factory, and Base class.
Supports both PostgreSQL (production/hackathon) and SQLite (quick local dev).
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


def _make_engine():
    url = settings.database_url

    # ── SQLite (lightweight local testing) ────────────────────────────────────
    if url.startswith("sqlite"):
        return create_engine(
            url,
            connect_args={"check_same_thread": False},
            echo=settings.debug,
        )

    # ── PostgreSQL (production / hackathon) ───────────────────────────────────
    return create_engine(
        url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        echo=settings.debug,
    )


engine = _make_engine()

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency — yields a DB session, always closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
