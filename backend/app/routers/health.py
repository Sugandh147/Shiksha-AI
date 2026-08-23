"""
app/routers/health.py
──────────────────────
Health-check endpoints for ShikshaAI.
Used to verify:
  • The FastAPI server is running.
  • The database connection is alive.
  • The ORM tables exist (post-migration).
  • RAG Knowledge Base documents & chunks status.
  • AI Gemini Provider API Key configuration status.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect

from app.db.database import get_db
from app.db.models import Document, DocumentChunk
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
    Tests database connection and counts tables.
    """
    db.execute(text("SELECT 1"))
    inspector = inspect(db.get_bind())
    tables = inspector.get_table_names()

    return DatabaseHealthResponse(
        status="ok",
        database="Database connected ✅",
        tables_found=len(tables),
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/system", summary="Comprehensive System Infrastructure Health Check")
def system_health(db: Session = Depends(get_db)):
    """
    Comprehensive infrastructure probe for developer setup verification.
    """
    # 1. DB Connectivity & Table Inspector
    try:
        db.execute(text("SELECT 1"))
        inspector = inspect(db.get_bind())
        tables_count = len(inspector.get_table_names())
        db_ok = True
    except Exception as e:
        tables_count = 0
        db_ok = False

    # 2. RAG Knowledge Base Status
    try:
        docs_count = db.query(Document).count()
        chunks_count = db.query(DocumentChunk).count()
    except Exception:
        docs_count = 0
        chunks_count = 0

    # 3. AI Gemini API Key Configuration
    gemini_key = settings.gemini_api_key or ""
    ai_configured = bool(
        gemini_key and
        not gemini_key.startswith("your_") and
        gemini_key != "placeholder"
    )

    return {
        "status": "ok" if db_ok else "error",
        "app_name": settings.app_name,
        "version": settings.app_version,
        "database": {
            "connected": db_ok,
            "tables_found": tables_count,
        },
        "rag_knowledge_base": {
            "documents_count": docs_count,
            "chunks_count": chunks_count,
            "ready": docs_count > 0 and chunks_count > 0,
        },
        "ai_provider": {
            "provider": "Google Gemini 1.5 Flash",
            "api_key_configured": ai_configured,
            "notice": "Configure GEMINI_API_KEY in .env for live AI tutoring" if not ai_configured else "Configured",
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/ping", summary="Simple ping")
def ping():
    """Lightweight liveness probe — returns pong instantly."""
    return {"ping": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}
