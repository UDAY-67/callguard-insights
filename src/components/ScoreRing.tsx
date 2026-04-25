import { motion } from "framer-motion";

interface Props {
  value: number; // 0-100
  label: string;
  size?: number;
  variant?: "primary" | "success" | "warning" | "destructive";
  invert?: boolean; // for risk: higher = bad
}

export function ScoreRing({ value, label, size = 140, variant, invert }: Props) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;

  const auto: Props["variant"] =
    variant ??
    (invert
      ? v >= 60 ? "destructive" : v >= 35 ? "warning" : "success"
      : v >= 70 ? "success" : v >= 45 ? "warning" : "destructive");

  const colorVar = `var(--color-${auto})`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="oklch(0.3 0.04 260 / 0.5)"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colorVar}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${colorVar})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold tabular-nums"
            style={{ color: colorVar }}
          >
            {Math.round(v)}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <div className="text-sm font-medium text-center text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
