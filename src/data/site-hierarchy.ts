import { getMedia } from "@/data/media-registry";

export type HierarchyStatus = "active" | "planned" | "coming-eventually";
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

const hero = (filename: string) => `https://cdn.hob.farm/hero-images/${filename}`;

export const siteSections: HierarchyEntry[] = [
  { id: "articles", slug: "articles", name: "Articles", description: "The complete chronological feed: essays, reporting, research, announcements, and process writing from across HobFarm.", href: "/articles/", kind: "site-section", status: "active", heroImage: hero("essay-hero.png"), heroAlt: "HobFarm editorial artwork", theme: "editorial", order: 1, ctaLabel: "Read Articles", countNoun: "articles" },
  { id: "presents", slug: "hobfarm-presents", name: "HobFarm Presents", shortName: "Presents", description: "The imprint for recurring stories, film history, cartoons, video, and named editorial worlds.", href: "/departments/hobfarm-presents/", kind: "site-section", status: "active", heroImage: getMedia("presents.graphics.avatar-system").src, heroAlt: getMedia("presents.graphics.avatar-system").alt, theme: "presents", order: 2, ctaLabel: "Enter Presents", countNoun: "series" },
  { id: "workshop", slug: "workshop", name: "Workshop", description: "The machinery beneath the magazine: experiments, methods, revisions, character systems, production notes, and finished tests.", href: "/workshop/", kind: "site-section", status: "active", heroImage: getMedia("workshop.graphics.landing").src, heroAlt: getMedia("workshop.graphics.landing").alt, theme: "workshop", order: 3, ctaLabel: "Open the Workshop", countNoun: "programs" },
  { id: "academy", slug: "academy", name: "Academy", description: "Repeatable methods, lessons, courses, templates, and structured learning paths built from working projects.", href: "/academy/", kind: "site-section", status: "active", theme: "editorial", order: 4, ctaLabel: "Visit the Academy" },
  { id: "shop", slug: "shop", name: "Shop", description: "A directory for digital packs, character releases, visual-world downloads, and one-off physical inventory across HobFarm storefronts.", href: "/shop/", kind: "site-section", status: "active", theme: "editorial", order: 5, ctaLabel: "Browse the Shop" },
  { id: "about-support", slug: "about", name: "About & Support", description: "How HobFarm works, who makes it, how to contribute, and the practical ways to support the publication.", href: "/about/", kind: "site-section", status: "active", theme: "editorial", order: 6, ctaLabel: "About HobFarm" },
];

export const presentsSeries: HierarchyEntry[] = [
  { id: "3dm", slug: "3-degrees-of-dick-miller", name: "3 Degrees of Dick Miller", shortName: "3DM", description: "Film history through connected careers, productions, studios, and cultural artifacts, from silent cinema through the early digital era.", href: "/departments/hobfarm-presents/3-degrees-of-dick-miller/", parent: "presents", kind: "presents-series", status: "active", logo: "https://cdn.hob.farm/3dm/3dm-logo.png", theme: "film", order: 1, ctaLabel: "Enter 3DM", featuredQuery: { department: "hobfarm-presents", series: "3dm" } },
  { id: "magazine-time-machine", slug: "magazine-time-machine", name: "Magazine Time Machine", description: "Old magazines, advertisements, dead futures, and cultural artifacts followed forward to see where they landed.", href: "/departments/magazine-time-machine/", parent: "presents", kind: "presents-series", status: "active", heroImage: getMedia("mtm.banner.image").src, heroAlt: getMedia("mtm.banner.image").alt, theme: "magazine", order: 2, ctaLabel: "Open the archive", featuredQuery: { department: "magazine-time-machine", series: "Magazine Time Machine" } },
  { id: "other-alice", slug: "other-alice-adventures", name: "Other Alice Adventures", shortName: "Other Alice", description: "An illustrated serial where wet, living Wonderland collides with the dry geometry of Wasteland.", href: "/departments/hobfarm-presents/other-alice-adventures/", parent: "presents", kind: "presents-series", status: "active", heroImage: hero("other-alice-hero.png"), heroAlt: "Wonderland's liquid growth meeting the crystalline Wasteland", theme: "alice", order: 3, ctaLabel: "Cross the boundary" },
  { id: "funnies", slug: "funnies", name: "Funnies", description: "Gary, Larry, Buffcock, Farm cartoons, and future strips held together by clean comic structure rather than one drawing style.", href: "/departments/funnies/", parent: "presents", kind: "presents-series", status: "active", heroImage: hero("funnies-hero.png"), heroAlt: "Characters and panels from HobFarm Funnies", theme: "comics", order: 4, ctaLabel: "Read the Funnies" },
  { id: "hobfarm-tv", slug: "hobfarm-tv", name: "HobFarm TV", description: "The eventual video side of HobFarm: film essays, animated stories, cartoons, music, archive programs, and experimental television.", href: "/projects/hobfarm-tv/", parent: "presents", kind: "presents-series", status: "coming-eventually", heroImage: hero("hobfarm-tv-hero.png"), heroAlt: "A lost-broadcast HobFarm television ident", theme: "broadcast", order: 5, ctaLabel: "View the test pattern" },
];

export const workshopPrograms: HierarchyEntry[] = [
  { id: "before-after", slug: "before-and-after", name: "Before & After", description: "Documentary comparisons, restorations, alternate histories, and character changes built around one recognizable subject.", href: "/workshop/before-and-after/", parent: "workshop", kind: "workshop-program", status: "active", heroImage: getMedia("before-after.shit-to-shine.after").src, heroAlt: getMedia("before-after.shit-to-shine.after").alt, theme: "comparison", order: 1, ctaLabel: "Compare the work", featuredQuery: { galleryType: "before-and-after" } },
  { id: "alter-ego", slug: "alter-ego", name: "Alter Ego", description: "Paired identities built around a public persona and its transformed, alternate, or private counterpart.", href: "/workshop/alter-ego/", parent: "workshop", kind: "workshop-program", status: "active", heroImage: hero("alter-ego-hero.png"), heroAlt: "Two alternate versions of the same identity", theme: "alter-ego", order: 2, ctaLabel: "Meet the other self" },
  { id: "cute-corrupted", slug: "cute-and-corrupted", name: "Cute & Corrupted", description: "The same subject in two controlled modes, with paired palettes, materials, character notes, cakes, images, and motion.", href: "/workshop/cute-and-corrupted/", parent: "workshop", kind: "workshop-program", status: "active", heroImage: hero("cute-corrupted-hero.png"), heroAlt: "Cute and corrupted versions of the same subject", theme: "comparison", order: 3, ctaLabel: "Enter both modes", featuredQuery: { galleryType: "cute-corrupted" } },
  { id: "character-mannequin", slug: "character-mannequin", name: "Character / Mannequin", description: "Numbered character systems, model sheets, turnarounds, wardrobe variants, presenter roles, camera tests, and continuity notes.", href: "/workshop/character-mannequin/", parent: "workshop", kind: "workshop-program", status: "active", heroImage: getMedia("workshop.graphics.hillary").src, heroAlt: getMedia("workshop.graphics.hillary").alt, theme: "character-sheet", order: 4, ctaLabel: "Open the character system" },
  { id: "stylefusion", slug: "stylefusion", name: "StyleFusion", description: "A separate reference-image application that assigns approved images to roles, runs specialized extraction agents, compiles an Intermediate Representation, and exports a model-ready generation document.", href: "/workshop/stylefusion/", parent: "workshop", kind: "workshop-program", status: "active", heroImage: getMedia("stylefusion.banner.image").src, heroAlt: getMedia("stylefusion.banner.image").alt, theme: "stylefusion", order: 5, ctaLabel: "Inspect the application", featuredQuery: { department: "workshop-notes", series: "StyleFusion" } },
  { id: "workshop-notes", slug: "workshop-notes", name: "Workshop Notes", description: "Readable process logs covering methods, tests, revisions, failures, tool choices, and build records.", href: "/workshop/workshop-notes/", parent: "workshop", kind: "workshop-program", status: "active", heroImage: getMedia("workshop.graphics.landing").src, heroAlt: getMedia("workshop.graphics.landing").alt, theme: "notes", order: 6, ctaLabel: "Read the notes", featuredQuery: { department: "workshop-notes" } },
];

export const articleCategories: HierarchyEntry[] = [
  { id: "essays-arguments", slug: "essays-arguments", name: "Essays & Arguments", description: "Essays, arguments, criticism, manifestos, and research features in the Articles feed.", href: "/departments/essays-arguments/", kind: "article-category", status: "active", heroImage: hero("essay-hero.png"), heroAlt: "HobFarm essay artwork", theme: "editorial", order: 1, ctaLabel: "Read the category", featuredQuery: { department: "essays-arguments" } },
];

export const getWorkshopProgram = (slug: string) => workshopPrograms.find((entry) => entry.slug === slug);
export const getPresentsSeries = (slug: string) => presentsSeries.find((entry) => entry.slug === slug);
