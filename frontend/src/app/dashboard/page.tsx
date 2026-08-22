"use client";

/**
 * src/app/dashboard/page.tsx
 * ───────────────────────────
 * Student Dashboard — overview of learning progress.
 * Phase 1: Shows skeleton UI with static demo data and a health-check status.
 * Phase 2: Will fetch real data from /api/v1/analytics/student
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain, Zap, BarChart3, BookOpen, LogOut,
  Flame, Trophy, Target, TrendingUp, ArrowRight, CheckCircle, Circle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getInitials, formatPercent } from "@/lib/utils";
import api from "@/lib/api";

interface HealthStatus {
  api: "ok" | "error" | "loading";
  db: "ok" | "error" | "loading";
  tablesFound: number;
}

const subjects = [
  { name: "Mathematics", icon: "📐", color: "#6366f1", mastery: 72, topics: 4 },
  { name: "Science",     icon: "🔬", color: "#10b981", mastery: 65, topics: 4 },
  { name: "English",     icon: "📖", color: "#f59e0b", mastery: 80, topics: 2 },
  { name: "Social Studies", icon: "🗺️", color: "#ec4899", mastery: 55, topics: 2 },
];

const quickActions = [
  { label: "AI Tutor",       icon: Brain, href: "/tutor",    color: "#6366f1", desc: "Ask your tutor anything" },
  { label: "Practice",       icon: Zap,   href: "/practice", color: "#10b981", desc: "Adaptive quiz session" },
  { label: "Analytics",      icon: BarChart3, href: "/analytics", color: "#f59e0b", desc: "View your progress" },
];

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [health, setHealth] = useState<HealthStatus>({ api: "loading", db: "loading", tablesFound: 0 });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Health check to verify backend is connected
    api.get("/health/ping")
      .then(() => {
        setHealth((h) => ({ ...h, api: "ok" }));
        return api.get<{ status: string; tables_found: number }>("/health/db");
      })
      .then((data) => {
        setHealth((h) => ({ ...h, db: "ok", tablesFound: data.tables_found }));
      })
      .catch(() => {
        setHealth({ api: "error", db: "error", tablesFound: 0 });
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-pulse-slow"
            style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }} />
          <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const statusIcon = (s: "ok" | "error" | "loading") => {
    if (s === "ok") return <CheckCircle className="w-3 h-3 text-emerald-400" />;
    if (s === "error") return <Circle className="w-3 h-3 text-red-400" />;
    return <Circle className="w-3 h-3 animate-pulse-slow" style={{ color: "var(--color-text-subtle)" }} />;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* ── Top Navbar ──────────────────────────────────────────────────── */}
      <nav className="glass sticky top-0 z-40 px-6 py-4">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Shiksha<span className="gradient-text">AI</span></span>
          </Link>

          {/* System status */}
          <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: "var(--color-text-subtle)" }}>
            <span className="flex items-center gap-1">{statusIcon(health.api)} API</span>
            <span className="flex items-center gap-1">{statusIcon(health.db)} Database</span>
            {health.tablesFound > 0 && (
              <span className="badge badge-easy">{health.tablesFound} tables</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
              >
                {getInitials(user.full_name)}
              </div>
              <span className="text-sm font-medium hidden md:block">{user.full_name.split(" ")[0]}</span>
            </div>
            <button onClick={logout} className="btn btn-secondary py-2 px-3 text-xs">
              <LogOut className="w-3 h-3" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container px-6 py-8">
        {/* ── Welcome Banner ──────────────────────────────────────────────── */}
        <div className="gradient-card rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>Welcome back 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold">{user.full_name}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Keep going — your next session is ready!
            </p>
          </div>
          {/* Stats row */}
          <div className="hidden md:flex gap-6">
            {[
              { icon: Flame, label: "Day Streak", value: "7", color: "#f59e0b" },
              { icon: Trophy, label: "Total XP",  value: "1,240", color: "#6366f1" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <Icon className="w-6 h-6 mx-auto mb-1" style={{ color }} />
                <div className="text-xl font-bold">{value}</div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickActions.map(({ label, icon: Icon, href, color, desc }) => (
            <Link
              key={label}
              href={href}
              className="card flex items-center gap-4 group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" style={{ color }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{label}</div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
            </Link>
          ))}
        </div>

        {/* ── Subject Mastery ────────────────────────────────────────────── */}
        <h2 className="text-lg font-bold mb-4">Subject Mastery</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {subjects.map((subj) => (
            <div key={subj.name} className="card">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{subj.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{subj.name}</div>
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{subj.topics} topics</div>
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: subj.mastery >= 70 ? "#10b981" : subj.mastery >= 50 ? "#f59e0b" : "#ef4444" }}
                >
                  {formatPercent(subj.mastery)}
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${subj.mastery}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Phase 1 Status Banner ──────────────────────────────────────── */}
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)" }}
        >
          <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: "#6366f1" }}>
            <Target className="w-4 h-4" /> Phase 1 Foundation Status
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span className="flex gap-1 items-center">{statusIcon(health.api)} FastAPI Server</span>
            <span className="flex gap-1 items-center">{statusIcon(health.db)} PostgreSQL Database</span>
            <span className="flex gap-1 items-center"><CheckCircle className="w-3 h-3 text-emerald-400" /> Authentication (JWT)</span>
            <span className="flex gap-1 items-center"><CheckCircle className="w-3 h-3 text-emerald-400" /> Next.js Frontend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
