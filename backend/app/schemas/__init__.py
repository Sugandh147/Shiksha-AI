"""
app/schemas/__init__.py
"""

from app.schemas.common import HealthResponse, DatabaseHealthResponse, APIResponse, ErrorResponse
from app.schemas.auth import UserRegister, UserLogin, UserOut, TokenResponse
from app.schemas.student import OnboardingRequest, StudentProfileOut, StudentDashboardData, WeakTopicItem
from app.schemas.teacher import TeacherProfileOut, TeacherStudentOut
