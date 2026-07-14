import type { AtlasRecord } from "./types";
export type ArchiveRecord = AtlasRecord & { recordType:string; dateLabel:string };
export const archiveRecords: ArchiveRecord[] = [
 { id:"revised-estate-map",title:"Revised estate map",recordType:"Map",dateLabel:"Current civic cycle",summary:"A Heart survey corrected with market roads, reservoirs, depots, and unregistered burrow marks.",canon:"locked",visibility:"public",evidence:[{label:"Layer comparison",kind:"map",certainty:"confirmed"}] },
 { id:"service-corridor-stain",title:"Service corridor residue",recordType:"Material record",dateLabel:"Undated",summary:"A repeated purple-black mark crossing tile, root, and contract seal without following the registered corridor.",canon:"working",visibility:"public",evidence:[{label:"Material sample",kind:"material",certainty:"recorded"}] },
];
