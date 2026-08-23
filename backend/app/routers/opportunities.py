"""
app/routers/opportunities.py
───────────────────────────────
OpportunityMatch Router for ShikshaAI:
  • GET /opportunities         — List all opportunities (verified public + clearly labeled demo)
  • GET /opportunities/matches — Calculate personalized 0-100% transparent match scores and "Why this matches you" explanations
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, Opportunity, StudentProfile, SkillMastery
from app.dependencies import require_student
from app.schemas.opportunities import OpportunityOut, OpportunityMatchOut

router = APIRouter(prefix="", tags=["OpportunityMatch"])


# ── 1. List All Opportunities ──────────────────────────────────────────────────

@router.get("/opportunities", response_model=List[OpportunityOut])
@router.get("/opportunity", response_model=List[OpportunityOut])
def get_all_opportunities(
    filter_type: Optional[str] = "all",
    db: Session = Depends(get_db),
):
    """
    List all opportunities in the database.
    filter_type options: 'all', 'verified', 'demo'
    """
    query = db.query(Opportunity)
    if filter_type == "verified":
        query = query.filter(Opportunity.is_demo == False)
    elif filter_type == "demo":
        query = query.filter(Opportunity.is_demo == True)

    opps = query.order_by(Opportunity.deadline.asc()).all()
    return opps


# ── 2. Calculate Personalized Opportunity Matches ──────────────────────────────

@router.get("/opportunities/matches", response_model=List[OpportunityMatchOut])
@router.get("/opportunity/matches", response_model=List[OpportunityMatchOut])
def get_personalized_opportunity_matches(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """
    Calculate transparent opportunity matches for authenticated student.
    Matches student grade level, location, preferred subjects, and DB academic mastery.
    Returns 0-100% match score with explicit "Why this matches you" bullet points.
    """
    profile = current_user.student_profile
    grade_level = profile.grade_level if profile else 8
    grade_str = f"Class {grade_level}"

    # Student Masteries & Overall Mastery %
    masteries = db.query(SkillMastery).filter(SkillMastery.student_id == current_user.id).all()
    avg_mastery = (
        round(sum(m.mastery_score for m in masteries) / len(masteries), 1)
        if masteries else 50.0
    )

    # Student Preferred Subjects
    pref_subjects = profile.preferred_subjects if (profile and profile.preferred_subjects) else ["Mathematics", "Science"]

    opps = db.query(Opportunity).all()
    matches: List[OpportunityMatchOut] = []

    for opp in opps:
        why_reasons: List[str] = []

        # Component 1: Grade Level Alignment (35% weight)
        if opp.target_education_level == grade_str or grade_str in opp.eligibility:
            grade_score = 100.0
            why_reasons.append(f"Matched: Your Grade Level ({grade_str}) satisfies eligibility requirement")
        else:
            grade_score = 70.0
            why_reasons.append(f"Eligible: Open for middle school students including {grade_str}")

        # Component 2: Subject & Interest Alignment (35% weight)
        opp_req_subs = opp.required_subjects or ["Mathematics"]
        matched_subs = [s for s in opp_req_subs if s in pref_subjects]
        if matched_subs:
            subject_score = 100.0
            why_reasons.append(f"Matched: Aligns with your interest in {', '.join(matched_subs)}")
        else:
            subject_score = 75.0
            why_reasons.append("Matched: Enhances your core STEM academic profile")

        # Component 3: Academic Mastery Qualification (30% weight)
        min_m = opp.minimum_mastery_score or 50.0
        if avg_mastery >= min_m:
            mastery_score_comp = 100.0
            why_reasons.append(f"Matched: Your overall Mathematics mastery of {avg_mastery}% exceeds the {min_m}% academic threshold")
        else:
            diff = min_m - avg_mastery
            mastery_score_comp = max(40.0, 100.0 - (diff * 2.5))
            why_reasons.append(f"Academic Goal: Reach {min_m}% mastery (currently at {avg_mastery}%) to maximize qualification probability")

        # Overall Weighted Match Score (0 - 100%)
        final_score = round(0.35 * grade_score + 0.35 * subject_score + 0.30 * mastery_score_comp, 1)

        if final_score >= 85.0:
            category = "High Match"
        elif final_score >= 70.0:
            category = "Moderate Match"
        else:
            category = "Eligible"

        matches.append(
            OpportunityMatchOut(
                opportunity=opp,
                match_score=final_score,
                match_category=category,
                why_matches=why_reasons,
            )
        )

    # Sort descending by match score
    matches.sort(key=lambda m: m.match_score, reverse=True)
    return matches
