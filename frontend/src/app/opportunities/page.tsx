"use client";

/**
 * src/app/opportunities/page.tsx
 * ────────────────────────────────
 * OpportunityMatch Dashboard.
 * Powered by transparent matching algorithm calculating 0-100% match scores based on:
 *   1. Student Education Level & Grade
 *   2. Subject & Skill Alignment
 *   3. Database Academic Mastery Qualification
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award, Sparkles, CheckCircle2, ArrowLeft, ExternalLink, Calendar,
  ShieldCheck, AlertCircle, Search, Filter, BookOpen, Layers, Check, Trophy
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { OpportunityMatchOut } from "@/types";

export default function OpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <OpportunityMatchContent />
    </ProtectedRoute>
  );
}

function OpportunityMatchContent() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<OpportunityMatchOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "verified">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get<OpportunityMatchOut[]>("/opportunities/matches");
      setMatches(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Could not load opportunity matches.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    const opp = m.opportunity;
    if (activeFilter === "high" && m.match_score < 80) return false;
    if (activeFilter === "verified" && opp.is_demo) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        opp.name.toLowerCase().includes(q) ||
        opp.provider.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Top Navbar */}
      <header className="glass-nav sticky top-0 z-40 py-3.5">
        <div className="app-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #f59e0b, #10b981)" }}
              >
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base leading-none">
                  Opportunity<span className="gradient-text">Match</span>
                </h1>
                <p className="text-xs text-muted mt-0.5">Transparent Educational Opportunity Engine</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Real DB Analytics Matcher
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 app-container py-8 space-y-8">
        {/* Banner */}
        <div className="gradient-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}>
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Personalized for {user?.full_name}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold">Matched Scholarships & Competitions</h2>
            <p className="text-xs md:text-sm text-muted leading-relaxed">
              We analyze your education level, skills, and database mastery scores to match you with verified public scholarships and academic Olympiads.
            </p>
          </div>

          <div className="glass p-4 rounded-2xl text-center shrink-0 min-w-[140px]">
            <div className="text-3xl font-extrabold text-amber-400">{matches.length}</div>
            <div className="text-xs text-muted">Opportunities Matched</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships, competitions, or providers..."
              className="w-full bg-surface border rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-amber-500"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === "all" ? "bg-amber-500 text-black shadow-md" : "bg-surface border text-muted hover:text-white"}`}
              style={activeFilter !== "all" ? { borderColor: "var(--color-border)" } : {}}
            >
              All ({matches.length})
            </button>
            <button
              onClick={() => setActiveFilter("high")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === "high" ? "bg-amber-500 text-black shadow-md" : "bg-surface border text-muted hover:text-white"}`}
              style={activeFilter !== "high" ? { borderColor: "var(--color-border)" } : {}}
            >
              High Matches (80%+)
            </button>
            <button
              onClick={() => setActiveFilter("verified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeFilter === "verified" ? "bg-emerald-500 text-black shadow-md" : "bg-surface border text-muted hover:text-white"}`}
              style={activeFilter !== "verified" ? { borderColor: "var(--color-border)" } : {}}
            >
              Verified Public
            </button>
          </div>
        </div>

        {/* Opportunity Cards Stream */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-3 border-amber-500 border-t-transparent" />
            <p className="text-sm text-muted">Calculating personalized match scores & verifying eligibility...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center max-w-md mx-auto space-y-3">
            <Award className="w-12 h-12 text-muted mx-auto" />
            <h3 className="font-bold text-lg">No Matches Found</h3>
            <p className="text-xs text-muted">Try adjusting your search query or filter selection.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.map((m) => {
              const opp = m.opportunity;
              return (
                <div
                  key={opp.id}
                  className="glass rounded-3xl p-6 md:p-8 space-y-6 border shadow-xl hover:border-amber-500/50 transition-all"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED PUBLIC SCHOLARSHIP
                        </span>
                        <span className="text-xs text-muted font-medium">&bull; Source: {opp.official_source}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-white">{opp.name}</h3>
                      <p className="text-xs text-muted font-semibold">{opp.provider}</p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="glass px-5 py-3 rounded-2xl border text-center shrink-0" style={{ borderColor: m.match_score >= 80 ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)" }}>
                      <div className="text-2xl font-extrabold" style={{ color: m.match_score >= 80 ? "#34d399" : "#fbbf24" }}>
                        {m.match_score}% Match
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{m.match_category}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-muted leading-relaxed font-medium">
                    {opp.description}
                  </p>

                  {/* ── Why This Matches You (Transparent Rationale) ── */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Why This Matches You (Transparent Score Rationale)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-100">
                      {m.why_matches.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Grid details (Eligibility, Benefits, Deadline) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-surface border space-y-1 text-xs" style={{ borderColor: "var(--color-border)" }}>
                      <span className="font-bold text-muted uppercase tracking-wider text-[10px]">Eligibility</span>
                      <p className="font-medium text-white">{opp.eligibility}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface border space-y-1 text-xs" style={{ borderColor: "var(--color-border)" }}>
                      <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Financial / Merit Benefit</span>
                      <p className="font-bold text-emerald-300">{opp.benefit}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface border space-y-1 text-xs" style={{ borderColor: "var(--color-border)" }}>
                      <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Application Deadline
                      </span>
                      <p className="font-extrabold text-white">{opp.deadline}</p>
                    </div>
                  </div>

                  {/* Footer Action Row */}
                  <div className="pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "var(--color-border)" }}>
                    <div className="text-xs text-muted">
                      Target Level: <span className="text-white font-bold">{opp.target_education_level}</span> | Required: <span className="text-indigo-300 font-semibold">{opp.required_subjects.join(", ")}</span>
                    </div>

                    <a
                      href={opp.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2"
                      style={{ background: opp.is_demo ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "linear-gradient(135deg, #10b981, #059669)" }}
                    >
                      Apply on Official Source <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
