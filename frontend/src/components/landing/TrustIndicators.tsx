import { ShieldCheck, Camera, Globe, Users } from "lucide-react";

export default function TrustIndicators() {
  return (
    <div className="py-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400 font-semibold">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>NCERT Grounded Knowledge</span>
      </div>
      <div className="flex items-center gap-2">
        <Camera className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>Vision OCR Solver</span>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-amber-400 shrink-0" />
        <span>English & Hindi Support</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>Teacher Intelligence</span>
      </div>
    </div>
  );
}
