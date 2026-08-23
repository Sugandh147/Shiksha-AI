"use client";

/**
 * src/app/profile/page.tsx
 * ─────────────────────────
 * Student Profile Page.
 * Displays student background, education level, class, preferred subjects, learning goals, streak, and XP.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User as UserIcon, BookOpen, GraduationCap, Target, Flame, Trophy,
  Globe, ArrowLeft, LogOut, CheckCircle, Sparkles, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { StudentProfile } from "@/types";

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentProfileContent />
    </ProtectedRoute>
  );
}

function StudentProfileContent() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.get<StudentProfile>("/student/profile");
      setProfile(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to load profile.";
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
          <p style={{ color: "var(--color-text-muted)" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Navbar */}
      <nav className="glass sticky top-0 z-40 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={logout} className="btn btn-secondary py-2 px-3 text-xs flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-6 py-8 max-w-4xl mx-auto space-y-8">
        {/* Header Profile Card */}
        <div className="glass rounded-3xl p-8 border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative z-10">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{user?.full_name}</h1>
                <span className="badge badge-easy capitalize">{user?.role}</span>
              </div>

              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                {user?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border" style={{ borderColor: "var(--color-border)" }}>
                  <GraduationCap className="w-4 h-4 text-indigo-400" /> Class {profile?.grade_level} ({profile?.education_level || "Middle School"})
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border" style={{ borderColor: "var(--color-border)" }}>
                  <Globe className="w-4 h-4 text-emerald-400" /> Language: {user?.preferred_language?.toUpperCase()}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-4 h-4" /> Onboarding Completed
                </span>
              </div>
            </div>

            <div className="flex gap-4 shrink-0">
              <div className="glass p-4 rounded-2xl text-center min-w-[90px]">
                <Flame className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <div className="text-xl font-bold">{profile?.current_streak_days || 0}</div>
                <div className="text-xs text-muted">Streak</div>
              </div>
              <div className="glass p-4 rounded-2xl text-center min-w-[90px]">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                <div className="text-xl font-bold">{profile?.total_xp || 0}</div>
                <div className="text-xs text-muted">XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Profile & Goal */}
          <div className="card space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-400" /> Primary Learning Goal
            </h3>
            <p className="text-sm p-4 rounded-2xl bg-white/5 border" style={{ borderColor: "var(--color-border)" }}>
              &ldquo;{profile?.learning_goal || "Understand core concepts deeply and excel in school exams."}&rdquo;
            </p>

            <h3 className="text-lg font-bold flex items-center gap-2 pt-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Preferred Subjects
            </h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.preferred_subjects || ["Mathematics", "Science"]).map((subj) => (
                <span
                  key={subj}
                  className="px-4 py-2 rounded-2xl text-sm font-medium border"
                  style={{ background: "rgba(99, 102, 241, 0.15)", borderColor: "#6366f1", color: "#818cf8" }}
                >
                  {subj}
                </span>
              ))}
            </div>
          </div>

          {/* Account & System Status */}
          <div className="card space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Initial Learning Profile Status
            </h3>
            <div className="space-y-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                <span>Account ID</span>
                <span className="font-mono text-white">#{user?.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                <span>Diagnostic Assessment</span>
                <span className="text-emerald-400 font-semibold">{profile?.diagnostic_completed ? "Completed" : "Initial Baseline Set"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                <span>Learning Style</span>
                <span className="capitalize text-white">{profile?.learning_style || "Visual / Interactive"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>School</span>
                <span className="text-white">{profile?.school_name || "Self Learner"}</span>
              </div>
            </div>

            <Link href="/onboarding" className="btn btn-secondary w-full py-2.5 text-xs text-center block mt-4">
              Re-run Onboarding Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
