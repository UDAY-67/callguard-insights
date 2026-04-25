import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export function AlertBanner({ verdict, score }: { verdict: "SAFE" | "SUSPICIOUS" | "SCAM"; score: number }) {
  const cfg = {
    SAFE: {
      bg: "var(--gradient-safe)",
      icon: ShieldCheck,
      title: "Call Authenticated — Safe",
      sub: "No deepfake signatures detected. Voice characteristics consistent with authentic human speech.",
      color: "var(--color-success)",
    },
    SUSPICIOUS: {
      bg: "linear-gradient(135deg, oklch(0.82 0.17 85), oklch(0.75 0.19 60))",
      icon: ShieldAlert,
      title: "Suspicious Activity Detected",
      sub: "Several anomalies flagged. Treat this call with caution and verify the caller through a secondary channel.",
      color: "var(--color-warning)",
    },
    SCAM: {
      bg: "var(--gradient-danger)",
      icon: ShieldX,
      title: "Deepfake / Phishing Detected",
      sub: "High-confidence synthetic voice and social engineering patterns. Do NOT share credentials or transfer funds.",
      color: "var(--color-destructive)",
    },
  }[verdict];
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8"
      style={{ background: cfg.bg }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative flex items-center gap-5">
        <div className="shrink-0 rounded-2xl bg-white/15 p-4 backdrop-blur">
          <Icon className="h-10 w-10 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.25em] text-white/80">
            Verdict
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white">{cfg.title}</div>
          <div className="text-sm text-white/85 mt-1 max-w-2xl">{cfg.sub}</div>
        </div>
        <div className="hidden md:flex flex-col items-center text-white">
          <div className="text-5xl font-bold tabular-nums">{score}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-80">Trust Score</div>
        </div>
      </div>
    </motion.div>
  );
}
