const steps = [
  { num: "01", title: "Assess Your Level", desc: "Complete a 5-question diagnostic quiz to pinpoint exactly where you need help." },
  { num: "02", title: "Understand Concepts", desc: "AI Tutor explains every concept with NCERT textbook citations, step by step." },
  { num: "03", title: "Practice Adaptively", desc: "Questions adjust to your skill level. Earn XP and build daily streaks." },
  { num: "04", title: "Track & Improve", desc: "Teachers see live ClassPulse analytics. Students track mastery in real time." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: "80px 0", background: "#f8f9fc" }}>
      <div className="container-page">

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="heading-section">How It Works</h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 10, maxWidth: 520, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            From baseline assessment to AI tutoring to teacher insights — in four steps.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 20,
              padding: "28px 24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center", justifyContent: "center",
                width: 40, height: 40,
                borderRadius: 12,
                background: "#ede9fe",
                fontSize: 15, fontWeight: 900, color: "#5b4cf5",
                marginBottom: 16,
              }}>
                {s.num}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .steps-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
