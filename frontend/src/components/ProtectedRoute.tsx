"use client";

/**
 * src/components/ProtectedRoute.tsx
 * ──────────────────────────────────
 * Reusable wrapper component for protected frontend routes.
 * Enforces authentication, Role-Based Access Control (RBAC), and onboarding completion.
 */

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated -> redirect to login
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // 2. Role-Based Access Control (RBAC) check
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      if (user.role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    // 3. Student Onboarding check
    if (
      user.role === "student" &&
      requireOnboarding &&
      !user.onboarding_completed &&
      pathname !== "/onboarding"
    ) {
      router.push("/onboarding");
      return;
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, requireOnboarding, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin"
            style={{
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "#6366f1",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: "var(--color-bg)" }}>
        <div className="glass max-w-md p-8 rounded-2xl">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            Your account role ({user.role}) does not have permission to view this area.
          </p>
          <button
            onClick={() => router.push(user.role === "teacher" ? "/teacher" : "/dashboard")}
            className="btn btn-primary w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
