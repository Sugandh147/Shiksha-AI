"""
app/main.py
────────────
FastAPI application entry point.

This file:
  1. Creates the FastAPI app instance.
  2. Configures CORS so the Next.js frontend can call the API.
  3. Adds global exception handlers for clean error messages.
  4. Registers all API routers under /api/v1.
  5. Exposes /docs (Swagger UI) for development.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.config import settings
from app.routers import health, auth, student, teacher, diagnostic, tutor, practice

logger = logging.getLogger(__name__)


# ── FastAPI app instance ──────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    description=(
        "🎓 ShikshaAI — AI for Equitable Education Access\n\n"
        "Backend API for adaptive learning, AI tutoring, and teacher analytics."
    ),
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# ── CORS Middleware ────────────────────────────────────────────────────────────
# This allows the Next.js frontend (running on localhost:3000) to call
# the FastAPI backend (running on localhost:8000).
# Without this, browsers block cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global Exception Handlers ─────────────────────────────────────────────────

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Returns clean 422 errors for invalid request bodies / query params."""
    logger.warning(f"Validation error on {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "detail": exc.errors(),
            "status_code": 422,
        },
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Returns clean 500 errors for database failures."""
    logger.error(f"Database error on {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Database Error",
            "detail": "An internal database error occurred.",
            "status_code": 500,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Catches any unhandled exception and returns a clean error."""
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "detail": str(exc) if settings.debug else "An unexpected error occurred.",
            "status_code": 500,
        },
    )


# ── API Routers ────────────────────────────────────────────────────────────────
# All routes live under /api/v1 for versioning.
app.include_router(health.router,           prefix="/api/v1")
app.include_router(auth.router,             prefix="/api/v1")
app.include_router(student.router,          prefix="/api/v1")
app.include_router(student.students_router, prefix="/api/v1")
app.include_router(teacher.router,          prefix="/api/v1")
app.include_router(diagnostic.router,       prefix="/api/v1")
app.include_router(tutor.router,            prefix="/api/v1")
app.include_router(practice.router,         prefix="/api/v1")


# ── Root endpoint ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/v1/health",
    }


# ── Startup / Shutdown events ─────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    logger.info(f"🚀 {settings.app_name} v{settings.app_version} started")
    logger.info(f"📚 API Docs: http://localhost:8000/docs")
    logger.info(f"🔧 Debug mode: {settings.debug}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info(f"🛑 {settings.app_name} shutting down")
