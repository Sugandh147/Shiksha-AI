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
  onboarding_completed?: boolean;
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

// ── Student Onboarding & Profile ───────────────────────────────────────────────

export interface StudentOnboardingRequest {
  name: string;
  education_level: string;
  class_grade: number;
  subjects: string[];
  preferred_language: string;
  learning_goal: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  grade_level: number;
  education_level?: string;
  school_name?: string;
  learning_style?: string;
  preferred_subjects?: string[];
  learning_goal?: string;
  diagnostic_completed: boolean;
  current_streak_days: number;
  total_xp: number;
  onboarding_completed: boolean;
  created_at?: string;
}

// ── Teacher Profile & Roster ──────────────────────────────────────────────────

export interface TeacherProfile {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  school_name?: string;
  subject_specialization?: string;
  years_experience: number;
}

export interface TeacherStudent {
  student_id: number;
  full_name: string;
  email: string;
  grade_level: number;
  class_name?: string;
  streak_days: number;
  total_xp: number;
  overall_mastery: number;
}

// ── Student Dashboard ─────────────────────────────────────────────────────────

export interface WeakTopicItem {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  mastery_score: number;
  current_level: string;
}

export interface RecentActivityItem {
  id: number;
  activity_type: string;
  title: string;
  description: string;
  timestamp: string;
  xp_earned: number;
}

export interface ContinueLearningItem {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  progress_percentage: number;
  next_action: string;
}

export interface StudentDashboardData {
  user_name: string;
  user_role: string;
  welcome_message: string;
  learning_goal?: string;
  overall_mastery: number;
  weak_topics: WeakTopicItem[];
  recent_activity: RecentActivityItem[];
  continue_learning?: ContinueLearningItem;
  ask_ai_tutor: {
    status: string;
    suggested_prompt: string;
    recommended_topic: string;
  };
  practice_weak_areas: WeakTopicItem[];
  streak_days: number;
  total_xp: number;
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
  options: Record<string, string>;
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

// ── Diagnostic Assessment ──────────────────────────────────────────────────────

export interface QuestionOutForDiagnostic {
  id: number;
  question_text: string;
  options: Record<string, string>;
  topic_id: number;
  topic_name: string;
  difficulty: string;
}

export interface DiagnosticStartResponse {
  total_questions: number;
  subject_name: string;
  topics_covered: string[];
  questions: QuestionOutForDiagnostic[];
}

export interface TopicPerformance {
  topic_id: number;
  topic_name: string;
  score_percentage: number;
  correct_count: number;
  total_questions: number;
  is_weak: boolean;
}

export interface QuestionReviewItem {
  question_id: number;
  question_text: string;
  topic_name: string;
  chosen_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
}

export interface DiagnosticResultResponse {
  diagnostic_id: number;
  overall_score_percentage: number;
  total_questions: number;
  correct_count: number;
  baseline_level: string;
  topic_performances: TopicPerformance[];
  weak_topics: string[];
  strong_topics: string[];
  xp_earned: number;
  question_reviews: QuestionReviewItem[];
}

// ── AI Tutor (RAG) ────────────────────────────────────────────────────────────

export interface SourceCitation {
  title: string;
  source_url?: string;
  chunk_text: string;
  relevance_score: number;
}

export interface VideoResource {
  title: string;
  channel_name: string;
  video_url: string;
  thumbnail_url?: string;
}

export interface TutorChatRequest {
  message: string;
  topic_name?: string;
  session_id?: number;
  modifier?: "simpler" | "deeper" | "example" | "practice";
  language?: string;
}

export interface TutorChatResponse {
  session_id: number;
  message_id: number;
  explanation: string;
  step_by_step: string[];
  example: string;
  follow_up: string[];
  sources: SourceCitation[];
  video_resources?: VideoResource[];
}

// ── Adaptive Practice Engine ──────────────────────────────────────────────────

export interface PracticeQuestionOut {
  question_id: number;
  question_text: string;
  options: Record<string, string>;
  topic_id: number;
  topic_name: string;
  difficulty: string;
}

export interface PracticeGenerateResponse {
  session_topic_name: string;
  initial_difficulty: string;
  questions: PracticeQuestionOut[];
}

export interface PracticeSubmitRequest {
  question_id: number;
  chosen_answer: string;
  time_taken_secs?: number;
  current_streak?: number;
  consecutive_wrongs?: number;
}

export interface PracticeSubmitResponse {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  next_difficulty: string;
  mastery_score: number;
  mastery_level: string;
  xp_earned: number;
  requires_remediation: boolean;
  remediation_concept?: string;
}

export interface RecommendedPracticeItem {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  mastery_score: number;
  current_level: string;
  reason: string;
}

// ── Teacher Intelligence (ClassPulse) ──────────────────────────────────────────

export interface ClassItem {
  id: number;
  name: string;
  grade_level: number;
  invite_code?: string;
  student_count: number;
}

export interface StudentAttentionInfo {
  student_id: number;
  full_name: string;
  email: string;
  class_name: string;
  risk_level: "High" | "Medium" | "Low";
  risk_score: number;
  flagged_reasons: string[];
}

export interface DifficultTopicItem {
  topic_id: number;
  topic_name: string;
  subject_name: string;
  average_mastery: number;
  students_struggling_count: number;
}

export interface ImprovedStudentItem {
  student_id: number;
  full_name: string;
  overall_mastery: number;
  recent_gain: number;
  streak_days: number;
}

export interface ClassAnalyticsOut {
  class_id: number;
  class_name: string;
  total_students: number;
  average_mastery: number;
  average_quiz_accuracy: number;
  students_needing_attention: StudentAttentionInfo[];
  most_difficult_topics: DifficultTopicItem[];
  most_improved_students: ImprovedStudentItem[];
}

export interface WeakTopicDetail {
  topic_id: number;
  subject_name: string;
  topic_name: string;
  mastery_score: number;
  current_level: string;
}

export interface QuizHistoryItem {
  topic_name: string;
  question_text: string;
  chosen_answer: string;
  correct_answer: string;
  is_correct: boolean;
  timestamp?: string;
}

export interface FrequentMistakeItem {
  topic_name: string;
  mistake_count: number;
  sample_mistake: string;
}

export interface StudentDetailInsightsOut {
  student_id: number;
  full_name: string;
  email: string;
  grade_level: number;
  class_name: string;
  overall_mastery: number;
  attention_level: string;
  flagged_reasons: string[];
  weak_topics: WeakTopicDetail[];
  recent_performance: QuizHistoryItem[];
  quiz_history: QuizHistoryItem[];
  practice_history: QuizHistoryItem[];
  frequent_mistakes: FrequentMistakeItem[];
  recommended_intervention: string;
}

export interface CopilotQueryRequest {
  question: string;
  class_id?: number;
}

export interface CopilotQueryResponse {
  query: string;
  answer: string;
  data_sources: string[];
  recommended_actions: string[];
}

export interface ImageQuestionSolverResponse {
  extracted_question: string;
  problem: string;
  concept: string;
  steps: string[];
  answer: string;
  verification: string;
  similar_question: string;
  sources: SourceCitation[];
}

export interface OpportunityOut {
  id: number;
  name: string;
  provider: string;
  description: string;
  eligibility: string;
  benefit: string;
  deadline: string;
  official_source: string;
  application_url: string;
  is_demo: boolean;
  target_education_level: string;
  required_subjects: string[];
  minimum_mastery_score: number;
}

export interface OpportunityMatchOut {
  opportunity: OpportunityOut;
  match_score: number;
  match_category: string;
  why_matches: string[];
}




