import { otherAliceChronology } from "./canon";

export type RelationshipNodeKind =
  | "person"
  | "House"
  | "institution"
  | "region"
  | "route"
  | "artifact"
  | "organism"
  | "historical claim"
  | "visitor imprint";
export type RelationshipEdgeKind =
  | "body"
  | "knowledge"
  | "material"
  | "authority"
  | "ecology"
  | "echo";
export type RelationshipNode = {
  id: string;
  label: string;
  kind: RelationshipNodeKind;
  x: number;
  y: number;
  summary: string;
};
export type RelationshipEdge = {
  id: string;
  source: string;
  target: string;
  kind: RelationshipEdgeKind;
  label: string;
  evidence: string;
  certainty: "confirmed" | "inferred" | "recorded" | "unresolved";
};

export const relationshipNodes: RelationshipNode[] = [
  { id: "hearts", label: "Hearts", kind: "House", x: 10, y: 12, summary: "Ground, law, and maps" },
  { id: "diamonds", label: "Diamonds", kind: "House", x: 90, y: 12, summary: "Business and circulation" },
  { id: "spades", label: "Spades", kind: "House", x: 10, y: 88, summary: "Continuity and repair" },
  { id: "clubs", label: "Clubs", kind: "House", x: 90, y: 88, summary: "Force and transport" },
  { id: "other-alice", label: "Other Alice", kind: "person", x: 48, y: 50, summary: "Resident natural philosopher, field observer, and practical problem solver" },
  { id: "chester", label: "Chester", kind: "person", x: 37, y: 51, summary: "Independent companion and diagnostic guide" },
  { id: "ciryl-spade", label: "Ciryl Spade", kind: "person", x: 21, y: 68, summary: "Mycelium maintenance worker" },
  { id: "queen-of-hearts", label: "Queen of Hearts", kind: "person", x: 21, y: 29, summary: "Wonderland Queen and central sovereign" },
  { id: "hatter", label: "Mad Hatter", kind: "person", x: 77, y: 32, summary: "Disputed highland tea and hospitality record" },
  { id: "white-rabbit", label: "White Rabbit", kind: "person", x: 57, y: 64, summary: "Alice's threshold invitation and an individual route-facing clockkeeper" },
  { id: "rabbit-guild", label: "Rabbit guild", kind: "institution", x: 68, y: 57, summary: "Transit, certification, and burrow access" },
  { id: "caterpillar", label: "Caterpillar", kind: "person", x: 33, y: 62, summary: "Transformation and dosage specialist" },
  { id: "club-road-crews", label: "Club road crews", kind: "institution", x: 82, y: 79, summary: "Outer transport and security collective" },
  { id: "tweedledum", label: "Tweedledum", kind: "person", x: 42, y: 35, summary: "Separate member of a paired public identity" },
  { id: "tweedledee", label: "Tweedledee", kind: "person", x: 54, y: 34, summary: "Separate member of a paired public identity" },
  { id: "humpty-dumpty", label: "Humpty Dumpty", kind: "person", x: 31, y: 41, summary: "Disputed authority on definitions" },
  { id: "mock-turtle", label: "Mock Turtle", kind: "person", x: 69, y: 76, summary: "Older edge being and witness" },
  { id: "gryphon", label: "Gryphon", kind: "person", x: 79, y: 68, summary: "Older edge guardian and witness" },
  { id: "labyrinth", label: "Labyrinth City", kind: "region", x: 49, y: 10, summary: "Dense civic center" },
  { id: "commercial-highlands", label: "Commercial Highlands", kind: "region", x: 73, y: 22, summary: "Cultivation, hospitality, and freight" },
  { id: "burrow", label: "Burrow route", kind: "route", x: 50, y: 92, summary: "Discontinuous passage" },
  { id: "reservoir", label: "Reservoir network", kind: "institution", x: 26, y: 79, summary: "Water and maintenance" },
  { id: "highland-tea-system", label: "Highland tea system", kind: "institution", x: 78, y: 44, summary: "Cultivation, chemistry, hospitality, and distribution" },
  { id: "size-change-mushroom", label: "Size-change mushroom", kind: "organism", x: 28, y: 57, summary: "Transformation material and dosage knowledge" },
  { id: "workshop-archive", label: "Alice's cabin workshop", kind: "artifact", x: 40, y: 70, summary: "Remedies, route records, scale tests, specimens, repairs, hospitality, and exchange" },
  { id: "route-moths", label: "Route moths", kind: "organism", x: 61, y: 82, summary: "Opening indicators" },
  { id: "revised-map", label: "Revised map", kind: "artifact", x: 34, y: 24, summary: "Layered estate evidence" },
  { id: "outside-gap", label: "Outside-time gap", kind: "historical claim", x: 63, y: 24, summary: otherAliceChronology.outsideGap },
  { id: "corridor-stain", label: "Corridor residue", kind: "visitor imprint", x: 49, y: 72, summary: "A mark reused locally" },
];

export const relationshipEdges: RelationshipEdge[] = [
  { id: "hearts-labyrinth", source: "hearts", target: "labyrinth", kind: "authority", label: "titles", evidence: "Central estate survey", certainty: "confirmed" },
  { id: "diamonds-labyrinth", source: "diamonds", target: "labyrinth", kind: "material", label: "circulates through", evidence: "Market and room contracts", certainty: "confirmed" },
  { id: "spades-reservoir", source: "spades", target: "reservoir", kind: "ecology", label: "maintains", evidence: "Water tests and shift calendars", certainty: "confirmed" },
  { id: "clubs-burrow", source: "clubs", target: "burrow", kind: "authority", label: "restricts", evidence: "Outer checkpoint register", certainty: "recorded" },
  { id: "alice-map", source: "other-alice", target: "revised-map", kind: "knowledge", label: "compares", evidence: "Field annotations", certainty: "recorded" },
  { id: "alice-outside-gap", source: "other-alice", target: "outside-gap", kind: "body", label: "outlived", evidence: "Arrival and present-age record", certainty: "confirmed" },
  { id: "route-moths-burrow", source: "route-moths", target: "burrow", kind: "ecology", label: "gathers near", evidence: "Depot observations", certainty: "inferred" },
  { id: "corridor-burrow", source: "corridor-stain", target: "burrow", kind: "echo", label: "repeats along", evidence: "Matched residue samples", certainty: "recorded" },
  { id: "reservoir-diamonds", source: "reservoir", target: "diamonds", kind: "material", label: "supplies", evidence: "Highland distribution ledger", certainty: "confirmed" },
  { id: "alice-white-rabbit", source: "other-alice", target: "white-rabbit", kind: "echo", label: "chose to follow into Wonderland", evidence: "Alice arrival and threshold record", certainty: "confirmed" },
  { id: "alice-chester", source: "other-alice", target: "chester", kind: "knowledge", label: "named, trusts, and works beside", evidence: "Early shelter accounts, workshop records, and repeated threshold observations", certainty: "confirmed" },
  { id: "alice-workshop", source: "other-alice", target: "workshop-archive", kind: "knowledge", label: "maintains and shares through", evidence: "Remedy ledger, route annotations, scale tests, and favor records", certainty: "recorded" },
  { id: "alice-mushroom-method", source: "other-alice", target: "size-change-mushroom", kind: "material", label: "prepares measured fragments from", evidence: "Separated samples, dose notes, and access records", certainty: "recorded" },
  { id: "alice-queen", source: "other-alice", target: "queen-of-hearts", kind: "authority", label: "negotiates access under", evidence: "Current court and route records", certainty: "recorded" },
  { id: "alice-hatter", source: "other-alice", target: "hatter", kind: "knowledge", label: "tests substances and hospitality with", evidence: "Disputed highland field record", certainty: "unresolved" },
  { id: "rabbit-guild-membership", source: "white-rabbit", target: "rabbit-guild", kind: "authority", label: "works within", evidence: "Clock certification and route marks", certainty: "inferred" },
  { id: "hatter-tea-system", source: "hatter", target: "highland-tea-system", kind: "material", label: "is associated with", evidence: "Tasting-house marks and protected distribution records", certainty: "unresolved" },
  { id: "tea-system-highlands", source: "highland-tea-system", target: "commercial-highlands", kind: "ecology", label: "operates across", evidence: "Cultivation and freight records", certainty: "recorded" },
  { id: "caterpillar-mushroom", source: "caterpillar", target: "size-change-mushroom", kind: "knowledge", label: "controls dosage knowledge for", evidence: "Separated mushroom samples and field notes", certainty: "recorded" },
  { id: "tweedle-pair", source: "tweedledum", target: "tweedledee", kind: "echo", label: "shares a disputed public identity with", evidence: "Contradictory paired testimony", certainty: "unresolved" },
  { id: "humpty-registry", source: "humpty-dumpty", target: "hearts", kind: "authority", label: "depends on accepted definitions from", evidence: "Conflicting registry entries", certainty: "unresolved" },
  { id: "old-edge-witnesses", source: "mock-turtle", target: "gryphon", kind: "knowledge", label: "holds old edge testimony beside", evidence: "Fragmentary inherited records", certainty: "inferred" },
  { id: "ciryl-reservoir", source: "ciryl-spade", target: "reservoir", kind: "ecology", label: "tests and repairs", evidence: "Frosted repair record and water test", certainty: "recorded" },
  { id: "crews-clubs", source: "club-road-crews", target: "clubs", kind: "authority", label: "works under", evidence: "Depot and checkpoint registers", certainty: "confirmed" },
  { id: "crews-burrow", source: "club-road-crews", target: "burrow", kind: "material", label: "maintains access near", evidence: "Winter road and salvage records", certainty: "recorded" },
];

export const relationshipLegend: { id: RelationshipEdgeKind; label: string }[] = [
  { id: "body", label: "Body" },
  { id: "knowledge", label: "Knowledge" },
  { id: "material", label: "Material" },
  { id: "authority", label: "Authority" },
  { id: "ecology", label: "Ecology" },
  { id: "echo", label: "Echo" },
];

export type UnsuitedDossier = { id: string; title: string; summary: string };
export const unsuitedDossiers: UnsuitedDossier[] = [
  {
    id: "chester",
    title: "Chester",
    summary: "Unsuited route authority whose refusal can outweigh a registered road.",
  },
];
export const affiliationLayers = ["body", "work", "House", "region", "route", "debt"] as const;
