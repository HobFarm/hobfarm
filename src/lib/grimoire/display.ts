import type {
  GrimoireSynthesis,
  SynthesisKind,
  SynthesisPlausibility,
} from "@/data/grimoire-synthesis";

// Public framing for the cross-pollination feature. One source of truth shared by
// the homepage synthesis window, the archive page, and the upcoming
// "A False Recipe, a Real Image" article, so the argument reads the same
// everywhere: these are speculative synthesis cards, not tutorials. A recipe can
// be physically impossible and still be a real image seed.
//
// Everything here is browser-safe (pure data + pure functions) so the homepage
// card's inline hydration script can import it directly.

export const CROSS_POLLINATION_FRAMING = {
  // Eyebrow / kicker for the archive hero.
  kicker: "Grimoire / cross-pollination",

  // Long intro for the archive page.
  intro:
    "Cross-pollinations are creative synthesis cards generated from concepts stored in the Grimoire. They are not tutorials, manufacturing instructions, or factual claims. Each one fuses stored atoms (domains, materials, coverings, subjects, lighting, poses, objects) into a single speculative artifact. Some are plausible. Some are impossible. The point is to produce strange, specific seeds for images, videos, captions, gallery entries, and future work.",

  // Compact intro for tighter layouts (e.g. the homepage column).
  short:
    "Not tutorials. Cross-pollinations are speculative synthesis cards: the Grimoire fuses stored visual atoms into fictional processes, image seeds, and strange artifacts that can become finished media.",

  // One-line framing for compact archive surfaces.
  stripNote: "Speculative cards, not tutorials. Every daily synthesis is kept.",

  // The "how to read these" callout.
  howToReadTitle: "How to read these",
  howToRead:
    "The Grimoire combines stored concepts into speculative cards. Treat them as creative prompts, not instructions. A card can be physically impossible as written and still be a real image seed, video concept, caption, gallery entry, or fictional product study. A false recipe, a real image.",
} as const;

// Per-kind framing line used as the default card note. Kept short and a little
// sharp, never apologetic: it classifies the card rather than disclaiming it.
const KIND_NOTE: Record<SynthesisKind, string> = {
  coinage: "A name coined for something that does not exist yet.",
  insight: "A connection the archive drew, not a claim of fact.",
  recipe: "A speculative style recipe, not a fabrication tutorial.",
  provocation: "A prompt to make from, not an instruction to follow.",
};

// When plausibility says the recipe can't physically work, that's the most
// honest (and most on-brand) note to show, regardless of kind.
const IMPOSSIBLE_NOTE = "Physically impossible as written. Real as an image seed.";
const FICTIONAL_NOTE = "Fictional as written. Useful as an image seed.";

// The single framing line a card shows under its title. Priority: an explicit
// public_note from the data, then a plausibility-specific note, then a kind default.
export function cardFramingNote(item: GrimoireSynthesis): string {
  if (item.public_note) return item.public_note;
  if (item.plausibility === "impossible") {
    return IMPOSSIBLE_NOTE;
  }
  if (item.plausibility === "fictional") return FICTIONAL_NOTE;
  return KIND_NOTE[item.kind] ?? "Speculative synthesis, not a tutorial.";
}

// Presentation for the plausibility chip. Accent values are confirmed design
// tokens (see src/styles/global.css). Rendered only when an item carries a
// plausibility; the curated set omits it and shows nothing.
export const plausibilityMeta: Record<
  SynthesisPlausibility,
  { label: string; accent: string }
> = {
  plausible: { label: "plausible", accent: "var(--color-spot-green)" },
  impractical: { label: "impractical", accent: "var(--color-accent-gold)" },
  impossible: { label: "impossible", accent: "var(--color-spot-magenta)" },
  fictional: { label: "fictional", accent: "var(--color-spot-purple)" },
  unknown: { label: "unrated", accent: "var(--color-base-500)" },
};

export function plausibilityChip(
  plausibility: SynthesisPlausibility | undefined
): { label: string; accent: string } | null {
  if (!plausibility) return null;
  return plausibilityMeta[plausibility] ?? null;
}

// Display-safe relabeling for public cards. Some Grimoire atom vocabulary is
// internally useful but wrong for a public surface. We do NOT mutate source
// data; this is a presentation-only override, keyed lowercase for a
// case-insensitive match. Keep it conservative: only terms that genuinely reach
// public cards. The durable fix belongs in the grimoire repo, not here.
export const PUBLIC_TAG_LABELS: Record<string, string> = {
  // Raw atom term the generator can surface -> public-safe label.
  "tail masturbation": "tail prosthetic",
};

// Returns the public-safe label for a tag/ingredient string, or the original
// when there's no override. Trims and matches case-insensitively.
export function publicTagLabel(raw: string): string {
  if (typeof raw !== "string") return raw;
  return PUBLIC_TAG_LABELS[raw.trim().toLowerCase()] ?? raw;
}
