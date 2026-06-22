export interface GrimoireSnapshotLayer {
  id: "L1" | "L2" | "L3" | "L4" | "L5";
  name: string;
  description: string;
  color: string;
}

export interface GrimoireSnapshotDiagnostic {
  level: "green" | "yellow" | "red";
  message: string;
}

export interface GrimoireSnapshot {
  schemaVersion: 1;
  capturedAt: string;
  cadence: "biweekly";
  layers: GrimoireSnapshotLayer[];
  diagnostics: GrimoireSnapshotDiagnostic[];
}

export const DEFAULT_GRIMOIRE_SNAPSHOT: GrimoireSnapshot = {
  schemaVersion: 1,
  capturedAt: "2026-05-17",
  cadence: "biweekly",
  layers: [
    {
      id: "L1",
      name: "L1: Substrate",
      description:
        "File cabinets & document reels\nRaw source material storage",
      color: "#ffe033",
    },
    {
      id: "L2",
      name: "L2: Chunks",
      description:
        "Punched-card data chunks\nGlowing segmented fragments",
      color: "#39ff14",
    },
    {
      id: "L3",
      name: "L3: Taxonomy",
      description:
        "Rotating classification rings\nDimensional category orbits",
      color: "#00e5ff",
    },
    {
      id: "L4",
      name: "L4: Atoms",
      description:
        "Dense particle knowledge cloud\nNeural lattice",
      color: "#ff00aa",
    },
    {
      id: "L5",
      name: "L5: Edges",
      description:
        "Correspondence web\nMulti-color connection mesh",
      color: "#aa44ff",
    },
  ],
  diagnostics: [
    { level: "green", message: "Substrate invariants hold" },
    { level: "green", message: "Queue health green" },
    { level: "green", message: "Vectorize backlog tiny" },
    { level: "green", message: "Decay, LPA, engram running" },
    { level: "yellow", message: "97% atoms lag tag_version" },
    { level: "yellow", message: "dimension_memberships underbuilt" },
    { level: "yellow", message: "curated path unused" },
    { level: "red", message: "Molecule formation stalled" },
    { level: "red", message: "60% chunks orphaned" },
    { level: "red", message: "chunk_atoms bridge: topology gap" },
  ],
};

const EXPECTED_LAYER_IDS: GrimoireSnapshotLayer["id"][] = [
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
];
const VALID_LEVELS = new Set<GrimoireSnapshotDiagnostic["level"]>([
  "green",
  "yellow",
  "red",
]);
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DIAGNOSTICS = 30;

function isString(v: unknown, min: number, max: number): v is string {
  return typeof v === "string" && v.length >= min && v.length <= max;
}

export function isValidSnapshot(v: unknown): v is GrimoireSnapshot {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  if (s.schemaVersion !== 1) return false;
  if (s.cadence !== "biweekly") return false;
  if (typeof s.capturedAt !== "string" || !ISO_DATE.test(s.capturedAt)) {
    return false;
  }
  if (!Array.isArray(s.layers) || s.layers.length !== 5) return false;
  for (let i = 0; i < 5; i++) {
    const layer = s.layers[i] as Record<string, unknown> | undefined;
    if (!layer || typeof layer !== "object") return false;
    if (layer.id !== EXPECTED_LAYER_IDS[i]) return false;
    if (!isString(layer.name, 1, 80)) return false;
    if (!isString(layer.description, 1, 200)) return false;
    if (typeof layer.color !== "string" || !HEX_COLOR.test(layer.color)) {
      return false;
    }
  }
  if (!Array.isArray(s.diagnostics)) return false;
  if (s.diagnostics.length > MAX_DIAGNOSTICS) return false;
  for (const d of s.diagnostics) {
    const diag = d as Record<string, unknown> | undefined;
    if (!diag || typeof diag !== "object") return false;
    if (
      typeof diag.level !== "string" ||
      !VALID_LEVELS.has(diag.level as GrimoireSnapshotDiagnostic["level"])
    ) {
      return false;
    }
    if (!isString(diag.message, 1, 120)) return false;
  }
  return true;
}

export async function loadGrimoireSnapshot(
  timeoutMs = 1500
): Promise<GrimoireSnapshot> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("/api/grimoire/snapshot", {
      headers: { accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) return DEFAULT_GRIMOIRE_SNAPSHOT;
    const data = await res.json();
    return isValidSnapshot(data) ? data : DEFAULT_GRIMOIRE_SNAPSHOT;
  } catch {
    return DEFAULT_GRIMOIRE_SNAPSHOT;
  } finally {
    clearTimeout(timer);
  }
}
