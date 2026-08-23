"""
app/routers/student.py
────────────────────────
Student-only routes: onboarding, profile retrieval/update, and student dashboard feed.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.db.models import (
    User, StudentProfile, Subject, Topic, SkillMastery,
    LearningEvent, LearningEventType, QuizAttempt, DifficultyLevel
)
from app.dependencies import require_student
from app.schemas.student import (
    OnboardingRequest, StudentProfileOut, StudentDashboardData,
    WeakTopicItem, RecentActivityItem, ContinueLearningItem
)

router = APIRouter(prefix="/student", tags=["Student"])


@router.post("/onboarding", response_model=StudentProfileOut)
def complete_onboarding(
    payload: OnboardingRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Complete student onboarding:
    1. Collect name, education level, class/grade, subjects, preferred language, learning goal.
    2. Update User & StudentProfile models.
    3. Initialize the student's initial learning profile (SkillMastery records for topics).
    4. Log onboarding completion event.
    """
    # 1. Update user basic info
    current_user.full_name = payload.name.strip()
    current_user.preferred_language = payload.preferred_language
    db.add(current_user)

    # 2. Update or create StudentProfile
    profile = current_user.student_profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id, grade_level=payload.class_grade)
        db.add(profile)

    profile.grade_level = payload.class_grade
    profile.education_level = payload.education_level
    profile.preferred_subjects = payload.subjects
    profile.learning_goal = payload.learning_goal
    profile.onboarding_completed = True
    profile.total_xp = (profile.total_xp or 0) + 50  # Onboarding bonus XP
    db.add(profile)
    db.flush()

    # 3. Create initial learning profile (SkillMasteries for selected subjects)
    # Find matching subjects from DB
    subject_objs = db.query(Subject).filter(Subject.name.in_(payload.subjects)).all()
    if not subject_objs:
        # Fallback: get all subjects if no exact match name
        subject_objs = db.query(Subject).all()

    subject_ids = [s.id for s in subject_objs]
    topics = db.query(Topic).filter(Topic.subject_id.in_(subject_ids)).all() if subject_ids else db.query(Topic).all()

    for topic in topics:
        existing_mastery = db.query(SkillMastery).filter(
            SkillMastery.student_id == current_user.id,
            SkillMastery.topic_id == topic.id
        ).first()

        if not existing_mastery:
            initial_mastery = SkillMastery(
                student_id=current_user.id,
                topic_id=topic.id,
                mastery_score=50.0,  # Baseline starting score
                current_level=DifficultyLevel.easy,
                correct_streak=0,
                total_attempts=0,
                correct_count=0,
            )
            db.add(initial_mastery)

    # 4. Log initial learning event
    event = LearningEvent(
        user_id=current_user.id,
        event_type=LearningEventType.session_start,
        payload={"action": "onboarding_completed", "goal": payload.learning_goal},
        xp_earned=50,
    )
    db.add(event)

    db.commit()
    db.refresh(profile)
    db.refresh(current_user)

    return StudentProfileOut(
        id=profile.id,
        user_id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        grade_level=profile.grade_level,
        education_level=profile.education_level,
        school_name=profile.school_name,
        learning_style=profile.learning_style,
        preferred_subjects=profile.preferred_subjects,
        learning_goal=profile.learning_goal,
        diagnostic_completed=profile.diagnostic_completed,
        current_streak_days=profile.current_streak_days,
        total_xp=profile.total_xp,
        onboarding_completed=profile.onboarding_completed,
        created_at=profile.created_at,
    )


@router.get("/profile", response_model=StudentProfileOut)
def get_student_profile(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Get current student's profile information.
    """
    profile = current_user.student_profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id, grade_level=8, onboarding_completed=False)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return StudentProfileOut(
        id=profile.id,
        user_id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        grade_level=profile.grade_level,
        education_level=profile.education_level,
        school_name=profile.school_name,
        learning_style=profile.learning_style,
        preferred_subjects=profile.preferred_subjects,
        learning_goal=profile.learning_goal,
        diagnostic_completed=profile.diagnostic_completed,
        current_streak_days=profile.current_streak_days,
        total_xp=profile.total_xp,
        onboarding_completed=profile.onboarding_completed,
        created_at=profile.created_at,
    )


@router.get("/dashboard", response_model=StudentDashboardData)
def get_student_dashboard(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Get dynamic, backend-driven dashboard data for the authenticated student.
    Returns:
      • Welcome message
      • Overall mastery %
      • Weak topics (< 70% mastery)
      • Recent activity feed
      • Continue learning recommendation
      • Ask AI Tutor widget data
      • Practice weak areas recommendation
      • Streak & XP counts
    """
    profile = current_user.student_profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id, grade_level=8, onboarding_completed=False)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # 1. Fetch Skill Masteries
    masteries = (
        db.query(SkillMastery, Topic, Subject)
        .join(Topic, SkillMastery.topic_id == Topic.id)
        .join(Subject, Topic.subject_id == Subject.id)
        .filter(SkillMastery.student_id == current_user.id)
        .all()
    )

    if masteries:
        total_score = sum(m.SkillMastery.mastery_score for m in masteries)
        overall_mastery = round(total_score / len(masteries), 1)
    else:
        overall_mastery = 0.0

    # 2. Weak Topics (Mastery < 70%, sorted ascending)
    weak_items: List[WeakTopicItem] = []
    sorted_masteries = sorted(masteries, key=lambda m: m.SkillMastery.mastery_score)
    for m in sorted_masteries:
        if m.SkillMastery.mastery_score < 70.0:
            weak_items.append(
                WeakTopicItem(
                    topic_id=m.Topic.id,
                    topic_name=m.Topic.name,
                    subject_name=m.Subject.name,
                    mastery_score=m.SkillMastery.mastery_score,
                    current_level=m.SkillMastery.current_level.value if hasattr(m.SkillMastery.current_level, "value") else str(m.SkillMastery.current_level),
                )
            )

    # If no weak topic < 70, take lowest 3 topics as practice focus
    if not weak_items and masteries:
        for m in sorted_masteries[:3]:
            weak_items.append(
                WeakTopicItem(
                    topic_id=m.Topic.id,
                    topic_name=m.Topic.name,
                    subject_name=m.Subject.name,
                    mastery_score=m.SkillMastery.mastery_score,
                    current_level=m.SkillMastery.current_level.value if hasattr(m.SkillMastery.current_level, "value") else str(m.SkillMastery.current_level),
                )
            )

    # 3. Recent Activity (From LearningEvents & QuizAttempts)
    events = (
        db.query(LearningEvent)
        .filter(LearningEvent.user_id == current_user.id)
        .order_by(LearningEvent.timestamp.desc())
        .limit(5)
        .all()
    )

    recent_activity: List[RecentActivityItem] = []
    for ev in events:
        evt_type = ev.event_type.value if hasattr(ev.event_type, "value") else str(ev.event_type)
        if evt_type == "session_start":
            title = "Started Learning Session"
            desc = f"Logged in and studied {ev.payload.get('subject', 'concepts') if ev.payload else 'concepts'}"
        elif evt_type == "streak_achieved":
            title = "Streak Milestone Reached! 🔥"
            desc = f"Achieved {ev.payload.get('streak_days', 3)} consecutive days of active learning"
        elif evt_type == "diagnostic_done":
            title = "Diagnostic Assessment Completed"
            desc = "Baseline diagnostic test completed successfully"
        else:
            title = f"Activity: {evt_type.replace('_', ' ').title()}"
            desc = "Completed learning exercise"

        recent_activity.append(
            RecentActivityItem(
                id=ev.id,
                activity_type=evt_type,
                title=title,
                description=desc,
                timestamp=ev.timestamp.strftime("%b %d, %H:%M") if ev.timestamp else "Recently",
                xp_earned=ev.xp_earned,
            )
        )

    # Fallback default activity if none exist
    if not recent_activity:
        recent_activity.append(
            RecentActivityItem(
                id=0,
                activity_type="onboarding",
                title="Account Setup Complete",
                description="Welcome to ShikshaAI! Your learning path is ready.",
                timestamp="Just now",
                xp_earned=50,
            )
        )

    # 4. Continue Learning Recommendation
    continue_item: Optional[ContinueLearningItem] = None
    if sorted_masteries:
        target = sorted_masteries[0]
        continue_item = ContinueLearningItem(
            topic_id=target.Topic.id,
            topic_name=target.Topic.name,
            subject_name=target.Subject.name,
            progress_percentage=target.SkillMastery.mastery_score,
            next_action="Continue Practice Session",
        )

    # 5. AI Tutor Prompt Suggestion
    focus_topic = weak_items[0].topic_name if weak_items else "Rational Numbers"
    ask_tutor_widget = {
        "status": "online",
        "suggested_prompt": f"Explain {focus_topic} with simple real-world examples",
        "recommended_topic": focus_topic,
    }

    # 6. Welcome Message
    goal_str = f" to work towards '{profile.learning_goal}'" if profile.learning_goal else ""
    welcome_message = f"Welcome back, {current_user.full_name}! Ready{goal_str} today?"

    return StudentDashboardData(
        user_name=current_user.full_name,
        user_role="student",
        welcome_message=welcome_message,
        learning_goal=profile.learning_goal,
        overall_mastery=overall_mastery,
        weak_topics=weak_items[:4],
        recent_activity=recent_activity,
        continue_learning=continue_item,
        ask_ai_tutor=ask_tutor_widget,
        practice_weak_areas=weak_items[:3],
        streak_days=profile.current_streak_days,
        total_xp=profile.total_xp,
    )


students_router = APIRouter(prefix="/students/me", tags=["Students"])


@router.get("/weak-topics", response_model=List[WeakTopicItem])
@students_router.get("/weak-topics", response_model=List[WeakTopicItem])
def get_student_weak_topics(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    GET /student/weak-topics and GET /students/me/weak-topics
    Returns current student's weak topics (mastery < 70% sorted ascending).
    """
    masteries = (
        db.query(SkillMastery, Topic, Subject)
        .join(Topic, SkillMastery.topic_id == Topic.id)
        .join(Subject, Topic.subject_id == Subject.id)
        .filter(SkillMastery.student_id == current_user.id)
        .all()
    )

    weak_items: List[WeakTopicItem] = []
    sorted_masteries = sorted(masteries, key=lambda m: m.SkillMastery.mastery_score)

    for m in sorted_masteries:
        if m.SkillMastery.mastery_score < 70.0:
            weak_items.append(
                WeakTopicItem(
                    topic_id=m.Topic.id,
                    topic_name=m.Topic.name,
                    subject_name=m.Subject.name,
                    mastery_score=m.SkillMastery.mastery_score,
                    current_level=m.SkillMastery.current_level.value if hasattr(m.SkillMastery.current_level, "value") else str(m.SkillMastery.current_level),
                )
            )

    # Fallback to lowest 3 topics if none < 70
    if not weak_items and masteries:
        for m in sorted_masteries[:3]:
            weak_items.append(
                WeakTopicItem(
                    topic_id=m.Topic.id,
                    topic_name=m.Topic.name,
                    subject_name=m.Subject.name,
                    mastery_score=m.SkillMastery.mastery_score,
                    current_level=m.SkillMastery.current_level.value if hasattr(m.SkillMastery.current_level, "value") else str(m.SkillMastery.current_level),
                )
            )

    return weak_items


@router.get("/mastery")
@students_router.get("/mastery")
def get_student_mastery(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    GET /student/mastery and GET /students/me/mastery
    Returns overall mastery score and topic-by-topic mastery breakdown.
    """
    masteries = (
        db.query(SkillMastery, Topic, Subject)
        .join(Topic, SkillMastery.topic_id == Topic.id)
        .join(Subject, Topic.subject_id == Subject.id)
        .filter(SkillMastery.student_id == current_user.id)
        .all()
    )

    if not masteries:
        return {"overall_mastery": 0.0, "topics": []}

    total_score = sum(m.SkillMastery.mastery_score for m in masteries)
    overall_mastery = round(total_score / len(masteries), 1)

    topics_list = [
        {
            "topic_id": m.Topic.id,
            "topic_name": m.Topic.name,
            "subject_name": m.Subject.name,
            "mastery_score": m.SkillMastery.mastery_score,
            "current_level": m.SkillMastery.current_level.value if hasattr(m.SkillMastery.current_level, "value") else str(m.SkillMastery.current_level),
            "is_weak": m.SkillMastery.mastery_score < 70.0,
        }
        for m in masteries
    ]

    return {"overall_mastery": overall_mastery, "topics": topics_list}

