"use client";

/**
 * src/app/(auth)/login/page.tsx
 * ──────────────────────────────
 * Authentic Real-User Login Page for ShikshaAI.
 * Light Theme — Clean, modern SaaS aesthetic matching the landing page.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, Brain, ShieldCheck } from "lucide-react";
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
    <div style={{ background: "#f8f9fc", minHeight: "100vh" }} className="flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Soft Background Ambient Accents */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(91,76,245,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }}
      />

      <div className="container-page relative z-10">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          
          {/* LEFT COLUMN: BRANDING & VALUE PROPOSITION */}
          <div className="space-y-6 text-left hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-3 text-decoration-none">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #5b4cf5 0%, #7c6ff9 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(91,76,245,0.3)"
                }}
              >
                <Brain size={24} color="#ffffff" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Shiksha<span style={{ color: "#5b4cf5" }}>AI</span>
              </span>
            </Link>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
                Personalized learning, <br />
                <span className="text-gradient">powered by AI.</span>
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                ShikshaAI combines baseline diagnostics, NCERT-grounded RAG tutoring, adaptive practice, and real-time teacher intelligence.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Brain size={16} color="#5b4cf5" />
                </div>
                <span>Grounding in official NCERT textbooks with citations</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkles size={16} color="#059669" />
                </div>
                <span>Multilingual support in English, Hindi & Hinglish</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={16} color="#d97706" />
                </div>
                <span>ClassPulse real-time teacher risk intelligence</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIGHT THEME LOGIN CARD */}
          <div className="w-full max-w-md mx-auto">
            
            {/* Header for Mobile */}
            <div className="text-center lg:hidden mb-6">
              <Link href="/" className="inline-flex items-center gap-2 mb-2 text-decoration-none">
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #5b4cf5 0%, #7c6ff9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Brain size={20} color="#ffffff" />
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  Shiksha<span style={{ color: "#5b4cf5" }}>AI</span>
                </span>
              </Link>
              <p className="text-xs text-slate-500">Personalized learning, powered by AI.</p>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 24,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 40px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.03)",
                padding: "32px"
              }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
                <p className="text-xs text-slate-500 mt-1">Enter your credentials to access your learning workspace</p>
              </div>

              {/* Error Alert Banner */}
              {error && (
                <div
                  className="flex items-start gap-3 p-3.5 rounded-xl text-xs font-semibold"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    style={{
                      width: "100%",
                      background: "#f8f9fc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "11px 16px",
                      fontSize: 14,
                      color: "#0f172a",
                      outline: "none"
                    }}
                    className="focus:border-indigo-500 transition-colors"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      style={{
                        width: "100%",
                        background: "#f8f9fc",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 12,
                        padding: "11px 44px 11px 16px",
                        fontSize: 14,
                        color: "#0f172a",
                        outline: "none"
                      }}
                      className="focus:border-indigo-500 transition-colors"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
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
                  className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2"
                  style={{ opacity: loading ? 0.7 : 1, width: "100%" }}
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

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Don&apos;t have an account yet?{" "}
                <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
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
