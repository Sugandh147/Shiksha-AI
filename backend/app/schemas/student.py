"""
app/schemas/student.py
───────────────────────
Pydantic models for student onboarding, student profile, and dashboard API responses.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class OnboardingRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    education_level: str = Field(..., description="e.g. Primary, Middle School, High School")
    class_grade: int = Field(..., ge=1, le=12, description="Class/Grade e.g. 8")
    subjects: List[str] = Field(..., min_items=1, description="List of preferred subjects")
    preferred_language: str = Field(default="en", description="en, hi, hinglish")
    learning_goal: str = Field(..., description="e.g. Master core concepts and boost grades")


class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    grade_level: int
    education_level: Optional[str] = None
    school_name: Optional[str] = None
    learning_style: Optional[str] = None
    preferred_subjects: Optional[List[str]] = None
    learning_goal: Optional[str] = None
    diagnostic_completed: bool
    current_streak_days: int
    total_xp: int
    onboarding_completed: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WeakTopicItem(BaseModel):
    topic_id: int
    topic_name: str
    subject_name: str
    mastery_score: float
    current_level: str


class RecentActivityItem(BaseModel):
    id: int
    activity_type: str
    title: str
    description: str
    timestamp: str
    xp_earned: int


class ContinueLearningItem(BaseModel):
    topic_id: int
    topic_name: str
    subject_name: str
    progress_percentage: float
    next_action: str


class StudentDashboardData(BaseModel):
    user_name: str
    user_role: str = "student"
    welcome_message: str
    learning_goal: Optional[str] = None
    overall_mastery: float
    weak_topics: List[WeakTopicItem]
    recent_activity: List[RecentActivityItem]
    continue_learning: Optional[ContinueLearningItem] = None
    ask_ai_tutor: dict
    practice_weak_areas: List[WeakTopicItem]
    streak_days: int
    total_xp: int
