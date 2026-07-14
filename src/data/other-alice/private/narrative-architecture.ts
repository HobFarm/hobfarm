import type { CanonLevel, PublicVisibility } from "../types";
export type PrivateStoryRecord = { id:string; canon:CanonLevel; visibility:PublicVisibility; notes:string[] };
export const narrativeArchitecture: PrivateStoryRecord = {
 id:"other-alice-narrative-architecture-v1", canon:"working", visibility:"private",
 notes:["Narrative source material is development evidence, not public canon.","Apply CANON-OVERRIDES.md before promoting any record.","No entry in this module may be imported by the public data barrel."],
};
