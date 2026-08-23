"""
app/schemas/opportunities.py
──────────────────────────────
Pydantic schemas for OpportunityMatch endpoints:
  • Opportunity item details
  • Personalized match output with Match Score and transparent rationale
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class OpportunityOut(BaseModel):
    id: int
    name: str
    provider: str
    description: str
    eligibility: str
    benefit: str
    deadline: str
    official_source: str
    application_url: str
    is_demo: bool
    target_education_level: str
    required_subjects: List[str] = Field(default_factory=list)
    minimum_mastery_score: float = 50.0

    class Config:
        from_attributes = True


class OpportunityMatchOut(BaseModel):
    opportunity: OpportunityOut
    match_score: float = Field(..., description="0-100% transparent match score")
    match_category: str = Field(..., description="High Match, Moderate Match, or Eligible")
    why_matches: List[str] = Field(..., description="Transparent bullet points explaining why this opportunity matches")
