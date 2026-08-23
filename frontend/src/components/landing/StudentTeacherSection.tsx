import Link from "next/link";
import { ArrowRight, GraduationCap, Users, Check } from "lucide-react";

export default function StudentTeacherSection() {
  return (
    <section id="classpulse" style={{ padding: "80px 0", background: "#fff" }}>
      <div className="container-page">

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="heading-section">Built for Students & Teachers</h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 10, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Whether you&apos;re studying for boards or running a class of 40 — ShikshaAI has you covered.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="value-grid">

          {/* Student Card */}
          <div style={{
            background: "linear-gradient(145deg, #f5f3ff 0%, #fff 100%)",
            border: "1.5px solid #ddd6fe",
            borderRadius: 24, padding: 36,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #5b4cf5, #7c6ff9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>
              <GraduationCap size={26} color="#fff" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#5b4cf5", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>For Students</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 16, lineHeight: 1.2 }}>
              Your Personal AI Learning Companion
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[
                "NCERT-grounded step-by-step explanations",
                "📷 Scan & solve handwritten questions",
                "Adaptive practice tailored to your weak topics",
                "Daily XP streaks and mastery tracking",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check size={11} color="#059669" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?role=student" className="btn-primary" style={{ fontSize: 14 }}>
              Get Started as Student <ArrowRight size={15} />
            </Link>
          </div>

          {/* Teacher Card */}
          <div style={{
            background: "linear-gradient(145deg, #ecfdf5 0%, #fff 100%)",
            border: "1.5px solid #a7f3d0",
            borderRadius: 24, padding: 36,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #059669, #10b981)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
            }}>
              <Users size={26} color="#fff" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>For Teachers</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 16, lineHeight: 1.2 }}>
              ClassPulse Intelligence for Classrooms
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[
                "Live class mastery heatmaps and risk flags",
                "AI Copilot answers questions using real class data",
                "6-character class join code system",
                "Transparent Learning Attention Indicators",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check size={11} color="#059669" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?role=teacher" className="btn-secondary" style={{ fontSize: 14 }}>
              <Users size={16} /> Register as Teacher
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .value-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
