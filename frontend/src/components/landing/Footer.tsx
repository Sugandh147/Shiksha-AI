import Link from "next/link";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#f8f9fc", borderTop: "1px solid #e2e8f0", padding: "48px 0 32px" }}>
      <div className="container-page">

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, marginBottom: 36 }}>
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #5b4cf5, #7c6ff9)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Brain size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                  Shiksha<span style={{ color: "#5b4cf5" }}>AI</span>
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>India K-12 Ecosystem</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
              Grounded NCERT AI tutoring, adaptive practice, and classroom intelligence — free for all Indian K-12 students and teachers.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Platform</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["For Students", "For Teachers", "Features", "How It Works"].map((l) => (
                  <a key={l} href="#" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }} onMouseEnter={e => (e.target as HTMLElement).style.color = "#5b4cf5"} onMouseLeave={e => (e.target as HTMLElement).style.color = "#64748b"}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Account</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/login" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>Sign In</Link>
                <Link href="/register" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>Create Account</Link>
                <Link href="/opportunities" style={{ fontSize: 14, color: "#64748b", textDecoration: "none" }}>Scholarships</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>
            © {new Date().getFullYear()} ShikshaAI. Built for Indian K-12 Education. All rights reserved.
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Free for students & teachers</span>
        </div>

      </div>
    </footer>
  );
}
