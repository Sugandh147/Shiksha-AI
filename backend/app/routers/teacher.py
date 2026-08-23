"""
app/routers/teacher.py
───────────────────────
Teacher-only routes: profile management, student roster access, and RBAC data isolation checks.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, TeacherProfile, Class, ClassMember, StudentProfile, SkillMastery
from app.dependencies import require_teacher
from app.schemas.teacher import TeacherProfileOut, TeacherStudentOut

router = APIRouter(prefix="/teacher", tags=["Teacher"])


@router.get("/profile", response_model=TeacherProfileOut)
def get_teacher_profile(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """
    Get current teacher's profile and subject specialization.
    """
    profile = current_user.teacher_profile
    if not profile:
        profile = TeacherProfile(
            user_id=current_user.id,
            school_name="ShikshaAI Partner School",
            subject_specialization="Mathematics & Science",
            years_experience=5,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return TeacherProfileOut(
        id=profile.id,
        user_id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        school_name=profile.school_name,
        subject_specialization=profile.subject_specialization,
        years_experience=profile.years_experience,
    )


@router.get("/students", response_model=List[TeacherStudentOut])
def get_teacher_students(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """
    RBAC Protected: Get list of students enrolled ONLY in classes taught by the authenticated teacher.
    Teachers cannot view students outside their assigned classes.
    """
    # 1. Get classes taught by teacher
    classes = db.query(Class).filter(Class.teacher_id == current_user.id).all()
    class_ids = [c.id for c in classes]

    if not class_ids:
        return []

    # 2. Get students in these classes
    memberships = (
        db.query(ClassMember, User, StudentProfile, Class)
        .join(User, ClassMember.student_id == User.id)
        .outerjoin(StudentProfile, User.id == StudentProfile.user_id)
        .join(Class, ClassMember.class_id == Class.id)
        .filter(ClassMember.class_id.in_(class_ids))
        .all()
    )

    results: List[TeacherStudentOut] = []
    seen_student_ids = set()

    for mem, user, prof, cls in memberships:
        if user.id in seen_student_ids:
            continue
        seen_student_ids.add(user.id)

        # Compute student's overall mastery
        masteries = db.query(SkillMastery).filter(SkillMastery.student_id == user.id).all()
        avg_mastery = (
            round(sum(m.mastery_score for m in masteries) / len(masteries), 1)
            if masteries else 0.0
        )

        results.append(
            TeacherStudentOut(
                student_id=user.id,
                full_name=user.full_name,
                email=user.email,
                grade_level=prof.grade_level if prof else cls.grade_level,
                class_name=cls.name,
                streak_days=prof.current_streak_days if prof else 0,
                total_xp=prof.total_xp if prof else 0,
                overall_mastery=avg_mastery,
            )
        )

    return results


@router.get("/students/{student_id}", response_model=TeacherStudentOut)
def get_student_by_id_for_teacher(
    student_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    """
    RBAC Protected: Retrieve single student details for a teacher.
    Checks authorization to verify the target student is enrolled in a class taught by the current teacher.
    Raises 403 Forbidden if teacher attempts to access an unrelated student.
    """
    # 1. Get classes taught by teacher
    teacher_class_ids = [
        c.id for c in db.query(Class).filter(Class.teacher_id == current_user.id).all()
    ]

    # 2. Verify target student membership
    membership = (
        db.query(ClassMember)
        .filter(
            ClassMember.student_id == student_id,
            ClassMember.class_id.in_(teacher_class_ids),
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You are not authorized to view this student's data. Student is not in your assigned classes.",
        )

    # 3. Retrieve student user and profile
    student_user = db.query(User).filter(User.id == student_id).first()
    if not student_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    prof = student_user.student_profile
    cls = membership.class_

    masteries = db.query(SkillMastery).filter(SkillMastery.student_id == student_id).all()
    avg_mastery = (
        round(sum(m.mastery_score for m in masteries) / len(masteries), 1)
        if masteries else 0.0
    )

    return TeacherStudentOut(
        student_id=student_user.id,
        full_name=student_user.full_name,
        email=student_user.email,
        grade_level=prof.grade_level if prof else cls.grade_level,
        class_name=cls.name,
        streak_days=prof.current_streak_days if prof else 0,
        total_xp=prof.total_xp if prof else 0,
        overall_mastery=avg_mastery,
    )
