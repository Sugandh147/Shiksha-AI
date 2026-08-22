"""
app/schemas/common.py
─────────────────────
Shared Pydantic response models used across multiple routers.
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Any, Optional


class HealthResponse(BaseModel):
    status: str
    message: str
    version: str
    timestamp: datetime


class DatabaseHealthResponse(BaseModel):
    status: str
    database: str
    tables_found: int
    timestamp: datetime


class APIResponse(BaseModel):
    """Generic wrapper for success responses."""
    success: bool = True
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error response shape."""
    success: bool = False
    error: str
    detail: Optional[str] = None
    status_code: int
