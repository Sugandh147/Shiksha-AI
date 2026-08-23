/**
 * src/lib/languages.ts
 * ─────────────────────
 * Centralized Frontend Language Registry for ShikshaAI Multilingual Learning.
 * Provides supported language options, native names, and scripts.
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    script: "Latin",
    flag: "🌐",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    script: "Devanagari",
    flag: "🇮🇳",
  },
  {
    code: "hi-en",
    name: "Hinglish",
    nativeName: "Hinglish (Conversational)",
    script: "Latin-Devanagari",
    flag: "💬",
  },
  // Extensible Indian Regional Languages (Architectural Hooks)
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    script: "Tamil",
    flag: "🇮🇳",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    script: "Telugu",
    flag: "🇮🇳",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    flag: "🇮🇳",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    script: "Devanagari",
    flag: "🇮🇳",
  },
];

export function getLanguageOption(code: string): LanguageOption {
  const normalized = code ? code.toLowerCase().trim() : "en";
  if (normalized === "hinglish" || normalized === "hi_en") return SUPPORTED_LANGUAGES[2];
  if (normalized === "hindi") return SUPPORTED_LANGUAGES[1];
  if (normalized === "english") return SUPPORTED_LANGUAGES[0];

  return SUPPORTED_LANGUAGES.find((l) => l.code === normalized) || SUPPORTED_LANGUAGES[0];
}
