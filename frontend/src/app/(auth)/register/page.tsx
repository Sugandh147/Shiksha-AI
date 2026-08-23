"use client";

/**
 * src/app/(auth)/register/page.tsx
 * ──────────────────────────────────
 * Registration page for Students and Teachers.
 * Role is pre-selected from the URL query param: ?role=student or ?role=teacher
 */

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, ArrowRight, AlertCircle, GraduationCap, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full animate-spin border-2 border-indigo-500 border-t-transparent" />
      </div>
    }>
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
    preferred_language: "en",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ ...formData, role });
      router.push(role === "teacher" ? "/teacher" : "/onboarding");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #10b981)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">
              Shiksha<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Start your personalized learning journey</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["student", "teacher"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all border"
                style={{
                  background: role === r ? "rgba(99, 102, 241, 0.15)" : "var(--color-surface-2)",
                  borderColor: role === r ? "#6366f1" : "var(--color-border)",
                  color: role === r ? "#6366f1" : "var(--color-text-muted)",
                }}
              >
                {r === "student" ? <GraduationCap className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                <span className="text-sm font-semibold capitalize">{r}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
              style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="Your full name"
                value={formData.full_name}
                onChange={(e) => setFormData((d) => ({ ...d, full_name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData((d) => ({ ...d, password: e.target.value }))}
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Language</label>
              <select
                className="input"
                value={formData.preferred_language}
                onChange={(e) => setFormData((d) => ({ ...d, preferred_language: e.target.value }))}
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="hinglish">🇮🇳 Hinglish</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account..." : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "var(--color-primary)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
