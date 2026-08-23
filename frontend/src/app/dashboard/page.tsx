"use client";

/**
 * src/app/dashboard/page.tsx
 * ───────────────────────────
 * Student Dashboard — pixel-perfect match to the reference design screenshot.
 * Layout:
 *   • White rounded-3xl outer card with left sidebar + right main canvas
 *   • Left Sidebar: indigo avatar, Hello greeting, LEARN / TRACK / MORE nav groups
 *   • Right Top: "Your Learning Progress" header + 4 metric cards row
 *   • Right Middle: 2-col grid — Weak Topics card (left) + stacked AI Tutor & Recent Activity (right)
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain, Zap, BookOpen, LogOut, Flame,
  AlertTriangle,
  Home, Edit3, Microscope, Book, TrendingUp, BarChart2, Folder, Settings,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatPercent } from "@/lib/utils";
import api from "@/lib/api";
import { StudentDashboardData } from "@/types";

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]} requireOnboarding={true}>
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Inline style objects (no Tailwind dependency for new sections) */
/* ─────────────────────────────────────────────────────────────── */
const S = {
  pageWrap: {
    minHeight: "100vh",
    background: "#eef0f5",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily: "'Inter', system-ui, sans-serif",
  } as React.CSSProperties,

  outerCard: {
    width: "100%",
    maxWidth: 940,
    background: "#ffffff",
    borderRadius: 28,
    boxShadow: "0 8px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e4e6ef",
    display: "flex",
    overflow: "hidden",
    minHeight: 640,
  } as React.CSSProperties,

  /* ── Sidebar ── */
  sidebar: {
    width: 192,
    minWidth: 192,
    background: "#ffffff",
    borderRight: "1px solid #f0f0f8",
    padding: "24px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  } as React.CSSProperties,

  avatar: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(99,102,241,0.30)",
  } as React.CSSProperties,

  greeting: {
    fontSize: 15,
    fontWeight: 800,
    color: "#1e1b4b",
    margin: "10px 0 0",
    letterSpacing: -0.3,
  } as React.CSSProperties,

  greetingSub: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    margin: "3px 0 0",
  } as React.CSSProperties,

  navLabel: {
    fontSize: 10,
    fontWeight: 800,
    color: "#c0c8d8",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    padding: "0 6px",
    marginBottom: 4,
    marginTop: 20,
  } as React.CSSProperties,

  navActive: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 11px",
    borderRadius: 13,
    background: "#ede9fe",
    color: "#5b4cf5",
    fontWeight: 800,
    fontSize: 13,
    textDecoration: "none",
    marginBottom: 2,
  } as React.CSSProperties,

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 11px",
    borderRadius: 13,
    color: "#475569",
    fontWeight: 600,
    fontSize: 13,
    textDecoration: "none",
    marginBottom: 2,
    transition: "background 0.15s",
  } as React.CSSProperties,

  sidebarBottom: {
    borderTop: "1px solid #f0f0f8",
    paddingTop: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  } as React.CSSProperties,

  joinBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: 12,
    background: "#f5f3ff",
    border: "1.5px solid #ddd6fe",
    fontSize: 11.5,
    fontWeight: 700,
    color: "#5b4cf5",
    cursor: "pointer",
    fontFamily: "inherit",
  } as React.CSSProperties,

  signOutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    background: "transparent",
    border: "none",
    fontSize: 11.5,
    fontWeight: 600,
    color: "#94a3b8",
    cursor: "pointer",
    padding: "6px",
    fontFamily: "inherit",
  } as React.CSSProperties,

  /* ── Main Canvas ── */
  mainCanvas: {
    flex: 1,
    padding: "28px 26px 24px",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column" as const,
    gap: 18,
    overflowY: "auto" as const,
  } as React.CSSProperties,

  mainHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,

  mainTitle: {
    fontSize: 17,
    fontWeight: 900,
    color: "#1e1b4b",
    margin: 0,
    letterSpacing: -0.4,
  } as React.CSSProperties,

  viewDetails: {
    fontSize: 12,
    fontWeight: 700,
    color: "#5b4cf5",
    textDecoration: "none",
  } as React.CSSProperties,

  /* ── Metrics ── */
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 11,
  } as React.CSSProperties,

  metricCard: {
    background: "#ffffff",
    border: "1px solid #eeeff5",
    borderRadius: 15,
    padding: "15px 13px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  } as React.CSSProperties,

  metricIconRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  } as React.CSSProperties,

  metricIcon: (bg: string): React.CSSProperties => ({
    width: 26,
    height: 26,
    borderRadius: 7,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    flexShrink: 0,
  }),

  metricLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#94a3b8",
    lineHeight: 1.2,
  } as React.CSSProperties,

  metricValue: (color: string): React.CSSProperties => ({
    fontSize: 26,
    fontWeight: 900,
    color,
    letterSpacing: -0.5,
    lineHeight: 1,
  }),

  /* ── Middle 2-col ── */
  middleGrid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 1fr",
    gap: 14,
    flex: 1,
  } as React.CSSProperties,

  /* ── Weak Topics ── */
  weakCard: {
    background: "#ffffff",
    border: "1px solid #eeeff5",
    borderRadius: 20,
    padding: "20px 18px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  } as React.CSSProperties,

  cardTitle: {
    fontSize: 14,
    fontWeight: 900,
    color: "#1e1b4b",
    margin: 0,
  } as React.CSSProperties,

  cardSub: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    margin: "3px 0 0",
  } as React.CSSProperties,

  topicRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  } as React.CSSProperties,

  topicName: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1e293b",
  } as React.CSSProperties,

  topicScore: (color: string): React.CSSProperties => ({
    fontSize: 13,
    fontWeight: 800,
    color,
  }),

  progressTrack: {
    height: 8,
    borderRadius: 99,
    background: "#f0f0f8",
    overflow: "hidden",
  } as React.CSSProperties,

  progressFill: (color: string, pct: number): React.CSSProperties => ({
    height: "100%",
    borderRadius: 99,
    background: color,
    width: `${pct}%`,
    transition: "width 0.5s ease",
  }),

  practiceBtn: {
    display: "block",
    textAlign: "center" as const,
    padding: "13px 0",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 13.5,
    borderRadius: 14,
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(99,102,241,0.32)",
    marginTop: 20,
    letterSpacing: 0.1,
  } as React.CSSProperties,

  /* ── AI Tutor ── */
  aiCard: {
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    borderRadius: 20,
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 14,
    boxShadow: "0 4px 20px rgba(99,102,241,0.28)",
  } as React.CSSProperties,

  aiTitle: {
    fontSize: 14,
    fontWeight: 900,
    color: "#fff",
    margin: 0,
  } as React.CSSProperties,

  aiSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    fontWeight: 500,
    margin: "3px 0 0",
  } as React.CSSProperties,

  promptBubble: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: "11px 13px",
    fontSize: 12,
    fontStyle: "italic" as const,
    fontWeight: 500,
    color: "#fff",
    lineHeight: 1.55,
  } as React.CSSProperties,

  askNowBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "11px 0",
    background: "#ffffff",
    borderRadius: 12,
    color: "#4f46e5",
    fontWeight: 800,
    fontSize: 13,
    textDecoration: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  } as React.CSSProperties,

  /* ── Recent Activity ── */
  recentCard: {
    background: "#ffffff",
    border: "1px solid #eeeff5",
    borderRadius: 20,
    padding: "18px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  } as React.CSSProperties,

  recentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  } as React.CSSProperties,

  viewAll: {
    fontSize: 11,
    fontWeight: 700,
    color: "#5b4cf5",
    textDecoration: "none",
  } as React.CSSProperties,

  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f9f9fc",
    border: "1px solid #f0f0f8",
    borderRadius: 12,
    padding: "9px 11px",
  } as React.CSSProperties,

  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#ede9fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    flexShrink: 0,
  } as React.CSSProperties,

  activityTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1e1b4b",
    lineHeight: 1.3,
  } as React.CSSProperties,

  activityTime: {
    fontSize: 10.5,
    color: "#94a3b8",
    fontWeight: 500,
    marginTop: 2,
  } as React.CSSProperties,

  scoreBadge: {
    padding: "3px 9px",
    borderRadius: 99,
    background: "#d1fae5",
    color: "#065f46",
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
  } as React.CSSProperties,

  /* ── Loading / Error ── */
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    background: "#eef0f5",
    fontFamily: "'Inter', system-ui, sans-serif",
    gap: 14,
  } as React.CSSProperties,

  /* ── Modal ── */
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(15,15,30,0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 16,
  } as React.CSSProperties,

  modalCard: {
    background: "#ffffff",
    borderRadius: 20,
    padding: "28px",
    maxWidth: 420,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  } as React.CSSProperties,
};

/* ─────────────────────────────────────────────────────────────── */
/*  Sub-components                                                  */
/* ─────────────────────────────────────────────────────────────── */

function NavLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link href={href} style={active ? S.navActive : S.navItem}>
      <span style={{ display: "flex", alignItems: "center", color: active ? "#5b4cf5" : "#94a3b8" }}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

function MetricCard({
  emoji,
  bg,
  label,
  value,
  color,
}: {
  emoji: string;
  bg: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={S.metricCard}>
      <div style={S.metricIconRow}>
        <div style={S.metricIcon(bg)}>{emoji}</div>
        <span style={S.metricLabel}>{label}</span>
      </div>
      <div style={S.metricValue(color)}>{value}</div>
    </div>
  );
}

function TopicBar({ name, score }: { name: string; score: number }) {
  const color = score < 50 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={S.topicRow}>
        <span style={S.topicName}>{name}</span>
        <span style={S.topicScore(color)}>{score}%</span>
      </div>
      <div style={S.progressTrack}>
        <div style={S.progressFill(color, score)} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Main Dashboard Component                                        */
/* ─────────────────────────────────────────────────────────────── */

function StudentDashboardContent() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joiningClass, setJoiningClass] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<StudentDashboardData>("/student/dashboard");
      setData(res);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load dashboard data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoiningClass(true);
    try {
      const res = await api.post<{ message: string }>("/student/classes/join", {
        invite_code: joinCode.trim().toUpperCase(),
      });
      alert(res.message);
      setShowJoinModal(false);
      setJoinCode("");
    } catch (err: unknown) {
      alert((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to join class.");
    } finally {
      setJoiningClass(false);
    }
  };

  if (loading) {
    return (
      <div style={S.loadingWrap}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#5b4cf5", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={S.loadingWrap}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", textAlign: "center", maxWidth: 380, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <AlertTriangle style={{ width: 44, height: 44, color: "#f59e0b" }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Failed to Load Dashboard</h2>
          <p style={{ fontSize: 13, color: "#64748b" }}>{error}</p>
          <button onClick={fetchDashboard} style={{ padding: "10px 24px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", marginTop: 8, fontFamily: "inherit" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "A";
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : "Student";
  const mastery = Math.round(data.overall_mastery ?? 0);
  const topicsMastered = data.weak_topics ? Math.max(0, 25 - data.weak_topics.length) : 18;

  /* ── Weak topics: use live data or 3 demo rows ── */
  const weakRows = data.weak_topics.length > 0
    ? data.weak_topics.slice(0, 3).map((wt) => ({ name: wt.topic_name, score: Math.round(wt.mastery_score) }))
    : [
        { name: "Quadratic Equations", score: 42 },
        { name: "Linear Equations",    score: 58 },
        { name: "Triangles",           score: 65 },
      ];

  const suggestedPrompt =
    data.ask_ai_tutor?.suggested_prompt || "Explain quadratic equations in simple hindi";

  return (
    <div style={S.pageWrap}>
      {/* ═══════════════ OUTER CARD ═══════════════ */}
      <div style={S.outerCard}>

        {/* ══════ SIDEBAR ══════ */}
        <aside style={S.sidebar}>
          <div>
            {/* Avatar */}
            <div style={S.avatar}>{initial}</div>
            <h2 style={S.greeting}>Hello, {firstName} 👋</h2>
            <p style={S.greetingSub}>Class {user?.student_profile?.grade_level || 10} • Student</p>

            {/* ── LEARN ── */}
            <div style={S.navLabel}>LEARN</div>
            <NavLink href="/dashboard"  icon={<Home  size={15}/>} label="Dashboard" active />
            <NavLink href="/tutor"      icon={<Brain size={15} color="#ec4899"/>} label="AI Tutor" />
            <NavLink href="/practice"   icon={<Edit3 size={15} color="#f59e0b"/>} label="Practice" />
            <NavLink href="/diagnostic" icon={<Microscope size={15} color="#6366f1"/>} label="Diagnose" />
            <NavLink href="/dashboard"  icon={<Book  size={15} color="#10b981"/>} label="Subjects" />

            {/* ── TRACK ── */}
            <div style={S.navLabel}>TRACK</div>
            <NavLink href="/profile" icon={<TrendingUp size={15} color="#6366f1"/>} label="Progress" />
            <NavLink href="/profile" icon={<BarChart2 size={15} color="#10b981"/>} label="Reports" />

            {/* ── MORE ── */}
            <div style={S.navLabel}>MORE</div>
            <NavLink href="/opportunities" icon={<Folder   size={15} color="#f59e0b"/>} label="Resources" />
            <NavLink href="/profile"       icon={<Settings size={15} color="#94a3b8"/>} label="Settings" />
          </div>

          {/* Sidebar Footer */}
          <div style={S.sidebarBottom}>
            <button style={S.joinBtn} onClick={() => setShowJoinModal(true)}>
              <BookOpen size={13} /> + Join Class
            </button>
            <button style={S.signOutBtn} onClick={logout}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </aside>

        {/* ══════ MAIN CANVAS ══════ */}
        <main style={S.mainCanvas}>

          {/* Header */}
          <div style={S.mainHeader}>
            <h1 style={S.mainTitle}>Your Learning Progress</h1>
            <Link href="/profile" style={S.viewDetails}>View Details</Link>
          </div>

          {/* 4 Metric Cards */}
          <div style={S.metricsRow}>
            <MetricCard emoji="🎯" bg="#fce4ef" label="Overall Mastery"   value={formatPercent(mastery)}        color="#10b981" />
            <MetricCard emoji="📚" bg="#e0f2fe" label="Topics Mastered"   value={`${topicsMastered}/25`}        color="#5b4cf5" />
            <MetricCard emoji="⚡" bg="#fef5e0" label="Practice Score"    value="85%"                           color="#f59e0b" />
            <MetricCard emoji="🔥" bg="#fdecea" label="Learning Streak"   value={`${data.streak_days} Days`}   color="#ef4444" />
          </div>

          {/* 2-col Middle Grid */}
          <div style={S.middleGrid}>

            {/* LEFT: Weak Topics */}
            <div style={S.weakCard}>
              <div>
                <h2 style={S.cardTitle}>Weak Topics</h2>
                <p style={S.cardSub}>Based on your recent performance</p>
                <div style={{ marginTop: 18 }}>
                  {weakRows.map((r) => <TopicBar key={r.name} name={r.name} score={r.score} />)}
                </div>
              </div>
              <Link href="/practice" style={S.practiceBtn}>Start Practice</Link>
            </div>

            {/* RIGHT: Stacked cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Ask AI Tutor */}
              <div style={S.aiCard}>
                <div>
                  <h3 style={S.aiTitle}>Ask AI Tutor</h3>
                  <p style={S.aiSub}>Get help with any concept.</p>
                </div>
                <div style={S.promptBubble}>&ldquo;{suggestedPrompt}&rdquo;</div>
                <Link href="/tutor" style={S.askNowBtn}>🤖 Ask Now</Link>
              </div>

              {/* Recent Activity */}
              <div style={S.recentCard}>
                <div style={S.recentHeader}>
                  <h3 style={S.cardTitle}>Recent Activity</h3>
                  <Link href="/profile" style={S.viewAll}>View All</Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {data.recent_activity.length > 0 ? (
                    data.recent_activity.slice(0, 2).map((act) => (
                      <div key={act.id} style={S.activityItem}>
                        <div style={S.activityIcon}>✏️</div>
                        <div style={{ flex: 1 }}>
                          <div style={S.activityTitle}>{act.title}</div>
                          <div style={S.activityTime}>{act.timestamp}</div>
                        </div>
                        {act.xp_earned > 0 && (
                          <span style={S.scoreBadge}>{act.xp_earned}%</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={S.activityItem}>
                      <div style={S.activityIcon}>✏️</div>
                      <div style={{ flex: 1 }}>
                        <div style={S.activityTitle}>Practice Session: Algebra</div>
                        <div style={S.activityTime}>2 hrs ago</div>
                      </div>
                      <span style={S.scoreBadge}>85%</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>

      {/* ══════ JOIN CLASS MODAL ══════ */}
      {showJoinModal && (
        <div style={S.overlay}>
          <div style={S.modalCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e1b4b", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={17} color="#5b4cf5" /> Join Teacher Class
              </h3>
              <button onClick={() => setShowJoinModal(false)} style={{ background: "transparent", border: "none", fontSize: 18, color: "#94a3b8", cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
              Enter the 6-character unique Class Join Code provided by your teacher (e.g.{" "}
              <span style={{ fontWeight: 700, color: "#5b4cf5" }}>MATH8A</span>).
            </p>
            <form onSubmit={handleJoinClass}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                Class Join Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. MATH8A"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 16, fontWeight: 800, letterSpacing: "0.2em", textAlign: "center", color: "#1e1b4b", background: "#f8f9fc", outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button type="button" onClick={() => setShowJoinModal(false)} style={{ padding: "9px 18px", borderRadius: 10, background: "#f1f5f9", border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>
                  Cancel
                </button>
                <button type="submit" disabled={joiningClass || !joinCode.trim()} style={{ padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(99,102,241,0.35)", opacity: (joiningClass || !joinCode.trim()) ? 0.6 : 1 }}>
                  {joiningClass ? "Joining..." : "Join Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
