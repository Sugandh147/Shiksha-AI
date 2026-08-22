"""
app/routers/health.py
──────────────────────
Health-check endpoints.
Used to verify:
  • The FastAPI server is running.
  • The database connection is alive.
  • The ORM tables exist (post-migration).
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect

from app.db.database import get_db
from app.config import settings
from app.schemas.common import HealthResponse, DatabaseHealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/", response_model=HealthResponse, summary="API Health Check")
def health_check():
    """
    Returns server status.
    A 200 response confirms FastAPI is running correctly.
    """
    return HealthResponse(
        status="ok",
        message=f"{settings.app_name} API is running 🚀",
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/db", response_model=DatabaseHealthResponse, summary="Database Health Check")
def database_health(db: Session = Depends(get_db)):
    """
    Tests the PostgreSQL connection and counts tables.
    A 200 response confirms the database is connected and migrations ran.
    """
    # Execute a trivial SQL query — will raise if DB is unreachable
    db.execute(text("SELECT 1"))

    # Count tables visible to SQLAlchemy's inspector
    inspector = inspect(db.get_bind())
    tables = inspector.get_table_names()

    return DatabaseHealthResponse(
        status="ok",
        database="PostgreSQL connected ✅",
        tables_found=len(tables),
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/ping", summary="Simple ping")
def ping():
    """Lightweight liveness probe — returns pong instantly."""
    return {"ping": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}
