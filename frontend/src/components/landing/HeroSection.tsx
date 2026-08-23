import Link from "next/link";
import { Zap, ArrowRight, GraduationCap, Users } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function HeroSection() {
  return (
    <section style={{ background: "#fff", paddingTop: "52px", paddingBottom: "64px", overflow: "hidden" }}>
      <div className="container-page">
        {/* Two-column grid: left text, right dashboard preview */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          alignItems: "center",
        }} className="hero-grid">

          {/* ── LEFT COLUMN: Headline, Description, CTAs ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <div style={{
                background: "#ede9fe", borderRadius: 99, padding: "5px 12px",
                display: "inline-flex", alignItems: "center", gap: 6,
                border: "1px solid #ddd6fe"
              }}>
                <Zap size={13} color="#5b4cf5" fill="#5b4cf5" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#5b21b6", letterSpacing: "0.02em" }}>
                  Intelligent Multilingual Learning Platform for Indian Education
                </span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#0f172a" }}>
                Personalized AI Learning <br />
                for Every Student,
              </h1>
              <h1 style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, lineHeight: 1.1,
                letterSpacing: "-0.03em", marginTop: 4,
                background: "linear-gradient(135deg, #5b4cf5 0%, #7c3aed 50%, #06b6d4 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                Grounded in NCERT <br />
                Science & Math
              </h1>
            </div>

            {/* Description */}
            <p style={{
              fontSize: "16.5px", lineHeight: 1.65,
              color: "var(--text-muted)",
              maxWidth: 460,
              fontWeight: 450
            }}>
              ShikshaAI combines grounded Socratic RAG tutoring, scan question vision solving, adaptive practice, and teacher intelligence — supporting English, Hindi, and Hinglish.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
              <Link href="/register?role=student" className="btn-primary" style={{ fontSize: 15 }}>
                <GraduationCap size={17} />
                Get Started as Student
                <ArrowRight size={16} />
              </Link>
              <Link href="/register?role=teacher" className="btn-secondary" style={{ fontSize: 15 }}>
                <Users size={17} />
                Register as Teacher
              </Link>
            </div>

            {/* Trust Icons Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", paddingTop: 4 }}>
              {[
                { icon: "🛡️", label: "NCERT Grounded" },
                { icon: "📊", label: "100% Real Performance" },
                { icon: "🌐", label: "Multiple Languages" },
                { icon: "🎁", label: "Free for All" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Dashboard Preview ── */}
          <DashboardPreview />

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
