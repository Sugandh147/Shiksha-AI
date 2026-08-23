"use client";

/**
 * src/app/teacher/page.tsx
 * ────────────────────────
 * ClassPulse Teacher Intelligence Dashboard.
 * Powered 100% by live database analytics.
 * Features:
 *   - Class-wide metrics (Total Students, Average Mastery, Quiz Accuracy, Students Needing Attention).
 *   - Learning Attention Indicator Table with transparent flagged reasons.
 *   - Most Difficult Topics & Most Improved Students widgets.
 *   - Embedded Privacy-Preserving Teacher Copilot Q&A.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, BarChart3, TrendingUp, AlertTriangle, ShieldCheck,
  Brain, Sparkles, Send, ArrowRight, Eye, RefreshCw, CheckCircle,
  HelpCircle, ChevronDown, ChevronUp, BookOpen, UserCheck, Activity, LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import {
  ClassItem, ClassAnalyticsOut, StudentAttentionInfo,
  CopilotQueryResponse
} from "@/types";

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <ClassPulseContent />
    </ProtectedRoute>
  );
}

function ClassPulseContent() {
  const { user, logout } = useAuth();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<ClassAnalyticsOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Teacher Copilot State
  const [copilotQuestion, setCopilotQuestion] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<CopilotQueryResponse | null>(null);
  const [showReasonsForStudent, setShowReasonsForStudent] = useState<Record<number, boolean>>({});

  // Create Class Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState(8);
  const [creatingClass, setCreatingClass] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassAnalytics(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const data = await api.get<ClassItem[]>("/teachers/classes");
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId(data[0].id);
      } else {
        setLoading(false);
      }
    } catch {
      setError("Failed to load assigned teacher classes.");
      setLoading(false);
    }
  };

  const fetchClassAnalytics = async (classId: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<ClassAnalyticsOut>(`/teachers/classes/${classId}/analytics`);
      setAnalytics(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load ClassPulse analytics.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopilotQuery = async (queryText?: string) => {
    const q = queryText || copilotQuestion;
    if (!q.trim() || copilotLoading) return;

    setCopilotLoading(true);
    try {
      const res = await api.post<CopilotQueryResponse>("/teachers/copilot", {
        question: q,
        class_id: selectedClassId || undefined,
      });
      setCopilotResponse(res);
      if (!queryText) setCopilotQuestion("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Teacher Copilot error.";
      alert(msg);
    } finally {
      setCopilotLoading(false);
    }
  };

  const toggleReasons = (sId: number) => {
    setShowReasonsForStudent((prev) => ({ ...prev, [sId]: !prev[sId] }));
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreatingClass(true);
    try {
      const res = await api.post<ClassItem>("/teachers/classes", {
        name: newClassName.trim(),
        grade_level: newClassGrade,
      });
      setClasses((prev) => [...prev, res]);
      setSelectedClassId(res.id);
      setShowCreateModal(false);
      setNewClassName("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to create class.";
      alert(msg);
    } finally {
      setCreatingClass(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Top Navbar */}
      <header className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">
                Class<span className="gradient-text">Pulse</span>
              </h1>
              <p className="text-xs text-muted mt-0.5">Teacher Intelligence System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Create Class Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-md"
            >
              <BookOpen className="w-4 h-4" /> <span>+ Create Class</span>
            </button>

            {/* Class Selector Dropdown */}
            {classes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-semibold hidden sm:inline">Class:</span>
                <select
                  value={selectedClassId || ""}
                  onChange={(e) => setSelectedClassId(Number(e.target.value))}
                  className="bg-surface border rounded-xl text-xs py-2 px-3 font-bold focus:outline-none focus:border-indigo-500"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.student_count} Students)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: "var(--color-border)" }}>
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold">{user?.full_name}</div>
                <div className="text-[10px] text-muted">Teacher &bull; Mathematics</div>
              </div>

              <button onClick={logout} className="btn btn-secondary py-2 px-3 text-xs flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 container max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => selectedClassId && fetchClassAnalytics(selectedClassId)} className="btn btn-secondary py-1 px-3 text-xs">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-3 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-muted">Loading live database analytics for ClassPulse...</p>
          </div>
        ) : !analytics ? (
          <div className="glass p-10 rounded-3xl text-center max-w-md mx-auto space-y-4">
            <Users className="w-12 h-12 text-muted mx-auto" />
            <h2 className="text-xl font-bold">No Class Assigned</h2>
            <p className="text-sm text-muted">You do not have any assigned active classes. Please contact the administrator.</p>
          </div>
        ) : (
          <>
            {/* ── 1. Top Stat Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-3xl border flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
                <div>
                  <div className="text-xs font-semibold text-muted mb-1">Total Students</div>
                  <div className="text-3xl font-extrabold">{analytics.total_students}</div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Active Roster</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
                <div>
                  <div className="text-xs font-semibold text-muted mb-1">Average Mastery</div>
                  <div className="text-3xl font-extrabold text-emerald-400">{analytics.average_mastery}%</div>
                  <div className="text-[11px] text-muted mt-1">Database Calculated</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
                <div>
                  <div className="text-xs font-semibold text-muted mb-1">Average Quiz Accuracy</div>
                  <div className="text-3xl font-extrabold text-indigo-400">{analytics.average_quiz_accuracy}%</div>
                  <div className="text-[11px] text-muted mt-1">Across all attempts</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border flex items-center justify-between" style={{ borderColor: "rgba(245, 158, 11, 0.4)", background: "rgba(245, 158, 11, 0.05)" }}>
                <div>
                  <div className="text-xs font-semibold text-amber-400 mb-1">Students Needing Attention</div>
                  <div className="text-3xl font-extrabold text-amber-400">{analytics.students_needing_attention.length}</div>
                  <div className="text-[11px] text-amber-300/80 mt-1">Flagged by Indicator</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* ── 2. Learning Attention Indicator Section ───────────────────── */}
            <div className="glass rounded-3xl p-6 md:p-8 space-y-4 border" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" /> Learning Attention Indicator Table
                  </h2>
                  <p className="text-xs text-muted">
                    Transparent rule-based risk calculation derived from live quiz accuracy, topic mastery, and repeated mistakes.
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Transparent Rules (No medical/psychological claims)
                </span>
              </div>

              {analytics.students_needing_attention.length === 0 ? (
                <div className="p-8 text-center bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="font-bold text-base">All Students On Track!</h3>
                  <p className="text-xs text-muted">No students currently exceed the risk threshold in this class.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b text-xs text-muted uppercase tracking-wider" style={{ borderColor: "var(--color-border)" }}>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Risk Level</th>
                        <th className="py-3 px-4">Risk Score</th>
                        <th className="py-3 px-4">Flagged Reasons (Transparent)</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                      {analytics.students_needing_attention.map((s) => (
                        <tr key={s.student_id} className="hover:bg-surface/50 transition-colors">
                          <td className="py-4 px-4 font-bold">
                            {s.full_name}
                            <div className="text-xs font-normal text-muted">{s.email}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{
                                background: s.risk_level === "High" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                                color: s.risk_level === "High" ? "#f87171" : "#fbbf24",
                                border: `1px solid ${s.risk_level === "High" ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                              }}
                            >
                              {s.risk_level} Attention
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-xs">
                            {s.risk_score} / 100
                          </td>
                          <td className="py-4 px-4 max-w-md">
                            <ul className="list-disc list-inside space-y-1 text-xs text-amber-200/90">
                              {s.flagged_reasons.map((r, idx) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link
                              href={`/teacher/students/${s.student_id}`}
                              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 inline-flex"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-400" /> Student Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── 3. Difficult Topics & Most Improved Grid ─────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Difficult Topics Widget */}
              <div className="glass rounded-3xl p-6 md:p-8 space-y-4 border" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" /> Most Difficult Topics in Class
                </h3>
                <div className="space-y-4">
                  {analytics.most_difficult_topics.map((dt) => (
                    <div key={dt.topic_id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">{dt.topic_name}</span>
                        <span className="text-amber-400 font-semibold">{dt.average_mastery}% Class Avg</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${dt.average_mastery}%`,
                            background: dt.average_mastery < 60 ? "linear-gradient(90deg, #ef4444, #f59e0b)" : "linear-gradient(90deg, #10b981, #34d399)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Improved Students Widget */}
              <div className="glass rounded-3xl p-6 md:p-8 space-y-4 border" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Performing & Improved Students
                </h3>
                <div className="space-y-3">
                  {analytics.most_improved_students.map((imp) => (
                    <div key={imp.student_id} className="p-3.5 rounded-2xl bg-surface border flex items-center justify-between text-xs" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                          {imp.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{imp.full_name}</div>
                          <div className="text-muted">🔥 {imp.streak_days} Day Streak</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400 text-sm">{imp.overall_mastery}%</div>
                        <div className="text-[10px] text-muted">Mastery Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 4. Embedded Teacher Copilot Panel ────────────────────────── */}
            <div className="glass rounded-3xl p-6 md:p-8 border space-y-4 relative overflow-hidden" style={{ borderColor: "rgba(99, 102, 241, 0.4)", background: "rgba(99, 102, 241, 0.05)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Teacher Copilot (AI Analytics Assistant)</h3>
                    <p className="text-xs text-muted">Ask questions about class struggles, student needs, and lesson planning based on live DB data.</p>
                  </div>
                </div>
              </div>

              {/* Prompt Suggestion Chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopilotQuery("Which students need help with algebra?")}
                  className="px-3 py-1.5 rounded-full text-xs bg-surface border text-indigo-300 hover:border-indigo-500 transition-all flex items-center gap-1.5"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Which students need help with algebra?
                </button>
                <button
                  onClick={() => handleCopilotQuery("Which topic is the class struggling with?")}
                  className="px-3 py-1.5 rounded-full text-xs bg-surface border text-indigo-300 hover:border-indigo-500 transition-all flex items-center gap-1.5"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Which topic is the class struggling with?
                </button>
                <button
                  onClick={() => handleCopilotQuery("Who has improved the most?")}
                  className="px-3 py-1.5 rounded-full text-xs bg-surface border text-indigo-300 hover:border-indigo-500 transition-all flex items-center gap-1.5"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Who has improved the most?
                </button>
                <button
                  onClick={() => handleCopilotQuery("What should I teach tomorrow?")}
                  className="px-3 py-1.5 rounded-full text-xs bg-surface border text-indigo-300 hover:border-indigo-500 transition-all flex items-center gap-1.5"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> What should I teach tomorrow?
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCopilotQuery();
                }}
                className="glass rounded-2xl p-2 flex items-center gap-2 border shadow-lg"
                style={{ borderColor: "var(--color-border)" }}
              >
                <input
                  type="text"
                  value={copilotQuestion}
                  onChange={(e) => setCopilotQuestion(e.target.value)}
                  placeholder="Ask Teacher Copilot a question about class analytics..."
                  className="flex-1 bg-transparent border-none px-4 py-3 text-sm focus:outline-none"
                  style={{ color: "var(--color-text)" }}
                />
                <button
                  type="submit"
                  disabled={!copilotQuestion.trim() || copilotLoading}
                  className="btn btn-primary py-3 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0"
                  style={{ opacity: !copilotQuestion.trim() || copilotLoading ? 0.5 : 1 }}
                >
                  {copilotLoading ? "Analyzing DB..." : "Ask Copilot"} <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Copilot Response Display */}
              {copilotResponse && (
                <div className="p-6 rounded-2xl bg-surface border space-y-4 text-sm animate-in fade-in duration-300" style={{ borderColor: "var(--color-border)" }}>
                  <div className="font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Copilot Analytical Answer:
                  </div>

                  <p className="whitespace-pre-line leading-relaxed text-sm font-medium">
                    {copilotResponse.answer}
                  </p>

                  {copilotResponse.recommended_actions.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Recommended Actions for Teacher:</span>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted">
                        {copilotResponse.recommended_actions.map((act, aIdx) => (
                          <li key={aIdx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Create Class Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 md:p-8 max-w-md w-full border space-y-6 animate-in zoom-in-95 duration-200" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Create New Class
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-muted hover:text-white text-lg font-bold">&times;</button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 8 - Section A"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">Grade Level</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(Number(e.target.value))}
                  className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingClass || !newClassName.trim()}
                  className="btn btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2"
                >
                  {creatingClass ? "Generating Code..." : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
