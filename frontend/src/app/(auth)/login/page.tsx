"use client";

/**
 * src/app/(auth)/login/page.tsx
 * ──────────────────────────────
 * Authentic Real-User Login Page for ShikshaAI.
 * Redesigned with unified app-container, dark glassmorphism,
 * responsive typography, password visibility toggle, and error alert handling.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BookOpen, ArrowRight, AlertCircle, Sparkles, Brain, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (loggedUser.role === "teacher") {
        router.push("/teacher");
      } else if (!loggedUser.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid email or password. Please check your credentials and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 relative overflow-hidden" style={{ background: "var(--color-bg)" }}>
      {/* Background Radial Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
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
                Personalized learning, <br />
                <span className="gradient-text">powered by AI.</span>
              </h1>
              <p className="text-sm text-muted max-w-md leading-relaxed">
                ShikshaAI combines baseline diagnostics, NCERT-grounded RAG tutoring, adaptive practice, and real-time teacher intelligence.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
                <span>Grounding in official NCERT textbooks with citations</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Multilingual support in English, Hindi & Hinglish</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>ClassPulse real-time teacher risk intelligence</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: POLISHED LOGIN CARD */}
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
              <p className="text-xs text-muted">Personalized learning, powered by AI.</p>
            </div>

            <div className="glass-card p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h2>
                <p className="text-xs text-muted mt-1">Enter your credentials to access your learning workspace</p>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-surface border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-surface border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3 text-sm font-bold glow-indigo flex items-center justify-center gap-2 mt-2"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t text-center text-xs text-muted" style={{ borderColor: "var(--color-border)" }}>
                Don&apos;t have an account yet?{" "}
                <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
