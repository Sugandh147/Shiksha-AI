"use client";

/**
 * src/app/onboarding/page.tsx
 * ───────────────────────────
 * Student Onboarding Flow — 4-Step Interactive Wizard.
 * Collects Name, Education Level, Class/Grade, Subjects, Preferred Language, and Learning Goal.
 * Submits to POST /api/v1/student/onboarding to create initial learning profile.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, CheckCircle, ArrowRight, ArrowLeft, Sparkles,
  GraduationCap, Target, Globe, BookMarked, Check, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const EDUCATION_LEVELS = [
  { id: "Primary School", label: "Primary School", desc: "Classes 1 to 5" },
  { id: "Middle School", label: "Middle School", desc: "Classes 6 to 8" },
  { id: "High School", label: "High School", desc: "Classes 9 & 10" },
  { id: "Higher Secondary", label: "Higher Secondary", desc: "Classes 11 & 12" },
];

const GRADES = [6, 7, 8, 9, 10, 11, 12];

const SUBJECT_OPTIONS = [
  { id: "Mathematics", label: "Mathematics", icon: "📐", color: "#6366f1" },
  { id: "Science", label: "Science", icon: "🔬", color: "#10b981" },
  { id: "English", label: "English", icon: "📖", color: "#f59e0b" },
  { id: "Social Studies", label: "Social Studies", icon: "🗺️", color: "#ec4899" },
];

const LEARNING_GOALS = [
  {
    id: "Score high in school exams & tests",
    title: "Excel in Exams",
    desc: "Top score goals, revision, and exam practice",
    icon: "🏆",
  },
  {
    id: "Understand core concepts deeply",
    title: "Deep Conceptual Understanding",
    desc: "Master fundamentals with AI step-by-step guidance",
    icon: "💡",
  },
  {
    id: "Get daily homework & practice help",
    title: "Daily Homework & Quiz Support",
    desc: "Instant answers and adaptive practice",
    icon: "📝",
  },
  {
    id: "Prepare for competitive exams",
    title: "Competitive Prep",
    desc: "Advanced problem solving and high difficulty challenges",
    icon: "🚀",
  },
];

export default function OnboardingPage() {
  const { user, refreshUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    preferred_language: "en",
    education_level: "Middle School",
    class_grade: 8,
    subjects: ["Mathematics", "Science"],
    learning_goal: "Understand core concepts deeply",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setFormData((d) => ({
        ...d,
        name: user.full_name || "",
        preferred_language: user.preferred_language || "en",
      }));
    }
  }, [user, isAuthenticated, isLoading, router]);

  const toggleSubject = (subj: string) => {
    setFormData((prev) => {
      const exists = prev.subjects.includes(subj);
      if (exists) {
        if (prev.subjects.length === 1) return prev; // Keep at least one subject
        return { ...prev, subjects: prev.subjects.filter((s) => s !== subj) };
      } else {
        return { ...prev, subjects: [...prev.subjects, subj] };
      }
    });
  };

  const handleComplete = async () => {
    setError("");
    setSubmitting(true);
    try {
      await api.post("/student/onboarding", {
        name: formData.name,
        education_level: formData.education_level,
        class_grade: Number(formData.class_grade),
        subjects: formData.subjects,
        preferred_language: formData.preferred_language,
        learning_goal: formData.learning_goal,
      });

      // Refresh auth context so user.onboarding_completed becomes true
      await refreshUser();
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to save onboarding profile. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: "var(--color-bg)" }}>
      {/* Dynamic background lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, #10b981, transparent)" }}
      />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              Shiksha<span className="gradient-text">AI</span> Setup
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Build Your Learning Profile</h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Step {step} of 4 — Tell us about yourself so we can personalize your AI tutor.
          </p>

          {/* Step indicator bar */}
          <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="flex-1 h-2 rounded-full transition-all duration-300"
                style={{
                  background: s <= step ? "linear-gradient(90deg, #6366f1, #10b981)" : "var(--color-surface-2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Card Content */}
        <div className="glass rounded-3xl p-6 md:p-8 shadow-2xl border" style={{ borderColor: "var(--color-border)" }}>
          {error && (
            <div
              className="flex items-center gap-2 p-4 rounded-2xl mb-6 text-sm"
              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444" }}
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* ── STEP 1: Basic Info ──────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-6 h-6" style={{ color: "#6366f1" }} />
                <h2 className="text-xl font-semibold">Basic Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Full Name</label>
                <input
                  type="text"
                  className="input py-3 text-base"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Learning Language</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "en", name: "English", icon: "🇬🇧" },
                    { id: "hi", name: "Hindi (हिंदी)", icon: "🇮🇳" },
                    { id: "hinglish", name: "Hinglish", icon: "🇮🇳" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferred_language: lang.id })}
                      className="p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2"
                      style={{
                        background: formData.preferred_language === lang.id ? "rgba(99, 102, 241, 0.15)" : "var(--color-surface-2)",
                        borderColor: formData.preferred_language === lang.id ? "#6366f1" : "var(--color-border)",
                        color: formData.preferred_language === lang.id ? "#6366f1" : "inherit",
                      }}
                    >
                      <span className="text-2xl">{lang.icon}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Education Level & Class ─────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <BookMarked className="w-6 h-6" style={{ color: "#10b981" }} />
                <h2 className="text-xl font-semibold">Education Level & Class</h2>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Select Education Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {EDUCATION_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, education_level: level.id })}
                      className="p-4 rounded-2xl border text-left transition-all"
                      style={{
                        background: formData.education_level === level.id ? "rgba(16, 185, 129, 0.15)" : "var(--color-surface-2)",
                        borderColor: formData.education_level === level.id ? "#10b981" : "var(--color-border)",
                      }}
                    >
                      <div className="font-semibold text-base" style={{ color: formData.education_level === level.id ? "#10b981" : "inherit" }}>
                        {level.label}
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                        {level.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Class / Grade Level</label>
                <div className="flex flex-wrap gap-3">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, class_grade: g })}
                      className="w-12 h-12 rounded-2xl border font-bold text-lg flex items-center justify-center transition-all"
                      style={{
                        background: formData.class_grade === g ? "linear-gradient(135deg, #6366f1, #10b981)" : "var(--color-surface-2)",
                        borderColor: formData.class_grade === g ? "transparent" : "var(--color-border)",
                        color: formData.class_grade === g ? "#ffffff" : "inherit",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Subjects Selection ──────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6" style={{ color: "#f59e0b" }} />
                <h2 className="text-xl font-semibold">Subjects You Want to Learn</h2>
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Select one or more subjects. Your initial mastery graph will be generated for these.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {SUBJECT_OPTIONS.map((subj) => {
                  const isSelected = formData.subjects.includes(subj.id);
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => toggleSubject(subj.id)}
                      className="p-5 rounded-2xl border text-left transition-all flex items-center justify-between group"
                      style={{
                        background: isSelected ? `${subj.color}18` : "var(--color-surface-2)",
                        borderColor: isSelected ? subj.color : "var(--color-border)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{subj.icon}</span>
                        <div>
                          <div className="font-semibold text-base" style={{ color: isSelected ? subj.color : "inherit" }}>
                            {subj.label}
                          </div>
                          <div className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                            Class {formData.class_grade} Curriculum
                          </div>
                        </div>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: isSelected ? subj.color : "var(--color-surface)",
                          border: isSelected ? "none" : "1px solid var(--color-border)",
                        }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4: Learning Goal ───────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6" style={{ color: "#ec4899" }} />
                <h2 className="text-xl font-semibold">Your Main Learning Goal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEARNING_GOALS.map((goal) => {
                  const isSelected = formData.learning_goal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, learning_goal: goal.id })}
                      className="p-5 rounded-2xl border text-left transition-all flex items-start gap-4"
                      style={{
                        background: isSelected ? "rgba(236, 72, 153, 0.15)" : "var(--color-surface-2)",
                        borderColor: isSelected ? "#ec4899" : "var(--color-border)",
                      }}
                    >
                      <span className="text-3xl shrink-0">{goal.icon}</span>
                      <div>
                        <div className="font-semibold text-base mb-1" style={{ color: isSelected ? "#ec4899" : "inherit" }}>
                          {goal.title}
                        </div>
                        <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {goal.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!formData.name.trim()}
                className="btn btn-primary flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={submitting}
                className="btn btn-primary py-3 px-6 flex items-center gap-2"
                style={{ opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? (
                  "Setting up your profile..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Complete Setup & Go to Dashboard
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
