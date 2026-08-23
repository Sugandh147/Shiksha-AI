"use client";

/**
 * src/app/dashboard/page.tsx
 * ───────────────────────────
 * Student Dashboard — 100% Backend Data Connected.
 * Light Theme — Clean, spacious SaaS layout with dark readable typography.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain, Zap, BookOpen, LogOut, Flame, Trophy, Target, Award,
  ArrowRight, CheckCircle, AlertTriangle, Sparkles, Activity,
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

  // Join Class State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joiningClass, setJoiningClass] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoiningClass(true);
    try {
      const res = await api.post<{ message: string; class_name: string }>("/student/classes/join", {
        invite_code: joinCode.trim().toUpperCase(),
      });
      alert(res.message);
      setShowJoinModal(false);
      setJoinCode("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to join class.";
      alert(msg);
    } finally {
      setJoiningClass(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-4 animate-spin"
            style={{
              border: "3px solid #e2e8f0",
              borderTopColor: "#5b4cf5",
            }}
          />
          <p className="text-slate-600 font-semibold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white max-w-md p-8 rounded-3xl text-center border border-slate-200 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <button onClick={fetchDashboard} className="btn-primary w-full">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Top Navbar ─────────────────────────────────────────────────── */}
      <header className="navbar sticky top-0 z-40 py-3.5">
        <div className="container-page flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-decoration-none">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, #5b4cf5, #7c6ff9)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">
              Shiksha<span className="text-gradient">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> <span>+ Join Class</span>
            </button>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 text-decoration-none"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #5b4cf5, #10b981)" }}
              >
                {getInitials(user?.full_name || "Student")}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">{user?.full_name?.split(" ")[0]}</span>
            </Link>

            <button onClick={logout} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-page py-8 space-y-8">
        {/* ── 1. Welcome Banner ─────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: "#ede9fe", color: "#5b21b6" }}>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Student Portal
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
              {data.welcome_message}
            </h1>
            <p className="text-sm font-medium text-slate-600 mb-3">
              Ready to continue your learning journey today?
            </p>
            
            {data.learning_goal && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Goal:</span>
                <span className="text-indigo-700">{data.learning_goal}</span>
              </div>
            )}
          </div>

          {/* Stats Counters */}
          <div className="flex gap-4 self-stretch lg:self-auto shrink-0">
            <div className="bg-slate-50 border border-slate-200 flex-1 lg:flex-initial p-4 rounded-2xl text-center min-w-[110px]">
              <Flame className="w-6 h-6 mx-auto mb-1 text-amber-500 animate-pulse" />
              <div className="text-2xl font-extrabold text-slate-900">{data.streak_days}</div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">Day Streak</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 flex-1 lg:flex-initial p-4 rounded-2xl text-center min-w-[110px]">
              <Trophy className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
              <div className="text-2xl font-extrabold text-slate-900">{data.total_xp}</div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">Total XP</div>
            </div>
          </div>
        </div>

        {/* ── Diagnostic Quiz Prompt Banner ─────────────────────────────── */}
        <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-700 shadow-xs">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Mathematics Diagnostic Assessment</h3>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                Test your knowledge across Algebra, Quadratic Equations, Trigonometry, Geometry, and Statistics.
              </p>
            </div>
          </div>
          <Link href="/diagnostic" className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shrink-0">
            <Sparkles className="w-4 h-4" /> Start Diagnostic Quiz <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── OpportunityMatch Card ─────────────────────────────────────── */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 flex flex-wrap items-center gap-2">
                <span>OpportunityMatch Engine</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                  Matches Available
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                Matched public scholarships & Olympiads based on your grade level and performance.
              </p>
            </div>
          </div>
          <Link
            href="/opportunities"
            className="btn-primary py-2.5 px-4 text-xs font-bold shrink-0 flex items-center gap-1.5"
            style={{ background: "#d97706" }}
          >
            View Matched Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── 2. Top Stats Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Mastery Gauge */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Overall Mastery</span>
                <span className="pill pill-green">Verified</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black" style={{ color: data.overall_mastery >= 70 ? "#059669" : "#d97706" }}>
                  {formatPercent(data.overall_mastery)}
                </span>
                <span className="text-xs text-slate-600 font-semibold">across all topics</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="progress-track">
                <div
                  className="progress-fill-bar"
                  style={{
                    width: `${data.overall_mastery}%`,
                    background: data.overall_mastery >= 70 ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #f59e0b, #d97706)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                <span>Beginner</span>
                <span>Proficient (70%)</span>
                <span>Master</span>
              </div>
            </div>
          </div>

          {/* Continue Learning Recommendation */}
          {data.continue_learning && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 text-emerald-700">
                  <Zap className="w-4 h-4 text-emerald-600" /> Continue Learning
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">{data.continue_learning.topic_name}</h3>
                <p className="text-xs text-slate-600 font-medium mb-3">
                  Subject: <span className="text-slate-800 font-semibold">{data.continue_learning.subject_name}</span>
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                  <span>Current Mastery</span>
                  <span>{formatPercent(data.continue_learning.progress_percentage)}</span>
                </div>
                <div className="progress-track mb-4">
                  <div className="progress-fill-bar" style={{ width: `${data.continue_learning.progress_percentage}%` }} />
                </div>
                <Link
                  href={`/practice?topic_id=${data.continue_learning.topic_id}`}
                  className="btn-primary w-full py-2.5 text-xs flex items-center justify-center gap-2 text-decoration-none"
                >
                  {data.continue_learning.next_action} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Ask AI Tutor Widget */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  <Brain className="w-4 h-4 text-indigo-600" /> Ask AI Tutor
                </span>
                <span className="pill pill-green flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-slate-700 mb-3 italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                &ldquo;{data.ask_ai_tutor.suggested_prompt}&rdquo;
              </p>
            </div>

            <Link href="/tutor" className="btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-decoration-none">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Start AI Tutor Conversation
            </Link>
          </div>
        </div>

        {/* ── 3. Weak Topics & Practice Section ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weak Topics List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Weak Topics & Practice Focus
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Topics requiring revision (score &lt; 70%) fetched live from database
                </p>
              </div>
              <span className="pill pill-brand">{data.weak_topics.length} topics flagged</span>
            </div>

            {data.weak_topics.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900">Great job! No weak topics found.</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your mastery in all topics is above 70%. Keep practicing to maintain your streak!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.weak_topics.map((topic) => (
                  <div key={topic.topic_id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {topic.subject_name}
                        </span>
                        <span className="text-xs font-bold text-slate-600 capitalize">
                          Level: {topic.current_level}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 mb-1">{topic.topic_name}</h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-xs text-slate-700 font-bold mb-1.5">
                        <span>Mastery Score</span>
                        <span className="text-amber-700">{formatPercent(topic.mastery_score)}</span>
                      </div>
                      <div className="progress-track mb-3">
                        <div className="progress-fill-bar" style={{ width: `${topic.mastery_score}%`, background: "linear-gradient(90deg, #ef4444, #f59e0b)" }} />
                      </div>
                      <Link href={`/practice?topic_id=${topic.topic_id}`} className="btn-secondary py-2 text-xs w-full flex items-center justify-center gap-1.5 text-amber-800 border-amber-300 hover:bg-amber-50 text-decoration-none">
                        <Zap className="w-3.5 h-3.5 text-amber-600" /> Practice Weak Topic
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 4. Recent Activity Timeline ───────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" /> Recent Activity
            </h2>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              {data.recent_activity.length > 0 ? (
                data.recent_activity.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-sm pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{act.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{act.description}</div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                        <span>{act.timestamp}</span>
                        {act.xp_earned > 0 && (
                          <span className="text-emerald-700 font-extrabold">+{act.xp_earned} XP</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 font-medium">
                  No learning activity yet. Complete your diagnostic assessment to start tracking your progress!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Join Class Modal Overlay */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Join Teacher Class
              </h3>
              <button onClick={() => setShowJoinModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter the 6-character unique Class Join Code provided by your teacher (e.g. <span className="font-bold text-indigo-700">MATH8A</span>).
            </p>

            <form onSubmit={handleJoinClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Class Join Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. MATH8A"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-base font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="btn-secondary py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joiningClass || !joinCode.trim()}
                  className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2"
                >
                  {joiningClass ? "Joining Class..." : "Join Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
