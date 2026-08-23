"""
app/routers/practice.py
────────────────────────
Adaptive Practice Engine API endpoints:
  • POST /practice/generate     — Generate adaptive practice set for weak topics
  • POST /practice/submit       — Submit answer, update mastery, compute next difficulty, trigger remediation
  • GET  /practice/recommended  — Get prioritized practice recommendations
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import (
    User, Question, SkillMastery, Topic, Subject, QuizAttempt,
    LearningEvent, LearningEventType, DifficultyLevel, StudentProfile, DocumentChunk
)
from app.dependencies import require_student
from app.schemas.practice import (
    PracticeGenerateRequest, PracticeGenerateResponse, PracticeQuestionOut,
    PracticeSubmitRequest, PracticeSubmitResponse, RecommendedPracticeItem
)

router = APIRouter(prefix="/practice", tags=["Adaptive Practice Engine"])


@router.post("/generate", response_model=PracticeGenerateResponse)
def generate_practice_set(
    payload: PracticeGenerateRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Generate an adaptive practice set customized for the student's grade level & selected topic.
    """
    student_grade = current_user.student_profile.grade_level if current_user.student_profile else 8
    target_topic: Optional[Topic] = None

    if payload.topic_id:
        target_topic = db.query(Topic).filter(Topic.id == payload.topic_id).first()

    if not target_topic:
        # Automatically select student's weakest topic matching grade level
        weakest_mastery = (
            db.query(SkillMastery, Topic)
            .join(Topic, SkillMastery.topic_id == Topic.id)
            .filter(SkillMastery.student_id == current_user.id, Topic.grade_level == student_grade)
            .order_by(SkillMastery.mastery_score.asc())
            .first()
        )
        if weakest_mastery:
            target_topic = weakest_mastery.Topic

    if not target_topic:
        # Fallback to first available topic for student's grade
        target_topic = db.query(Topic).filter(Topic.grade_level == student_grade).first()

    if not target_topic:
        # Fallback to any topic in DB
        target_topic = db.query(Topic).first()

    if not target_topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No topics available in database for practice.",
        )

    # Determine initial difficulty from student's SkillMastery
    mastery = (
        db.query(SkillMastery)
        .filter(
            SkillMastery.student_id == current_user.id,
            SkillMastery.topic_id == target_topic.id,
        )
        .first()
    )

    initial_level = mastery.current_level if mastery else DifficultyLevel.medium
    level_str = initial_level.value if hasattr(initial_level, "value") else str(initial_level)

    # Query practice questions for target topic & grade
    questions = (
        db.query(Question)
        .filter(Question.topic_id == target_topic.id)
        .all()
    )

    if not questions:
        # Fallback to questions for same grade level
        questions = db.query(Question).filter(Question.grade_level == student_grade).all()

    if not questions:
        questions = db.query(Question).all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No practice questions found for topic {target_topic.name}.",
        )

    # Limit to requested count
    count = payload.count or 5
    selected_qs = questions[:count]

    q_out = [
        PracticeQuestionOut(
            question_id=q.id,
            question_text=q.question_text,
            options=q.options or {},
            topic_id=q.topic_id,
            topic_name=target_topic.name,
            difficulty=q.difficulty.value if hasattr(q.difficulty, "value") else str(q.difficulty),
        )
        for q in selected_qs
    ]

    return PracticeGenerateResponse(
        session_topic_name=target_topic.name,
        initial_difficulty=level_str,
        questions=q_out,
    )


@router.post("/submit", response_model=PracticeSubmitResponse)
def submit_practice_answer(
    payload: PracticeSubmitRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Process practice answer submission:
    1. Check correctness against question key.
    2. Store QuizAttempt record.
    3. Update SkillMastery (score %, streak, total attempts, correct count).
    4. Compute next adaptive difficulty level (wrong -> easier, correct -> harder).
    5. Trigger concept remediation modal if repeated mistakes occur.
    6. Award XP and log LearningEvent.
    """
    question = db.query(Question).filter(Question.id == payload.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )

    chosen_norm = payload.chosen_answer.strip().upper()
    correct_norm = question.correct_answer.strip().upper()
    is_correct = (chosen_norm == correct_norm)

    # 1. Record QuizAttempt
    attempt = QuizAttempt(
        student_id=current_user.id,
        question_id=question.id,
        chosen_answer=chosen_norm,
        is_correct=is_correct,
        time_taken_secs=payload.time_taken_secs or 0,
        difficulty_when_asked=question.difficulty,
    )
    db.add(attempt)

    # 2. Retrieve or create SkillMastery for topic
    mastery = (
        db.query(SkillMastery)
        .filter(
            SkillMastery.student_id == current_user.id,
            SkillMastery.topic_id == question.topic_id,
        )
        .first()
    )

    if not mastery:
        mastery = SkillMastery(
            student_id=current_user.id,
            topic_id=question.topic_id,
            mastery_score=50.0,
            current_level=DifficultyLevel.medium,
            correct_streak=0,
            total_attempts=0,
            correct_count=0,
        )
        db.add(mastery)

    mastery.total_attempts = (mastery.total_attempts or 0) + 1

    if is_correct:
        mastery.correct_count = (mastery.correct_count or 0) + 1
        mastery.correct_streak = (mastery.correct_streak or 0) + 1
        consecutive_wrongs = 0
    else:
        mastery.correct_streak = 0
        consecutive_wrongs = (payload.consecutive_wrongs or 0) + 1

    # Recalculate Mastery Score (Weighted formula: 70% previous + 30% current result)
    current_score = 100.0 if is_correct else 0.0
    new_mastery_score = round(0.75 * (mastery.mastery_score or 50.0) + 0.25 * current_score, 1)
    new_mastery_score = max(0.0, min(100.0, new_mastery_score))
    mastery.mastery_score = new_mastery_score

    # 3. Determine Adaptive Next Difficulty Level
    curr_lvl_str = mastery.current_level.value if hasattr(mastery.current_level, "value") else str(mastery.current_level)

    if is_correct:
        if mastery.correct_streak >= 3 or curr_lvl_str == "medium":
            next_lvl = DifficultyLevel.hard
        elif curr_lvl_str == "easy":
            next_lvl = DifficultyLevel.medium
        else:
            next_lvl = DifficultyLevel.hard
    else:
        if curr_lvl_str == "hard":
            next_lvl = DifficultyLevel.medium
        elif curr_lvl_str == "medium":
            next_lvl = DifficultyLevel.easy
        else:
            next_lvl = DifficultyLevel.easy

    mastery.current_level = next_lvl
    db.add(mastery)

    # 4. Check for Concept Remediation Trigger (Repeated Mistakes >= 2)
    requires_remediation = False
    remediation_concept = None

    if not is_correct and consecutive_wrongs >= 2:
        requires_remediation = True
        # Fetch chunk explanation for topic
        chunk = db.query(DocumentChunk).first()
        if chunk:
            remediation_concept = f"Core Concept Remediation: {chunk.chunk_text}"
        else:
            remediation_concept = f"Remediation Note: Review core definitions and formulas for {question.topic.name if question.topic else 'this topic'}."

    # 5. Award XP and log LearningEvent
    xp_gained = 15 if is_correct else 5
    profile = current_user.student_profile
    if profile:
        profile.total_xp = (profile.total_xp or 0) + xp_gained
        db.add(profile)

    event = LearningEvent(
        user_id=current_user.id,
        event_type=LearningEventType.question_correct if is_correct else LearningEventType.question_wrong,
        payload={
            "question_id": question.id,
            "is_correct": is_correct,
            "topic_id": question.topic_id,
            "new_mastery": new_mastery_score,
            "next_difficulty": next_lvl.value if hasattr(next_lvl, "value") else str(next_lvl),
        },
        xp_earned=xp_gained,
    )
    db.add(event)

    db.commit()

    return PracticeSubmitResponse(
        is_correct=is_correct,
        correct_answer=correct_norm,
        explanation=question.explanation,
        next_difficulty=next_lvl.value if hasattr(next_lvl, "value") else str(next_lvl),
        mastery_score=new_mastery_score,
        mastery_level=next_lvl.value if hasattr(next_lvl, "value") else str(next_lvl),
        xp_earned=xp_gained,
        requires_remediation=requires_remediation,
        remediation_concept=remediation_concept,
    )


@router.get("/recommended", response_model=List[RecommendedPracticeItem])
def get_recommended_practice(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Get recommended practice topics for the student based on live SkillMastery scores.
    Prioritizes weak areas (< 70%).
    """
    masteries = (
        db.query(SkillMastery, Topic, Subject)
        .join(Topic, SkillMastery.topic_id == Topic.id)
        .join(Subject, Topic.subject_id == Subject.id)
        .filter(SkillMastery.student_id == current_user.id)
        .order_by(SkillMastery.mastery_score.asc())
        .all()
    )

    recommendations: List[RecommendedPracticeItem] = []
    for m, t, s in masteries:
        if m.mastery_score < 50.0:
            reason = f"Critical Focus Required ({m.mastery_score}% accuracy)"
        elif m.mastery_score < 70.0:
            reason = f"Identified Weak Topic ({m.mastery_score}% accuracy)"
        else:
            reason = f"Mastery Revision ({m.mastery_score}% accuracy)"

        recommendations.append(
            RecommendedPracticeItem(
                topic_id=t.id,
                topic_name=t.name,
                subject_name=s.name,
                mastery_score=m.mastery_score,
                current_level=m.current_level.value if hasattr(m.current_level, "value") else str(m.current_level),
                reason=reason,
            )
        )

    return recommendations
