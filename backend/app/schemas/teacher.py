"""
app/schemas/teacher.py
───────────────────────
Pydantic schemas for ClassPulse Teacher Intelligence endpoints:
  • Teacher profile & roster
  • Class list & ClassPulse Analytics
  • Learning Attention Indicator
  • Student Detail Insights & Recommended Interventions
  • Teacher Copilot Q&A
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class TeacherProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    school_name: Optional[str] = None
    subject_specialization: Optional[str] = None
    years_experience: int = 0

    class Config:
        from_attributes = True


class TeacherStudentOut(BaseModel):
    student_id: int
    full_name: str
    email: str
    grade_level: int
    class_name: Optional[str] = None
    streak_days: int = 0
    total_xp: int = 0
    overall_mastery: float = 0.0


class ClassCreateRequest(BaseModel):
    name: str = Field(..., description="Name of the class e.g. Class 8 - Section A")
    grade_level: int = Field(..., description="Grade level e.g. 8")


class JoinClassRequest(BaseModel):
    invite_code: str = Field(..., description="Unique class join code e.g. MATH8A")


class ClassItem(BaseModel):
    id: int
    name: str
    grade_level: int
    invite_code: Optional[str] = None
    student_count: int = 0


class StudentAttentionInfo(BaseModel):
    student_id: int
    full_name: str
    email: str
    class_name: str
    risk_level: str = Field(..., description="High, Medium, or Low")
    risk_score: float
    flagged_reasons: List[str]


class DifficultTopicItem(BaseModel):
    topic_id: int
    topic_name: str
    subject_name: str
    average_mastery: float
    students_struggling_count: int


class ImprovedStudentItem(BaseModel):
    student_id: int
    full_name: str
    overall_mastery: float
    recent_gain: float
    streak_days: int


class ClassAnalyticsOut(BaseModel):
    class_id: int
    class_name: str
    total_students: int
    average_mastery: float
    average_quiz_accuracy: float
    students_needing_attention: List[StudentAttentionInfo]
    most_difficult_topics: List[DifficultTopicItem]
    most_improved_students: List[ImprovedStudentItem]


class StudentDetailInsightsOut(BaseModel):
    student_id: int
    full_name: str
    email: str
    grade_level: int
    class_name: str
    overall_mastery: float
    attention_level: str
    flagged_reasons: List[str]
    weak_topics: List[Dict[str, Any]]
    recent_performance: List[Dict[str, Any]]
    quiz_history: List[Dict[str, Any]]
    practice_history: List[Dict[str, Any]]
    frequent_mistakes: List[Dict[str, Any]]
    recommended_intervention: str


class CopilotQueryRequest(BaseModel):
    question: str = Field(..., min_length=2, description="Teacher natural language question")
    class_id: Optional[int] = Field(None, description="Optional target class ID for context scoping")


class CopilotQueryResponse(BaseModel):
    query: str
    answer: str
    data_sources: List[str]
    recommended_actions: List[str]
