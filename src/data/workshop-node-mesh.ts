export type PublicNodeKind =
  | "surface"
  | "project"
  | "workflow"
  | "application"
  | "subject"
  | "media"
  | "infrastructure"
  | "destination"
  | "record"
  | "composite";

export type NodeExampleStatus = "current" | "working" | "hypothetical";

export type PublicNode = {
  id: string;
  label: string;
  kind: PublicNodeKind;
  projectId?: string;
  href?: string;
  summary: string;
  status?: NodeExampleStatus;
};

export type PublicEdgeMeaning =
  | "related-to"
  | "references"
  | "documents"
  | "uses"
  | "contributes-to"
  | "produces"
  | "published-as"
  | "distributed-to"
  | "taught-as"
  | "sold-as"
  | "powers";

export type PublicEdge = {
  from: PublicNode["id"];
  to: PublicNode["id"];
  meaning: PublicEdgeMeaning;
};

export type CompositionInput = {
  id: string;
  label: string;
  kind: PublicNodeKind;
  href?: string;
  contribution: string;
};

export type CompositionExample = {
  id: string;
  eyebrow: string;
  status: NodeExampleStatus;
  inputs: readonly CompositionInput[];
  output: {
    label: string;
    kind: PublicNodeKind;
    href?: string;
    description: string;
  };
  caption: string;
};

export const publicHobFarmNodes: readonly PublicNode[] = [
  { id: "articles", label: "Articles", kind: "surface", href: "/articles/", summary: "Independent Editorial works connected by subjects, entities, series, and selected related reading." },
  { id: "presents", label: "Presents", kind: "surface", href: "/presents/", summary: "The public home for recurring stories, characters, cartoons, and developed worlds." },
  { id: "workshop", label: "Workshop", kind: "surface", href: "/workshop/", summary: "Project records, methods, experiments, revisions, and production evidence." },
  { id: "academy", label: "Academy", kind: "surface", href: "/academy/", summary: "Lessons built from methods that survived real work." },
  { id: "shop", label: "Shop", kind: "surface", href: "/shop/", summary: "The commercial directory and verified HobFarm releases." },
  { id: "hobfarm-site", projectId: "hobfarm-site", label: "HobFarm", kind: "project", href: "/workshop/projects/hobfarm/", summary: "The publishing site, repository, content model, and relationship system." },
  { id: "ezize", projectId: "ezize", label: "EZIZE", kind: "application", href: "/ezize/", summary: "A public collectible image machine with authored weighted paths, Generation Path Odds, finished EZs, and account receipts." },
  { id: "stylefusion", projectId: "stylefusion", label: "StyleFusion", kind: "application", href: "/workshop/stylefusion/", summary: "A structured visual representation compiled for changing tools." },
  { id: "before-after", projectId: "before-after", label: "Before & After", kind: "workflow", href: "/workshop/before-and-after/", summary: "A source-integrity and transformation workflow built around one recognizable subject." },
  { id: "future-carriage", projectId: "future-carriage", label: "Future Carriage", kind: "project", href: "/workshop/future-carriage/", summary: "Historical constraints, a future vehicle family, and a self-directed concept campaign." },
  { id: "avatar-host", projectId: "avatar-host", label: "Avatar & Host", kind: "workflow", href: "/workshop/avatar-host/", summary: "Stable character identity, role, voice, reference, and motion direction." },
  { id: "other-alice", projectId: "other-alice-world", label: "Other Alice", kind: "project", href: "/presents/other-alice-adventures/world-guide/", summary: "An authored world with persistent rules, state, stories, and interfaces." },
  { id: "workshop-notes", label: "Workshop Notes", kind: "record", href: "/workshop/workshop-notes/", summary: "Canonical Article records for tests, failures, revisions, and time-sensitive findings." },
  { id: "grimoire", label: "Grimoire", kind: "infrastructure", summary: "A reviewed schema, vocabulary, and bounded project-memory layer." },
  { id: "wildcard-machine", label: "Wildcard Machine", kind: "infrastructure", summary: "The deterministic pull and probability runtime used by EZIZE." },
  { id: "external-distribution", label: "External distribution", kind: "destination", summary: "Audience, gallery, video, download, and marketplace surfaces used only when they have a job." },
] as const;

export const publicHobFarmEdges: readonly PublicEdge[] = [
  { from: "workshop", to: "hobfarm-site", meaning: "documents" },
  { from: "workshop", to: "future-carriage", meaning: "documents" },
  { from: "workshop", to: "avatar-host", meaning: "documents" },
  { from: "workshop", to: "before-after", meaning: "documents" },
  { from: "workshop-notes", to: "articles", meaning: "published-as" },
  { from: "other-alice", to: "presents", meaning: "published-as" },
  { from: "grimoire", to: "stylefusion", meaning: "powers" },
  { from: "grimoire", to: "other-alice", meaning: "powers" },
  { from: "grimoire", to: "ezize", meaning: "powers" },
  { from: "wildcard-machine", to: "ezize", meaning: "powers" },
  { from: "workshop", to: "academy", meaning: "taught-as" },
  { from: "shop", to: "external-distribution", meaning: "distributed-to" },
  { from: "presents", to: "external-distribution", meaning: "distributed-to" },
] as const;

export const primaryComposition: CompositionExample = {
  id: "avatar-future-carriage",
  eyebrow: "Working composition",
  status: "working",
  inputs: [
    {
      id: "avatar-host",
      label: "Avatar & Host",
      kind: "workflow",
      href: "/workshop/avatar-host/",
      contribution: "Character identity, front/profile/rear/three-quarter reference, wardrobe state, expression, role, and motion-ready continuity.",
    },
    {
      id: "future-carriage",
      label: "Future Carriage",
      kind: "project",
      href: "/workshop/future-carriage/",
      contribution: "Vehicle family, interiors and exteriors, historical constraints, operating idea, environments, and campaign language.",
    },
  ],
  output: {
    label: "Future Carriage campaign proof",
    kind: "composite",
    href: "/workshop/future-carriage/",
    description: "A presenter frame or moving scene can use the same character inside the Future Carriage world. The current case study contains campaign proof, but this is not a separate shipped project route.",
  },
  caption: "Both inputs remain complete projects. The campaign proof selects what it needs from each one and keeps its own production record.",
} as const;

export const acadiaComposition: CompositionExample = {
  id: "future-carriage-acadia",
  eyebrow: "Hypothetical project",
  status: "hypothetical",
  inputs: [
    {
      id: "future-carriage",
      label: "Future Carriage",
      kind: "project",
      href: "/workshop/future-carriage/",
      contribution: "The vehicle rules, operating concept, and existing campaign language.",
    },
    {
      id: "acadia-research",
      label: "Acadia carriage-road research",
      kind: "subject",
      contribution: "A possible future research node about historical carriage roads and park transportation context.",
    },
  ],
  output: {
    label: "Future national-park carriage concept",
    kind: "composite",
    description: "A speculative transportation concept that could later combine with Avatar & Host to produce a campaign, film, advertisement, or fictional story.",
  },
  caption: "Example only. HobFarm has not created this project, researched an Acadia article, or proposed a system to Acadia or the National Park Service.",
} as const;

export const projectNodeParts = [
  { label: "Sources", description: "The material, evidence, question, identity, or authored world that starts the job." },
  { label: "Context", description: "Only the history and prior decisions this node needs to remain understandable." },
  { label: "Stable core", description: "The identity, purpose, or durable representation that must survive tool changes." },
  { label: "Rules or constraints", description: "What must remain true, what may change, and where invention is allowed." },
  { label: "Outputs", description: "The route, media, application, record, lesson, release, or other useful result." },
  { label: "Connections", description: "Selected relationships with a stated job. No connection is added just because two things share a word." },
  { label: "Record", description: "The sources, decisions, validation, status, and revisions another person or tool can inspect." },
] as const;

export const edgeVocabulary: readonly { meaning: PublicEdgeMeaning; description: string }[] = [
  { meaning: "related-to", description: "Two nodes share a deliberate, genuinely symmetric relationship." },
  { meaning: "references", description: "One node cites or points into another node's subject, source, or record." },
  { meaning: "documents", description: "A record explains the development of another node." },
  { meaning: "uses", description: "A node selects an artifact, rule, or capability from another node." },
  { meaning: "contributes-to", description: "An existing node supplies one bounded input to a new composite node." },
  { meaning: "produces", description: "A workflow or project creates a durable output." },
  { meaning: "published-as", description: "A node appears through its correct HobFarm public surface." },
  { meaning: "distributed-to", description: "A release travels to an external audience, gallery, video, or marketplace surface." },
  { meaning: "taught-as", description: "A proven method becomes an Academy lesson or course." },
  { meaning: "sold-as", description: "A finished deliverable becomes a verified Shop or marketplace offer." },
  { meaning: "powers", description: "An infrastructure node performs a defined job inside another node." },
] as const;

export const replaceableStructureExamples = [
  { label: "Avatar & Host", stable: "identity, reference structure, role, and continuity rules", replaceable: "current voice, video model, camera tool, or editing method" },
  { label: "Future Carriage", stable: "source constraints, vehicle family, operating idea, and campaign language", replaceable: "current renderer, animation method, or editing tool" },
  { label: "EZIZE", stable: "authored recipe, deterministic pull, probability math, and Ledger", replaceable: "current image renderer or provider" },
  { label: "HobFarm", stable: "content model, canonical objects, relationships, and production record", replaceable: "layouts, components, CMS tools, hosting, and production providers" },
] as const;

export const representationExamples = [
  { label: "Website", values: ["information architecture", "design tokens", "content model", "AGENTS.md", "acceptance criteria"] },
  { label: "Article", values: ["sources", "editorial rules", "claims", "structure", "citation requirements"] },
  { label: "Image", values: ["Visual IR", "geometry", "materials", "camera", "lighting", "scene"] },
  { label: "Photography", values: ["source image", "viewpoint", "evidence", "transformation rules"] },
  { label: "Video", values: ["shot plan", "edit structure", "graphics", "audio", "delivery matrix"] },
  { label: "Game", values: ["world schema", "state", "rules", "variables", "persistence"] },
] as const;
