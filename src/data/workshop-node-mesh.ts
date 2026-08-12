export type PublicNodeKind =
  | "surface"
  | "project"
  | "infrastructure"
  | "destination"
  | "record";

export type PublicNode = {
  id: string;
  label: string;
  kind: PublicNodeKind;
  projectId?: string;
  href?: string;
  summary: string;
};

export type PublicEdgeMeaning =
  | "feeds"
  | "documents"
  | "publishes-to"
  | "teaches"
  | "sells-through"
  | "powers"
  | "uses"
  | "produces";

export type PublicEdge = {
  from: PublicNode["id"];
  to: PublicNode["id"];
  meaning: PublicEdgeMeaning;
};

export const publicHobFarmNodes: readonly PublicNode[] = [
  { id: "articles", label: "Articles", kind: "surface", href: "/articles/", summary: "Editorial research, arguments, reporting, and visual evidence." },
  { id: "presents", label: "Presents", kind: "surface", href: "/presents/", summary: "Recurring stories, characters, cartoons, film history, and media programs." },
  { id: "workshop", label: "Workshop", kind: "surface", href: "/workshop/", summary: "The durable production method behind the work." },
  { id: "academy", label: "Academy", kind: "surface", href: "/academy/", summary: "Lessons built from methods that survived real projects." },
  { id: "shop", label: "Shop", kind: "surface", href: "/shop/", summary: "The commercial directory and verified HobFarm releases." },
  { id: "hobfarm-site", projectId: "hobfarm-site", label: "HobFarm", kind: "project", href: "/workshop/projects/hobfarm/", summary: "The website, publishing system, repository, and release loop." },
  { id: "stylefusion", projectId: "stylefusion", label: "StyleFusion", kind: "project", href: "/workshop/stylefusion/", summary: "A canonical visual representation compiled for changing tools." },
  { id: "before-after", projectId: "before-after", label: "Before & After", kind: "project", href: "/workshop/before-and-after/", summary: "Source photography, fixed viewpoints, evidence, and transformation." },
  { id: "future-carriage", projectId: "future-carriage", label: "Future Carriage", kind: "project", href: "/workshop/future-carriage/", summary: "Historical research turned into a product and campaign system." },
  { id: "other-alice", projectId: "other-alice-world", label: "Other Alice", kind: "project", href: "/presents/other-alice-adventures/world-guide/", summary: "An authored world with persistent rules, state, stories, and interfaces." },
  { id: "workshop-notes", label: "Workshop Notes", kind: "record", href: "/workshop/workshop-notes/", summary: "Tests, failures, revisions, and time-sensitive findings." },
  { id: "grimoire", label: "Grimoire", kind: "infrastructure", summary: "A reviewed schema, vocabulary, and project-memory layer." },
  { id: "published-work", label: "Published work", kind: "destination", summary: "Articles, images, applications, films, games, lessons, and products." },
] as const;

export const publicHobFarmEdges: readonly PublicEdge[] = [
  { from: "articles", to: "hobfarm-site", meaning: "feeds" },
  { from: "hobfarm-site", to: "workshop", meaning: "uses" },
  { from: "workshop", to: "workshop-notes", meaning: "documents" },
  { from: "workshop", to: "academy", meaning: "teaches" },
  { from: "workshop", to: "shop", meaning: "sells-through" },
  { from: "stylefusion", to: "published-work", meaning: "produces" },
  { from: "before-after", to: "articles", meaning: "publishes-to" },
  { from: "future-carriage", to: "presents", meaning: "publishes-to" },
  { from: "other-alice", to: "presents", meaning: "publishes-to" },
  { from: "grimoire", to: "stylefusion", meaning: "powers" },
  { from: "grimoire", to: "other-alice", meaning: "powers" },
  { from: "hobfarm-site", to: "published-work", meaning: "publishes-to" },
] as const;

export const projectNodeParts = [
  { label: "Sources", description: "The material, evidence, question, or authored world that starts the job." },
  { label: "Context", description: "Only the history, rules, and prior decisions this project needs." },
  { label: "Constraints", description: "What must remain true, what may change, and where invention is allowed." },
  { label: "Representation", description: "The explicit structure another tool or production step can use." },
  { label: "Tools", description: "Code, cameras, software, people, models, or manual methods chosen for this job." },
  { label: "Validation", description: "The checks that decide whether the result still carries the source and intent." },
  { label: "Outputs", description: "The finished routes, media, products, records, or lessons the project produces." },
] as const;

export const representationExamples = [
  { label: "Website", values: ["information architecture", "design tokens", "content model", "AGENTS.md", "acceptance criteria"] },
  { label: "Article", values: ["sources", "editorial rules", "claims", "structure", "citation requirements"] },
  { label: "Image", values: ["Visual IR", "geometry", "materials", "camera", "lighting", "scene"] },
  { label: "Photography", values: ["source image", "viewpoint", "evidence", "transformation rules"] },
  { label: "Video", values: ["shot plan", "edit structure", "graphics", "audio", "delivery matrix"] },
  { label: "Game", values: ["world schema", "state", "rules", "variables", "persistence"] },
] as const;
