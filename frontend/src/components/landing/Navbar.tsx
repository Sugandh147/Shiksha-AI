"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "For Students", href: "/register?role=student" },
    { label: "For Teachers", href: "/register?role=teacher" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  return (
    <header className="navbar">
      <div className="container-page">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          
          {/* Left: Logo + Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #5b4cf5 0%, #7c6ff9 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(91,76,245,0.35)"
            }}>
              <Brain size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "18px", lineHeight: 1.1, color: "#0f172a" }}>
                Shiksha<span style={{ color: "#5b4cf5" }}>AI</span>
              </div>
              <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: "#94a3b8", textTransform: "uppercase" }}>
                India K-12 Ecosystem
              </div>
            </div>
          </Link>

          {/* Center: Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} style={{
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: "14px",
                fontWeight: 600,
                color: "#475569",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#5b4cf5"; (e.target as HTMLElement).style.background = "#f5f3ff"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "#475569"; (e.target as HTMLElement).style.background = "transparent"; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Auth CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="desktop-ctas">
            <Link href="/login" className="btn-secondary" style={{ padding: "9px 20px", fontSize: "14px" }}>
              Sign In
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px" }}>
              Create Account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            style={{ display: "none", padding: 8, border: "1.5px solid #e2e8f0", borderRadius: 10, background: "transparent", cursor: "pointer" }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} color="#475569" /> : <Menu size={20} color="#475569" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "16px 24px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                onClick={() => setOpen(false)}
                style={{ padding: "10px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary" style={{ justifyContent: "center" }}>Sign In</Link>
            <Link href="/register" onClick={() => setOpen(false)} className="btn-primary" style={{ justifyContent: "center" }}>Create Account</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
        }
        @media (max-width: 640px) {
          .desktop-ctas { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
