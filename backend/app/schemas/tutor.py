"""
app/schemas/tutor.py
────────────────────
Pydantic schemas for AI Tutor chat endpoint (POST /tutor/chat).
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class SourceCitation(BaseModel):
    title: str
    source_url: Optional[str] = None
    chunk_text: str
    relevance_score: float


class TutorChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Student query or prompt text")
    topic_name: Optional[str] = Field(None, description="Current topic context e.g. Quadratic Equations")
    session_id: Optional[int] = Field(None, description="Existing ChatSession ID to continue conversation")
    modifier: Optional[str] = Field(None, description="Quick modifier: simpler, deeper, example, practice")
    language: Optional[str] = Field(None, description="Explanation language: en, hi, hi-en")


class TutorChatResponse(BaseModel):
    session_id: int
    message_id: int
    explanation: str
    step_by_step: List[str]
    example: str
    follow_up: List[str]
    sources: List[SourceCitation]


class ImageQuestionSolverResponse(BaseModel):
    extracted_question: str
    problem: str
    concept: str
    steps: List[str]
    answer: str
    verification: str
    similar_question: str
    sources: List[SourceCitation]

