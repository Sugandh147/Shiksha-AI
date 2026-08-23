"use client";

/**
 * src/context/AuthContext.tsx
 * ────────────────────────────
 * React Context for global authentication state.
 *
 * Any component in the app can call useAuth() to:
 *   • Read the current user (user, token, isAuthenticated)
 *   • Call login() / logout() / register() / refreshUser()
 *
 * State is persisted in localStorage so users stay logged in on refresh.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, AuthState, LoginRequest, RegisterRequest, AuthResponse } from "@/types";
import api from "@/lib/api";

// ── Context type ───────────────────────────────────────────────────────────────

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
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
    return response.user;
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
    return response.user;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await api.get<User>("/auth/me");
      localStorage.setItem("shikshaai_user", JSON.stringify(user));
      setState((s) => ({ ...s, user }));
      return user;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("shikshaai_token");
    localStorage.removeItem("shikshaai_user");
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
