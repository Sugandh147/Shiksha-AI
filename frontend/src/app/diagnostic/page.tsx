"use client";

/**
 * src/app/diagnostic/page.tsx
 * ───────────────────────────
 * Interactive Diagnostic Quiz Page for Mathematics.
 * Fetches 10-15 questions covering Algebra, Quadratic Equations, Trigonometry, Geometry, Statistics.
 * Submits chosen answers to POST /api/v1/diagnostic/submit and redirects to /diagnostic/results.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, ArrowRight, ArrowLeft, CheckCircle, Clock,
  Brain, HelpCircle, AlertCircle, Sparkles, LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { DiagnosticStartResponse, QuestionOutForDiagnostic } from "@/types";

export default function DiagnosticQuizPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DiagnosticQuizContent />
    </ProtectedRoute>
  );
}

function DiagnosticQuizContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [quizData, setQuizData] = useState<DiagnosticStartResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post<DiagnosticStartResponse>("/diagnostic/start");
      setQuizData(res);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load diagnostic questions from server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    if (!quizData) return;
    setSubmitting(true);
    setError("");

    // Convert keys to string for backend API contract
    const formattedAnswers: Record<string, string> = {};
    Object.entries(answers).forEach(([qId, val]) => {
      formattedAnswers[qId] = val;
    });

    try {
      const result = await api.post("/diagnostic/submit", {
        answers: formattedAnswers,
        time_taken_secs: 180,
      });

      // Save result in sessionStorage for instant rendering on results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("shikshaai_latest_diagnostic_result", JSON.stringify(result));
      }

      router.push("/diagnostic/results");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to submit diagnostic quiz. Please try again.";
      setError(msg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin"
            style={{
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "#6366f1",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>Preparing Mathematics Diagnostic Assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData || quizData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-md p-8 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Quiz Load Error</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>{error || "No diagnostic questions available."}</p>
          <button onClick={fetchQuiz} className="btn btn-primary w-full">
            Retry Loading Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ: QuestionOutForDiagnostic = quizData.questions[currentIndex];
  const totalQ = quizData.questions.length;
  const progressPct = roundTo((currentIndex + 1) / totalQ * 100);
  const isAnswered = Boolean(answers[currentQ.id]);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Top Bar */}
      <header className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              Shiksha<span className="gradient-text">AI</span> Diagnostic
            </span>
          </Link>

          {/* Progress Center */}
          <div className="flex-1 max-w-md mx-6">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Question {currentIndex + 1} of {totalQ}</span>
              <span style={{ color: "var(--color-text-muted)" }}>{answeredCount} Answered</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <Link href="/dashboard" className="btn btn-secondary py-1.5 px-3 text-xs">
            Cancel
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-4xl mx-auto px-6 py-8 flex flex-col justify-center">
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-2xl mb-6 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          {/* Header Metadata Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                {currentQ.topic_name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <span className="text-xs text-muted flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> Multiple Choice
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-bold mb-8 leading-snug">
            {currentQ.question_text}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {Object.entries(currentQ.options).map(([key, val]) => {
              const isSelected = answers[currentQ.id] === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, key)}
                  className="p-5 rounded-2xl border text-left transition-all flex items-center justify-between group"
                  style={{
                    background: isSelected ? "rgba(99, 102, 241, 0.15)" : "var(--color-surface-2)",
                    borderColor: isSelected ? "#6366f1" : "var(--color-border)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors"
                      style={{
                        background: isSelected ? "#6366f1" : "var(--color-surface)",
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
                      background: isSelected ? "#6366f1" : "transparent",
                      border: isSelected ? "none" : "1px solid var(--color-border)",
                    }}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="btn btn-secondary flex items-center gap-2 text-xs py-2.5"
              style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex < totalQ - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="btn btn-primary flex items-center gap-2 text-xs py-2.5 px-5"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || answeredCount === 0}
                className="btn btn-primary flex items-center gap-2 py-3 px-6 text-sm font-bold shadow-lg"
                style={{ opacity: submitting || answeredCount === 0 ? 0.6 : 1 }}
              >
                {submitting ? (
                  "Calculating Diagnosis..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Finish & View Results ({answeredCount}/{totalQ})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function roundTo(n: number) {
  return Math.round(n);
}
