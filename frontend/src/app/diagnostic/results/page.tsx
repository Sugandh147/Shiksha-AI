"use client";

/**
 * src/app/diagnostic/results/page.tsx
 * ────────────────────────────────────
 * Diagnostic Assessment Results Page.
 * Dynamic, 100% backend-calculated result report.
 * Displays overall score %, assigned baseline level, per-topic performances, weak topics (<70%), and question review.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy, CheckCircle, AlertTriangle, ArrowRight, BookOpen,
  Sparkles, RefreshCw, BarChart3, HelpCircle, ChevronDown, ChevronUp, Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { DiagnosticResultResponse } from "@/types";

export default function DiagnosticResultsPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DiagnosticResultsContent />
    </ProtectedRoute>
  );
}

function DiagnosticResultsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [result, setResult] = useState<DiagnosticResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    // 1. Try to load from sessionStorage
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("shikshaai_latest_diagnostic_result");
      if (cached) {
        try {
          setResult(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // Fallback to API
        }
      }
    }

    // 2. Fetch from backend API
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<DiagnosticResultResponse>("/diagnostic/results");
      setResult(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "No diagnostic results found. Please take the diagnostic assessment first.";
      setError(msg);
    } finally {
      setLoading(false);
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
          <p style={{ color: "var(--color-text-muted)" }}>Generating your personalized diagnostic report...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-md p-8 rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold">No Diagnostic Results</h2>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{error}</p>
          <Link href="/diagnostic" className="btn btn-primary w-full block">
            Start Diagnostic Assessment
          </Link>
        </div>
      </div>
    );
  }

  const primaryWeakTopic = result.weak_topics.length > 0 ? result.weak_topics[0] : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Navbar */}
      <nav className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              Shiksha<span className="gradient-text">AI</span> Assessment
            </span>
          </Link>

          <Link href="/dashboard" className="btn btn-secondary py-1.5 px-4 text-xs flex items-center gap-2">
            Go to Student Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ── 1. Hero Summary Banner ────────────────────────────────────── */}
        <div className="gradient-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border" style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
              <Sparkles className="w-3.5 h-3.5" /> Assessment Completed & Persistence Saved
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Diagnostic Results for {user?.full_name}</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Based on your answers, your starting baseline level is set to{" "}
              <span className="font-bold text-white uppercase">{result.baseline_level}</span>.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Score Ring */}
            <div className="glass p-5 rounded-2xl text-center min-w-[120px]">
              <div className="text-3xl font-extrabold" style={{ color: result.overall_score_percentage >= 70 ? "#10b981" : "#f59e0b" }}>
                {result.overall_score_percentage}%
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {result.correct_count} / {result.total_questions} Correct
              </div>
            </div>

            {/* XP Awarded */}
            <div className="glass p-5 rounded-2xl text-center min-w-[100px]">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-indigo-400" />
              <div className="text-xl font-bold text-indigo-300">+{result.xp_earned} XP</div>
              <div className="text-xs text-muted">Reward</div>
            </div>
          </div>
        </div>

        {/* ── 2. Topic Performance Grid ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Topic Performance Breakdown
            </h2>
            <span className="text-xs text-muted">Calculated dynamically by Backend Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.topic_performances.map((tp) => (
              <div
                key={tp.topic_id}
                className="card flex flex-col justify-between border transition-all"
                style={{
                  borderColor: tp.is_weak ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.3)",
                  background: tp.is_weak ? "rgba(245, 158, 11, 0.04)" : "var(--color-surface)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base">{tp.topic_name}</h3>
                    {tp.is_weak ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Weak Area
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Strong
                      </span>
                    )}
                  </div>

                  <div className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                    {tp.correct_count} of {tp.total_questions} questions correct
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Accuracy</span>
                    <span className="font-bold" style={{ color: tp.is_weak ? "#f59e0b" : "#10b981" }}>
                      {tp.score_percentage}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${tp.score_percentage}%`,
                        background: tp.is_weak ? "linear-gradient(90deg, #ef4444, #f59e0b)" : "linear-gradient(90deg, #10b981, #34d399)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Weak vs Strong Topic Insights Summary ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identified Weak Topics */}
          <div className="card border-amber-500/30 space-y-3">
            <h3 className="font-bold text-lg text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Identified Weak Areas (&lt; 70%)
            </h3>
            {result.weak_topics.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                No weak areas identified! Excellent proficiency across all subjects.
              </p>
            ) : (
              <ul className="space-y-2">
                {result.weak_topics.map((t) => (
                  <li key={t} className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 text-sm border border-amber-500/20">
                    <span className="font-medium text-white">{t}</span>
                    <span className="text-xs text-amber-400 font-semibold">Priority Focus</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Strong Topics */}
          <div className="card border-emerald-500/30 space-y-3">
            <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Strong Mastery Areas (&ge; 70%)
            </h3>
            {result.strong_topics.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Keep practicing to turn concepts into strong mastery!
              </p>
            ) : (
              <ul className="space-y-2">
                {result.strong_topics.map((t) => (
                  <li key={t} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 text-sm border border-emerald-500/20">
                    <span className="font-medium text-white">{t}</span>
                    <span className="text-xs text-emerald-400 font-semibold">Proficient</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── 4. Question Review Accordion ─────────────────────────────── */}
        <div className="glass rounded-3xl p-6 md:p-8 space-y-4 border" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="w-full flex items-center justify-between font-bold text-lg text-left"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" /> Question-by-Question Review ({result.question_reviews.length} questions)
            </span>
            {showReviews ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showReviews && (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
              {result.question_reviews.map((qr, idx) => (
                <div
                  key={qr.question_id}
                  className={`p-4 rounded-2xl border text-sm space-y-2 ${
                    qr.is_correct
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted">Q{idx + 1} &bull; {qr.topic_name}</span>
                    {qr.is_correct ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        Incorrect
                      </span>
                    )}
                  </div>

                  <div className="font-semibold text-base">{qr.question_text}</div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>Your Choice: <span className="font-bold">{qr.chosen_answer}</span></div>
                    <div>Correct Answer: <span className="font-bold text-emerald-400">{qr.correct_answer}</span></div>
                  </div>

                  <div className="text-xs p-3 rounded-xl bg-white/5 border text-muted mt-2" style={{ borderColor: "var(--color-border)" }}>
                    <span className="font-semibold text-white">Explanation: </span>{qr.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard" className="btn btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 w-full sm:w-auto justify-center">
            View Updated Dashboard <ArrowRight className="w-4 h-4" />
          </Link>

          <Link href="/diagnostic" className="btn btn-secondary py-3 px-6 text-sm flex items-center gap-2 w-full sm:w-auto justify-center">
            <RefreshCw className="w-4 h-4" /> Retake Diagnostic
          </Link>
        </div>
      </div>
    </div>
  );
}
