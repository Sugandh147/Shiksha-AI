"""
app/db/models.py
────────────────
All SQLAlchemy ORM models for ShikshaAI.

These Python classes map 1-to-1 to PostgreSQL tables.
SQLAlchemy translates Python operations into SQL automatically.

Models:
  1.  User              – All users (students + teachers)
  2.  StudentProfile     – Extra student-specific data
  3.  TeacherProfile     – Extra teacher-specific data
  4.  Class             – A classroom entity
  5.  ClassMember       – Many-to-many: Student ↔ Class
  6.  Subject           – e.g. Mathematics, Science
  7.  Topic             – e.g. Fractions (belongs to Subject)
  8.  Question          – MCQ question bank
  9.  DiagnosticAttempt – Student's initial diagnostic test result
  10. QuizAttempt       – Individual question attempt in practice
  11. SkillMastery      – Per-student mastery score per Topic
  12. LearningEvent     – Immutable event log (streak, session etc.)
  13. ChatSession       – A tutor chat conversation thread
  14. ChatMessage       – Individual message in a chat session
  15. Document          – Uploaded/seeded knowledge document
  16. DocumentChunk     – Chunked text + vector embedding for RAG
"""

import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey,
    Integer, JSON, String, Text, UniqueConstraint, func,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


# ─────────────────────────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    admin   = "admin"


class DifficultyLevel(str, enum.Enum):
    easy   = "easy"
    medium = "medium"
    hard   = "hard"


class QuestionType(str, enum.Enum):
    mcq       = "mcq"       # Multiple choice
    true_false = "true_false"
    short_answer = "short_answer"


class LearningEventType(str, enum.Enum):
    session_start    = "session_start"
    question_correct = "question_correct"
    question_wrong   = "question_wrong"
    streak_achieved  = "streak_achieved"
    level_up         = "level_up"
    level_down       = "level_down"
    diagnostic_done  = "diagnostic_done"


# ─────────────────────────────────────────────────────────────────────────────
# 1. User  (students AND teachers share this table, role differentiates them)
# ─────────────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id                 = Column(Integer, primary_key=True, index=True)
    email              = Column(String(255), unique=True, nullable=False, index=True)
    full_name          = Column(String(100), nullable=False)
    password_hash      = Column(String(255), nullable=False)
    role               = Column(Enum(UserRole), nullable=False, default=UserRole.student)
    preferred_language = Column(String(10), default="en")   # "en", "hi", "te" etc.
    avatar_url         = Column(String(512), nullable=True)
    is_active          = Column(Boolean, default=True)
    is_verified        = Column(Boolean, default=False)
    created_at         = Column(DateTime(timezone=True), server_default=func.now())
    updated_at         = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    student_profile  = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile  = relationship("TeacherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    class_memberships = relationship("ClassMember", back_populates="student", foreign_keys="ClassMember.student_id")
    diagnostic_attempts = relationship("DiagnosticAttempt", back_populates="student")
    quiz_attempts    = relationship("QuizAttempt", back_populates="student")
    skill_masteries  = relationship("SkillMastery", back_populates="student")
    learning_events  = relationship("LearningEvent", back_populates="user")
    chat_sessions    = relationship("ChatSession", back_populates="student")
    taught_classes   = relationship("Class", back_populates="teacher")


# ─────────────────────────────────────────────────────────────────────────────
# 2. StudentProfile
# ─────────────────────────────────────────────────────────────────────────────

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id                   = Column(Integer, primary_key=True, index=True)
    user_id              = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    grade_level          = Column(Integer, nullable=False)        # e.g. 8 (Class 8)
    school_name          = Column(String(200), nullable=True)
    learning_style       = Column(String(50), default="visual")  # visual / auditory / reading
    diagnostic_completed = Column(Boolean, default=False)
    current_streak_days  = Column(Integer, default=0)
    total_xp             = Column(Integer, default=0)            # Gamification points
    education_level      = Column(String(100), nullable=True)
    preferred_subjects   = Column(JSON, nullable=True)           # List of selected subjects e.g. ["Mathematics", "Science"]
    learning_goal        = Column(String(200), nullable=True)    # e.g. "Score high in school exams"
    onboarding_completed = Column(Boolean, default=False)
    created_at           = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="student_profile")


# ─────────────────────────────────────────────────────────────────────────────
# 3. TeacherProfile
# ─────────────────────────────────────────────────────────────────────────────

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    school_name = Column(String(200), nullable=True)
    subject_specialization = Column(String(100), nullable=True)
    years_experience = Column(Integer, default=0)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="teacher_profile")


# ─────────────────────────────────────────────────────────────────────────────
# 4. Class  (a classroom — one teacher, many students)
# ─────────────────────────────────────────────────────────────────────────────

class Class(Base):
    __tablename__ = "classes"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)           # "Class 8 - Section A"
    grade_level = Column(Integer, nullable=False)
    teacher_id  = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    invite_code = Column(String(20), unique=True, nullable=True)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    teacher = relationship("User", back_populates="taught_classes")
    members = relationship("ClassMember", back_populates="class_", cascade="all, delete-orphan")


# ─────────────────────────────────────────────────────────────────────────────
# 5. ClassMember  (many-to-many junction: Student ↔ Class)
# ─────────────────────────────────────────────────────────────────────────────

class ClassMember(Base):
    __tablename__ = "class_members"
    __table_args__ = (UniqueConstraint("class_id", "student_id"),)

    id         = Column(Integer, primary_key=True, index=True)
    class_id   = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    joined_at  = Column(DateTime(timezone=True), server_default=func.now())

    class_   = relationship("Class", back_populates="members")
    student  = relationship("User", back_populates="class_memberships", foreign_keys=[student_id])


# ─────────────────────────────────────────────────────────────────────────────
# 6. Subject  (Mathematics, Science, English, History …)
# ─────────────────────────────────────────────────────────────────────────────

class Subject(Base):
    __tablename__ = "subjects"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon        = Column(String(50), nullable=True)   # emoji or icon name
    color       = Column(String(20), nullable=True)   # hex color for UI
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    topics    = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="subject")


# ─────────────────────────────────────────────────────────────────────────────
# 7. Topic  (Fractions, Algebra, Photosynthesis …)
# ─────────────────────────────────────────────────────────────────────────────

class Topic(Base):
    __tablename__ = "topics"

    id          = Column(Integer, primary_key=True, index=True)
    subject_id  = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    name        = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    grade_level = Column(Integer, nullable=True)
    order_index = Column(Integer, default=0)  # Display order within subject
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    subject    = relationship("Subject", back_populates="topics")
    questions  = relationship("Question", back_populates="topic")
    masteries  = relationship("SkillMastery", back_populates="topic")


# ─────────────────────────────────────────────────────────────────────────────
# 8. Question  (MCQ question bank)
# ─────────────────────────────────────────────────────────────────────────────

class Question(Base):
    __tablename__ = "questions"

    id             = Column(Integer, primary_key=True, index=True)
    subject_id     = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    topic_id       = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    question_text  = Column(Text, nullable=False)
    question_type  = Column(Enum(QuestionType), default=QuestionType.mcq)
    difficulty     = Column(Enum(DifficultyLevel), nullable=False)
    options        = Column(JSON, nullable=True)     # {"A": "...", "B": "...", "C": "...", "D": "..."}
    correct_answer = Column(String(10), nullable=False)  # "A", "B", "C", or "D"
    explanation    = Column(Text, nullable=False)   # Why this answer is correct
    grade_level    = Column(Integer, nullable=True)
    is_diagnostic  = Column(Boolean, default=False, index=True) # Used in baseline diagnostic
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    subject = relationship("Subject", back_populates="questions")
    topic   = relationship("Topic", back_populates="questions")
    attempts = relationship("QuizAttempt", back_populates="question")


# ─────────────────────────────────────────────────────────────────────────────
# 9. DiagnosticAttempt  (One per student — their baseline assessment)
# ─────────────────────────────────────────────────────────────────────────────

class DiagnosticAttempt(Base):
    __tablename__ = "diagnostic_attempts"

    id              = Column(Integer, primary_key=True, index=True)
    student_id      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score_percentage = Column(Float, nullable=False)   # 0.0 – 100.0
    total_questions = Column(Integer, nullable=False)
    correct_count   = Column(Integer, nullable=False)
    answers_json    = Column(JSON, nullable=True)      # {question_id: chosen_answer, ...}
    baseline_level  = Column(Enum(DifficultyLevel), nullable=False)  # Assigned starting level
    completed_at    = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", back_populates="diagnostic_attempts")


# ─────────────────────────────────────────────────────────────────────────────
# 10. QuizAttempt  (Individual question attempt during practice or quiz)
# ─────────────────────────────────────────────────────────────────────────────

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id               = Column(Integer, primary_key=True, index=True)
    student_id       = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id      = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    chosen_answer    = Column(String(10), nullable=False)
    is_correct       = Column(Boolean, nullable=False)
    time_taken_secs  = Column(Integer, default=0)
    difficulty_when_asked = Column(Enum(DifficultyLevel), nullable=True)
    timestamp        = Column(DateTime(timezone=True), server_default=func.now())

    student  = relationship("User", back_populates="quiz_attempts")
    question = relationship("Question", back_populates="attempts")


# ─────────────────────────────────────────────────────────────────────────────
# 11. SkillMastery  (Per-student mastery score per Topic — updated after each attempt)
# ─────────────────────────────────────────────────────────────────────────────

class SkillMastery(Base):
    __tablename__ = "skill_masteries"
    __table_args__ = (UniqueConstraint("student_id", "topic_id"),)

    id             = Column(Integer, primary_key=True, index=True)
    student_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id       = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    mastery_score  = Column(Float, default=50.0)       # 0.0 to 100.0
    current_level  = Column(Enum(DifficultyLevel), default=DifficultyLevel.easy)
    correct_streak = Column(Integer, default=0)        # Consecutive correct answers
    total_attempts = Column(Integer, default=0)
    correct_count  = Column(Integer, default=0)
    updated_at     = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    student = relationship("User", back_populates="skill_masteries")
    topic   = relationship("Topic", back_populates="masteries")


# ─────────────────────────────────────────────────────────────────────────────
# 12. LearningEvent  (Immutable append-only log for analytics & gamification)
# ─────────────────────────────────────────────────────────────────────────────

class LearningEvent(Base):
    __tablename__ = "learning_events"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(Enum(LearningEventType), nullable=False)
    payload    = Column(JSON, nullable=True)    # Flexible extra context
    xp_earned  = Column(Integer, default=0)
    timestamp  = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="learning_events")


# ─────────────────────────────────────────────────────────────────────────────
# 13. ChatSession  (One conversation thread in the AI Tutor)
# ─────────────────────────────────────────────────────────────────────────────

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_name = Column(String(200), nullable=True)   # What the student was asking about
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student  = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


# ─────────────────────────────────────────────────────────────────────────────
# 14. ChatMessage  (Individual message in a ChatSession)
# ─────────────────────────────────────────────────────────────────────────────

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id         = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender     = Column(String(20), nullable=False)  # "user" or "assistant"
    content    = Column(Text, nullable=False)
    sources    = Column(JSON, default=list)          # [{title, chunk_text, relevance_score}]
    timestamp  = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ChatSession", back_populates="messages")


# ─────────────────────────────────────────────────────────────────────────────
# 15. Document  (Trusted knowledge source — e.g. NCERT chapter)
# ─────────────────────────────────────────────────────────────────────────────

class Document(Base):
    __tablename__ = "documents"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(300), nullable=False)
    subject_id  = Column(Integer, ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True)
    grade_level = Column(Integer, nullable=True)
    source_url  = Column(String(512), nullable=True)
    author      = Column(String(200), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


# ─────────────────────────────────────────────────────────────────────────────
# 16. DocumentChunk  (Chunked text for RAG retrieval — vector stored in Phase 2)
# ─────────────────────────────────────────────────────────────────────────────

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id           = Column(Integer, primary_key=True, index=True)
    document_id  = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    chunk_index  = Column(Integer, nullable=False)   # Position of this chunk in document
    chunk_text   = Column(Text, nullable=False)
    # NOTE: In Phase 2 we add a 'embedding' column (pgvector) here
    metadata_    = Column("metadata", JSON, nullable=True)  # {page, section, etc.}
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="chunks")


# ─────────────────────────────────────────────────────────────────────────────
# 17. Opportunity  (Scholarships, Olympiads & Academic Competitions)
# ─────────────────────────────────────────────────────────────────────────────

class Opportunity(Base):
    __tablename__ = "opportunities"

    id                     = Column(Integer, primary_key=True, index=True)
    name                   = Column(String(255), nullable=False)
    provider               = Column(String(200), nullable=False)
    description            = Column(Text, nullable=False)
    eligibility            = Column(Text, nullable=False)
    benefit                = Column(Text, nullable=False)
    deadline               = Column(String(50), nullable=False)
    official_source        = Column(String(255), nullable=False)
    application_url        = Column(String(512), nullable=False)
    is_demo                = Column(Boolean, default=False)
    target_education_level = Column(String(100), default="Class 8")
    required_subjects      = Column(JSON, default=list)
    minimum_mastery_score  = Column(Float, default=50.0)
    created_at             = Column(DateTime(timezone=True), server_default=func.now())

