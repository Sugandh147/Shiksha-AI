"""
app/core/constants.py
───────────────────────
Centralized business logic constants and thresholds for ShikshaAI.
Eliminates magic numbers and hardcoded values across backend services & routers.
"""

# ── Mastery & Diagnostic Thresholds ───────────────────────────────────────────
WEAK_TOPIC_THRESHOLD_PCT: float = 70.0  # Mastery < 70% is classified as a weak topic
STRONG_TOPIC_THRESHOLD_PCT: float = 70.0  # Mastery >= 70% is classified as strong
HIGH_RISK_THRESHOLD_PCT: float = 50.0   # Mastery < 50% triggers High Attention risk flag
MEDIUM_RISK_THRESHOLD_PCT: float = 65.0 # Mastery 50-65% triggers Medium Attention risk flag

# ── XP Rewards ─────────────────────────────────────────────────────────────────
DIAGNOSTIC_XP_REWARD: int = 100
PRACTICE_CORRECT_XP_REWARD: int = 15

# ── Opportunity Matching Weights ──────────────────────────────────────────────
OPPORTUNITY_WEIGHT_GRADE: float = 0.35
OPPORTUNITY_WEIGHT_SUBJECT: float = 0.35
OPPORTUNITY_WEIGHT_MASTERY: float = 0.30

# ── RAG Retrieval Parameters ──────────────────────────────────────────────────
DEFAULT_RAG_TOP_K: int = 3
DEFAULT_RELEVANCE_MIN: float = 0.40
