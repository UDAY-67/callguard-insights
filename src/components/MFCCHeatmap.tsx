export function MFCCHeatmap({ data }: { data: number[][] }) {
  const rows = data.length;
  const cols = data[0]?.length ?? 0;
  // map [-1,1] -> color
  const color = (v: number) => {
    const n = (v + 1) / 2; // 0..1
    // gradient cyan -> purple -> magenta
    if (n < 0.5) {
      const t = n / 0.5;
      const r = Math.round(20 + t * 80);
      const g = Math.round(180 - t * 60);
      const b = Math.round(220 - t * 40);
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (n - 0.5) / 0.5;
      const r = Math.round(100 + t * 155);
      const g = Math.round(120 - t * 100);
      const b = Math.round(180 + t * 40);
      return `rgb(${r},${g},${b})`;
    }
  };
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border/50">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 14px)`,
        }}
      >
        {data.flatMap((row, i) =>
          row.map((v, j) => (
            <div
              key={`${i}-${j}`}
              style={{ backgroundColor: color(v) }}
              title={`MFCC[${i},${j}] = ${v.toFixed(2)}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
