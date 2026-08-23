const features = [
  { icon: "🧠", title: "AI Tutor", desc: "Grounded Socratic tutoring with step-by-step NCERT-cited explanations in English, Hindi, or Hinglish." },
  { icon: "📷", title: "Scan & Solve", desc: "Photograph handwritten or printed questions. Vision AI extracts and solves math instantly." },
  { icon: "🎯", title: "Adaptive Practice", desc: "Practice sets that auto-adjust to your mastery. Wrong answers trigger concept explanations." },
  { icon: "👩‍🏫", title: "Teacher Intelligence", desc: "ClassPulse live heatmaps, attention indicators, and Teacher Copilot powered by class data." },
  { icon: "🏆", title: "Opportunity Match", desc: "Matches students with NMMS, INSPIRE, and YASASVI scholarships based on real academic performance." },
  { icon: "🌐", title: "Multilingual", desc: "Seamlessly switch between English, Devanagari Hindi, and Hinglish on any device." },
];

export default function FeatureSection() {
  return (
    <section id="features" style={{ padding: "80px 0", background: "#fff" }}>
      <div className="container-page">

        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: "inline-block",
              background: "#ede9fe", color: "#5b21b6",
              border: "1px solid #ddd6fe",
              borderRadius: 99, padding: "4px 14px",
              fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}>
              Complete Learning Ecosystem
            </span>
          </div>
          <h2 className="heading-section">
            Built Specifically for Indian K-12 Education
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 12, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Everything you need to learn, practice and excel — all in one intelligent platform
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
        }} className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="card-feature" style={{ textAlign: "center" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "#f5f3ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, margin: "0 auto 14px"
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .feature-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .feature-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
