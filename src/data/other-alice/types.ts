export type CanonLevel = "locked" | "working" | "disputed" | "unknown";
export type PublicVisibility = "public" | "private" | "withheld";
export type Certainty = "confirmed" | "inferred" | "recorded" | "unresolved";

export type EvidenceRef = {
  label: string;
  kind: "record" | "observation" | "map" | "testimony" | "material";
  certainty: Certainty;
};

export type AtlasRecord = {
  id: string;
  title: string;
  summary: string;
  canon: CanonLevel;
  visibility: PublicVisibility;
  evidence: EvidenceRef[];
};
