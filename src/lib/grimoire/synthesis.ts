import type {
  GrimoireSynthesis,
  SynthesisKind,
  SynthesisPlausibility,
} from "@/data/grimoire-synthesis";

// Validates the live payload before it touches the DOM. The homepage must never
// render a malformed synthesis; on any doubt the caller keeps the curated item.

const KINDS = new Set<SynthesisKind>(["coinage", "insight", "recipe", "provocation"]);
const PLAUSIBILITIES = new Set<SynthesisPlausibility>([
  "plausible",
  "impractical",
  "impossible",
  "fictional",
  "unknown",
]);
const MEDIA_KINDS = new Set(["image", "video", "audio"]);

function isNonEmptyString(v: unknown, max = 600): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= max;
}

function isString(v: unknown, max = 600): v is string {
  return typeof v === "string" && v.length <= max;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function isSafeDisplayUrl(v: unknown, max = 500): v is string {
  if (!isNonEmptyString(v, max)) return false;
  if (/\s/.test(v)) return false;
  if (v.startsWith("/") && !v.startsWith("//")) return true;

  try {
    const url = new URL(v);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

// A short list of short strings (use_as / not_for). Empty array is allowed (the
// caller just renders nothing); anything non-string or oversized is rejected.
function isShortStringList(v: unknown, maxItems = 8, maxLen = 60): v is string[] {
  return (
    Array.isArray(v) &&
    v.length <= maxItems &&
    v.every((s) => isNonEmptyString(s, maxLen))
  );
}

export function isValidSynthesis(v: unknown): v is GrimoireSynthesis {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  if (!isNonEmptyString(s.id, 128)) return false;
  if (!KINDS.has(s.kind as SynthesisKind)) return false;
  if (!isNonEmptyString(s.title, 120)) return false;
  if (!isNonEmptyString(s.synthesis, 600)) return false;
  if (!Array.isArray(s.ingredients) || s.ingredients.length < 1 || s.ingredients.length > 4) {
    return false;
  }
  for (const ing of s.ingredients) {
    const i = isRecord(ing) ? ing : null;
    if (!i || !isNonEmptyString(i.label, 120) || !isNonEmptyString(i.category, 60)) {
      return false;
    }
    if (i.href !== undefined && !isSafeDisplayUrl(i.href, 300)) return false;
  }
  if (s.connection !== undefined && !isNonEmptyString(s.connection, 600)) return false;
  if (s.thread !== undefined) {
    const t = isRecord(s.thread) ? s.thread : null;
    if (!t || !isNonEmptyString(t.label, 120) || !isSafeDisplayUrl(t.href, 300)) return false;
  }
  if (s.image !== undefined) {
    const img = isRecord(s.image) ? s.image : null;
    if (!img || !isSafeDisplayUrl(img.url, 500)) return false;
    if (img.alt !== undefined && !isString(img.alt, 240)) return false;
  }
  if (s.media !== undefined) {
    const media = isRecord(s.media) ? s.media : null;
    if (!media || !MEDIA_KINDS.has(String(media.kind)) || !isSafeDisplayUrl(media.url, 500)) {
      return false;
    }
    if (media.alt !== undefined && !isString(media.alt, 240)) return false;
  }
  // Optional public classification (live-only). Present-but-malformed is rejected
  // so a bad field can't reach the DOM; absent is always fine.
  if (s.plausibility !== undefined && !PLAUSIBILITIES.has(s.plausibility as SynthesisPlausibility)) {
    return false;
  }
  if (s.use_as !== undefined && !isShortStringList(s.use_as)) return false;
  if (s.not_for !== undefined && !isShortStringList(s.not_for)) return false;
  if (s.public_note !== undefined && !isNonEmptyString(s.public_note, 200)) return false;
  return true;
}

// A live item is only used if it was generated within this window; otherwise the
// homepage shows the curated rotation rather than a stale "today". Live items
// always carry generated_at, so a missing/unparseable value is treated as stale.
const FRESH_WINDOW_MS = 48 * 60 * 60 * 1000;
const LIVE_GRIMOIRE_ENABLED = import.meta.env.PUBLIC_GRIMOIRE_LIVE === "true";

export function isFreshSynthesis(item: GrimoireSynthesis, nowMs: number): boolean {
  if (!item.generated_at) return false;
  const t = Date.parse(item.generated_at);
  if (Number.isNaN(t)) return false;
  const age = nowMs - t;
  return age <= FRESH_WINDOW_MS && age >= -FRESH_WINDOW_MS;
}

// Fetches today's live synthesis via the Pages Function proxy. Returns null on
// any failure (not configured, upstream down, malformed, or stale) so the
// curated rotation stays in place. Accepts a bare synthesis or `{ today: ... }`.
export async function loadLiveSynthesis(timeoutMs = 1500): Promise<GrimoireSynthesis | null> {
  if (!LIVE_GRIMOIRE_ENABLED) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("/api/grimoire/synthesis", {
      headers: { accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const item = isValidSynthesis(data)
      ? data
      : isValidSynthesis((data as { today?: unknown })?.today)
        ? (data as { today: GrimoireSynthesis }).today
        : null;
    if (!item) return null;
    return isFreshSynthesis(item, Date.now()) ? item : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
