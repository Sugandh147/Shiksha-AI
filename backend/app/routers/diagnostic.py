"""
app/routers/diagnostic.py
───────────────────────────
Diagnostic Assessment API endpoints:
  • POST /diagnostic/start  — Fetch diagnostic questions
  • POST /diagnostic/submit — Dynamic scoring, topic mastery updates, weak topic identification
  • GET  /diagnostic/results — Retrieve latest assessment results
"""

from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.constants import WEAK_TOPIC_THRESHOLD_PCT, DIAGNOSTIC_XP_REWARD
from app.db.database import get_db
from app.db.models import (
    User, Question, DiagnosticAttempt, SkillMastery, Topic, Subject,
    LearningEvent, LearningEventType, DifficultyLevel, StudentProfile
)
from app.dependencies import require_student
from app.schemas.diagnostic import (
    DiagnosticStartResponse, QuestionOutForDiagnostic,
    DiagnosticSubmitRequest, DiagnosticResultResponse,
    TopicPerformance, QuestionReviewItem
)

router = APIRouter(prefix="/diagnostic", tags=["Diagnostic Assessment"])


@router.post("/start", response_model=DiagnosticStartResponse)
def start_diagnostic_quiz(
    grade_level: Optional[int] = None,
    subject_id: Optional[int] = None,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Fetch diagnostic assessment questions customized for the student's Class/Grade and Subject.
    """
    student_grade = grade_level or (current_user.student_profile.grade_level if current_user.student_profile else 8)

    query = db.query(Question).filter(Question.is_diagnostic == True)

    if subject_id:
        query = query.filter(Question.subject_id == subject_id)

    # 1. Filter by student's grade level
    questions = query.filter(Question.grade_level == student_grade).all()

    if not questions:
        # Fallback to any diagnostic questions
        questions = query.all()

    if not questions:
        questions = db.query(Question).filter(Question.is_diagnostic == True).all()

    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No diagnostic questions found in the database.",
        )

    # Get subject name
    subject_name = "Mathematics"
    if questions[0].subject:
        subject_name = questions[0].subject.name

    topics_covered = sorted(list(set(q.topic.name for q in questions if q.topic)))

    q_list = [
        QuestionOutForDiagnostic(
            id=q.id,
            question_text=q.question_text,
            options=q.options or {},
            topic_id=q.topic_id,
            topic_name=q.topic.name if q.topic else subject_name,
            difficulty=q.difficulty.value if hasattr(q.difficulty, "value") else str(q.difficulty),
        )
        for q in questions
    ]

    return DiagnosticStartResponse(
        total_questions=len(q_list),
        subject_name=subject_name,
        topics_covered=topics_covered,
        questions=q_list,
    )


@router.post("/submit", response_model=DiagnosticResultResponse)
def submit_diagnostic_quiz(
    payload: DiagnosticSubmitRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Process diagnostic quiz submission dynamically:
    1. Verify submitted answers against database answer keys.
    2. Calculate overall accuracy % and baseline level.
    3. Calculate topic-by-topic performance %.
    4. Dynamically identify weak topics (< 70%) and strong topics (>= 70%).
    5. Update student's SkillMastery records for each evaluated topic.
    6. Log LearningEvent and award +100 XP.
    7. Return full detailed result breakdown to frontend.
    """
    if not payload.answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No answers provided in quiz submission.",
        )

    # 1. Fetch all diagnostic questions to build lookup map
    all_diag_questions = db.query(Question).filter(Question.is_diagnostic == True).all()
    q_map = {str(q.id): q for q in all_diag_questions}

    overall_correct = 0
    overall_total = 0
    topic_stats: Dict[int, Dict] = {}  # topic_id -> { topic_name, correct, total }
    question_reviews: List[QuestionReviewItem] = []

    # 2. Evaluate each answered question
    for q_id_str, chosen_opt in payload.answers.items():
        q = q_map.get(q_id_str)
        if not q:
            # Fallback DB query if question wasn't pre-fetched
            q = db.query(Question).filter(Question.id == int(q_id_str)).first()
            if not q:
                continue

        chosen_norm = chosen_opt.strip().upper()
        correct_norm = q.correct_answer.strip().upper()
        is_correct = (chosen_norm == correct_norm)

        overall_total += 1
        if is_correct:
            overall_correct += 1

        t_id = q.topic_id
        t_name = q.topic.name if q.topic else "General Math"
        if t_id not in topic_stats:
            topic_stats[t_id] = {"topic_id": t_id, "topic_name": t_name, "correct": 0, "total": 0}

        topic_stats[t_id]["total"] += 1
        if is_correct:
            topic_stats[t_id]["correct"] += 1

        question_reviews.append(
            QuestionReviewItem(
                question_id=q.id,
                question_text=q.question_text,
                topic_name=t_name,
                chosen_answer=chosen_norm,
                correct_answer=correct_norm,
                is_correct=is_correct,
                explanation=q.explanation,
            )
        )

    if overall_total == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid submission: None of the submitted question IDs exist.",
        )

    # 3. Calculate Overall Accuracy & Baseline Level
    overall_score_percentage = round((overall_correct / overall_total) * 100.0, 1)

    if overall_score_percentage < 50.0:
        baseline_level = DifficultyLevel.easy
    elif overall_score_percentage < 75.0:
        baseline_level = DifficultyLevel.medium
    else:
        baseline_level = DifficultyLevel.hard

    # 4. Calculate Topic-Level Performance & Identify Weak/Strong Topics
    topic_performances: List[TopicPerformance] = []
    weak_topics: List[str] = []
    strong_topics: List[str] = []

    for t_id, stats in topic_stats.items():
        t_score = round((stats["correct"] / stats["total"]) * 100.0, 1)
        is_weak = (t_score < WEAK_TOPIC_THRESHOLD_PCT)

        if is_weak:
            weak_topics.append(stats["topic_name"])
        else:
            strong_topics.append(stats["topic_name"])

        topic_performances.append(
            TopicPerformance(
                topic_id=t_id,
                topic_name=stats["topic_name"],
                score_percentage=t_score,
                correct_count=stats["correct"],
                total_questions=stats["total"],
                is_weak=is_weak,
            )
        )

    # Sort topic performances ascending by score (weakest first)
    topic_performances.sort(key=lambda tp: tp.score_percentage)

    # 5. Persist DiagnosticAttempt record
    answers_json = {
        "user_answers": payload.answers,
        "topic_scores": {tp.topic_name: tp.score_percentage for tp in topic_performances},
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
    }

    attempt = DiagnosticAttempt(
        student_id=current_user.id,
        score_percentage=overall_score_percentage,
        total_questions=overall_total,
        correct_count=overall_correct,
        answers_json=answers_json,
        baseline_level=baseline_level,
    )
    db.add(attempt)
    db.flush()

    # 6. Create / Update SkillMastery records for student per topic
    for tp in topic_performances:
        mastery = (
            db.query(SkillMastery)
            .filter(
                SkillMastery.student_id == current_user.id,
                SkillMastery.topic_id == tp.topic_id,
            )
            .first()
        )

        if tp.score_percentage < 40.0:
            lvl = DifficultyLevel.easy
        elif tp.score_percentage < 75.0:
            lvl = DifficultyLevel.medium
        else:
            lvl = DifficultyLevel.hard

        if not mastery:
            mastery = SkillMastery(
                student_id=current_user.id,
                topic_id=tp.topic_id,
                mastery_score=tp.score_percentage,
                current_level=lvl,
                correct_streak=tp.correct_count,
                total_attempts=tp.total_questions,
                correct_count=tp.correct_count,
            )
            db.add(mastery)
        else:
            mastery.mastery_score = tp.score_percentage
            mastery.current_level = lvl
            mastery.total_attempts = (mastery.total_attempts or 0) + tp.total_questions
            mastery.correct_count = (mastery.correct_count or 0) + tp.correct_count
            db.add(mastery)

    # 7. Update StudentProfile diagnostic status & award XP
    profile = current_user.student_profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id, grade_level=8)
        db.add(profile)

    profile.diagnostic_completed = True
    profile.total_xp = (profile.total_xp or 0) + 100
    db.add(profile)

    # 8. Log LearningEvent
    event = LearningEvent(
        user_id=current_user.id,
        event_type=LearningEventType.diagnostic_done,
        payload={
            "score_pct": overall_score_percentage,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
        },
        xp_earned=100,
    )
    db.add(event)

    db.commit()

    return DiagnosticResultResponse(
        diagnostic_id=attempt.id,
        overall_score_percentage=overall_score_percentage,
        total_questions=overall_total,
        correct_count=overall_correct,
        baseline_level=baseline_level.value if hasattr(baseline_level, "value") else str(baseline_level),
        topic_performances=topic_performances,
        weak_topics=weak_topics,
        strong_topics=strong_topics,
        xp_earned=100,
        question_reviews=question_reviews,
    )


@router.get("/results", response_model=DiagnosticResultResponse)
def get_diagnostic_results(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Get the most recent diagnostic assessment result for the authenticated student.
    """
    attempt = (
        db.query(DiagnosticAttempt)
        .filter(DiagnosticAttempt.student_id == current_user.id)
        .order_by(DiagnosticAttempt.completed_at.desc())
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No diagnostic test results found for this student. Please take the diagnostic quiz first.",
        )

    # Reconstruct topic performances & reviews from attempt data & DB
    masteries = (
        db.query(SkillMastery, Topic)
        .join(Topic, SkillMastery.topic_id == Topic.id)
        .filter(SkillMastery.student_id == current_user.id)
        .all()
    )

    topic_performances: List[TopicPerformance] = []
    weak_topics: List[str] = []
    strong_topics: List[str] = []

    for m, t in masteries:
        is_w = m.mastery_score < 70.0
        if is_w:
            weak_topics.append(t.name)
        else:
            strong_topics.append(t.name)

        topic_performances.append(
            TopicPerformance(
                topic_id=t.id,
                topic_name=t.name,
                score_percentage=m.mastery_score,
                correct_count=m.correct_count or 0,
                total_questions=m.total_attempts or 0,
                is_weak=is_w,
            )
        )

    topic_performances.sort(key=lambda tp: tp.score_percentage)

    # Reconstruct question reviews if saved in answers_json
    question_reviews: List[QuestionReviewItem] = []
    user_answers = (attempt.answers_json or {}).get("user_answers", {})
    if user_answers:
        q_ids = [int(k) for k in user_answers.keys() if k.isdigit()]
        questions = db.query(Question).filter(Question.id.in_(q_ids)).all() if q_ids else []
        for q in questions:
            chosen = user_answers.get(str(q.id), "N/A").strip().upper()
            correct = q.correct_answer.strip().upper()
            is_c = (chosen == correct)
            question_reviews.append(
                QuestionReviewItem(
                    question_id=q.id,
                    question_text=q.question_text,
                    topic_name=q.topic.name if q.topic else "Math",
                    chosen_answer=chosen,
                    correct_answer=correct,
                    is_correct=is_c,
                    explanation=q.explanation,
                )
            )

    return DiagnosticResultResponse(
        diagnostic_id=attempt.id,
        overall_score_percentage=attempt.score_percentage,
        total_questions=attempt.total_questions,
        correct_count=attempt.correct_count,
        baseline_level=attempt.baseline_level.value if hasattr(attempt.baseline_level, "value") else str(attempt.baseline_level),
        topic_performances=topic_performances,
        weak_topics=weak_topics,
        strong_topics=strong_topics,
        xp_earned=100,
        question_reviews=question_reviews,
    )
