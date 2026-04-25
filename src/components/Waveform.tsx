import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

export function Waveform({ data }: { data: { t: number; v: number }[] }) {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.18 195)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[-1.2, 1.2]} />
          <Area
            type="monotone"
            dataKey="v"
            stroke="oklch(0.85 0.18 195)"
            strokeWidth={1.5}
            fill="url(#wf)"
            isAnimationActive
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
