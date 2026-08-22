/**
 * src/types/index.ts
 * ──────────────────
 * Shared TypeScript types for ShikshaAI frontend.
 * These match the Pydantic schemas returned by the FastAPI backend.
 */

// ── User & Auth ───────────────────────────────────────────────────────────────

export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  preferred_language: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
  preferred_language?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Student Profile ───────────────────────────────────────────────────────────

export interface StudentProfile {
  id: number;
  user_id: number;
  grade_level: number;
  school_name?: string;
  learning_style: string;
  diagnostic_completed: boolean;
  current_streak_days: number;
  total_xp: number;
  onboarding_completed: boolean;
}

// ── Subjects & Topics ─────────────────────────────────────────────────────────

export interface Subject {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Topic {
  id: number;
  subject_id: number;
  name: string;
  description?: string;
  grade_level?: number;
}

// ── Questions ─────────────────────────────────────────────────────────────────

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  subject_id: number;
  topic_id: number;
  question_text: string;
  difficulty: DifficultyLevel;
  options: Record<string, string>;  // {"A": "...", "B": "..."}
  is_diagnostic: boolean;
  grade_level?: number;
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface SkillMastery {
  id: number;
  topic_id: number;
  topic_name: string;
  subject_name: string;
  mastery_score: number;
  current_level: DifficultyLevel;
  correct_streak: number;
  total_attempts: number;
  correct_count: number;
}

// ── Health Check ──────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  message: string;
  version: string;
  timestamp: string;
}

export interface DatabaseHealthResponse {
  status: string;
  database: string;
  tables_found: number;
  timestamp: string;
}
