"use client";

/**
 * src/app/practice/page.tsx
 * ─────────────────────────
 * Adaptive Practice Engine Page.
 * Driven by live student SkillMastery & weak-topic data.
 * Features:
 *   - Targeted practice set generation (/practice/generate).
 *   - Real-time adaptive difficulty feedback (/practice/submit).
 *   - Dynamic concept remediation callout when repeated mistakes occur.
 *   - Session summary report with mastery gains and XP rewards.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Zap, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Clock,
  Trophy, BookOpen, RefreshCw, Sparkles, Brain, HelpCircle, XCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import {
  PracticeGenerateResponse, PracticeQuestionOut,
  PracticeSubmitResponse
} from "@/types";

export default function PracticePage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <PracticeContent />
    </ProtectedRoute>
  );
}

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicIdParam = searchParams.get("topic_id");

  const [practiceSet, setPracticeSet] = useState<PracticeGenerateResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<PracticeSubmitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Session Tracking Metrics
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [consecutiveWrongs, setConsecutiveWrongs] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchPracticeSet();
  }, [topicIdParam]);

  const fetchPracticeSet = async () => {
    setLoading(true);
    setError("");
    try {
      const topicId = topicIdParam ? parseInt(topicIdParam) : undefined;
      const res = await api.post<PracticeGenerateResponse>("/practice/generate", {
        topic_id: topicId,
        count: 5,
      });
      setPracticeSet(res);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not generate practice questions.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!practiceSet || !selectedOption || submitting) return;

    const currentQ = practiceSet.questions[currentIndex];
    setSubmitting(true);

    try {
      const res = await api.post<PracticeSubmitResponse>("/practice/submit", {
        question_id: currentQ.question_id,
        chosen_answer: selectedOption,
        time_taken_secs: 15,
        current_streak: currentStreak,
        consecutive_wrongs: consecutiveWrongs,
      });

      setFeedback(res);
      setTotalXpEarned((prev) => prev + res.xp_earned);

      if (res.is_correct) {
        setCorrectCount((prev) => prev + 1);
        setCurrentStreak((prev) => prev + 1);
        setConsecutiveWrongs(0);
      } else {
        setCurrentStreak(0);
        setConsecutiveWrongs((prev) => prev + 1);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to submit answer.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!practiceSet) return;
    setFeedback(null);
    setSelectedOption(null);

    if (currentIndex < practiceSet.questions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin"
            style={{
              border: "3px solid rgba(16, 185, 129, 0.2)",
              borderTopColor: "#10b981",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>Generating adaptive practice set tailored to your weak areas...</p>
        </div>
      </div>
    );
  }

  if (error || !practiceSet || practiceSet.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-md p-8 rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold">Practice Error</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{error || "No practice questions available."}</p>
          <button onClick={fetchPracticeSet} className="btn btn-primary w-full">
            Retry Generating Set
          </button>
        </div>
      </div>
    );
  }

  // ── Session Summary Screen ───────────────────────────────────────────
  if (isCompleted) {
    const accuracyPct = Math.round((correctCount / practiceSet.questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-xl w-full p-8 md:p-10 rounded-3xl text-center space-y-6 border shadow-2xl" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Practice Session Completed!</h1>
            <p className="text-sm text-muted">
              Topic: <span className="font-bold text-white">{practiceSet.session_topic_name}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-4 rounded-2xl">
              <div className="text-2xl font-bold text-emerald-400">{accuracyPct}%</div>
              <div className="text-xs text-muted">Accuracy</div>
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="text-2xl font-bold text-indigo-400">+{totalXpEarned}</div>
              <div className="text-xs text-muted">XP Earned</div>
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="text-2xl font-bold text-amber-400">{correctCount}/{practiceSet.questions.length}</div>
              <div className="text-xs text-muted">Correct</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-surface border text-xs text-left space-y-1" style={{ borderColor: "var(--color-border)" }}>
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Skill Mastery Updated in Database
            </div>
            <p className="text-muted">
              Your performance has been recorded and adaptive difficulty level has been calibrated for your next practice run.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/dashboard" className="btn btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/tutor" className="btn btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" /> Ask AI Tutor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ: PracticeQuestionOut = practiceSet.questions[currentIndex];
  const totalQ = practiceSet.questions.length;
  const currentDiff = feedback?.next_difficulty || currentQ.difficulty;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <header className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #10b981, #6366f1)" }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              Shiksha<span className="gradient-text">AI</span> Adaptive Practice
            </span>
          </Link>

          {/* Progress Indicator */}
          <div className="flex-1 max-w-md mx-6">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Question {currentIndex + 1} of {totalQ}</span>
              <span className="text-emerald-400">+{totalXpEarned} XP</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }} />
            </div>
          </div>

          <Link href="/dashboard" className="btn btn-secondary py-1.5 px-3 text-xs">
            Exit
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-4xl mx-auto px-6 py-8 flex flex-col justify-center">
        <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl border space-y-6 relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {currentQ.topic_name}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                style={{
                  background: currentDiff === "hard" ? "rgba(239, 68, 68, 0.15)" : (currentDiff === "medium" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)"),
                  color: currentDiff === "hard" ? "#f87171" : (currentDiff === "medium" ? "#fbbf24" : "#34d399"),
                  border: `1px solid ${currentDiff === "hard" ? "rgba(239, 68, 68, 0.3)" : (currentDiff === "medium" ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)")}`,
                }}
              >
                Adaptive Difficulty: {currentDiff}
              </span>
            </div>

            {currentStreak >= 2 && (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                🔥 {currentStreak} Answer Streak!
              </span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-bold leading-snug">
            {currentQ.question_text}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(currentQ.options).map(([key, val]) => {
              const isSelected = selectedOption === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={Boolean(feedback)}
                  onClick={() => setSelectedOption(key)}
                  className="p-5 rounded-2xl border text-left transition-all flex items-center justify-between group"
                  style={{
                    background: isSelected ? "rgba(16, 185, 129, 0.15)" : "var(--color-surface-2)",
                    borderColor: isSelected ? "#10b981" : "var(--color-border)",
                    opacity: feedback && !isSelected ? 0.6 : 1,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                      style={{
                        background: isSelected ? "#10b981" : "var(--color-surface)",
                        color: isSelected ? "#ffffff" : "var(--color-text-muted)",
                        border: isSelected ? "none" : "1px solid var(--color-border)",
                      }}
                    >
                      {key}
                    </div>
                    <span className="text-base font-medium" style={{ color: isSelected ? "#ffffff" : "inherit" }}>
                      {val}
                    </span>
                  </div>

                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isSelected ? "#10b981" : "transparent",
                      border: isSelected ? "none" : "1px solid var(--color-border)",
                    }}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Immediate Answer Submit Button */}
          {!feedback && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || submitting}
                className="btn btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-lg"
                style={{ opacity: !selectedOption || submitting ? 0.5 : 1 }}
              >
                {submitting ? "Checking Answer..." : "Submit Answer"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Immediate Feedback Card */}
          {feedback && (
            <div
              className={`p-6 rounded-2xl border space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300 ${
                feedback.is_correct ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {feedback.is_correct ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-base">
                      {feedback.is_correct ? "Correct Answer! 🎉" : "Incorrect Answer"}
                    </h3>
                    <p className="text-xs text-muted">
                      {feedback.is_correct
                        ? `+${feedback.xp_earned} XP Awarded • Next difficulty set to ${feedback.next_difficulty.toUpperCase()}`
                        : `Correct option was (${feedback.correct_answer}) • Next difficulty adjusted to ${feedback.next_difficulty.toUpperCase()}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="text-sm p-4 rounded-xl bg-surface border text-muted" style={{ borderColor: "var(--color-border)" }}>
                <span className="font-semibold text-white">Explanation: </span>{feedback.explanation}
              </div>

              {/* Concept Remediation Callout Modal */}
              {feedback.requires_remediation && feedback.remediation_concept && (
                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 space-y-2 text-amber-200 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Concept Remediation Callout (Repeated Mistakes Detected)
                  </div>
                  <p className="leading-relaxed">{feedback.remediation_concept}</p>
                </div>
              )}

              {/* Next Question Control */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="btn btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                  {currentIndex < totalQ - 1 ? "Next Question" : "Finish Practice Session"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
