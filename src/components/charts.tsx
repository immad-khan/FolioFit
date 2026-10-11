const pt = (cx: number, cy: number, r: number, i: number, n: number) => {
  const a = (Math.PI * 2 * i) / n - Math.PI / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

export function Radar({
  values = [0.96, 0.92, 0.88, 0.79, 0.84, 0.9],
  target = [0.85, 0.85, 0.82, 0.86, 0.8, 0.83],
  size = 240,
}: {
  values?: number[];
  target?: number[];
  size?: number;
}) {
  const c = size / 2;
  const R = size / 2 - 16;
  const n = values.length;
  const poly = (vals: number[]) => vals.map((v, i) => pt(c, c, R * v, i, n).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      <defs>
        <radialGradient id="rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00a693" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#00a693" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={Array.from({ length: n }, (_, i) => pt(c, c, R * s, i, n).join(",")).join(" ")}
          fill="none"
          stroke="#bbcac5"
          strokeOpacity={0.7}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(c, c, R, i, n);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#bbcac5" strokeOpacity={0.6} />;
      })}
      <polygon points={poly(target)} fill="none" stroke="#1e667f" strokeDasharray="4 4" strokeWidth={1.5} />
      <polygon points={poly(values)} fill="url(#rg)" stroke="#006b5e" strokeWidth={2.5} strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = pt(c, c, R * v, i, n);
        return <circle key={i} cx={x} cy={y} r={4} fill="#006b5e" stroke="#fff" strokeWidth={1.5} />;
      })}
    </svg>
  );
}

export function VelocityChart({ data = [74, 78, 83, 88.4] }: { data?: number[] }) {
  const w = 320;
  const h = 110;
  const min = Math.min(...data) - 6;
  const max = Math.max(...data) + 2;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * (w - 12) + 6, h - ((d - min) / (max - min)) * (h - 16) - 8]);
  const path = pts
    .map((p, i) => {
      if (i === 0) return `M${p[0]},${p[1]}`;
      const prev = pts[i - 1];
      const mx = (prev[0] + p[0]) / 2;
      return `C${mx},${prev[1]} ${mx},${p[1]} ${p[0]},${p[1]}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
      <defs>
        <linearGradient id="vg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00a693" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00a693" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`} fill="url(#vg)" />
      <path d={path} fill="none" stroke="#006b5e" strokeWidth={2.5} strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 5 : 3.5} fill="#006b5e" stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

export const keywordData = [
  { label: "Figma & Design Systems", you: 98, industry: 74 },
  { label: "User Journey & Prototyping", you: 91, industry: 68 },
  { label: "TypeScript & React Context", you: 84, industry: 59 },
  { label: "Product Analytics (Mixpanel/GA)", you: 76, industry: 62 },
];

export function KeywordBars() {
  return (
    <div className="space-y-4">
      {keywordData.map((k) => (
        <div key={k.label}>
          <div className="flex justify-between font-mono text-label-sm text-on-surface-variant mb-1.5">
            <span>{k.label}</span>
            <span>
              {k.you}% <span className="text-outline">(Industry: {k.industry}%)</span>
            </span>
          </div>
          <div className="relative h-2.5 rounded-full bg-surface-container overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary-container rounded-full" style={{ width: `${k.you}%` }} />
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${k.industry}%` }} />
          </div>
        </div>
      ))}
      <div className="flex gap-5 pt-2 font-mono text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Industry Baseline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> Your Competitive Edge
        </span>
      </div>
    </div>
  );
}

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 rounded-full bg-surface-container overflow-hidden ${className}`}>
      <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${value}%` }} />
    </div>
  );
}
