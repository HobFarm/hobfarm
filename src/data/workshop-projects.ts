import { getMedia, type MediaRecord } from "@/data/media-registry";

export type WorkshopProjectStatus =
  | "Published case study"
  | "Active program"
  | "Public application study"
  | "Published world record";

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
  destination: "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
  role: "world-atlas",
  alt: getMedia("other-alice.wonderland.world-map").alt,
  status: "active",
};

const otherAliceCharacter: MediaRecord = {
  src: "/media/other-alice/other-alice-character-sheet.webp",
  mediaType: "image",
  width: 1400,
  height: 1050,
  destination: "/departments/hobfarm-presents/other-alice-adventures/cast/",
  role: "character-continuity",
  alt: "Other Alice character sheet showing the adult character's locked visual identity",
  status: "active",
};

const otherAliceMap: MediaRecord = {
  src: "/media/other-alice/other-alice-living-map-hero.webp",
  mediaType: "image",
  width: 1536,
  height: 1024,
  destination: "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
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
  getMedia("stylefusion.banner.image"),
  getMedia("stylefusion.cathedral.hero"),
  getMedia("stylefusion.hellcat.poster"),
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

export const selectedWorkshopProjects: readonly WorkshopProject[] = [
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
    featuredPosition: 1,
    homepagePosition: 1,
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
    featuredPosition: 2,
    homepagePosition: 2,
    sourceLabel: "Source photograph",
    resultLabel: "Speculative restoration",
    visualVariant: "evidence-grid",
  },
  {
    id: "stylefusion",
    title: "StyleFusion",
    projectType: "Reference-analysis application",
    brief:
      "Each approved reference gets a defined job. StyleFusion records the analysis, render instructions, and result in one production file.",
    promise:
      "Give every reference a job, extract the useful rules, and turn the result into a production document.",
    startingMaterial: "approved reference images with explicit roles",
    productionProblem:
      "Separate subject, style, color, texture, scene, and camera evidence so a useful reference pile becomes specific direction.",
    stages: ["assign roles", "inspect evidence", "compile specification", "generate or diagnose", "export record"],
    possibleOutputs: ["production brief", "generation document", "diagnostic", "hero image", "poster", "motion study"],
    capabilities: ["reference roles", "structured analysis", "render instructions", "diagnostics"],
    media: getMedia("stylefusion.cathedral.hero"),
    secondaryMedia: getMedia("stylefusion.banner.image"),
    approvedAssets: styleFusionAssets,
    destination: "/workshop/stylefusion/",
    status: "Public application study",
    featuredPosition: 3,
    homepagePosition: 3,
    sourceLabel: "Reference analysis",
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
    featuredPosition: 4,
    homepagePosition: 4,
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
    destination: "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
    status: "Published world record",
    featuredPosition: 5,
    homepagePosition: 5,
    sourceLabel: "Authored world",
    resultLabel: "Atlas and cast",
    visualVariant: "world-atlas",
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
  return selectedWorkshopProjects.find((project) => project.id === id);
}
