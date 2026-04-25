import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { getMockHistory } from "@/services/api";
import { resultStore } from "@/lib/store";
import { ShieldCheck, ShieldAlert, ShieldX, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Call History — CallShield" },
      { name: "description", content: "Review previously analyzed calls and their trust scores." },
      { property: "og:title", content: "Call History — CallShield" },
      { property: "og:description", content: "Past calls scanned through CallShield with full trust reports." },
    ],
  }),
  component: HistoryPage,
});

const verdictMeta = {
  SAFE: { icon: ShieldCheck, color: "var(--color-success)", bg: "oklch(0.72 0.18 155 / 0.15)" },
  SUSPICIOUS: { icon: ShieldAlert, color: "var(--color-warning)", bg: "oklch(0.82 0.17 85 / 0.15)" },
  SCAM: { icon: ShieldX, color: "var(--color-destructive)", bg: "oklch(0.65 0.24 25 / 0.15)" },
} as const;

function HistoryPage() {
  const items = getMockHistory();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">History</div>
        <h1 className="text-4xl font-bold">Past Analyses</h1>
        <p className="text-muted-foreground mt-2">All calls scanned through CallShield, newest first.</p>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["SAFE","SUSPICIOUS","SCAM"] as const).map((v) => {
          const count = items.filter((i) => i.verdict === v).length;
          const M = verdictMeta[v];
          const Icon = M.icon;
          return (
            <div key={v} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: M.bg }}>
                <Icon className="h-5 w-5" style={{ color: M.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">{count}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{v}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const M = verdictMeta[item.verdict];
          const Icon = M.icon;
          return (
            <motion.div
              key={item.timestamp + item.fileName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to="/results"
                onClick={() => resultStore.set(item)}
                className="block glass hover:bg-secondary/40 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: M.bg }}>
                    <Icon className="h-5 w-5" style={{ color: M.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.fileName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()} • {item.durationSec}s
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <Score label="Voice" v={item.voiceAuthenticity} />
                    <Score label="Identity" v={item.identityMatch} />
                    <Score label="Risk" v={item.contextRisk} invert />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tabular-nums" style={{ color: M.color }}>
                      {item.trustScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Trust</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Score({ label, v, invert }: { label: string; v: number; invert?: boolean }) {
  const good = invert ? v < 35 : v >= 70;
  const mid = invert ? v < 60 : v >= 45;
  const color = good ? "var(--color-success)" : mid ? "var(--color-warning)" : "var(--color-destructive)";
  return (
    <div className="text-center min-w-[60px]">
      <div className="text-sm font-semibold tabular-nums" style={{ color }}>{v}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
