"use client";

/**
 * src/app/teacher/students/[id]/page.tsx
 * ───────────────────────────────────────
 * Teacher Student Detail Insights Page.
 * RBAC Protected: Displays student mastery, weak topics, quiz history,
 * frequent mistakes, and recommended pedagogical interventions.
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, BookOpen, AlertTriangle, CheckCircle, BarChart3,
  Clock, Trophy, Zap, ShieldCheck, HelpCircle, Lightbulb, Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { StudentDetailInsightsOut } from "@/types";

export default function StudentDetailPage() {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <StudentDetailContent />
    </ProtectedRoute>
  );
}

function StudentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id;

  const [insights, setInsights] = useState<StudentDetailInsightsOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (studentId) {
      fetchInsights(Number(studentId));
    }
  }, [studentId]);

  const fetchInsights = async (sId: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<StudentDetailInsightsOut>(`/teachers/students/${sId}/insights`);
      setInsights(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load student detailed insights.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-3 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-muted">Retrieving detailed student analytics & quiz history...</p>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-md p-8 rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold">Access Error</h2>
          <p className="text-sm text-muted">{error || "Student insights unavailable."}</p>
          <Link href="/teacher" className="btn btn-primary w-full">
            Return to ClassPulse Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Top Navbar */}
      <header className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/teacher" className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back to ClassPulse
          </Link>

          <span className="text-xs font-semibold text-muted flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> RBAC Protected Teacher Data Access
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Student Profile Hero Header */}
        <div className="gradient-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border" style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-300 font-extrabold text-2xl flex items-center justify-center border border-indigo-500/40 shrink-0">
              {insights.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{insights.full_name}</h1>
              <p className="text-xs text-muted mt-1">
                {insights.email} &bull; Class: <span className="text-white font-semibold">{insights.class_name}</span> (Grade {insights.grade_level})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="glass p-4 rounded-2xl text-center min-w-[110px]">
              <div className="text-2xl font-extrabold text-emerald-400">{insights.overall_mastery}%</div>
              <div className="text-xs text-muted">Overall Mastery</div>
            </div>

            <div className="glass p-4 rounded-2xl text-center min-w-[120px]">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold block mb-1"
                style={{
                  background: insights.attention_level === "High" ? "rgba(239, 68, 68, 0.2)" : (insights.attention_level === "Medium" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"),
                  color: insights.attention_level === "High" ? "#f87171" : (insights.attention_level === "Medium" ? "#fbbf24" : "#34d399"),
                  border: `1px solid ${insights.attention_level === "High" ? "rgba(239, 68, 68, 0.3)" : (insights.attention_level === "Medium" ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)")}`,
                }}
              >
                {insights.attention_level} Risk
              </span>
              <div className="text-[10px] text-muted">Attention Level</div>
            </div>
          </div>
        </div>

        {/* ── 1. Recommended Intervention Callout ─────────────────────── */}
        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
          <h2 className="font-bold text-base text-indigo-300 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-400" /> Recommended Intervention for Teacher
          </h2>
          <p className="text-sm font-medium text-indigo-100 leading-relaxed">
            {insights.recommended_intervention}
          </p>
        </div>

        {/* ── 2. Weak Topics Breakdown Grid ───────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Weak Topics Breakdown (&lt; 70% Mastery)
          </h2>

          {insights.weak_topics.length === 0 ? (
            <div className="glass p-6 rounded-2xl text-center text-sm text-muted">
              No weak topics identified. Student is performing proficiently across all areas.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.weak_topics.map((wt: any) => (
                <div key={wt.topic_id} className="card border-amber-500/30 bg-amber-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{wt.subject_name}</span>
                    <span className="text-xs text-muted capitalize">Level: {wt.current_level}</span>
                  </div>
                  <h3 className="font-bold text-base">{wt.topic_name}</h3>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Mastery Score</span>
                      <span className="font-bold text-amber-400">{wt.mastery_score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${wt.mastery_score}%`, background: "linear-gradient(90deg, #ef4444, #f59e0b)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 3. Quiz & Practice History Table ───────────────────────── */}
        <div className="glass rounded-3xl p-6 md:p-8 space-y-4 border" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Quiz & Practice Attempts History
          </h2>

          {insights.quiz_history.length === 0 ? (
            <p className="text-sm text-muted">No quiz attempt history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b text-xs text-muted uppercase tracking-wider" style={{ borderColor: "var(--color-border)" }}>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4">Question Text</th>
                    <th className="py-3 px-4">Student Choice</th>
                    <th className="py-3 px-4">Correct Key</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                  {insights.quiz_history.map((qh: any, idx: number) => (
                    <tr key={idx} className="hover:bg-surface/50 transition-colors text-xs">
                      <td className="py-3 px-4 font-bold text-indigo-300">{qh.topic_name}</td>
                      <td className="py-3 px-4 max-w-sm truncate">{qh.question_text}</td>
                      <td className="py-3 px-4 font-bold">{qh.chosen_answer}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">{qh.correct_answer}</td>
                      <td className="py-3 px-4 text-right">
                        {qh.is_correct ? (
                          <span className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-red-400 font-bold">Incorrect</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
