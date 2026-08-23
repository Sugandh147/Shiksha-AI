"use client";

/**
 * src/app/dashboard/page.tsx
 * ───────────────────────────
 * Student Dashboard — 100% Backend Data Connected.
 * Protected by ProtectedRoute for role="student".
 * Displays:
 *   • Welcome message & learning goal
 *   • Overall mastery percentage gauge
 *   • Weak topics (< 70% score) with direct practice triggers
 *   • Recent activity feed timeline
 *   • Continue learning recommended topic card
 *   • Ask AI Tutor widget with prompt shortcuts
 *   • Practice weak areas recommendation card
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain, Zap, BookOpen, LogOut, Flame, Trophy, Target, Award,
  ArrowRight, CheckCircle, AlertTriangle, Sparkles, User as UserIcon, Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getInitials, formatPercent } from "@/lib/utils";
import api from "@/lib/api";
import { StudentDashboardData } from "@/types";

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]} requireOnboarding={true}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

function StudentDashboardContent() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<StudentDashboardData>("/student/dashboard");
      setData(res);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load dashboard data from backend.";
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
          <p style={{ color: "var(--color-text-muted)" }}>Loading live student data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-md p-8 rounded-2xl text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Failed to Load Dashboard</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>{error}</p>
          <button onClick={fetchDashboard} className="btn btn-primary w-full">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* ── Top Navbar ─────────────────────────────────────────────────── */}
      <nav className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              Shiksha<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
              >
                {getInitials(user?.full_name || "Student")}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{user?.full_name?.split(" ")[0]}</span>
            </Link>

            <button onClick={logout} className="btn btn-secondary py-2 px-3 text-xs flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-6 py-8 max-w-7xl mx-auto space-y-8">
        {/* ── 1. Welcome Banner ─────────────────────────────────────────── */}
        <div className="gradient-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: "rgba(99, 102, 241, 0.2)", color: "#818cf8" }}>
              <Sparkles className="w-3.5 h-3.5" /> AI Student Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{data.welcome_message}</h1>
            {data.learning_goal && (
              <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                <Target className="w-4 h-4 text-emerald-400" /> Goal: <span className="font-medium text-white">{data.learning_goal}</span>
              </p>
            )}
          </div>

          <div className="flex gap-4 self-stretch md:self-auto shrink-0">
            <div className="glass flex-1 md:flex-initial p-4 rounded-2xl text-center min-w-[100px]">
              <Flame className="w-6 h-6 mx-auto mb-1 text-amber-400 animate-pulse-slow" />
              <div className="text-2xl font-bold">{data.streak_days}</div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Day Streak</div>
            </div>
            <div className="glass flex-1 md:flex-initial p-4 rounded-2xl text-center min-w-[100px]">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-indigo-400" />
              <div className="text-2xl font-bold">{data.total_xp}</div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Total XP</div>
            </div>
          </div>
        </div>

        {/* ── Diagnostic Quiz Prompt Banner ─────────────────────────────── */}
        <div className="glass rounded-3xl p-6 border flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(16, 185, 129, 0.3)", background: "rgba(16, 185, 129, 0.05)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Mathematics Diagnostic Assessment</h3>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Test your knowledge across Algebra, Quadratic Equations, Trigonometry, Geometry, and Statistics.
              </p>
            </div>
          </div>
          <Link href="/diagnostic" className="btn btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4" /> Start Diagnostic Quiz <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── OpportunityMatch Card ─────────────────────────────────────── */}
        <div className="glass rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.05)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                OpportunityMatch Engine <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Matches Available</span>
              </div>
              <p className="text-xs text-muted">
                Matched public scholarships & Olympiads based on your grade level and DB performance.
              </p>
            </div>
          </div>
          <Link href="/opportunities" className="btn btn-primary py-2 px-4 text-xs font-bold shrink-0 flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
            View Matched Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── 2. Top Stats Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Mastery Gauge */}
          <div className="card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted">Overall Mastery</span>
                <span className="badge badge-easy">Backend Verified</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-extrabold" style={{ color: data.overall_mastery >= 70 ? "#10b981" : "#f59e0b" }}>
                  {formatPercent(data.overall_mastery)}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>across all topics</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${data.overall_mastery}%`,
                    background: data.overall_mastery >= 70 ? "linear-gradient(90deg, #10b981, #34d399)" : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs" style={{ color: "var(--color-text-subtle)" }}>
                <span>Beginner</span>
                <span>Proficient (70%)</span>
                <span>Master</span>
              </div>
            </div>
          </div>

          {/* Continue Learning Recommendation */}
          {data.continue_learning && (
            <div className="card flex flex-col justify-between border" style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#10b981" }}>
                  <Zap className="w-4 h-4" /> Continue Learning
                </div>
                <h3 className="font-bold text-lg mb-1">{data.continue_learning.topic_name}</h3>
                <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                  Subject: {data.continue_learning.subject_name}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Current Mastery</span>
                  <span className="font-bold">{formatPercent(data.continue_learning.progress_percentage)}</span>
                </div>
                <div className="progress-bar mb-4">
                  <div className="progress-fill" style={{ width: `${data.continue_learning.progress_percentage}%` }} />
                </div>
                <button className="btn btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2">
                  {data.continue_learning.next_action} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Ask AI Tutor Widget */}
          <div className="card flex flex-col justify-between border" style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6366f1" }}>
                  <Brain className="w-4 h-4" /> Ask AI Tutor
                </span>
                <span className="badge badge-easy flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text-muted)" }}>
                &ldquo;{data.ask_ai_tutor.suggested_prompt}&rdquo;
              </p>
            </div>

            <Link href="/tutor" className="btn btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
              <Sparkles className="w-3.5 h-3.5" /> Start AI Tutor Conversation
            </Link>
          </div>
        </div>

        {/* ── 3. Weak Topics & Practice Section ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weak Topics List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Weak Topics & Practice Focus
                </h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Topics requiring revision (score &lt; 70%) fetched live from database
                </p>
              </div>
              <span className="badge badge-medium">{data.weak_topics.length} topics flagged</span>
            </div>

            {data.weak_topics.length === 0 ? (
              <div className="card p-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold">Great job! No weak topics found.</h3>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                  Your mastery in all topics is above 70%. Keep practicing to maintain your streak!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.weak_topics.map((topic) => (
                  <div key={topic.topic_id} className="card flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                          {topic.subject_name}
                        </span>
                        <span className="text-xs font-bold capitalize" style={{ color: "var(--color-text-subtle)" }}>
                          Level: {topic.current_level}
                        </span>
                      </div>
                      <h4 className="font-bold mb-1">{topic.topic_name}</h4>
                    </div>

                    <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Mastery Score</span>
                        <span className="font-bold text-amber-400">{formatPercent(topic.mastery_score)}</span>
                      </div>
                      <div className="progress-bar mb-3">
                        <div className="progress-fill" style={{ width: `${topic.mastery_score}%`, background: "linear-gradient(90deg, #ef4444, #f59e0b)" }} />
                      </div>
                      <Link href={`/practice?topic_id=${topic.topic_id}`} className="btn btn-secondary py-1.5 text-xs w-full flex items-center justify-center gap-1.5 text-amber-400 border-amber-500/30 hover:bg-amber-500/10">
                        <Zap className="w-3.5 h-3.5" /> Practice Weak Topic
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 4. Recent Activity Timeline ───────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> Recent Activity
            </h2>

            <div className="glass rounded-2xl p-5 space-y-4">
              {data.recent_activity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-sm pb-3 border-b last:border-0 last:pb-0" style={{ borderColor: "var(--color-border)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{act.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{act.description}</div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: "var(--color-text-subtle)" }}>
                      <span>{act.timestamp}</span>
                      {act.xp_earned > 0 && (
                        <span className="text-emerald-400 font-semibold">+{act.xp_earned} XP</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
