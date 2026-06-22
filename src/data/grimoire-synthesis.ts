// Grimoire daily synthesis: the homepage "cross-pollination" window.
//
// The point is serendipity, not stats. Each day the Grimoire fuses elements
// from far-apart corners of the root network into one novel idea: a coined
// microgenre, an unexpected connection, a style recipe, or a provocation.
// The kind that makes you stop and think "damn, that's rad."
//
// Frontend ships a curated rotation (deterministic by date) so the window
// changes every day without a redeploy and demonstrates the concept now. The
// LIVE generator lives in the grimoire repo: a daily job that walks the atom /
// correspondence graph, picks distant nodes, and writes a real synthesis (and
// optionally a graphic) into this exact shape. When that lands, a Pages
// Function serves it at /api/grimoire/synthesis and `source` flips to "live".

export type SynthesisKind = "coinage" | "insight" | "recipe" | "provocation";

// How physically real the synthesis is, as a public-facing classification. The
// whole point of the feature is that a card can be "impossible" and still be a
// useful image seed, so this is a display label, not a quality score. Live items
// may carry it; the curated set leaves it off and the UI never fabricates it.
export type SynthesisPlausibility =
  | "plausible" // could be built or shot roughly as described
  | "impractical" // makeable in principle, absurd in practice
  | "impossible" // physically can't work as written (still a real image)
  | "fictional" // invented world/process, not claiming reality at all
  | "unknown"; // unrated

// One fused element and which corner of the Grimoire it came from.
export type SynthesisIngredient = {
  label: string;
  category: string; // e.g. material, lighting, structure, creature, symbol, domain, ritual
  href?: string;
};

// Richer generated media (live mode). image is the still-image convenience field;
// media carries the typed form when video/audio formats come online.
export type SynthesisMedia = {
  kind: "image" | "video" | "audio";
  url: string;
  alt?: string;
};

export type GrimoireSynthesis = {
  id: string; // live: the UTC day, "YYYY-MM-DD", one per day
  source: "curated" | "live";
  kind: SynthesisKind;
  title: string; // the headline of the discovery
  synthesis: string; // the idea itself, 1-3 sentences
  connection?: string; // why these distant things belong together (coinage/insight)
  ingredients: SynthesisIngredient[]; // 2-4 elements the Grimoire fused
  image?: { url: string; alt: string }; // generated still (live mode)
  thread?: { label: string; href: string }; // a real entry to follow
  // Live-only fields (snake_case, mirrors the grimoire worker contract). Not
  // produced by the curated set; the consumer treats them all as optional.
  media?: SynthesisMedia;
  format?: string; // e.g. "text"
  model?: string; // e.g. "xai/grok-4.3"
  generated_at?: string; // ISO-8601 timestamp, always set on live items
  // Optional public classification. Surfaced only when present; the frontend
  // never invents these. Long-term they come from the grimoire generator; the
  // shapes here let the site display them the moment the backend emits them.
  plausibility?: SynthesisPlausibility; // how real the recipe is (display label)
  use_as?: string[]; // what the artifact is good for: image seed, caption, video...
  not_for?: string[]; // what it explicitly is not: a tutorial, a fabrication spec
  public_note?: string; // one-line per-card framing override (else a kind default)
};

export type GrimoireSynthesisEnvelope = {
  source: "curated" | "live";
  item: GrimoireSynthesis;
  index: number;
  total: number;
};

// Display metadata for each kind (label + which spot accent it leans on).
export const synthesisKindMeta: Record<
  SynthesisKind,
  { label: string; accent: string }
> = {
  coinage: { label: "new coinage", accent: "var(--color-spot-magenta)" },
  insight: { label: "connection", accent: "var(--color-spot-cyan)" },
  recipe: { label: "style recipe", accent: "var(--color-spot-green)" },
  provocation: { label: "provocation", accent: "var(--color-spot-purple)" },
};

// Curated syntheses. Threads point only at grimoire entries that exist on disk.
export const grimoireSyntheses: GrimoireSynthesis[] = [
  {
    id: "brutalist-tarot",
    source: "curated",
    kind: "coinage",
    title: "Brutalist Tarot",
    synthesis:
      "A 78-card deck where every arcana is a poured-concrete monolith, lit like a parking garage at 3am. The Tower already looks like this. Build the other 77.",
    connection:
      "Tarot is a rigid taxonomy pretending to be mysticism. Brutalism is structure made visible. Same impulse, different substrate.",
    ingredients: [
      { label: "concrete monumentality", category: "material" },
      { label: "divination card grid", category: "structure" },
      { label: "hazard-light glow", category: "lighting" },
    ],
    thread: { label: "Understanding visual atoms", href: "/grimoire/understanding-visual-atoms" },
  },
  {
    id: "moths-read-like-exit-signs",
    source: "curated",
    kind: "insight",
    title: "Moths Read Like Exit Signs",
    synthesis:
      "Both evolved to be read instantly under bad light: one to startle a predator, one to move a crowd. Design a wayfinding system built on startle patterns instead of arrows.",
    connection:
      "Eyespots and emergency iconography solve the same problem (legible at a glance, no language) and arrived at similar high-contrast geometry.",
    ingredients: [
      { label: "moth wing eyespots", category: "creature" },
      { label: "emergency exit iconography", category: "symbol" },
      { label: "signal cyan", category: "color" },
    ],
    thread: { label: "From generic to character", href: "/grimoire/from-generic-to-character" },
  },
  {
    id: "petroleum-rococo",
    source: "curated",
    kind: "recipe",
    title: "Petroleum Rococo",
    synthesis:
      "Take 18th-century gilt excess and submerge it in motor oil. Old gold filigree, oil-slick iridescence, lit by lobby neon. Ornate, toxic, expensive looking. A palette for something that should not be beautiful but is.",
    ingredients: [
      { label: "old gold filigree", category: "ornament" },
      { label: "oil-slick iridescence", category: "material" },
      { label: "lobby neon", category: "lighting" },
    ],
    thread: { label: "Color palette recipes", href: "/grimoire/color-palette-recipes" },
  },
  {
    id: "draw-the-hold-music",
    source: "curated",
    kind: "provocation",
    title: "Draw the Hold Music",
    synthesis:
      "Make a single still image that feels exactly like being on hold for 40 minutes. No phone, no office. Just the mood: beige eternity, looping false hope, a smile you cannot see.",
    connection:
      "Translating a sound or a feeling into a fixed frame forces you to name what it is actually made of. That is the whole job.",
    ingredients: [
      { label: "beige eternity", category: "mood" },
      { label: "looping false hope", category: "structure" },
      { label: "reflected hazard light", category: "lighting" },
    ],
    thread: { label: "How prompts get compiled", href: "/grimoire/stylefusion-prompt-compilation" },
  },
  {
    id: "forensic-cottagecore",
    source: "curated",
    kind: "coinage",
    title: "Forensic Cottagecore",
    synthesis:
      "Cozy farmhouse warmth photographed like a crime scene: numbered evidence markers next to the fresh bread, red string between the dried herbs. Comfort, but something happened here.",
    connection:
      "Cottagecore and evidence boards are both obsessive acts of cataloguing. Push them together and the coziness turns into suspense.",
    ingredients: [
      { label: "farmhouse warmth", category: "domain" },
      { label: "evidence-board string", category: "structure" },
      { label: "numbered markers", category: "symbol" },
    ],
    thread: { label: "Understanding visual atoms", href: "/grimoire/understanding-visual-atoms" },
  },
  {
    id: "a-spreadsheet-is-a-zen-garden",
    source: "curated",
    kind: "insight",
    title: "A Spreadsheet Is a Zen Garden",
    synthesis:
      "Raked gravel and a frozen grid of cells do the same thing: impose calm through repetition you are not allowed to disturb. Render a zen garden as a literal spreadsheet, or a spreadsheet as a place you go to meditate.",
    connection:
      "Both are tools for finding order in chaos by sub-dividing emptiness into a grid. One is sand, one is data.",
    ingredients: [
      { label: "raked gravel rows", category: "structure" },
      { label: "frozen cell grid", category: "domain" },
      { label: "side glow", category: "lighting" },
    ],
    thread: { label: "Welcome to the Grimoire", href: "/grimoire/welcome-to-the-grimoire" },
  },
  {
    id: "vending-machine-baroque",
    source: "curated",
    kind: "recipe",
    title: "Vending Machine Baroque",
    synthesis:
      "The drama of a Caravaggio applied to a 2am vending machine: one harsh internal light source, deep velvet shadow, every snack rendered like a saint in chiaroscuro. The chips are holy now.",
    ingredients: [
      { label: "chiaroscuro contrast", category: "lighting" },
      { label: "vending machine glow", category: "domain" },
      { label: "velvet shadow", category: "material" },
    ],
    thread: { label: "Color palette recipes", href: "/grimoire/color-palette-recipes" },
  },
  {
    id: "give-the-character-a-secret",
    source: "curated",
    kind: "provocation",
    title: "Lock the Face, Leak the Secret",
    synthesis:
      "Hold one character's exact bone structure across five images, but let each scene reveal something they are hiding. Same face, five secrets. The identity lock is the control group; the secret is the variable.",
    connection:
      "A character only becomes real when the locked traits stay fixed long enough for the flexible ones to tell a story.",
    ingredients: [
      { label: "face geometry", category: "trait lock" },
      { label: "five flexible scenes", category: "structure" },
      { label: "a withheld secret", category: "narrative" },
    ],
    thread: {
      label: "Face geometry and identity lock",
      href: "/grimoire/face-geometry-identity-lock",
    },
  },
];

// Days since the Unix epoch in UTC, used to pick a deterministic daily item.
function epochDayUtc(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000);
}

export function synthesisForDate(date: Date): GrimoireSynthesisEnvelope {
  const total = grimoireSyntheses.length;
  const index = ((epochDayUtc(date) % total) + total) % total;
  return { source: "curated", item: grimoireSyntheses[index], index, total };
}
