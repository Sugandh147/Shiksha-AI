"use client";

/**
 * src/app/(auth)/register/page.tsx
 * ──────────────────────────────────
 * Authentic Real-User Registration Page for ShikshaAI.
 * Light Theme — Clean, modern SaaS aesthetic matching the landing page.
 */

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle, GraduationCap, Users, CheckCircle2, Brain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 rounded-full animate-spin border-2 border-indigo-600 border-t-transparent" />
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
    <div style={{ background: "#f8f9fc", minHeight: "100vh" }} className="flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Ambient Accents */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(91,76,245,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)" }}
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
                Start your personalized <br />
                <span className="text-gradient">learning journey today.</span>
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                Create your real account to unlock adaptive math practice, NCERT-grounded RAG tutoring, and real-time skill mastery tracking.
              </p>
            </div>

            {/* Account Benefits Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                padding: "20px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
              }}
              className="space-y-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Account Benefits
              </div>
              <div className="text-xs space-y-2.5 text-slate-600">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Diagnostic quiz to identify weak topics automatically</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Grounded AI Tutor with official textbook chapter citations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ClassPulse teacher analytics & instant class join code system</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIGHT THEME REGISTRATION CARD */}
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
              <p className="text-xs text-slate-500">Create your real user account</p>
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
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h2>
                <p className="text-xs text-slate-500 mt-1">Select your role and fill in your details to get started</p>
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

              {/* ROLE SELECTION CARDS */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                  I AM A...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className="flex flex-col items-start p-4 rounded-xl transition-all text-left cursor-pointer"
                    style={{
                      background: role === "student" ? "#f5f3ff" : "#f8f9fc",
                      border: role === "student" ? "2px solid #5b4cf5" : "1.5px solid #e2e8f0",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <GraduationCap className={`w-5 h-5 ${role === "student" ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className={`text-sm font-bold ${role === "student" ? "text-indigo-900" : "text-slate-700"}`}>
                        Student
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 leading-normal">
                      Learn & track progress
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className="flex flex-col items-start p-4 rounded-xl transition-all text-left cursor-pointer"
                    style={{
                      background: role === "teacher" ? "#ecfdf5" : "#f8f9fc",
                      border: role === "teacher" ? "2px solid #10b981" : "1.5px solid #e2e8f0",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Users className={`w-5 h-5 ${role === "teacher" ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className={`text-sm font-bold ${role === "teacher" ? "text-emerald-900" : "text-slate-700"}`}>
                        Teacher
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 leading-normal">
                      Manage classes & insights
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      background: "#f8f9fc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "10px 16px",
                      fontSize: 14,
                      color: "#0f172a",
                      outline: "none"
                    }}
                    className="focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.full_name}
                    onChange={(e) => setFormData((d) => ({ ...d, full_name: e.target.value }))}
                    required
                  />
                </div>

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
                      padding: "10px 16px",
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                      Password
                    </label>
                    <input
                      type="password"
                      style={{
                        width: "100%",
                        background: "#f8f9fc",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 12,
                        padding: "10px 16px",
                        fontSize: 14,
                        color: "#0f172a",
                        outline: "none"
                      }}
                      className="focus:border-indigo-500 transition-colors"
                      placeholder="Min 6 chars"
                      value={formData.password}
                      onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      style={{
                        width: "100%",
                        background: "#f8f9fc",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 12,
                        padding: "10px 16px",
                        fontSize: 14,
                        color: "#0f172a",
                        outline: "none"
                      }}
                      className="focus:border-indigo-500 transition-colors"
                      placeholder="Re-enter password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData((d) => ({ ...d, confirm_password: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Preferred Language
                  </label>
                  <select
                    style={{
                      width: "100%",
                      background: "#f8f9fc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "10px 16px",
                      fontSize: 14,
                      color: "#0f172a",
                      fontWeight: 600,
                      outline: "none"
                    }}
                    className="focus:border-indigo-500 transition-colors"
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
                  className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2"
                  style={{ opacity: loading ? 0.7 : 1, width: "100%" }}
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

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
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
