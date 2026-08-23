"""
app/schemas/practice.py
────────────────────────
Pydantic schemas for Adaptive Practice Engine endpoints:
  • POST /practice/generate
  • POST /practice/submit
  • GET  /practice/recommended
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class PracticeGenerateRequest(BaseModel):
    topic_id: Optional[int] = Field(None, description="Target topic ID to practice")
    subject_id: Optional[int] = Field(None, description="Target subject ID")
    count: Optional[int] = Field(5, ge=1, le=15, description="Number of practice questions")


class PracticeQuestionOut(BaseModel):
    question_id: int
    question_text: str
    options: Dict[str, str]
    topic_id: int
    topic_name: str
    difficulty: str


class PracticeGenerateResponse(BaseModel):
    session_topic_name: str
    initial_difficulty: str
    questions: List[PracticeQuestionOut]


class PracticeSubmitRequest(BaseModel):
    question_id: int
    chosen_answer: str
    time_taken_secs: Optional[int] = 0
    current_streak: Optional[int] = 0
    consecutive_wrongs: Optional[int] = 0


class PracticeSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    next_difficulty: str
    mastery_score: float
    mastery_level: str
    xp_earned: int = 15
    requires_remediation: bool = False
    remediation_concept: Optional[str] = None


class RecommendedPracticeItem(BaseModel):
    topic_id: int
    topic_name: str
    subject_name: str
    mastery_score: float
    current_level: str
    reason: str
