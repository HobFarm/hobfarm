import type { AtlasRecord } from "./types";
export type BestiaryRecord = AtlasRecord & { habitat:string; civicRole:string };
export const bestiaryRecords: BestiaryRecord[] = [
 { id:"reservoir-mussels",title:"Reservoir mussels",habitat:"Spade waterworks",civicRole:"Filter water and register contamination through shell color.",summary:"A cultivated filter organism whose health is read alongside mechanical tests.",canon:"working",visibility:"public",evidence:[{label:"Reservoir inspection",kind:"observation",certainty:"recorded"}] },
 { id:"route-moths",title:"Route moths",habitat:"Service doors and night depots",civicRole:"Gather near repeatable openings and help crews distinguish a route from a one-time anomaly.",summary:"Useful evidence, not a guarantee that a route is safe.",canon:"working",visibility:"public",evidence:[{label:"Depot keeper observation",kind:"testimony",certainty:"inferred"}] },
];
