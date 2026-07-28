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
  capabilities: readonly string[];
  media: MediaRecord;
  secondaryMedia?: MediaRecord;
  destination: string;
  status: WorkshopProjectStatus;
  featuredPosition: number;
  homepagePosition?: number;
  sourceLabel?: string;
  resultLabel?: string;
};

const otherAliceAtlas: MediaRecord = {
  src: "https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp",
  mediaType: "image",
  width: 1920,
  height: 1072,
  destination: "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
  role: "world-atlas",
  alt: "Aerial atlas plate of circular Wonderland, its regions, roads, forests, farms, and mountain boundary",
  status: "active",
};

export const selectedWorkshopProjects: readonly WorkshopProject[] = [
  {
    id: "future-carriage",
    title: "Future Carriage",
    projectType: "Concept campaign / product visualization",
    brief:
      "Historical carriage drawings set the constraints for electric, robotic, and autonomous vehicle studies.",
    capabilities: ["historical research", "product plates", "campaign direction", "motion planning"],
    media: getMedia("workshop.ami-legacy.model-3917.vehicle"),
    secondaryMedia: getMedia("workshop.ami-legacy.history.stanhope"),
    destination: "/workshop/ami-legacy/",
    status: "Published case study",
    featuredPosition: 1,
    homepagePosition: 1,
    sourceLabel: "Historical source",
    resultLabel: "Product study",
  },
  {
    id: "before-after",
    title: "Before & After",
    projectType: "Photography and alternate history",
    brief:
      "Source photographs become documentary comparisons, restorations, locked-camera transformations, and clearly labeled alternate futures.",
    capabilities: ["source analysis", "restoration", "compositing", "motion"],
    media: getMedia("before-after.shit-to-shine.after"),
    secondaryMedia: getMedia("before-after.shit-to-shine.source"),
    destination: "/workshop/before-and-after/",
    status: "Active program",
    featuredPosition: 2,
    homepagePosition: 2,
    sourceLabel: "Source photograph",
    resultLabel: "Speculative restoration",
  },
  {
    id: "stylefusion",
    title: "StyleFusion",
    projectType: "Reference-analysis application",
    brief:
      "Each approved reference gets a defined job. StyleFusion records the analysis, render instructions, and result in one production file.",
    capabilities: ["reference roles", "structured analysis", "render instructions", "diagnostics"],
    media: getMedia("stylefusion.cathedral.hero"),
    secondaryMedia: getMedia("stylefusion.banner.image"),
    destination: "/workshop/stylefusion/",
    status: "Public application study",
    featuredPosition: 3,
    homepagePosition: 3,
    sourceLabel: "Reference analysis",
    resultLabel: "Directed output",
  },
  {
    id: "character-mannequin",
    title: "Character / Mannequin",
    projectType: "Character production",
    brief:
      "A neutral identity sheet anchors wardrobe, expression, camera, scene, and presenter work across later appearances.",
    capabilities: ["identity locks", "character sheets", "continuity", "motion"],
    media: getMedia("workshop.psygoth.zima.design-v2"),
    secondaryMedia: getMedia("workshop.process.zima.mannequin"),
    destination: "/workshop/character-mannequin/",
    status: "Active program",
    featuredPosition: 4,
    homepagePosition: 4,
    sourceLabel: "Identity sheet",
    resultLabel: "Directed character",
  },
  {
    id: "other-alice-world",
    title: "Other Alice: Living Wonderland",
    projectType: "Worldbuilding and interactive publishing",
    brief:
      "A story world becomes an atlas, route logic, regional plates, interfaces, motion studies, and a durable public record.",
    capabilities: ["world rules", "maps", "interfaces", "interactive publishing"],
    media: otherAliceAtlas,
    destination: "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
    status: "Published world record",
    featuredPosition: 5,
    homepagePosition: 5,
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
