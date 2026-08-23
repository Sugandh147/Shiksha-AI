import { Brain, Activity, ChevronRight } from "lucide-react";

export default function ProductPreview() {
  return (
    <div className="w-full max-w-5xl mx-auto pt-6">
      <div
        className="glass-card p-4 sm:p-6 md:p-8 text-left border relative overflow-hidden shadow-2xl"
        style={{ borderColor: "var(--color-border)", borderRadius: "24px" }}
      >
        {/* Window Chrome Header Bar */}
        <div
          className="flex items-center justify-between pb-4 border-b mb-6"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              shikshaai.app &bull; Interactive Student & Teacher Workspace
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> System Active
          </span>
        </div>

        {/* Product Workspace Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Panel 1: Student Skill Mastery */}
          <div
            className="p-4 rounded-2xl bg-slate-950/80 border space-y-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-300 uppercase tracking-wider">Mathematics Mastery</span>
              <span className="font-extrabold text-emerald-400 text-sm">78.5%</span>
            </div>
            <div className="space-y-2.5">
              <div className="text-xs space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Linear Equations</span>
                  <span className="font-semibold text-white">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "85%" }} />
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Algebraic Expressions</span>
                  <span className="font-semibold text-amber-400">62% (Practice Focus)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "62%", background: "linear-gradient(90deg, #f59e0b, #ef4444)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Grounded RAG AI Explanation */}
          <div
            className="p-4 rounded-2xl bg-slate-950/80 border space-y-2.5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>NCERT Grounded AI Answer</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              &quot;To solve <code className="text-indigo-300 font-mono">2x + 3 = 11</code>, subtract 3 from both sides to get <code className="text-indigo-300 font-mono">2x = 8</code>, so <code className="text-emerald-400 font-bold font-mono">x = 4</code>.&quot;
            </p>
            <div className="text-[10px] text-indigo-300/80 font-mono pt-1">
              📖 Citation: NCERT Mathematics Class 8 — Chapter 2
            </div>
          </div>

          {/* Panel 3: ClassPulse Teacher Intelligence */}
          <div
            className="p-4 rounded-2xl bg-slate-950/80 border space-y-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider">ClassPulse Intelligence</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">Live Analytics</span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              Teacher Copilot flagged <strong className="text-white font-semibold">Algebraic Factoring</strong> as top struggle topic across 24 students.
            </div>
            <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
              View Intervention Plan <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
