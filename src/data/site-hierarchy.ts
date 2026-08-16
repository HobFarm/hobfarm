import { getMedia } from "@/data/media-registry";

export type HierarchyStatus = "active" | "planned" | "coming-eventually" | "historical";
export type HierarchyTheme =
  | "editorial"
  | "presents"
  | "film"
  | "magazine"
  | "alice"
  | "comics"
  | "broadcast"
  | "workshop"
  | "comparison"
  | "alter-ego"
  | "character-sheet"
  | "stylefusion"
  | "notes";

export type HierarchyEntry = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  href: string;
  parent?: "presents" | "workshop";
  /** Defaults to true. Set false to keep the entry out of navigation surfaces. */
  inNav?: boolean;
  /** Defaults to false. Set true to emit robots noindex on the entry route. */
  noindex?: boolean;
  /** Resolves this Workshop entry through the shared Process method renderer. */
  processSlug?: string;
  kind: "site-section" | "presents-series" | "workshop-program" | "article-category";
  status: HierarchyStatus;
  heroImage?: string;
  heroAlt?: string;
  logo?: string;
  theme: HierarchyTheme;
  order: number;
  ctaLabel: string;
  countNoun?: string;
  featuredQuery?: { department?: string; series?: string; format?: string; galleryType?: string };
};

export type WorkshopProgramEntry = HierarchyEntry & {
  startsWith: readonly string[];
  transformation: string;
  outputs: readonly string[];
  workflow: readonly string[];
  featuredExample: string;
  distinction?: string;
};

const hero = (filename: string) => `https://cdn.hob.farm/hero-images/${filename}`;

export const siteSections: HierarchyEntry[] = [
  { id: "articles", slug: "articles", name: "Articles", description: "HobFarm's main editorial body: essays, reporting, research, arguments, updates, process writing, and multimedia stories.", href: "/articles/", kind: "site-section", status: "active", heroImage: hero("essay-hero.png"), heroAlt: "HobFarm editorial artwork", theme: "editorial", order: 1, ctaLabel: "Read Articles", countNoun: "articles" },
  { id: "presents", slug: "hobfarm-presents", name: "HobFarm Presents", shortName: "Presents", description: "Recurring properties with their own identity, archive, characters, visual language, world, or release pattern.", href: "/presents/", kind: "site-section", status: "active", heroImage: getMedia("presents.graphics.avatar-system").src, heroAlt: getMedia("presents.graphics.avatar-system").alt, theme: "presents", order: 2, ctaLabel: "Enter Presents", countNoun: "series" },
  { id: "workshop", slug: "workshop", name: "Workshop", description: "Project development and production records: sources, methods, experiments, revisions, failures, decisions, and reusable findings.", href: "/workshop/", kind: "site-section", status: "active", heroImage: getMedia("workshop.graphics.landing").src, heroAlt: getMedia("workshop.graphics.landing").alt, theme: "workshop", order: 3, ctaLabel: "Open the Workshop", countNoun: "programs" },
  { id: "academy", slug: "academy", name: "Academy", description: "Lessons and courses built only after a real Workshop method becomes repeatable enough to teach.", href: "/academy/", kind: "site-section", status: "active", theme: "editorial", order: 4, ctaLabel: "Visit the Academy" },
  { id: "shop", slug: "shop", name: "Shop", description: "The product directory and direct-commerce surface, with verified routes to the correct HobFarm or marketplace shelf.", href: "/shop/", kind: "site-section", status: "active", theme: "editorial", order: 5, ctaLabel: "Browse the Shop" },
  { id: "about-support", slug: "about", name: "About & Support", description: "How HobFarm works, who makes it, how to contribute, and the practical ways to support the publication.", href: "/about/", kind: "site-section", status: "active", theme: "editorial", order: 6, ctaLabel: "About HobFarm" },
];

export const presentsSeries: HierarchyEntry[] = [
  // Nav order comes from array position, not the `order` field. Other Alice
  // leads because it is the flagship: a project rather than an article feed.
  { id: "other-alice", slug: "other-alice-adventures", name: "Other Alice Adventures", shortName: "Other Alice", description: "A persistent story game set in an authored Wonderland that remembers choices, relationships, time, and consequences.", href: "/presents/other-alice-adventures/", parent: "presents", kind: "presents-series", status: "active", heroImage: hero("other-alice-hero.png"), heroAlt: "Wonderland's liquid growth meeting the crystalline Wasteland", theme: "alice", order: 1, ctaLabel: "Enter the world" },
  { id: "3dm", slug: "3-degrees-of-dick-miller", name: "3 Degrees of Dick Miller", shortName: "3DM", description: "Film history through connected careers, productions, studios, and cultural artifacts, from silent cinema through the early digital era.", href: "/presents/3-degrees-of-dick-miller/", parent: "presents", kind: "presents-series", status: "active", logo: "https://cdn.hob.farm/3dm/3dm-logo.png", theme: "film", order: 2, ctaLabel: "Enter 3DM", featuredQuery: { department: "hobfarm-presents", series: "3dm" } },
  { id: "magazine-time-machine", slug: "magazine-time-machine", name: "Magazine Time Machine", description: "Old magazines, advertisements, dead futures, and cultural artifacts followed forward to see where they landed.", href: "/presents/magazine-time-machine/", parent: "presents", kind: "presents-series", status: "active", heroImage: getMedia("mtm.banner.image").src, heroAlt: getMedia("mtm.banner.image").alt, theme: "magazine", order: 3, ctaLabel: "Open the archive", featuredQuery: { department: "magazine-time-machine", series: "Magazine Time Machine" } },
  { id: "funnies", slug: "funnies", name: "Funnies", description: "Gary, Larry, Buffcock, Farm cartoons, and future strips held together by clean comic structure rather than one drawing style.", href: "/presents/funnies/", parent: "presents", kind: "presents-series", status: "active", heroImage: hero("funnies-hero.png"), heroAlt: "Characters and panels from HobFarm Funnies", theme: "comics", order: 4, ctaLabel: "Read the Funnies" },
  { id: "hobfarm-tv", slug: "hobfarm-tv", name: "HobFarm TV", description: "Video built from the articles in the other Presents sections: film essays, animated stories, cartoons, music, archive programs, and experimental television.", href: "/presents/hobfarm-tv/", parent: "presents", kind: "presents-series", status: "coming-eventually", heroImage: hero("hobfarm-tv-hero.png"), heroAlt: "A lost-broadcast HobFarm television ident", theme: "broadcast", order: 5, ctaLabel: "View the test pattern" },
];

export const primaryWorkshopPrograms: readonly WorkshopProgramEntry[] = [
  {
    id: "workshop-notes", slug: "workshop-notes", name: "Workshop Notes",
    description: "The production record behind HobFarm: sources, questions, decisions, tests, failures, revisions, reusable findings, and finished destinations.",
    href: "/workshop/workshop-notes/", parent: "workshop", kind: "workshop-program", status: "active",
    heroImage: getMedia("workshop.graphics.landing").src, heroAlt: getMedia("workshop.graphics.landing").alt,
    theme: "notes", order: 1, ctaLabel: "Read the notes", featuredQuery: { department: "workshop-notes" },
    startsWith: ["a real question", "source material", "a production problem"],
    transformation: "Keep the choices, tests, failures, and revisions attached to the work.",
    outputs: ["process note", "source record", "case study", "reusable finding"],
    workflow: ["Record the question", "Keep the source material", "Log the production decisions", "Show the tests and revisions", "Write the reusable finding", "Link the final destination"],
    featuredExample: "Current Workshop Notes archive",
  },
  {
    id: "character-mannequin", slug: "character-mannequin", name: "Character / Mannequin",
    description: "A mannequin is the stable form beneath later identities. A character adds face, persona, materials, wardrobe, behavior, visual language, and world.",
    href: "/workshop/character-mannequin/", parent: "workshop", kind: "workshop-program", status: "active",
    heroImage: getMedia("workshop.character-mannequin.workflow").src, heroAlt: getMedia("workshop.character-mannequin.workflow").alt,
    theme: "character-sheet", order: 2, ctaLabel: "Open the character system",
    startsWith: ["a person or animal", "a creature or cake", "a vehicle, prop, or object"],
    transformation: "Apply identity, materials, wardrobe, behavior, and a visual world to a stable form.",
    outputs: ["production board", "character sheet", "directed scene", "motion proof"],
    workflow: ["Define the stable form", "Record the identity locks", "Build the character system", "Direct the scene and camera", "Test continuity across outputs"],
    featuredExample: "Mannequin-to-character production board",
  },
  {
    id: "avatar-host", slug: "avatar-host", name: "Avatar & Host",
    description: "A stable identity gains a speaking role, voice, expression, motion, recurring looks, and a destination.",
    href: "/workshop/avatar-host/", parent: "workshop", kind: "workshop-program", status: "active",
    heroImage: getMedia("workshop.ami-legacy.hero").src, heroAlt: getMedia("workshop.ami-legacy.hero").alt,
    theme: "character-sheet", order: 3, ctaLabel: "Meet Ami and the host system",
    startsWith: ["a photograph", "an existing character", "a newly built mannequin"],
    transformation: "Add a role, voice, expression, motion direction, recurring looks, and a public job.",
    outputs: ["presenter clip", "campaign host", "series guide", "lesson or article introduction"],
    workflow: ["Lock the identity", "Define the speaking role", "Choose the voice and look", "Direct expression and motion", "Attach the clip to a destination"],
    featuredExample: "Ami presents Future Carriage",
  },
  {
    id: "before-after", slug: "before-and-after", name: "Before & After",
    description: "One source is compared across time, condition, repair, decay, restoration, or a possible history, with documentary and invented results clearly labeled.",
    href: "/workshop/before-and-after/", parent: "workshop", kind: "workshop-program", status: "active",
    heroImage: getMedia("before-after.shit-to-shine.after").src, heroAlt: getMedia("before-after.shit-to-shine.after").alt,
    theme: "comparison", order: 4, ctaLabel: "Compare the work", featuredQuery: { galleryType: "before-and-after" },
    startsWith: ["a source photograph", "a matched historical view", "a locked subject and camera"],
    transformation: "Change time or condition while preserving visible evidence and labeling invented material.",
    outputs: ["documentary pair", "speculative restoration", "alternate history", "transition film"],
    workflow: ["Verify the source", "Lock the subject and camera", "Label the mode", "Build the transformation", "Compare what survived", "Publish factual and invented context separately"],
    featuredExample: "Salton Sea and abandoned laundry comparisons",
  },
  {
    id: "alter-ego", slug: "alter-ego", name: "Alter Ego",
    description: "One mannequin produces two related personas that share an identity while role, posture, wardrobe, attitude, setting, and public function pull them apart.",
    href: "/workshop/alter-ego/", parent: "workshop", kind: "workshop-program", status: "active",
    heroImage: hero("alter-ego-hero.png"), heroAlt: "Two alternate versions of the same identity",
    theme: "alter-ego", order: 5, ctaLabel: "Meet both personas",
    startsWith: ["one mannequin", "shared identity locks", "two distinct roles or personas"],
    transformation: "Split one identity into related personas with different roles, posture, wardrobe, attitude, settings, and public jobs.",
    outputs: ["paired hero", "identity sheets", "poster", "host role or campaign"],
    workflow: ["Define the shared mannequin and identity locks", "Write two distinct personas", "Build related visual systems", "Test the pair together", "Produce hero, sheet, poster, or motion evidence", "Route each persona to a useful role"],
    featuredExample: "Sophia and Stella",
    distinction: "Alter Ego changes the persona the subject performs.",
  },
];

/**
 * Historical records keep their original route and internal id for backlinks,
 * taxonomy, and media compatibility. They do not appear as active programs.
 */
export const historicalWorkshopPrograms: readonly WorkshopProgramEntry[] = [
  {
    id: "cute-corrupted", slug: "cute-and-corrupted", name: "EZIZE Origins",
    description: "The paired Cute & Corrupted visual experiment that supplied EZIZE with its first persona and transformation grammar.",
    href: "/workshop/cute-and-corrupted/", parent: "workshop", inNav: false, kind: "workshop-program", status: "historical",
    heroImage: hero("cute-corrupted-hero.png"), heroAlt: "Cute and corrupted studies from the visual experiment that became EZIZE",
    theme: "comparison", order: 0, ctaLabel: "Read the origin record", featuredQuery: { galleryType: "cute-corrupted" },
    startsWith: ["one recognizable subject", "a shared silhouette", "a readable identity"],
    transformation: "The experiment changed tone and material condition while keeping the shared base legible.",
    outputs: ["paired stills", "character studies", "gross-out cards", "motion pairs"],
    workflow: ["Define the shared mannequin", "Establish the cute baseline", "Write the corruption rule", "Build paired stills or motion", "Check identity continuity", "Preserve the grammar for EZIZE"],
    featuredExample: "The Cake, Critter, and Character studies that preceded EZIZE",
    distinction: "Cute and corrupted are now descriptive modes inside EZIZE, not a separate current project.",
  },
];

export const workshopProgramDefinitions: readonly WorkshopProgramEntry[] = [
  ...primaryWorkshopPrograms,
  ...historicalWorkshopPrograms,
];

export const supportingWorkshopPrograms: readonly HierarchyEntry[] = [
  { id: "seed-to-world", slug: "seed-to-world", name: "Seed to World", description: "A baseline character becomes a small visual world: seed image, identity extraction, style pass, world translation, and motion proof.", href: "/workshop/seed-to-world/", parent: "workshop", inNav: false, noindex: false, processSlug: "seed-to-world", kind: "workshop-program", status: "active", heroImage: "https://cdn.hob.farm/gallery/seed-to-world/s2w-v1-04.png", heroAlt: "Seed character with pale grey features and multicolor neon hair", theme: "character-sheet", order: 7, ctaLabel: "Open Seed to World" },
  { id: "fashion-grammar", slug: "fashion-grammar", name: "Fashion Grammar", description: "Outfit logic, pose, accessories, material, and palette become a reusable character package.", href: "/workshop/fashion-grammar/", parent: "workshop", inNav: false, noindex: false, processSlug: "fashion", kind: "workshop-program", status: "active", heroImage: "https://cdn.hob.farm/pages/process/fashion/fashion-hero.png", heroAlt: "Starlet fashion grammar character package", theme: "workshop", order: 8, ctaLabel: "Open Fashion Grammar" },
  { id: "book-package", slug: "book-package", name: "Book Package", description: "A story signal becomes a cover, illustration system, motion teaser, and reusable visual world.", href: "/workshop/book-package/", parent: "workshop", inNav: false, noindex: false, processSlug: "book", kind: "workshop-program", status: "active", heroImage: "https://cdn.hob.farm/pages/process/book/book-hero.png", heroAlt: "The Star in the Skull book package", theme: "workshop", order: 9, ctaLabel: "Open the book package" },
  { id: "motion", slug: "motion", name: "Motion", description: "A single character prompt expands into animated clips, transition shots, and an editorial loop built for atmosphere, repetition, and replay.", href: "/workshop/motion/", parent: "workshop", inNav: false, noindex: false, processSlug: "motion", kind: "workshop-program", status: "active", heroImage: "https://cdn.hob.farm/pages/process/motion/motion-hero.png", heroAlt: "Hellcat motion hero artifact", theme: "workshop", order: 10, ctaLabel: "Open the motion pass" },
  { id: "stylefusion", slug: "stylefusion", name: "StyleFusion", description: "A separate reference-image application that assigns approved images to roles, runs specialized extraction agents, compiles an Intermediate Representation, and exports a model-ready generation document.", href: "/workshop/stylefusion/", parent: "workshop", inNav: false, noindex: false, kind: "workshop-program", status: "active", heroImage: getMedia("stylefusion.banner.image").src, heroAlt: getMedia("stylefusion.banner.image").alt, theme: "stylefusion", order: 11, ctaLabel: "Inspect the application", featuredQuery: { department: "workshop-notes", series: "StyleFusion" } },
];

export const workshopPrograms: readonly HierarchyEntry[] = [
  ...workshopProgramDefinitions,
  ...supportingWorkshopPrograms,
];

export const articleCategories: HierarchyEntry[] = [
  { id: "essays-arguments", slug: "essays-arguments", name: "Essays & Arguments", description: "Essays, arguments, criticism, manifestos, and research features in the Articles feed.", href: "/articles/essays-arguments/", kind: "article-category", status: "active", heroImage: hero("essay-hero.png"), heroAlt: "HobFarm essay artwork", theme: "editorial", order: 1, ctaLabel: "Read the category", featuredQuery: { department: "essays-arguments" } },
];

export const getWorkshopProgram = (slug: string) => workshopPrograms.find((entry) => entry.slug === slug);
export const getPresentsSeries = (slug: string) => presentsSeries.find((entry) => entry.slug === slug);
