"use client";

/**
 * src/app/page.tsx
 * ─────────────────
 * ShikshaAI Landing Page — the first thing any visitor sees.
 *
 * Sections:
 *   1. Hero — headline, CTA, animated gradient orb
 *   2. Stats — impact numbers
 *   3. Features — 6 core feature cards
 *   4. How It Works — 3 step flow
 *   5. CTA — dual login buttons
 */

import Link from "next/link";
import { BookOpen, Brain, BarChart3, Users, Zap, Globe, ArrowRight, CheckCircle, Star } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Socratic Tutor",
    description: "Ask any question — get step-by-step Socratic guidance grounded in trusted NCERT textbooks, in your preferred language.",
    color: "#6366f1",
    gradient: "from-indigo-500/20 to-indigo-500/5",
  },
  {
    icon: Zap,
    title: "Adaptive Practice",
    description: "Questions automatically adjust to your level. Get harder when you're doing well, easier when you need support.",
    color: "#10b981",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Track your mastery score per topic, identify your weak areas, and celebrate your streak.",
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-amber-500/5",
  },
  {
    icon: Users,
    title: "Teacher Dashboard",
    description: "Teachers see class-wide mastery heatmaps and instantly identify students who need extra support.",
    color: "#ec4899",
    gradient: "from-pink-500/20 to-pink-500/5",
  },
  {
    icon: BookOpen,
    title: "Trusted RAG Knowledge",
    description: "Every AI answer is grounded in verified NCERT curriculum content — no hallucinations, just facts.",
    color: "#8b5cf6",
    gradient: "from-violet-500/20 to-violet-500/5",
  },
  {
    icon: Globe,
    title: "Multi-lingual Support",
    description: "Learn in English, Hindi, or Hinglish. ShikshaAI meets you where you are.",
    color: "#06b6d4",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your profile",
    description: "Tell us your grade level, preferred language, and learning style. Takes 2 minutes.",
    color: "#6366f1",
  },
  {
    step: "02",
    title: "Take the diagnostic quiz",
    description: "A 5-question baseline assessment sets your personalized starting difficulty level.",
    color: "#10b981",
  },
  {
    step: "03",
    title: "Learn, practice & grow",
    description: "Chat with your AI tutor, solve adaptive questions, and track your mastery in real time.",
    color: "#f59e0b",
  },
];

const stats = [
  { value: "10+", label: "Subjects Covered" },
  { value: "3×", label: "Faster Concept Mastery" },
  { value: "Multi", label: "lingual Support" },
  { value: "Free", label: "For Every Student" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-white">
              Shiksha<span className="gradient-text">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-secondary text-sm py-2 px-4">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary text-sm py-2 px-4">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glows */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div
          className="absolute top-40 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        />

        <div className="container text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-light text-sm font-medium">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span style={{ color: "var(--color-text-muted)" }}>
              Built for the <span className="text-white font-semibold">AI for Equitable Education</span> Hackathon
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            Every Student Deserves
            <br />
            <span className="gradient-text">a World-Class Tutor</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 animate-fade-in-up delay-100"
            style={{ color: "var(--color-text-muted)" }}
          >
            ShikshaAI delivers personalized, curriculum-aligned AI tutoring in your language — 
            bridging India&apos;s education gap, one student at a time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
            <Link href="/register?role=student" className="btn btn-primary text-base py-3 px-8 glow-primary">
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register?role=teacher" className="btn btn-secondary text-base py-3 px-8">
              I&apos;m a Teacher
              <Users className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 justify-center mt-12 animate-fade-in-up delay-300">
            {["✅ Free for all students", "📚 NCERT-aligned content", "🌐 Hindi & English support"].map((t) => (
              <span key={t} className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="container">
          <div className="glass rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────────── */}
      <section className="section px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything a student needs,{" "}
              <span className="gradient-text">powered by AI</span>
            </h2>
            <p className="text-lg" style={{ color: "var(--color-text-muted)" }}>
              From personalized tutoring to teacher analytics — ShikshaAI is a complete learning ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section className="section px-6">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready in <span className="gradient-text">3 steps</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="text-center relative">
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-1/2 w-full h-px opacity-30"
                    style={{ background: "linear-gradient(90deg, #6366f1, transparent)" }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 font-bold text-xl"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40`, color: step.color }}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p style={{ color: "var(--color-text-muted)" }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────────── */}
      <section className="section px-6">
        <div className="container">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            <div
              className="absolute inset-0 rounded-3xl opacity-50"
              style={{ background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Start learning today. <span className="gradient-text">It&apos;s free.</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: "var(--color-text-muted)" }}>
                Join students across India getting personalized AI education support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register?role=student" className="btn btn-primary text-base py-3 px-8">
                  I&apos;m a Student → Start Learning
                </Link>
                <Link href="/register?role=teacher" className="btn btn-secondary text-base py-3 px-8">
                  I&apos;m a Teacher → View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid var(--color-border)" }}>
        <p style={{ color: "var(--color-text-subtle)" }} className="text-sm">
          Built with ❤️ for the AI Hackathon 2026 · ShikshaAI — AI for Equitable Education Access
        </p>
      </footer>
    </div>
  );
}
