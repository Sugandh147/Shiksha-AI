// DashboardPreview.tsx
// Renders a realistic ShikshaAI student dashboard preview
// matching the reference image screenshot (white card, sidebar, mastery stats, AI Tutor)

export default function DashboardPreview() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      boxShadow: "0 20px 60px rgba(91,76,245,0.12), 0 8px 24px rgba(0,0,0,0.07)",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      position: "relative",
      maxWidth: 580,
      width: "100%",
    }}>
      {/* ── Window Title Bar ── */}
      <div style={{
        background: "#f8faff",
        borderBottom: "1px solid #e2e8f0",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fca5a5" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fcd34d" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#86efac" }} />
        <div style={{
          marginLeft: 8,
          display: "flex", alignItems: "center", gap: 6,
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 6, padding: "3px 10px"
        }}>
          <span style={{ width: 12, height: 12, background: "#ede9fe", borderRadius: 3, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>ShikshaAI</span>
        </div>
      </div>

      {/* ── Two-pane Layout: Sidebar + Main ── */}
      <div style={{ display: "flex" }}>

        {/* Sidebar */}
        <div style={{
          width: 148,
          borderRight: "1px solid #f1f5f9",
          padding: "16px 12px",
          background: "#fff",
          flexShrink: 0,
        }}>
          {/* User Mini Profile */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #5b4cf5, #7c6ff9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 8
            }}>A</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Hello, Ananya 👋</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: 1 }}>Class 10 • Student</div>
          </div>

          {/* Nav Group: LEARN */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4, paddingLeft: 8 }}>LEARN</div>
            {[
              { icon: "🏠", label: "Dashboard", active: true },
              { icon: "🧠", label: "AI Tutor" },
              { icon: "✏️", label: "Practice" },
              { icon: "🔬", label: "Diagnose" },
              { icon: "📚", label: "Subjects" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "5px 8px", borderRadius: 8,
                background: item.active ? "#ede9fe" : "transparent",
                marginBottom: 2,
              }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{ fontSize: 12, fontWeight: item.active ? 700 : 500, color: item.active ? "#5b4cf5" : "#64748b" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Nav Group: TRACK */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4, paddingLeft: 8 }}>TRACK</div>
            {[
              { icon: "📈", label: "Progress" },
              { icon: "📊", label: "Reports" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "5px 8px", borderRadius: 8, marginBottom: 2
              }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Nav Group: MORE */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: 4, paddingLeft: 8 }}>MORE</div>
            {[
              { icon: "📁", label: "Resources" },
              { icon: "⚙️", label: "Settings" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "5px 8px", borderRadius: 8, marginBottom: 2
              }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div style={{ flex: 1, padding: "16px", overflow: "hidden" }}>

          {/* Row 1: Learning Progress Header */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Your Learning Progress</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#5b4cf5", cursor: "pointer" }}>View Details</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { icon: "🎯", label: "Overall Mastery", value: "72%", color: "#10b981" },
                { icon: "📚", label: "Topics Mastered", value: "18/25", color: "#5b4cf5" },
                { icon: "⚡", label: "Practice Score", value: "85%", color: "#f59e0b" },
                { icon: "🔥", label: "Learning Streak", value: "7 Days", color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#f8faff", borderRadius: 10, padding: "8px 10px",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>
                    {s.icon} {s.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Weak Topics + AI Tutor side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

            {/* Weak Topics */}
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Weak Topics</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 10 }}>Based on your recent performance</div>
              {[
                { label: "Quadratic Equations", pct: 42, color: "#ef4444" },
                { label: "Linear Equations", pct: 58, color: "#f59e0b" },
                { label: "Triangles", pct: 65, color: "#f59e0b" },
              ].map((t) => (
                <div key={t.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#334155" }}>{t.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.color }}>{t.pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill-bar" style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}aa)` }} />
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: 8, textAlign: "center",
                background: "#5b4cf5", borderRadius: 8,
                padding: "6px 0", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer"
              }}>
                Start Practice
              </div>
            </div>

            {/* AI Tutor */}
            <div>
              <div style={{
                background: "linear-gradient(135deg, #5b4cf5 0%, #7c6ff9 100%)",
                borderRadius: 12, padding: "12px", marginBottom: 10, color: "#fff"
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>Ask AI Tutor</div>
                <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 8 }}>Get help with any concept.</div>
                <div style={{
                  background: "rgba(255,255,255,0.15)", borderRadius: 8,
                  padding: "8px 10px", fontSize: 11, fontStyle: "italic",
                  color: "#e0d9ff", marginBottom: 8
                }}>
                  &quot;Explain quadratic equations in simple hindi&quot;
                </div>
                <div style={{
                  background: "#fff", color: "#5b4cf5",
                  borderRadius: 8, padding: "6px 0",
                  textAlign: "center", fontSize: 11, fontWeight: 700, cursor: "pointer"
                }}>
                  🤖 Ask Now
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ background: "#f8faff", borderRadius: 12, padding: "10px 12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>Recent Activity</span>
                  <span style={{ fontSize: 10, color: "#5b4cf5", fontWeight: 600 }}>View All</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 13 }}>📝</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#334155" }}>Practice Session: Algebra</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>2 hrs ago</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#d1fae5", color: "#059669", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>85%</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
