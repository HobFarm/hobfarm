// Explicit tone -> full-class-string maps for the homepage infographic
// primitives. We never build classes like `border-${tone}` because Tailwind's
// compiler only emits utilities it can see as literal strings. Tailwind 4 scans
// .ts source, so the literal strings below are picked up at build time.

export type Tone =
  | "base"
  | "accent"
  | "green"
  | "cyan"
  | "magenta"
  | "blue"
  | "red"
  | "gold";

// Node card border accent.
export const NODE_BORDER: Record<Tone, string> = {
  base: "border-base-700",
  accent: "border-accent-500/40",
  green: "border-accent-green/40",
  cyan: "border-accent-cyan/40",
  magenta: "border-accent-magenta/40",
  blue: "border-accent-blue/40",
  red: "border-accent-red/40",
  gold: "border-accent-gold/40",
};

// Small status-dot fill.
export const NODE_DOT: Record<Tone, string> = {
  base: "bg-base-500",
  accent: "bg-accent-500",
  green: "bg-accent-green",
  cyan: "bg-accent-cyan",
  magenta: "bg-accent-magenta",
  blue: "bg-accent-blue",
  red: "bg-accent-red",
  gold: "bg-accent-gold",
};

// Accent text (kickers, labels) kept readable on the dark ground.
export const TONE_TEXT: Record<Tone, string> = {
  base: "text-base-400",
  accent: "text-accent-400",
  green: "text-accent-green",
  cyan: "text-accent-cyan",
  magenta: "text-accent-magenta-bright",
  blue: "text-accent-blue-bright",
  red: "text-accent-red-bright",
  gold: "text-accent-gold",
};

// Only .glow-violet and .glow-green exist as utilities, so cool tones map to
// green and everything else to violet.
export function glowClass(tone: Tone): string {
  return tone === "green" || tone === "cyan" ? "glow-green" : "glow-violet";
}
