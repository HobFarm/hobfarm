// Structured content for the homepage redesign (Operating Map + infographic story).
// All copy lives here so the section components stay layout-only. Visible copy
// avoids machine-metaphor decoration ("pipeline", "engine", "output"); internal
// keys may still use those words.

import { getMedia } from "@/data/media-registry";

export interface LabeledItem {
  label: string;
  value: string;
}

export interface Cta {
  label: string;
  href: string;
  external?: boolean;
}

// Optional asset slot. src/poster/video stay null until real assets are produced;
// the components render coded placeholders (image) or nothing (motion) when null.
export interface ImageSlot {
  src: string | null;
  alt: string;
}

export interface MotionSlot {
  poster: string | null;
  video: string | null;
}

export interface StoryPanelImage {
  src: string;
  alt: string;
  label: string;
}

export interface StoryPanel {
  label: string;
  title: string;
  copy: string;
  accent: "cyan" | "magenta" | "green" | "blue" | "gold";
  images: StoryPanelImage[];
  callouts: LabeledItem[];
  flow: string[];
}

// --- Section 1: Hero / Operating Map ----------------------------------------

export const operatingMap = {
  brand: "HobFarm",
  eyebrow: "Character systems / Visual media / Lessons",
  headline:
    "Character systems, avatar workflows, and strange visual experiments built for the social feed.",
  subhead:
    "HobFarm turns character ideas, style references, AI experiments, and visual chaos into reusable image sets, short-form videos, gallery drops, process notes, and lessons. It is part character lab, part visual systems workshop, part content engine.",
  goal:
    "The goal is simple: build characters and images that can survive beyond one post. Same face, stronger style, better variants, clearer prompts, reusable assets, and enough process behind the work to turn it into something people can watch, collect, study, or remix.",
  diagram: {
    title: "Idea to reusable visual set",
    stages: [
      {
        label: "Raw signal",
        items: ["character idea", "style reference", "AI test"],
      },
      {
        label: "System lock",
        items: ["same face", "style rules", "variant prompts"],
      },
      {
        label: "Feed-ready set",
        items: ["image set", "short video", "gallery drop"],
      },
    ],
  },
  // Operating-map columns. Group labels are set in the component:
  // "Inputs" -> "The System" -> "Finished Work".
  inputs: ["Characters", "References", "Style modes", "Motifs", "Media goals"],
  system: ["Character sheet", "Style formula", "Cute -> Corrupted pass", "Motion test", "Grimoire indexing"],
  finished: [
    "Gallery drops",
    "Social clips",
    "Carousel sheets",
    "Articles",
    "Course lessons",
    "Client visuals",
    "Digital packs",
  ],
  // Bottom loop strip.
  loop: ["Idea", "Sheet", "Style pass", "Post", "Gallery", "Lesson", "Product"],
  ctas: [
    { label: "See the visuals", href: "/gallery/" },
    { label: "Read articles", href: "/articles/" },
    { label: "Work with HobFarm", href: "/services/" },
  ] as Cta[],
};

// Credibility chips (migrated from the old homepage proofChips).
export const capabilities = [
  "character systems",
  "avatar workflows",
  "before / after loops",
  "style references",
  "short-form video",
  "gallery drops",
];

// --- Section 2: Before & After ----------------------------------------------

export const beforeAfter = {
  eyebrow: "Before & After",
  heading: "Same character. Different era. Different rules.",
  copy:
    "Before & After is a transformation series where one character is split across two visual worlds. The face, body type, and core identity stay consistent, but the styling changes completely: fashion era, pose language, setting, props, color logic, and social behavior.",
  detail:
    "The first piece compares 1926 elegance with current-day social-media performance culture. The format works as a still image, a short animated loop, or a gallery entry that can later become a post, pack, or lesson.",
  feature: {
    title: "1926 / Now",
    beforeLabel: "1926",
    afterLabel: "Now",
    image: "https://cdn.hob.farm/gallery/before-and-after/1926-2026/before-and-after-1926-2026.png",
    video: "https://cdn.hob.farm/gallery/before-and-after/1926-2026/before-and-after-1926-2026.mp4",
    alt: "Before and After split image comparing a 1926 elegant fashion character with a modern social-media persona of the same character.",
    notes: [
      { label: "Keeps", value: "face, proportions, eye shape, identity" },
      { label: "Changes", value: "wardrobe, posture, props, lighting" },
      { label: "Format", value: "poster and short animated loop" },
    ],
  },
  steps: [
    "Character lock",
    "Era split",
    "Still image",
    "Animated loop",
    "Gallery drop",
    "Post or pack",
  ],
  ctas: [
    { label: "View the Before & After Gallery", href: "/gallery/before-and-after/" },
    { label: "See the Workflow", href: "#workflow" },
  ] as Cta[],
};

// --- Section 3: Cute -> Corrupted -------------------------------------------

export const cuteCorrupted = {
  eyebrow: "Cute / Corrupted",
  heading: "Cute things, corrupted on purpose",
  copy:
    "A visual series about paired transformations. Every piece starts with a clean, charming version, then mutates into a darker version that keeps the same subject, silhouette, and appeal. Pick a branch and run the change yourself.",
  cta: "Every design starts clean. Every design comes back changed.",
  landingHref: "/gallery/cute-corrupted/",
  defaultBranch: "critters",
  // Each branch has a `featured` entry (shown in the homepage switcher) and a
  // full `entries` list (shown on the landing page). Media URLs and
  // locked/changed traits are read live from each gallery entry
  // (see src/lib/cute-corrupted.ts) so nothing drifts from the source. A
  // branch or entry that does not exist yet is skipped automatically.
  branches: [
    {
      key: "critters",
      label: "Critters",
      featured: "cute-corrupted/raccoon",
      entries: [
        "cute-corrupted/raccoon",
        "cute-corrupted/cat",
        "cute-corrupted/corgi",
        "cute-corrupted/koala",
      ],
      blurb:
        "Cute animal cartoons pushed into toxic, haunted, mutant, overgrown, or monster-movie versions of themselves.",
    },
    {
      key: "characters",
      label: "Characters",
      featured: "cute-corrupted/sienna",
      entries: ["cute-corrupted/sienna", "cute-corrupted/kareena"],
      blurb:
        "Mascots, fashion figures, cartoon hosts, and character sheets transformed from clean charm into corrupted glamour.",
    },
    {
      key: "cakes",
      label: "Cakes",
      featured: "cute-corrupted/cakes",
      entries: ["cute-corrupted/cakes"],
      blurb:
        "Wedding cakes, birthday cakes, and occasion cakes redesigned as dark bakery centerpieces with cursed frosting logic.",
    },
  ],
  // Series-level promo posters (not before/after pairs) shown on the landing page.
  posters: [
    {
      title: "Cute & Corrupted",
      src: "https://cdn.hob.farm/gallery/cute-corrupted/posters/cute-and-corrupted-poster.mp4",
      poster: "https://cdn.hob.farm/gallery/cute-corrupted/posters/cute-and-corrupted-poster.jpg",
    },
    {
      title: "Melting Heart",
      src: "https://cdn.hob.farm/gallery/cute-corrupted/posters/cute-and-corrupted-melting-heart.mp4",
    },
  ],
};

// --- Section 4: Visual Systems ----------------------------------------------

export const visualSystems = {
  eyebrow: "Visual Systems",
  heading: "Reusable looks, not random image sets",
  intro:
    "HobFarm develops style systems with repeatable rules. A system names its color, materials, silhouette, type, subject matter, and allowed variants, so one good direction can become a character sheet, a post set, a gallery entry, a product mockup, or a lesson.",
  // The formula every system runs through.
  formula: [
    "Style inputs",
    "Trait extraction",
    "Formula",
    "Variants",
    "Finished work",
  ],
  systems: [
    {
      name: "PsyGoth",
      summary:
        "Psychedelic image logic built on goth materials: dark romance, club silhouettes, occult atmosphere, liquid motifs, and emotional distortion.",
      traits: [
        { label: "Color", value: "Saturated bloom on a black ground" },
        { label: "Silhouette", value: "Club and couture lines" },
        { label: "Material", value: "Latex, lace, wet shine, smoke" },
        { label: "Type", value: "High-contrast display, occult detail" },
        { label: "Subject", value: "Dark-romance figures, ritual scenes" },
        { label: "Environment", value: "Night interiors, fog, neon haze" },
        { label: "Motion", value: "Slow drift, liquid warp" },
        { label: "Fits", value: "Covers, characters, posters, fashion" },
      ] as LabeledItem[],
    },
    {
      name: "Technodelic",
      summary:
        "1950s science-fiction art and 1960s atomic design crossed with 60s-70s concert-poster language, analog color, and 80s VHS-cover energy.",
      traits: [
        { label: "Color", value: "Analog print, risograph and CRT" },
        { label: "Silhouette", value: "Atomic geometry, retro-future curves" },
        { label: "Material", value: "Paper grain, tape, halftone" },
        { label: "Type", value: "Concert-poster lettering, atomic deco" },
        { label: "Subject", value: "Rockets, labs, ray-gun futures" },
        { label: "Environment", value: "Space-age sets, test patterns" },
        { label: "Motion", value: "Scanline drift, poster bloom" },
        { label: "Fits", value: "Posters, covers, title cards, products" },
      ] as LabeledItem[],
    },
  ],
};

// --- Section 5: Applications Across Media -----------------------------------

export const applications = {
  eyebrow: "Across Media",
  heading: "One character system, many places to go",
  copy: "The business value is in reuse. A character or style system can feed Instagram reels, carousel sheets, gallery pages, client visuals, digital downloads, articles, and course lessons without starting from nothing every time.",
  items: [
    "Character sheets",
    "Before / After loops",
    "Cute -> Corrupted reels",
    "Carousel posts",
    "Gallery drops",
    "World scenes",
    "Motion tests",
    "Digital packs",
    "Product mockups",
    "Client visuals",
    "Articles",
    "Lessons + courses",
  ],
};

// --- Section 6: Production Workflow ------------------------------------------

export const workflow = {
  eyebrow: "Production Workflow",
  heading: "How one idea becomes a reusable set",
  copy: "The goal is not one lucky image. The goal is a repeatable set that can become posts, a gallery page, a lesson, a service example, or a paid pack.",
  steps: [
    { title: "Concept", body: "Pick the character, object, room, or style idea." },
    { title: "Base sheet", body: "Lock the character, pose, face, palette, and key traits." },
    { title: "Style split", body: "Choose the contrast: era, mood, subculture, corrupted mode, or setting." },
    { title: "Variant set", body: "Make enough options to see what survives across formats." },
    { title: "Social edit", body: "Crop the strongest pieces for reels, covers, and carousels." },
    { title: "Gallery page", body: "Archive the finished work with useful metadata and notes." },
    { title: "Lesson note", body: "Turn the repeatable part into an article or course module." },
    { title: "Paid path", body: "Package the best set as services, downloads, products, or support perks." },
  ],
};

// --- Section 7: Grimoire -----------------------------------------------------

export const grimoireFlow = {
  eyebrow: "Grimoire",
  heading: "The memory behind the work",
  copy: "Grimoire connects images, notes, essays, prompts, motifs, tags, and reusable patterns so the work can be searched, studied, remixed, and expanded.",
  sources: ["Images", "Notes", "Prompts", "Essays", "Motifs"],
  stages: ["Ingest", "Atoms", "Tags + concepts"],
  // Internal key "reusable"; column label set in component ("Reusable pieces").
  reusable: [
    "Gallery entries",
    "Essays",
    "Prompts",
    "Style notes",
    "Workflow docs",
    "Course material",
    "Tool inputs",
  ],
  // Plain-language comparison (migrated from the old GrimoireNotMagic section).
  plain: {
    oldBook: "Ingredients, correspondences, recipes, procedures.",
    hobfarm:
      "Atoms, embeddings, schemas, retrieval, reinforcement, feedback loops.",
  },
};

// Core systems band (migrated from featuredSystems), shown in the Grimoire section.
export const coreSystems = [
  {
    title: "Grimoire",
    body: "The pattern layer under HobFarm: visual vocabulary, source references, motifs, relationships, style signals, and reusable creative structures.",
    href: "/grimoire/",
  },
  {
    title: "StyleFusion",
    body: "The image tool: extraction, structured intent, enrichment, provider-aware prompt building, generation, and validation.",
    href: "/workshop/stylefusion/",
  },
  {
    title: "Publishing",
    body: "Gallery metadata, marketplace listings, social posts, reusable pieces, and packaging.",
    href: "/workshop/",
  },
];

// --- Section 7: Field Notes / Academy ---------------------------------------

export const academy = {
  eyebrow: "Field Notes + Academy",
  heading: "The lessons come from the work",
  copy: "Field notes break down style systems, image experiments, avatar workflows, and publishing decisions. The academy layer will collect the repeatable parts into structured guides, templates, and working examples.",
  categories: [
    { label: "Style breakdowns", text: "How a look is built, trait by trait." },
    { label: "Workflow notes", text: "The steps behind a finished piece." },
    { label: "Case studies", text: "Real jobs, start to finish." },
    { label: "Templates", text: "Reusable starting points." },
    { label: "Course modules", text: "Structured lessons, in progress." },
    { label: "Tool + process guides", text: "How the tools fit together." },
  ],
  // Articles to feature (by content id). Falls back gracefully if absent.
  featuredPostIds: [
    "same-model-different-surface.md",
    "invisible-variable.md",
    "stylefusion-ir-extraction.md",
    "grimoire-knowledge-graph.md",
  ],
  // Notes in the queue (migrated from queuedPatternNotes).
  queuedNotes: [
    "The Soap Principle",
    "From Source Code to Soap",
    "Why AI Fortunes Work",
    "What It Costs to Build a Creative AI System",
  ],
};

// --- Section 8: Explore / Support / Follow ----------------------------------

export const exploreLinks: Array<{ label: string; href: string; note: string; soon?: boolean }> = [
  { label: "Galleries", href: "/gallery/", note: "Finished visuals" },
  { label: "Articles", href: "/articles/", note: "Features + process" },
  { label: "Grimoire", href: "/grimoire/", note: "The memory layer" },
  { label: "Academy", href: "/academy/", note: "Lessons, in progress", soon: true },
];

export const supportLinks: Cta[] = [
  { label: "Join the Lab", href: "/membership" },
  { label: "Premium galleries", href: "/gallery/" },
  { label: "Support HobFarm", href: "/support/" },
];

export const followLinks: Cta[] = [
  { label: "DeviantArt", href: "https://www.deviantart.com/hobfarm", external: true },
  { label: "YouTube", href: "https://www.youtube.com/@HobFarm", external: true },
  { label: "X", href: "https://x.com/hobdotfarm", external: true },
];

// --- Optional media slots (all null now; fill to activate) -------------------
// Convention: cdn.hob.farm/pages/home/story/<key>.webp (images),
//             cdn.hob.farm/pages/home/<key>.webm + <key>-poster.webp (motion).

export const storyImages: Record<string, ImageSlot> = {
  operatingMap: { src: null, alt: "HobFarm operating map: inputs, system, and finished work." },
  visualSystems: { src: null, alt: "PsyGoth and Technodelic style systems side by side." },
  applications: { src: null, alt: "One style system applied across many media formats." },
  workflow: { src: null, alt: "The HobFarm production workflow, start to finish." },
  grimoire: { src: null, alt: "Grimoire connecting images, notes, and reusable patterns." },
  academy: { src: null, alt: "Field notes and academy lessons drawn from the work." },
};

export const motionAssets: Record<string, MotionSlot> = {
  operatingMap: { poster: null, video: null },
  visualSystems: { poster: null, video: null },
  applications: { poster: null, video: null },
  workflow: { poster: null, video: null },
  grimoire: { poster: null, video: null },
  academy: { poster: null, video: null },
};

// Compact media-infographic panels for the homepage. These use existing CDN
// assets as thumbnails, with the explanation kept as real HTML text.
export const storyPanels: Record<string, StoryPanel> = {
  visualSystems: {
    label: "Style system board",
    title: "Style rules become reusable art direction",
    copy:
      "Finished images are useful, but the repeatable traits are the business asset: palette, silhouette, materials, subject rules, and variants.",
    accent: "magenta",
    images: [
      {
        src: "https://cdn.hob.farm/gallery/cute-corrupted/kareena-pink/kareena-poster.png",
        alt: "Kareena Cute / Corrupted poster with pastel fashion and punk collage versions.",
        label: "Cute / Corrupted",
      },
      {
        src: "https://cdn.hob.farm/gallery/compilation/compilation-v1-04.jpg",
        alt: "Liquid gothic figure in a red tree desert world.",
        label: "World variant",
      },
      {
        src: "https://cdn.hob.farm/blog/psychedelic-goth/psychedelic-goth.png",
        alt: "Psychedelic goth visual style reference.",
        label: "Style note",
      },
    ],
    callouts: [
      { label: "Lock", value: "face, palette, silhouette" },
      { label: "Flex", value: "wardrobe, setting, crop" },
      { label: "Use", value: "gallery, social, course" },
    ],
    flow: ["reference", "traits", "formula", "variants", "media"],
  },
  applications: {
    label: "Funnel map",
    title: "A strong set can feed the whole site",
    copy:
      "The homepage should send different visitors to the part they care about: visuals, process, courses, services, support, or shop paths.",
    accent: "cyan",
    images: [
      {
        src: "https://cdn.hob.farm/gallery/seed-to-world/s2w-v1-04.png",
        alt: "Neon glitch streetwear character in a night fountain scene.",
        label: "Gallery",
      },
      {
        src: getMedia("academy.banner.image").src,
        alt: "HobFarm courses banner image.",
        label: "Courses",
      },
      {
        src: getMedia("stylefusion.banner.image").src,
        alt: "StyleFusion project banner image.",
        label: "Services",
      },
    ],
    callouts: [
      { label: "Reach", value: "reels, posts, shares" },
      { label: "Trust", value: "process, notes, proof" },
      { label: "Money", value: "services, packs, support" },
    ],
    flow: ["character", "social", "gallery", "lesson", "offer"],
  },
  workflow: {
    label: "Set builder",
    title: "One concept becomes a content packet",
    copy:
      "The important shift is from single images to reusable sets: sheet, variants, motion proof, post crops, notes, and product directions.",
    accent: "green",
    images: [
      {
        src: "https://cdn.hob.farm/gallery/seed-to-world/s2w-v1-01.jpg",
        alt: "Seed image for a neon glitch streetwear character.",
        label: "Base",
      },
      {
        src: "https://cdn.hob.farm/gallery/seed-to-world/s2w-v1-03.png",
        alt: "Style pass for a neon glitch streetwear character.",
        label: "Style pass",
      },
      {
        src: "https://cdn.hob.farm/gallery/seed-to-world/s2w-v1-04.png",
        alt: "World pass for a neon glitch streetwear character.",
        label: "World pass",
      },
    ],
    callouts: [
      { label: "Packet", value: "sheet, stills, captions" },
      { label: "Archive", value: "gallery and notes" },
      { label: "Sell", value: "service proof or pack" },
    ],
    flow: ["base", "corrupt", "motion", "publish", "package"],
  },
  grimoire: {
    label: "Knowledge graph",
    title: "The archive keeps ideas findable",
    copy:
      "Grimoire connects images, motifs, tags, prompts, and notes so older experiments can return as new characters, lessons, or products.",
    accent: "blue",
    images: [
      {
        src: "https://cdn.hob.farm/blog/grimoire/grimoire-cross-pollination-hero.png",
        alt: "Grimoire cross-pollination hero image.",
        label: "Synthesis",
      },
      {
        src: "https://cdn.hob.farm/blog/grimoire/grimoire-post-01.png",
        alt: "Molten Kiltie Forge generated artifact.",
        label: "Artifact",
      },
      {
        src: "https://cdn.hob.farm/pages/blog/grimoire_knowledge.png",
        alt: "Visual knowledge graph article image.",
        label: "Index",
      },
    ],
    callouts: [
      { label: "Store", value: "images, notes, tags" },
      { label: "Connect", value: "motifs and references" },
      { label: "Reuse", value: "new sets and lessons" },
    ],
    flow: ["source", "atoms", "tags", "retrieval", "reuse"],
  },
  academy: {
    label: "Learning path",
    title: "The lessons come from finished work",
    copy:
      "Articles and courses should explain the method behind real HobFarm sets: character sheets, style construction, image experiments, and publishing decisions.",
    accent: "gold",
    images: [
      {
        src: "https://cdn.hob.farm/blog/web-vs-api/same-model-different-surface-hero.jpg",
        alt: "Same Model, Different Surface article hero image.",
        label: "Case study",
      },
      {
        src: "https://cdn.hob.farm/pages/blog/ir_extraction.png",
        alt: "StyleFusion image reading article hero image.",
        label: "Process",
      },
      {
        src: "https://cdn.hob.farm/blog/invisible-variable/header-invisible-variable-hobfarm.jpg",
        alt: "Invisible Variable article hero image.",
        label: "Research",
      },
    ],
    callouts: [
      { label: "Free", value: "articles and notes" },
      { label: "Paid", value: "courses and packs" },
      { label: "Proof", value: "real examples" },
    ],
    flow: ["make", "document", "teach", "sell", "repeat"],
  },
};
