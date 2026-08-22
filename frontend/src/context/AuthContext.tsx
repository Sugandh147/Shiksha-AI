"use client";

/**
 * src/context/AuthContext.tsx
 * ────────────────────────────
 * React Context for global authentication state.
 *
 * Any component in the app can call useAuth() to:
 *   • Read the current user (user, token, isAuthenticated)
 *   • Call login() / logout() / register()
 *
 * State is persisted in localStorage so users stay logged in on refresh.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, AuthState, LoginRequest, RegisterRequest, AuthResponse } from "@/types";
import api from "@/lib/api";

// ── Context type ───────────────────────────────────────────────────────────────

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// ── Create context (undefined forces consumers to use the provider) ────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider component ────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // true on mount — loading from localStorage
  });

  // Load auth state from localStorage on app start
  useEffect(() => {
    try {
      const token = localStorage.getItem("shikshaai_token");
      const userStr = localStorage.getItem("shikshaai_user");
      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    localStorage.setItem("shikshaai_token", response.access_token);
    localStorage.setItem("shikshaai_user", JSON.stringify(response.user));
    setState({
      user: response.user,
      token: response.access_token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    localStorage.setItem("shikshaai_token", response.access_token);
    localStorage.setItem("shikshaai_user", JSON.stringify(response.user));
    setState({
      user: response.user,
      token: response.access_token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("shikshaai_token");
    localStorage.removeItem("shikshaai_user");
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook for consuming auth context ───────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
