"""
app/schemas/diagnostic.py
──────────────────────────
Pydantic models for Diagnostic Assessment endpoints (start, submit, results, weak-topics, mastery).
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class QuestionOutForDiagnostic(BaseModel):
    id: int
    question_text: str
    options: Dict[str, str]
    topic_id: int
    topic_name: str
    difficulty: str


class DiagnosticStartResponse(BaseModel):
    total_questions: int
    subject_name: str = "Mathematics"
    topics_covered: List[str]
    questions: List[QuestionOutForDiagnostic]


class DiagnosticSubmitRequest(BaseModel):
    answers: Dict[str, str] = Field(..., description="Dict mapping question_id (as string) to chosen option e.g. {'1': 'A'}")
    time_taken_secs: Optional[int] = 0


class TopicPerformance(BaseModel):
    topic_id: int
    topic_name: str
    score_percentage: float
    correct_count: int
    total_questions: int
    is_weak: bool


class QuestionReviewItem(BaseModel):
    question_id: int
    question_text: str
    topic_name: str
    chosen_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str


class DiagnosticResultResponse(BaseModel):
    diagnostic_id: int
    overall_score_percentage: float
    total_questions: int
    correct_count: int
    baseline_level: str
    topic_performances: List[TopicPerformance]
    weak_topics: List[str]
    strong_topics: List[str]
    xp_earned: int = 100
    question_reviews: List[QuestionReviewItem]


class WeakTopicResponse(BaseModel):
    topic_id: int
    topic_name: str
    subject_name: str
    mastery_score: float
    current_level: str


class MasteryResponse(BaseModel):
    overall_mastery: float
    topics: List[WeakTopicResponse]
