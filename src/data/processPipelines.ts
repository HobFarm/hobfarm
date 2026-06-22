export type ProcessPaletteColor = {
  name: string;
  hex?: string;
  swatchClass?: string;
};

export type ProcessStep = {
  label: string;
  title: string;
  description: string;
  media: string;
  alt: string;
};

export type RelatedGrimoireLink = {
  label: string;
  href: string;
  description: string;
};

export type ProcessSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ProcessSummaryBox = {
  label: string;
  body: string;
};

export type ProcessPipeline = {
  slug: string;
  identifier: string;
  eyebrow: string;
  title: string;
  shortDescription: string;
  pipeline: string;
  href: string;
  assetBase: string;
  media: {
    video: string;
    poster: string;
    hero: string;
    sheet?: string;
    artifact?: string;
    supportingStill?: string;
    og?: string;
  };
  heroPanel?: {
    artifactLabel?: string;
    artifactCaption?: string;
    artifactAlt?: string;
    summaryBox?: ProcessSummaryBox;
  };
  outputSummary: string[];
  progression?: ProcessSectionCopy;
  steps: ProcessStep[];
  editorialChain?: ProcessSectionCopy & {
    steps: string[];
  };
  loopReel?: ProcessSectionCopy;
  notes?: ProcessSectionCopy & {
    items: string[];
  };
  relatedGrimoire: RelatedGrimoireLink[];
  visualDna: {
    identity: string[];
    materials: string[];
    palette: ProcessPaletteColor[];
    styleAnchors: string[];
  };
  visualPanel?: ProcessSectionCopy & {
    relatedEyebrow?: string;
    relatedTitle?: string;
    relatedDescription?: string;
    imageCaption?: string;
    imageAlt?: string;
  };
  relatedGallerySlugs?: string[];
};

const PROCESS_ASSET_BASE = "https://cdn.hob.farm/pages/process";

export const processPipelines: ProcessPipeline[] = [
  {
    slug: "fashion",
    identifier: "fashion",
    eyebrow: "FASHION GRAMMAR",
    title: "Starlet",
    shortDescription:
      "Outfit logic, pose, accessories, material, and palette become a reusable character package.",
    pipeline: "Seed → outfit logic → character system → character sheet",
    href: "/process/fashion/",
    assetBase: `${PROCESS_ASSET_BASE}/fashion/`,
    media: {
      video: "fashion-video.mp4",
      poster: "fashion-poster.jpg",
      hero: "fashion-hero.png",
      sheet: "fashion-sheet.png",
      artifact: "fashion-sheet.png",
      og: "fashion-og.jpg",
    },
    heroPanel: {
      artifactLabel: "sheet",
      artifactCaption: "Starlet: character package sheet",
      artifactAlt: "Starlet character package sheet",
      summaryBox: {
        label: "Character package",
        body: "The sheet carries silhouette, outfit logic, material cues, pose language, palette, and reusable visual DNA.",
      },
    },
    outputSummary: [
      "Source-informed fashion grammar",
      "Reusable visual DNA",
      "Character package with character sheet",
    ],
    progression: {
      eyebrow: "Progression",
      title: "Signal to Package",
      description:
        "The fashion signal moves through outfit logic, identity stabilization, presentation, and a final character sheet.",
    },
    relatedGallerySlugs: ["fashion/glamour-pin-up"],
    relatedGrimoire: [
      {
        label: "Character package",
        href: "/grimoire/from-generic-to-character/",
        description: "How a loose figure becomes a stable, reusable character identity.",
      },
      {
        label: "Visual atoms",
        href: "/grimoire/understanding-visual-atoms/",
        description: "The palette, materials, lighting, and composition units behind the package.",
      },
      {
        label: "Prompt compilation",
        href: "/grimoire/stylefusion-prompt-compilation/",
        description: "How structured visual DNA becomes provider-ready instructions.",
      },
    ],
    steps: [
      {
        label: "01",
        title: "First signal",
        description:
          "A fashion signal becomes silhouette, pose, stage attitude, and accessory direction.",
        media: "fashion-v1.jpg",
        alt: "First Starlet fashion reference",
      },
      {
        label: "02",
        title: "Outfit logic",
        description:
          "Material cues tighten around lace, leather, gold hardware, and platform footwear.",
        media: "fashion-v2.png",
        alt: "Starlet outfit logic variant",
      },
      {
        label: "03",
        title: "Character lock",
        description:
          "The figure stabilizes into a reusable identity with repeatable styling decisions.",
        media: "fashion-v3.png",
        alt: "Starlet character identity variant",
      },
      {
        label: "04",
        title: "Presentation pass",
        description:
          "The fashion grammar moves from isolated result into a polished media surface.",
        media: "fashion-v4.jpg",
        alt: "Starlet presentation pass",
      },
      {
        label: "05",
        title: "Character package",
        description:
          "The sheet packages silhouette, materials, palette, pose language, and visual DNA.",
        media: "fashion-sheet.png",
        alt: "Starlet final character package sheet",
      },
    ],
    visualDna: {
      identity: [
        "warm tan skin",
        "voluminous light brown updo",
        "hot pink lace dress",
        "black cropped leather jacket",
        "gold chain belt",
        "black platform boots",
      ],
      materials: [
        "glossy leather",
        "delicate lace",
        "matte fur trim",
        "gold jewelry",
        "reflective stage floor",
      ],
      palette: [
        { name: "deep purple", hex: "#6C5CE7", swatchClass: "bg-spot-purple" },
        { name: "hot pink", hex: "#C51077", swatchClass: "bg-spot-magenta" },
        { name: "rich black", hex: "#2F2F2F", swatchClass: "bg-base-700" },
        { name: "warm beige", hex: "#F5F5DC", swatchClass: "bg-base-100" },
        { name: "gold", hex: "#FFD700", swatchClass: "bg-accent-gold" },
      ],
      styleAnchors: [
        "glamour pin-up",
        "airbrushed illustration",
        "neo-glamour",
        "polished digital render",
      ],
    },
  },
  {
    slug: "motion",
    identifier: "motion",
    eyebrow: "MOTION PASS",
    title: "Hellcat",
    shortDescription:
      "A single character prompt expands into a motion reel. Four generated stills become animated clips, transition shots, and an editorial loop built for atmosphere, repetition, and replay.",
    pipeline: "Seed → 4 stills → motion clips → transitions → edit loop",
    href: "/process/motion/",
    assetBase: `${PROCESS_ASSET_BASE}/motion/`,
    media: {
      video: "motion-video.mp4",
      poster: "motion-video-poster.jpg",
      hero: "motion-hero.png",
      artifact: "motion-poster.png",
      supportingStill: "motion-hero.png",
    },
    heroPanel: {
      artifactLabel: "poster",
      artifactCaption: "Hellcat: motion poster artifact",
      artifactAlt: "Hellcat motion poster artifact",
      summaryBox: {
        label: "Loop assembly",
        body: "The reel begins as four still variations. Each becomes a motion clip. First and last frames are exported to build bridging transitions, then everything returns to the edit timeline for pacing, timing, ambient industrial sound, and impact effects.",
      },
    },
    outputSummary: [
      "Four source stills with shared character DNA",
      "Each still expanded into a motion clip",
      "Bridge transitions built from exported start and end frames",
      "One-minute loop assembled with pacing, nat sound, and explosion accents",
    ],
    progression: {
      eyebrow: "Source variations",
      title: "Four Stills to Motion",
      description:
        "The reel starts with four source stills that share character continuity, industrial atmosphere, and enough variation to create movement.",
    },
    relatedGallerySlugs: ["video-workflow/higgsfield-transition-test"],
    relatedGrimoire: [
      {
        label: "Character continuity",
        href: "/grimoire/from-generic-to-character/",
        description: "How repeated anchors keep an identity recognizable across generated passes.",
      },
      {
        label: "Visual atoms",
        href: "/grimoire/understanding-visual-atoms/",
        description: "The materials, lighting, palette, and atmosphere carried through the reel.",
      },
      {
        label: "Prompt compilation",
        href: "/grimoire/stylefusion-prompt-compilation/",
        description: "How structured visual DNA becomes production-ready instructions.",
      },
    ],
    steps: [
      {
        label: "01",
        title: "Source still 01",
        description:
          "The first still locks the character, industrial setting, firelight, and neon-eye identity.",
        media: "motion-v1.png",
        alt: "Hellcat first source still",
      },
      {
        label: "02",
        title: "Source still 02",
        description:
          "A second pass shifts pose and staging while keeping the same outfit, ears, tattoos, and refinery language.",
        media: "motion-v2.png",
        alt: "Hellcat second source still",
      },
      {
        label: "03",
        title: "Source still 03",
        description:
          "The third still adds more environmental pressure: smoke, metal depth, and ember-lit contrast.",
        media: "motion-v3.jpg",
        alt: "Hellcat third source still",
      },
      {
        label: "04",
        title: "Source still 04",
        description:
          "The fourth still gives the edit another angle to turn into motion clips and transition endpoints.",
        media: "motion-v4.png",
        alt: "Hellcat fourth source still",
      },
    ],
    editorialChain: {
      eyebrow: "Editorial chain",
      title: "Stills, Clips, Transitions, Loop",
      description:
        "The finished reel is not a single generation. It is a motion pass assembled from stills, clip endpoints, transition clips, timing, nat sound, and impact effects.",
      steps: [
        "One prompt produced four still images",
        "Each still became a motion clip",
        "First and last frames from those clips were exported",
        "Those frames were used in Higgsfield to generate transitions",
        "Transition clips were returned to Premiere",
        "Clip rates were adjusted for pacing",
        "Nat sound was used to fill gaps",
        "Explosion sound effects were added",
        "The result became a one-minute loop",
      ],
    },
    loopReel: {
      eyebrow: "Loop reel",
      title: "Final Motion Artifact",
      description:
        "The one-minute loop keeps the character in circulation: source stills, transition shots, atmosphere, timing, and impact effects folded into a finished reel.",
    },
    notes: {
      eyebrow: "Motion notes",
      title: "What Holds Together",
      description:
        "The motion pass depends on continuity decisions more than one spectacular frame.",
      items: [
        "Repeated character identity across clips",
        "Transition continuity built from frame-matched endpoints",
        "Editorial pacing rather than single-pass generation",
        "Ambient industrial sound and impact accents",
      ],
    },
    visualDna: {
      identity: [
        "long pointed elf ears",
        "cool grey skin",
        "neon green eyes",
        "glossy black high ponytail",
        "red and grey body tattoos",
        "black rune-marked bodysuit",
      ],
      materials: [
        "glossy synthetic leather",
        "rusted metal catwalks",
        "smoke and steam haze",
        "ember-lit industrial steel",
        "matte grey skin",
        "red-orange practical glow",
      ],
      palette: [
        { name: "deep indigo", hex: "#1A1D23" },
        { name: "warm rust", hex: "#FFC080" },
        { name: "neon green", hex: "#8CFF3B" },
        { name: "vibrant red", hex: "#FF3737" },
        { name: "charcoal black", hex: "#05070A" },
      ],
      styleAnchors: [
        "neo-noir anime",
        "industrial cyberpunk",
        "dark fantasy illustration",
        "manga-influenced digital painting",
        "cinematic concept art",
      ],
    },
    visualPanel: {
      eyebrow: "Visual DNA + Grimoire",
      title: "Character Continuity Under Motion",
      description:
        "The motion pass carries identity anchors, material cues, palette pressure, style anchors, and public Grimoire notes through every generated clip.",
      relatedEyebrow: "Motion-informed grammar",
      relatedTitle: "Related Grimoire",
      relatedDescription:
        "These notes explain the public parts of the process: character continuity, visual atoms, and prompt compilation.",
      imageCaption: "Hellcat: source-informed motion hero artifact",
      imageAlt: "Hellcat motion hero artifact",
    },
  },
  {
    slug: "book",
    identifier: "book",
    eyebrow: "BOOK PACKAGE",
    title: "The Star in the Skull",
    shortDescription:
      "A story signal becomes a cover, illustration system, motion teaser, and reusable visual world.",
    pipeline: "Story seed → cover → illustration system → motion trailer",
    href: "/process/book/",
    assetBase: `${PROCESS_ASSET_BASE}/book/`,
    media: {
      video: "book-video.mp4",
      poster: "book-hero.png",
      hero: "book-hero.png",
      artifact: "book-cover.png",
      supportingStill: "book-hero.png",
    },
    heroPanel: {
      artifactLabel: "cover",
      artifactCaption: "The Star in the Skull: cover system artifact",
      artifactAlt: "The Star in the Skull book cover artifact",
      summaryBox: {
        label: "Narrative package",
        body: "The cover is not the endpoint. It is the visual lock for a story world: title treatment, character presence, mood, palette, illustration style, and promotional motion all branch from the same story signal.",
      },
    },
    outputSummary: [
      "Cover-ready vertical artwork",
      "Dark fantasy engraving style",
      "Reusable character and scene DNA",
      "Interior illustration direction",
      "Short motion teaser for promotion",
    ],
    progression: {
      eyebrow: "Story world",
      title: "Cover System and Illustration Studies",
      description:
        "The story signal branches into cover art, supporting visual-world studies, interior illustration direction, and a publishing face for the package.",
    },
    relatedGrimoire: [
      {
        label: "Visual atoms",
        href: "/grimoire/understanding-visual-atoms/",
        description: "The reusable palette, materials, lighting, and texture units behind the story world.",
      },
      {
        label: "Character package",
        href: "/grimoire/from-generic-to-character/",
        description: "How repeated anchors keep a subject stable across cover, plates, and promo motion.",
      },
      {
        label: "Prompt compilation",
        href: "/grimoire/stylefusion-prompt-compilation/",
        description: "How structured illustration DNA becomes provider-ready production instructions.",
      },
    ],
    steps: [
      {
        label: "01",
        title: "Story signal",
        description:
          "A black-and-white cat, skull monument, star light, and rocky landscape define the first visual world pass.",
        media: "book-v1.jpg",
        alt: "The Star in the Skull first story-world study",
      },
      {
        label: "02",
        title: "Illustration direction",
        description:
          "Engraving texture, selective color, and dark fantasy atmosphere sharpen into a reusable image language.",
        media: "book-v2.png",
        alt: "The Star in the Skull illustration direction study",
      },
      {
        label: "03",
        title: "Interior plate logic",
        description:
          "The world expands toward chapter plate material: stark composition, mythic scale, and ink-heavy terrain.",
        media: "book-v3.png",
        alt: "The Star in the Skull interior illustration study",
      },
      {
        label: "04",
        title: "Promo world pass",
        description:
          "The same illustration DNA becomes writer-facing concept material for teasers, excerpts, and social promos.",
        media: "book-v4.png",
        alt: "The Star in the Skull promotional world study",
      },
      {
        label: "05",
        title: "Cover system",
        description:
          "The publishing face locks title treatment, central character, palette pressure, and macabre story promise.",
        media: "book-cover.png",
        alt: "The Star in the Skull final book cover system",
      },
    ],
    notes: {
      eyebrow: "Publishing uses",
      title: "Where the Package Goes",
      description:
        "The same illustration DNA can support a writing project beyond one cover image.",
      items: [
        "Cover art for a finished story package",
        "Chapter plates and interior illustration direction",
        "Promo motion for trailers and social posts",
        "KDP, zines, RPG/worldbuilding, and Patreon fiction",
      ],
    },
    visualDna: {
      identity: [
        "black-and-white tuxedo cat",
        "bright blue eyes",
        "vivid red inner ears",
        "thick white neck ruff",
        "colossal skull monument",
        "star-like light source",
      ],
      materials: [
        "matte paper",
        "ink hatching",
        "dense crosshatching",
        "stippling",
        "bone texture",
        "rocky terrain",
      ],
      palette: [
        { name: "black", hex: "#000000" },
        { name: "white", hex: "#FFFFFF" },
        { name: "electric blue", hex: "#03A9F4" },
        { name: "red", hex: "#FF3737" },
        { name: "bone grey", hex: "#CCCCCC" },
      ],
      styleAnchors: [
        "dark fantasy illustration",
        "vintage engraving revival",
        "macabre surrealism",
        "pen-and-ink crosshatching",
        "selective color accentuation",
      ],
    },
    visualPanel: {
      eyebrow: "Illustration DNA + Grimoire",
      title: "Reusable Story World Logic",
      description:
        "The book package is built from recurring identity anchors, material cues, palette pressure, and illustration rules that can travel from cover to chapter plate to promo motion.",
      relatedEyebrow: "Story-informed grammar",
      relatedTitle: "Related Grimoire",
      relatedDescription:
        "These notes explain the public parts of the process: visual atoms, character stability, and prompt compilation.",
      imageCaption: "The Star in the Skull: hero still and video poster",
      imageAlt: "The Star in the Skull hero still",
    },
  },
  {
    slug: "seed-to-world",
    identifier: "seed-to-world",
    eyebrow: "CHARACTER LOOP",
    title: "Seed to World",
    shortDescription:
      "A baseline character becomes a small visual world: seed image, identity extraction, style pass, world translation, and motion proof.",
    pipeline: "Seed → identity → style → world → motion",
    href: "/process/seed-to-world/",
    assetBase: "https://cdn.hob.farm/gallery/seed-to-world/",
    media: {
      video: "s2w-v1-05.mp4",
      poster: "s2w-v1-04.png",
      hero: "s2w-v1-04.png",
      artifact: "s2w-v1-01.jpg",
      supportingStill: "s2w-v1-04.png",
      og: "s2w-v1-04.png",
    },
    heroPanel: {
      artifactLabel: "seed",
      artifactCaption: "Neon Glitch Streetwear: seed character",
      artifactAlt: "Seed character: pale grey figure with multicolor neon hair",
      summaryBox: {
        label: "Character loop",
        body:
          "One character seed becomes a stable identity, an alt-fashion variant, a world-aware scene, and a motion proof. A small visual world from a single baseline.",
      },
    },
    outputSummary: [
      "Stable character identity from a single seed",
      "Style and world variants with locked anchors",
      "Motion proof for gallery, social, and homepage",
    ],
    progression: {
      eyebrow: "Progression",
      title: "Seed to World",
      description:
        "Seed to World is a compact character-development loop. A baseline image establishes the visual identity. Structured extraction locks the useful anchors. A style pass changes the outfit and surface language. A world pass moves the character into a scene. The final video turns the set into motion.",
    },
    relatedGallerySlugs: ["character-dev/seed-to-world-v1-neon-glitch-streetwear"],
    relatedGrimoire: [
      {
        label: "Character package",
        href: "/grimoire/from-generic-to-character/",
        description: "How a loose figure becomes a stable, reusable character identity.",
      },
      {
        label: "Visual atoms",
        href: "/grimoire/understanding-visual-atoms/",
        description: "The palette, materials, lighting, and composition units behind the package.",
      },
    ],
    steps: [
      {
        label: "01",
        title: "Seed Image",
        description:
          "The starting character establishes silhouette, palette, attitude, and surface effects.",
        media: "s2w-v1-01.jpg",
        alt: "Seed image: pale grey neon-glitch character in a white room",
      },
      {
        label: "02",
        title: "Identity Extraction",
        description:
          "The strongest anchors are translated into structured visual data.",
        media: "s2w-v1-02.png",
        alt: "Identity extraction variant",
      },
      {
        label: "03",
        title: "Style Pass",
        description:
          "The character is rerun with a stronger outfit and design language.",
        media: "s2w-v1-03.png",
        alt: "Style pass variant: stronger outfit grammar",
      },
      {
        label: "04",
        title: "World Pass",
        description:
          "The same identity moves into an illustrated scene with a new mood and environment.",
        media: "s2w-v1-04.png",
        alt: "World pass: night fountain streetwear scene",
      },
      {
        label: "05",
        title: "Motion Proof",
        description:
          "The finished set becomes usable motion material for homepage, social, and gallery promotion.",
        media: "s2w-v1-04.png",
        alt: "Motion proof poster: the video lives in the hero",
      },
    ],
    visualDna: {
      identity: [
        "pale grey skin",
        "multicolored neon hair",
        "black eyeliner",
        "guarded expression",
      ],
      materials: ["fishnet", "denim", "graphic print", "chains", "synthetic neon"],
      palette: [
        { name: "Pale grey", hex: "#d8d8de" },
        { name: "Neon magenta", hex: "#ff2bd6" },
        { name: "Cyan", hex: "#22d3ee" },
        { name: "Acid green", hex: "#a3e635" },
        { name: "Pink", hex: "#f472b6" },
        { name: "Black", hex: "#0a0a0a" },
      ],
      styleAnchors: [
        "glitch art",
        "cyberpunk",
        "streetwear",
        "pulp comic",
        "night park",
      ],
    },
    visualPanel: {
      eyebrow: "Visual DNA + Grimoire",
      title: "Identity Anchors Under Translation",
      description:
        "The loop carries the same identity through seed, extraction, wardrobe grammar, world placement, and motion without it becoming a different character.",
      relatedEyebrow: "Knowledge graph",
      relatedTitle: "Related Grimoire",
      relatedDescription:
        "These notes explain the public parts of the method: character stability, visual atoms, and reusable prompt structure.",
      imageCaption: "Neon Glitch Streetwear: world pass artifact",
      imageAlt: "Night-fountain streetwear world pass",
    },
  },
];

export function getProcessAssetUrl(pipeline: ProcessPipeline, filename: string): string {
  return `${pipeline.assetBase}${filename}`;
}

export function getProcessVideoType(filename: string): string {
  return filename.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4";
}

export function getProcessPipelineBySlug(slug: string): ProcessPipeline | undefined {
  return processPipelines.find((pipeline) => pipeline.slug === slug);
}
