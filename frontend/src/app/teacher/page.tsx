"use client";

/**
 * src/app/teacher/page.tsx
 * ────────────────────────
 * Teacher Dashboard Page.
 * Protected by ProtectedRoute for role="teacher".
 * Features:
 *   • Teacher Profile (School, Subject Specialization, Experience)
 *   • Roster of students enrolled in taught classes
 *   • RBAC verification tool to test student data isolation
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, BookOpen, LogOut, ShieldCheck, Search, Flame, Trophy,
  AlertCircle, CheckCircle, Lock, UserCheck, GraduationCap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { TeacherProfile, TeacherStudent } from "@/types";

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <TeacherDashboardContent />
    </ProtectedRoute>
  );
}

function TeacherDashboardContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // RBAC test state
  const [testStudentId, setTestStudentId] = useState("");
  const [rbacTestResult, setRbacTestResult] = useState<{
    status: "none" | "allowed" | "forbidden";
    message: string;
  }>({ status: "none", message: "" });

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    setError("");
    try {
      const [profData, rosterData] = await Promise.all([
        api.get<TeacherProfile>("/teacher/profile"),
        api.get<TeacherStudent[]>("/teacher/students"),
      ]);
      setProfile(profData);
      setStudents(rosterData);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load teacher dashboard.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRbac = async () => {
    if (!testStudentId) return;
    setRbacTestResult({ status: "none", message: "Testing permission..." });
    try {
      const res = await api.get<TeacherStudent>(`/teacher/students/${testStudentId}`);
      setRbacTestResult({
        status: "allowed",
        message: `✅ Authorized: Successfully retrieved data for ${res.full_name} (${res.class_name}).`,
      });
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Access denied by backend authorization layer.";
      setRbacTestResult({
        status: "forbidden",
        message: `🚫 403 Forbidden: ${detail}`,
      });
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
          <p style={{ color: "var(--color-text-muted)" }}>Loading teacher portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Top Navbar */}
      <nav className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container flex items-center justify-between">
          <Link href="/teacher" className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              Shiksha<span className="gradient-text">AI</span> Teacher Portal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-easy font-semibold">Teacher</span>
              <span className="text-sm font-medium hidden sm:inline">{user?.full_name}</span>
            </div>
            <button onClick={logout} className="btn btn-secondary py-2 px-3 text-xs flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-6 py-8 max-w-7xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="gradient-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: "rgba(99, 102, 241, 0.2)", color: "#818cf8" }}>
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Educator Profile
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{profile?.full_name || user?.full_name}</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {profile?.school_name} &bull; Specialization: <span className="text-white font-medium">{profile?.subject_specialization}</span>
            </p>
          </div>

          <div className="glass p-4 rounded-2xl flex items-center gap-6">
            <div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Experience</div>
              <div className="text-xl font-bold">{profile?.years_experience} Years</div>
            </div>
            <div className="w-px h-8" style={{ background: "var(--color-border)" }} />
            <div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>Enrolled Students</div>
              <div className="text-xl font-bold text-emerald-400">{students.length}</div>
            </div>
          </div>
        </div>

        {/* RBAC Verification Box */}
        <div className="glass rounded-2xl p-6 border space-y-4" style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Lock className="w-5 h-5 text-indigo-400" /> Verify RBAC Data Isolation
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Enter a student ID to test backend permission checks. Teachers can only access student data for students in their assigned classes. Unrelated student IDs will return a <code className="bg-white/10 px-1 py-0.5 rounded text-amber-300">403 Forbidden</code> error.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              className="input max-w-xs"
              placeholder="e.g. 2 or 999"
              value={testStudentId}
              onChange={(e) => setTestStudentId(e.target.value)}
            />
            <button onClick={handleTestRbac} className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Test Backend Permission
            </button>
          </div>

          {rbacTestResult.status !== "none" && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                rbacTestResult.status === "allowed"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {rbacTestResult.message}
            </div>
          )}
        </div>

        {/* Student Roster Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-400" /> Class Roster & Student Performance
            </h2>
            <span className="badge badge-easy">{students.length} Total Enrolled</span>
          </div>

          <div className="glass rounded-2xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b text-xs font-semibold uppercase tracking-wider" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                  <tr>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Class / Grade</th>
                    <th className="p-4">Streak</th>
                    <th className="p-4">Total XP</th>
                    <th className="p-4">Overall Mastery</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                  {students.map((st) => (
                    <tr key={st.student_id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
                          >
                            {st.full_name.charAt(0)}
                          </div>
                          <div>
                            <div>{st.full_name}</div>
                            <div className="text-xs font-mono" style={{ color: "var(--color-text-subtle)" }}>ID: #{st.student_id} &bull; {st.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{st.class_name} (Grade {st.grade_level})</td>
                      <td className="p-4 font-medium flex items-center gap-1 text-amber-400">
                        <Flame className="w-4 h-4" /> {st.streak_days} days
                      </td>
                      <td className="p-4 font-medium text-indigo-400">
                        <Trophy className="w-4 h-4 inline mr-1" /> {st.total_xp}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: st.overall_mastery >= 70 ? "#10b981" : "#f59e0b" }}>
                            {st.overall_mastery}%
                          </span>
                          <div className="progress-bar w-20">
                            <div className="progress-fill" style={{ width: `${st.overall_mastery}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setTestStudentId(String(st.student_id));
                            api.get<TeacherStudent>(`/teacher/students/${st.student_id}`).then((res) => {
                              setRbacTestResult({
                                status: "allowed",
                                message: `✅ Verified access for Student #${st.student_id} (${res.full_name}).`,
                              });
                            });
                          }}
                          className="btn btn-secondary text-xs py-1 px-3"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
