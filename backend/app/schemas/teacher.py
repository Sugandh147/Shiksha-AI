"""
app/schemas/teacher.py
───────────────────────
Pydantic models for teacher endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List


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
