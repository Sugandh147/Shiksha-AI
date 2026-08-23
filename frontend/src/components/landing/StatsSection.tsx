const stats = [
  {
    icon: "📗",
    value: "NCERT",
    label: "Grounded Content",
    sub: "100% NCERT-aligned content & explanations",
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    icon: "📊",
    value: "100%",
    label: "Real Performance",
    sub: "Based on your actual learning data",
    color: "#5b4cf5",
    bg: "#ede9fe",
  },
  {
    icon: "🌐",
    value: "3+",
    label: "Languages",
    sub: "English, Hindi, Hinglish & more",
    color: "#06b6d4",
    bg: "#cffafe",
  },
  {
    icon: "🎁",
    value: "Free",
    label: "For Everyone",
    sub: "No cost for students & teachers",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
];

export default function StatsSection() {
  return (
    <section style={{ padding: "0 0 60px", background: "#fff" }}>
      <div className="container-page">
        <div style={{
          background: "#f8f9fc",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: "28px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }} className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2, lineHeight: 1.4 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
