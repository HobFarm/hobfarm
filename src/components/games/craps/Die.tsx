import type { DieFace } from "@/lib/craps/engine";

interface DieProps {
  value?: number | null;
  rolling?: boolean;
  label?: string;
}

const PIPS: Record<DieFace, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [
    [30, 30],
    [70, 70],
  ],
  3: [
    [30, 30],
    [50, 50],
    [70, 70],
  ],
  4: [
    [30, 30],
    [70, 30],
    [30, 70],
    [70, 70],
  ],
  5: [
    [30, 30],
    [70, 30],
    [50, 50],
    [30, 70],
    [70, 70],
  ],
  6: [
    [30, 26],
    [70, 26],
    [30, 50],
    [70, 50],
    [30, 74],
    [70, 74],
  ],
};

export default function Die({ value = 1, rolling = false, label }: DieProps) {
  const face = normalizeFace(value);
  const title = label ?? `Die showing ${face}`;

  return (
    <div className={["craps-die", rolling ? "craps-die--rolling" : ""].join(" ")} aria-label={title}>
      <svg viewBox="0 0 100 100" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`die-face-${face}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f7fbff" />
            <stop offset="62%" stopColor="#dfe7f2" />
            <stop offset="100%" stopColor="#b7c1d2" />
          </linearGradient>
          <filter id={`die-glow-${face}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.4" floodColor="#19e3e3" floodOpacity="0.35" />
          </filter>
        </defs>
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="16"
          fill={`url(#die-face-${face})`}
          stroke={rolling ? "#19e3e3" : "#c8d3df"}
          strokeWidth="3"
          filter={rolling ? `url(#die-glow-${face})` : undefined}
        />
        <path d="M24 12h52c7 0 12 5 12 12v8C80 22 68 16 52 16H24z" fill="rgba(255,255,255,.48)" />
        {PIPS[face].map(([cx, cy], index) => (
          <circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r="7.5" fill="#090814" />
        ))}
      </svg>
    </div>
  );
}

function normalizeFace(value?: number | null): DieFace {
  if (value === 2 || value === 3 || value === 4 || value === 5 || value === 6) return value;
  return 1;
}
