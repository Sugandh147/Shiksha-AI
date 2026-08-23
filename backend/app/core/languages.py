"""
app/core/languages.py
──────────────────────
Centralized Language Registry for ShikshaAI Multilingual Learning.
Supports English (en), Hindi (hi), and Hinglish (hi-en), with an extensible
schema designed for easy addition of Tamil (ta), Telugu (te), Bengali (bn), Marathi (mr), etc.
"""

from typing import Dict, List, Any
from dataclasses import dataclass


@dataclass
class LanguageConfig:
    code: str
    name: str
    native_name: str
    script: str
    is_active: bool
    prompt_instruction: str


# ── Centralized Language Definitions ───────────────────────────────────────────

SUPPORTED_LANGUAGES: Dict[str, LanguageConfig] = {
    "en": LanguageConfig(
        code="en",
        name="English",
        native_name="English",
        script="Latin",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT:\n"
            "Generate the explanation, step-by-step reasoning, worked example, and follow-up suggestions in clear, standard English."
        ),
    ),
    "hi": LanguageConfig(
        code="hi",
        name="Hindi",
        native_name="हिंदी",
        script="Devanagari",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT (IMPORTANT):\n"
            "Generate the explanation, step-by-step reasoning, worked example, and follow-up suggestions strictly in clear Devanagari Hindi (हिंदी).\n"
            "Keep standard mathematical formulas and equations in universal notation (e.g., x² - 5x + 6 = 0)."
        ),
    ),
    "hi-en": LanguageConfig(
        code="hi-en",
        name="Hinglish",
        native_name="Hinglish (Hindi in English Script)",
        script="Latin-Devanagari",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT (IMPORTANT):\n"
            "Generate the explanation, step-by-step reasoning, worked example, and follow-up suggestions in natural conversational Hinglish (Hindi language written using English/Latin alphabet, e.g., 'Is topic me hum quadratic equation ko basic se samjhenge').\n"
            "Keep standard mathematical formulas and equations in universal notation."
        ),
    ),
    # ── Extensible Regional Indian Languages (Architectural Hooks) ────────────
    "ta": LanguageConfig(
        code="ta",
        name="Tamil",
        native_name="தமிழ்",
        script="Tamil",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT:\n"
            "Generate explanation and step-by-step reasoning in Tamil (தமிழ்)."
        ),
    ),
    "te": LanguageConfig(
        code="te",
        name="Telugu",
        native_name="తెలుగు",
        script="Telugu",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT:\n"
            "Generate explanation and step-by-step reasoning in Telugu (తెలుగు)."
        ),
    ),
    "bn": LanguageConfig(
        code="bn",
        name="Bengali",
        native_name="বাংলা",
        script="Bengali",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT:\n"
            "Generate explanation and step-by-step reasoning in Bengali (বাংলা)."
        ),
    ),
    "mr": LanguageConfig(
        code="mr",
        name="Marathi",
        native_name="मराठी",
        script="Devanagari",
        is_active=True,
        prompt_instruction=(
            "EXPLANATION LANGUAGE REQUIREMENT:\n"
            "Generate explanation and step-by-step reasoning in Marathi (मराठी)."
        ),
    ),
}


def get_language_config(code: str) -> LanguageConfig:
    """Retrieve language configuration by code. Defaults to English ('en') if code is unrecognised."""
    normalized_code = code.lower().strip() if code else "en"
    if normalized_code in ["hinglish", "hi_en"]:
        normalized_code = "hi-en"
    elif normalized_code in ["hindi"]:
        normalized_code = "hi"
    elif normalized_code in ["english"]:
        normalized_code = "en"

    return SUPPORTED_LANGUAGES.get(normalized_code, SUPPORTED_LANGUAGES["en"])


def get_language_instruction(code: str) -> str:
    """Get LLM prompt system instruction for target language code."""
    config = get_language_config(code)
    return config.prompt_instruction


def get_supported_languages_list() -> List[Dict[str, Any]]:
    """Get JSON serializable list of active supported languages for API responses."""
    return [
        {
            "code": cfg.code,
            "name": cfg.name,
            "native_name": cfg.native_name,
            "script": cfg.script,
            "is_active": cfg.is_active,
        }
        for cfg in SUPPORTED_LANGUAGES.values()
        if cfg.is_active
    ]
