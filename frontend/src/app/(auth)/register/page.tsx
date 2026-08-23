"use client";

/**
 * src/app/(auth)/register/page.tsx
 * ──────────────────────────────────
 * Authentic Real-User Registration Page for ShikshaAI.
 * Redesigned with unified app-container, dark glassmorphism,
 * interactive role cards, responsive grid, and clean validation.
 */

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, ArrowRight, AlertCircle, GraduationCap, Users, CheckCircle2, Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full animate-spin border-2 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "student"
  );
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    preferred_language: "en",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: role,
        preferred_language: formData.preferred_language,
      });

      if (role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "An account with this email address already exists. Please sign in instead.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      {/* Background Radial Ambient Glows */}
      <div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
      />

      <div className="app-container relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: HERO BRANDING & VALUE PROPOSITION */}
          <div className="space-y-6 text-center lg:text-left hidden sm:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
              >
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                Shiksha<span className="gradient-text">AI</span>
              </span>
            </Link>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                Start your personalized <br />
                <span className="gradient-text">learning journey today.</span>
              </h1>
              <p className="text-sm text-muted max-w-md leading-relaxed">
                Create your real account to unlock adaptive math practice, NCERT-grounded RAG tutoring, and real-time skill mastery tracking.
              </p>
            </div>

            <div className="glass-card p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Account Benefits</div>
              <div className="text-xs space-y-2 text-muted text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Diagnostic quiz to identify weak topics automatically</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Grounded AI Tutor with official textbook chapter citations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ClassPulse teacher analytics & instant class join code system</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REGISTRATION CARD */}
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Mobile Logo Header */}
            <div className="text-center sm:hidden mb-4">
              <Link href="/" className="inline-flex items-center gap-2 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
                >
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  Shiksha<span className="gradient-text">AI</span>
                </span>
              </Link>
              <p className="text-xs text-muted">Create your real user account</p>
            </div>

            <div className="glass-card p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
                <p className="text-xs text-muted mt-1">Select your role and fill in your details to get started</p>
              </div>

              {/* Error Alert Banner */}
              {error && (
                <div
                  className="flex items-start gap-3 p-3.5 rounded-2xl text-xs font-medium animate-in fade-in duration-200"
                  style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#ef4444" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* ROLE SELECTION CARDS */}
              <div>
                <label className="block text-xs font-bold text-muted mb-2 uppercase tracking-wider">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className="flex flex-col items-start p-3.5 rounded-2xl transition-all border text-left cursor-pointer"
                    style={{
                      background: role === "student" ? "rgba(99, 102, 241, 0.15)" : "var(--color-surface)",
                      borderColor: role === "student" ? "#6366f1" : "var(--color-border)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className={`w-5 h-5 ${role === "student" ? "text-indigo-400" : "text-muted"}`} />
                      <span className={`text-sm font-bold ${role === "student" ? "text-indigo-300" : ""}`}>Student</span>
                    </div>
                    <span className="text-[11px] text-muted leading-tight">Learn, practice and track your progress.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className="flex flex-col items-start p-3.5 rounded-2xl transition-all border text-left cursor-pointer"
                    style={{
                      background: role === "teacher" ? "rgba(16, 185, 129, 0.15)" : "var(--color-surface)",
                      borderColor: role === "teacher" ? "#10b981" : "var(--color-border)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Users className={`w-5 h-5 ${role === "teacher" ? "text-emerald-400" : "text-muted"}`} />
                      <span className={`text-sm font-bold ${role === "teacher" ? "text-emerald-300" : ""}`}>Teacher</span>
                    </div>
                    <span className="text-[11px] text-muted leading-tight">Create classes and understand progress.</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    placeholder="e.g. Aarav Sharma"
                    value={formData.full_name}
                    onChange={(e) => setFormData((d) => ({ ...d, full_name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                      placeholder="Min 6 chars"
                      value={formData.password}
                      onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                      placeholder="Re-enter password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData((d) => ({ ...d, confirm_password: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Preferred Language</label>
                  <select
                    className="w-full bg-surface border rounded-xl py-2.5 px-4 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    value={formData.preferred_language}
                    onChange={(e) => setFormData((d) => ({ ...d, preferred_language: e.target.value }))}
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="hi">🇮🇳 Hindi (हिंदी)</option>
                    <option value="hinglish">🇮🇳 Hinglish</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3 text-sm font-bold glow-indigo flex items-center justify-center gap-2 mt-2"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span>Creating account...</span>
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t text-center text-xs text-muted" style={{ borderColor: "var(--color-border)" }}>
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
