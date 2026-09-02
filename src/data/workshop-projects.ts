import { getMedia, type MediaRecord } from "@/data/media-registry";

export type WorkshopProjectStatus =
  | "Published case study"
  | "Active program"
  | "Working application"
  | "Public application study"
  | "Published world record"
  | "Private alpha case study"
  | "Project origin";

export type WorkshopProject = {
  id: string;
  title: string;
  projectType: string;
  brief: string;
  promise: string;
  startingMaterial: string;
  productionProblem: string;
  stages: readonly string[];
  possibleOutputs: readonly string[];
  capabilities: readonly string[];
  media: MediaRecord;
  secondaryMedia?: MediaRecord;
  approvedAssets: readonly MediaRecord[];
  destination: string;
  status: WorkshopProjectStatus;
  featuredPosition: number;
  homepagePosition?: number;
  sourceLabel?: string;
  resultLabel?: string;
  visualVariant:
    | "evidence-grid"
    | "production-rail"
    | "reference-compiler"
    | "world-atlas"
    | "source-to-campaign";
};

const otherAliceAtlas: MediaRecord = {
  src: getMedia("other-alice.wonderland.world-map").src,
  mediaType: "image",
  width: 1448,
  height: 1086,
  destination: "/presents/other-alice-adventures/world-guide/",
  role: "world-atlas",
  alt: getMedia("other-alice.wonderland.world-map").alt,
  status: "active",
};

const otherAliceCharacter: MediaRecord = {
  src: "/media/other-alice/other-alice-character-sheet.webp",
  mediaType: "image",
  width: 1400,
  height: 1050,
  destination: "/presents/other-alice-adventures/cast/",
  role: "character-continuity",
  alt: "Other Alice character sheet showing the adult character's locked visual identity",
  status: "active",
};

const otherAliceMap: MediaRecord = {
  src: "/media/other-alice/other-alice-living-map-hero.webp",
  mediaType: "image",
  width: 1536,
  height: 1024,
  destination: "/presents/other-alice-adventures/world-guide/",
  role: "world-map",
  alt: "Other Alice living-world map with routes and regions",
  status: "active",
};

const futureCarriageAssets = [
  getMedia("workshop.ami-legacy.history.gig-3917"),
  getMedia("workshop.ami-legacy.model-3917.vehicle"),
  getMedia("workshop.ami-legacy.autonomous-coach"),
  getMedia("workshop.ami-legacy.hero"),
] as const;

const beforeAfterAssets = [
  getMedia("before-after.north-shore.before"),
  getMedia("before-after.north-shore.after"),
  getMedia("before-after.salton-city.before"),
  getMedia("before-after.salton-city.after"),
] as const;

const styleFusionAssets = [
  getMedia("stylefusion.current.psychedelic.hero"),
  getMedia("stylefusion.current.psychedelic.variant-a"),
  getMedia("stylefusion.current.flame"),
  getMedia("stylefusion.current.fire-dancer"),
] as const;

const characterAssets = [
  getMedia("workshop.character-mannequin.workflow"),
  getMedia("workshop.process.zima.wardrobe-board"),
  getMedia("workshop.process.zima.visual-language"),
  getMedia("workshop.process.zima.vertical-poster"),
] as const;

const otherAliceAssets = [
  otherAliceAtlas,
  otherAliceCharacter,
  otherAliceMap,
] as const;

const hobFarmAssets = [
  getMedia("workshop.hobfarm-project.hero"),
] as const;

const cuteCorruptedAssets = [
  getMedia("workshop.program-index.cute-corrupted"),
] as const;

const avatarHostAssets = [
  getMedia("workshop.ami-legacy.hero"),
  getMedia("avatar.identity.ami"),
] as const;

const ezizeAssets = [
  getMedia("ezize.app.private-alpha"),
  getMedia("ezize.output.corrupted-cake"),
] as const;

export const selectedWorkshopProjects: readonly WorkshopProject[] = [
  {
    id: "ezize",
    title: "EZIZE",
    projectType: "Collectible image probability machine",
    brief:
      "Cute & Corrupted, Grimoire, and Wildcard Machine became one public application that resolves weighted generation paths, calculates their theoretical probability, renders a finished image, and keeps the EZ ID and receipt connected.",
    promise:
      "Turn an authored visual grammar into repeatable surprise without giving the image model control over the underlying collectible recipe.",
    startingMaterial: "a paired visual concept, authored taxonomies, and a deterministic weighted runtime",
    productionProblem:
      "Keep persona, form, traits, probability, image direction, and the generation record connected from the first pull through the rendered file.",
    stages: ["concept grammar", "Grimoire packs", "deterministic pull", "image specification", "render and record"],
    possibleOutputs: ["generated image", "downloadable PNG", "generation record", "process documentation", "selected external releases"],
    capabilities: ["product development", "structured generation", "application design", "provenance"],
    media: ezizeAssets[1],
    secondaryMedia: ezizeAssets[0],
    approvedAssets: ezizeAssets,
    destination: "/ezize/",
    status: "Public application study",
    featuredPosition: 1,
    sourceLabel: "Working application",
    resultLabel: "Rendered EZ",
    visualVariant: "evidence-grid",
  },
  {
    id: "hobfarm-site",
    title: "HobFarm",
    projectType: "Web, publishing, and operations",
    brief:
      "The publication itself is a working case study in content architecture, front-end development, repository context, deployment, release, and revision.",
    promise:
      "Keep editorial, media, commerce, learning, and interactive work legible inside one maintainable publishing system.",
    startingMaterial: "published work, operating rules, content models, and a live Astro codebase",
    productionProblem:
      "Let different kinds of work keep their own identity while sharing navigation, metadata, deployment, quality checks, and a durable public home.",
    stages: ["project context", "repository context", "implementation", "validation", "Cloudflare release", "observation and revision"],
    possibleOutputs: ["public routes", "content collections", "interactive applications", "release records", "deployment"],
    capabilities: ["Astro", "content architecture", "AI-assisted coding", "Cloudflare"],
    media: hobFarmAssets[0],
    approvedAssets: hobFarmAssets,
    destination: "/workshop/projects/hobfarm/",
    status: "Active program",
    featuredPosition: 2,
    homepagePosition: 1,
    visualVariant: "source-to-campaign",
  },
  {
    id: "future-carriage",
    title: "Future Carriage",
    projectType: "Concept campaign / product visualization",
    brief:
      "Historical carriage drawings set the constraints for electric, robotic, and autonomous vehicle studies.",
    promise:
      "Carry the useful logic of a historical object into a complete modern product and campaign system.",
    startingMaterial: "19th-century carriage drawings and operating details",
    productionProblem:
      "Preserve the recognizable carriage logic while developing a legible future vehicle family and honest concept campaign.",
    stages: ["source plate", "design constraints", "product family", "presenter direction", "campaign formats"],
    possibleOutputs: ["product plate", "campaign poster", "social cut", "landscape film", "case-study page"],
    capabilities: ["historical research", "product plates", "campaign direction", "motion planning"],
    media: futureCarriageAssets[1],
    secondaryMedia: futureCarriageAssets[0],
    approvedAssets: futureCarriageAssets,
    destination: "/workshop/future-carriage/",
    status: "Published case study",
    featuredPosition: 5,
    homepagePosition: 4,
    sourceLabel: "Historical source",
    resultLabel: "Product study",
    visualVariant: "source-to-campaign",
  },
  {
    id: "before-after",
    title: "Before & After",
    projectType: "Photography and alternate history",
    brief:
      "Source photographs become documentary comparisons, restorations, locked-camera transformations, and clearly labeled alternate futures.",
    promise:
      "One recognizable subject can show time, damage, repair, development, or a possible history.",
    startingMaterial: "a source photograph or matched historical view",
    productionProblem:
      "Show a real comparison, a repair, or an invented future without allowing documentary and speculative evidence to blur together.",
    stages: ["source check", "camera and subject lock", "mode label", "transformation", "comparison record"],
    possibleOutputs: ["documentary pair", "restoration", "alternate future", "character change", "motion loop"],
    capabilities: ["source analysis", "restoration", "compositing", "motion"],
    media: getMedia("before-after.shit-to-shine.after"),
    secondaryMedia: getMedia("before-after.shit-to-shine.source"),
    approvedAssets: beforeAfterAssets,
    destination: "/workshop/before-and-after/",
    status: "Active program",
    featuredPosition: 4,
    homepagePosition: 3,
    sourceLabel: "Source photograph",
    resultLabel: "Speculative restoration",
    visualVariant: "evidence-grid",
  },
  {
    id: "stylefusion",
    title: "StyleFusion",
    projectType: "Reference-analysis application",
    brief:
      "Each reference gets a simple job. StyleFusion turns those assignments into a reusable modular pack, exact positive prose, and generation history.",
    promise:
      "Give every reference one job and turn the useful visual decisions into a portable pack.",
    startingMaterial: "one to six reference images assigned to Subject, Style, or Composition",
    productionProblem:
      "Separate subject, pose, style, environment, and shot decisions so a reference pile becomes coherent positive direction.",
    stages: ["assign roles", "build pack", "inspect prompt", "choose model", "generate", "download pack"],
    possibleOutputs: ["portable visual pack", "exact generation prompt", "hero image", "poster", "motion study"],
    capabilities: ["reference roles", "modular packs", "positive prompt translation", "same-pack model comparison"],
    media: getMedia("stylefusion.current.psychedelic.hero"),
    secondaryMedia: getMedia("stylefusion.current.psychedelic.variant-a"),
    approvedAssets: styleFusionAssets,
    destination: "/workshop/stylefusion/",
    status: "Working application",
    featuredPosition: 3,
    homepagePosition: 2,
    sourceLabel: "Role-assigned references",
    resultLabel: "Directed output",
    visualVariant: "reference-compiler",
  },
  {
    id: "character-mannequin",
    title: "Character / Mannequin",
    projectType: "Character production",
    brief:
      "A neutral identity sheet anchors wardrobe, expression, camera, scene, and presenter work across later appearances.",
    promise:
      "Lock the identity, then change wardrobe, scene, camera, and performance without losing the person.",
    startingMaterial: "a portrait, written brief, or approved identity seed",
    productionProblem:
      "Create enough neutral continuity evidence that later wardrobe, scene, camera, avatar, and motion work still reads as the same character.",
    stages: ["brief or portrait", "neutral sheet", "wardrobe and materials", "directed scene", "avatar or motion"],
    possibleOutputs: ["reference sheet", "wardrobe board", "hero scene", "presenter frame", "motion proof"],
    capabilities: ["identity locks", "character sheets", "continuity", "motion"],
    media: getMedia("workshop.character-mannequin.workflow"),
    secondaryMedia: getMedia("workshop.process.zima.mannequin"),
    approvedAssets: characterAssets,
    destination: "/workshop/character-mannequin/",
    status: "Active program",
    featuredPosition: 9,
    sourceLabel: "Identity sheet",
    resultLabel: "Directed character",
    visualVariant: "production-rail",
  },
  {
    id: "other-alice-world",
    title: "Other Alice: Living Wonderland",
    projectType: "Worldbuilding and interactive publishing",
    brief:
      "An authored story world becomes an atlas, cast, route logic, interfaces, and persistent interactive visits without losing its canon boundary.",
    promise:
      "Build the rules behind a place, then publish maps, characters, interfaces, stories, and persistent interactive visits from the same authored record.",
    startingMaterial: "canon, literary sources, visual continuity, and world rules",
    productionProblem:
      "Keep a growing world legible across stories, maps, characters, interfaces, and private campaigns whose choices do not rewrite canon.",
    stages: ["canon", "world rules", "atlas and cast", "interface", "persistent visit"],
    possibleOutputs: ["world guide", "character dossier", "map", "story", "interface", "interactive campaign"],
    capabilities: ["world rules", "maps", "interfaces", "interactive publishing"],
    media: otherAliceAtlas,
    secondaryMedia: otherAliceCharacter,
    approvedAssets: otherAliceAssets,
    destination: "/presents/other-alice-adventures/world-guide/",
    status: "Published world record",
    featuredPosition: 6,
    sourceLabel: "Authored world",
    resultLabel: "Atlas and cast",
    visualVariant: "world-atlas",
  },
  {
    id: "avatar-host",
    title: "Avatar & Host",
    projectType: "Identity, voice, and motion system",
    brief:
      "A stable identity gains a speaking role, voice, presentation rules, motion direction, recurring looks, and a real destination.",
    promise:
      "Keep the same host recognizable while the assignment, wardrobe, set, camera, and delivery format change.",
    startingMaterial: "a photograph, existing character, or approved mannequin",
    productionProblem:
      "Make a reusable host feel connected to the publication rather than producing isolated presenter clips with no public job.",
    stages: ["identity", "role", "voice and look", "performance direction", "destination"],
    possibleOutputs: ["presenter clip", "campaign host", "series guide", "article introduction", "motion proof"],
    capabilities: ["role design", "identity continuity", "voice", "motion"],
    media: avatarHostAssets[0],
    secondaryMedia: avatarHostAssets[1],
    approvedAssets: avatarHostAssets,
    destination: "/workshop/avatar-host/",
    status: "Active program",
    featuredPosition: 8,
    sourceLabel: "Campaign role",
    resultLabel: "Stable identity",
    visualVariant: "production-rail",
  },
];

export const historicalWorkshopProjects: readonly WorkshopProject[] = [
  {
    id: "cute-corrupted",
    title: "EZIZE Origins",
    projectType: "Historical visual experiment",
    brief:
      "The paired Cute & Corrupted studies supplied the first persona and transformation grammar that now runs inside EZIZE.",
    promise:
      "Preserve the visual premise, historical evidence, and transformation rules without presenting the old name as a current project.",
    startingMaterial: "one recognizable subject and two deliberately different modes",
    productionProblem:
      "Push the modes apart while keeping the shared silhouette and identity readable.",
    stages: ["concept", "shared base", "mode rules", "paired production", "EZIZE grammar"],
    possibleOutputs: ["paired still", "motion pair", "historical record", "EZIZE source grammar"],
    capabilities: ["concept development", "visual grammar", "taxonomy", "project history"],
    media: cuteCorruptedAssets[0],
    approvedAssets: cuteCorruptedAssets,
    destination: "/workshop/cute-and-corrupted/",
    status: "Project origin",
    featuredPosition: 99,
    visualVariant: "evidence-grid",
  },
];

export const workshopCapabilities = [
  {
    title: "Concept campaigns",
    description:
      "Product ideas, advertisements, campaign worlds, posters, social assets, short films, and landing-page presentations.",
  },
  {
    title: "Characters and hosts",
    description:
      "Mascots, presenters, reference sheets, wardrobe studies, scenes, expressions, continuity records, and motion.",
  },
  {
    title: "Editorial and historical visuals",
    description:
      "Archive research, restorations, comparisons, speculative reconstructions, diagrams, and article packages.",
  },
  {
    title: "Worlds and interactive projects",
    description:
      "Locations, props, visual rules, story structures, maps, interfaces, and web experiences.",
  },
  {
    title: "Production specifications",
    description:
      "Reference analysis, style specifications, render instructions, continuity rules, and reusable production documents.",
  },
] as const;

export function getWorkshopProject(id: WorkshopProject["id"]) {
  return [...selectedWorkshopProjects, ...historicalWorkshopProjects].find((project) => project.id === id);
}
