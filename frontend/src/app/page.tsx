"use client";

/**
 * src/app/page.tsx
 * ─────────────────
 * ShikshaAI Landing Page — Premium EdTech Startup Interface for Indian K-12.
 */

import Link from "next/link";
import { BookOpen, Brain, BarChart3, Users, Zap, Globe, ArrowRight, CheckCircle, Star, Camera, ShieldCheck, Award, Sparkles, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Grounded RAG AI Tutor",
    description: "Ask any question — get grounded step-by-step reasoning citing official NCERT textbooks in English, Hindi, or Hinglish.",
    color: "#6366f1",
    badge: "NCERT Grounded",
  },
  {
    icon: Camera,
    title: "📷 Scan Question Solver",
    description: "Photograph or upload printed or handwritten math questions. Vision AI extracts math text & solves it step-by-step with verification.",
    color: "#10b981",
    badge: "Vision AI Multimodal",
  },
  {
    icon: Zap,
    title: "Adaptive Practice Engine",
    description: "Questions auto-adjust to student skill mastery. Wrong answers trigger step-by-step concept explanations before resuming.",
    color: "#f59e0b",
    badge: "Adaptive Rules",
  },
  {
    icon: Users,
    title: "ClassPulse Teacher Dashboard",
    description: "Teachers see live class mastery heatmaps, transparent Learning Attention Indicators, and ask natural questions to Teacher Copilot.",
    color: "#ec4899",
    badge: "Teacher Intelligence",
  },
  {
    icon: Award,
    title: "OpportunityMatch Engine",
    description: "Matches students with verified public scholarships (NMMS, INSPIRE, YASASVI) & Olympiads with transparent match scores.",
    color: "#06b6d4",
    badge: "Public Scholarships",
  },
  {
    icon: Globe,
    title: "Multilingual Indian Languages",
    description: "Seamlessly switch explanation language between English, Devanagari Hindi, Hinglish, Tamil, Telugu, and Bengali.",
    color: "#8b5cf6",
    badge: "Indian Languages",
  },
];

const steps = [
  {
    step: "01",
    title: "Student Onboarding",
    description: "Tell us your grade level (Classes 6-12), preferred language, and learning goals in 60 seconds.",
    color: "#6366f1",
  },
  {
    step: "02",
    title: "Mathematics Diagnostic",
    description: "A short 5-question baseline assessment calculates topic-level mastery across Algebra, Quadratic Equations, and Geometry.",
    color: "#10b981",
  },
  {
    step: "03",
    title: "AI Tutor & Opportunities",
    description: "Solve scanned question photos, chat with AI Tutor in Hindi/English, practice weak topics, and apply for matched scholarships.",
    color: "#f59e0b",
  },
];

const stats = [
  { value: "NCERT", label: "Grounded Textbook Retrieval" },
  { value: "100%", label: "Real Database Performance" },
  { value: "3+", label: "Languages (EN, HI, Hinglish)" },
  { value: "Free", label: "For Every Student & Teacher" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* ── Top Navbar ──────────────────────────────────────────────────── */}
      <nav className="glass sticky top-0 left-0 right-0 z-50 px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Shiksha<span className="gradient-text">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 ml-2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                India K-12 Ecosystem
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-secondary text-xs py-2 px-4 font-semibold">
              Sign In
            </Link>
            <Link href="/login?demo=student" className="btn btn-primary text-xs py-2 px-4 font-bold glow-primary">
              Demo Student Login
            </Link>
            <Link href="/login?demo=teacher" className="btn btn-secondary text-xs py-2 px-4 font-bold border-indigo-500/40 text-indigo-300">
              Demo Teacher Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Ambient Radial Lighting Glows */}
        <div
          className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute top-32 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        />

        <div className="container max-w-6xl mx-auto text-center relative z-10 space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold border border-indigo-500/30 animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>
              Intelligent Multilingual Learning Platform for <span className="text-white font-bold">Indian Education</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white">
            Personalized AI Learning for Every Student, <br />
            <span className="gradient-text">Grounded in NCERT Science & Math</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-muted font-medium leading-relaxed">
            ShikshaAI combines grounded Socratic RAG tutoring, 📷 Scan Question vision solving, adaptive practice, and teacher intelligence — supporting English, Hindi, and Hinglish.
          </p>

          {/* Dual Primary Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link href="/login?demo=student" className="btn btn-primary text-sm py-3.5 px-8 font-bold glow-primary flex items-center gap-2 rounded-2xl w-full sm:w-auto">
              Explore Student Experience <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login?demo=teacher" className="btn btn-secondary text-sm py-3.5 px-8 font-bold flex items-center gap-2 rounded-2xl w-full sm:w-auto">
              Explore Teacher ClassPulse <Users className="w-4 h-4 text-indigo-400" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted font-semibold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded NCERT Knowledge</span>
            <span className="flex items-center gap-1.5"><Camera className="w-4 h-4 text-indigo-400" /> Printed & Handwritten Vision OCR</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-amber-400" /> English & Devanagari Hindi Support</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-cyan-400" /> Transparent Opportunity Matching</span>
          </div>
        </div>
      </section>

      {/* ── Impact Stats Strip ──────────────────────────────────────────── */}
      <section className="py-8 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="glass rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border shadow-xl" style={{ borderColor: "var(--color-border)" }}>
            {stats.map((s, idx) => (
              <div key={idx} className="text-center space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-xs font-semibold text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Feature Showcase Grid ──────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="container max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Complete Learning Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built specifically for the needs of <span className="gradient-text">Indian K-12 Education</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass rounded-3xl p-6 md:p-8 space-y-4 border hover:border-indigo-500/50 transition-all group"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                      style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}40` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color }} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-surface border text-muted" style={{ borderColor: "var(--color-border)" }}>
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                  <p className="text-xs text-muted leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3-Step Guided Workflow ──────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="container max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How ShikshaAI Works in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="glass p-8 rounded-3xl border relative space-y-4" style={{ borderColor: "var(--color-border)" }}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-lg"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40`, color: step.color }}
                >
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed font-medium">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 mt-auto border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2 font-bold text-white">
            <Brain className="w-5 h-5 text-indigo-400" /> ShikshaAI — Intelligent Learning Ecosystem
          </div>
          <div>Grounded NCERT Science & Math AI for Indian K-12 Education</div>
        </div>
      </footer>
    </div>
  );
}
