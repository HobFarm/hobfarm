export type CanonLevel = "locked" | "working" | "disputed" | "unknown";
export type PublicVisibility = "public" | "private" | "withheld";
export type Certainty = "confirmed" | "inferred" | "recorded" | "unresolved";
export type OtherAliceEntityKind =
  | "resident"
  | "officeholder"
  | "old-being"
  | "pair-member"
  | "institution"
  | "collective";
export type OtherAlicePublicRecordState =
  | "established"
  | "working"
  | "disputed"
  | "withheld";
export type OtherAliceOriginDisclosure =
  | "established"
  | "incomplete"
  | "disputed"
  | "sealed"
  | "withheld";
export type OtherAliceVisualState =
  | "approved"
  | "provisional"
  | "design-pending"
  | "withheld";
export type OtherAliceCastGroup =
  | "present-continuity"
  | "center-highlands"
  | "routes-transformation"
  | "disputed-identities"
  | "old-edge-witnesses";

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

export type OtherAliceResidentRecord = {
  id: string;
  slug: string;
  name: string;
  role: string;
  category: "character" | "faction";
  entityKind: OtherAliceEntityKind;
  publicState: OtherAlicePublicRecordState;
  currentFunction: string;
  livingWorldConnection: string;
  systemTouchpoint: string;
  castGroup: OtherAliceCastGroup;
  displayGroupRef?: string;
  regionRefs: string[];
  houseRefs: string[];
  routeRefs: string[];
  systemRefs: string[];
  relationshipRefs: string[];
  evidence: EvidenceRef[];
  originDisclosure: OtherAliceOriginDisclosure;
  visualState: OtherAliceVisualState;
  assetRef?: string | null;
  landscapeAssetRef?: string | null;
  image?: string;
  imageAlt?: string;
  landscapeImage?: string;
  landscapeImageAlt?: string;
  detailPageReady?: boolean;
  href?: string;
  guideAnchor: string;
  visibility: PublicVisibility;
  summary: string[];
};
