import { otherAliceChronology } from "./canon";

export type RelationshipNodeKind = "person"|"House"|"institution"|"region"|"route"|"artifact"|"organism"|"historical claim"|"visitor imprint";
export type RelationshipEdgeKind = "body"|"knowledge"|"material"|"authority"|"ecology"|"echo";
export type RelationshipNode = { id:string; label:string; kind:RelationshipNodeKind; x:number; y:number; summary:string };
export type RelationshipEdge = { id:string; source:string; target:string; kind:RelationshipEdgeKind; label:string; evidence:string; certainty:"confirmed"|"inferred"|"recorded"|"unresolved" };

export const relationshipNodes: RelationshipNode[] = [
 {id:"alice",label:"Other Alice",kind:"person",x:50,y:48,summary:"Resident field observer"},
 {id:"hearts",label:"Hearts",kind:"House",x:20,y:22,summary:"Ground, law, and maps"},
 {id:"diamonds",label:"Diamonds",kind:"House",x:80,y:22,summary:"Business and circulation"},
 {id:"spades",label:"Spades",kind:"House",x:18,y:75,summary:"Continuity and repair"},
 {id:"clubs",label:"Clubs",kind:"House",x:82,y:75,summary:"Force and transport"},
 {id:"labyrinth",label:"Labyrinth City",kind:"region",x:50,y:18,summary:"Dense civic center"},
 {id:"burrow",label:"Burrow route",kind:"route",x:50,y:84,summary:"Discontinuous passage"},
 {id:"reservoir",label:"Reservoir network",kind:"institution",x:34,y:66,summary:"Water and maintenance"},
 {id:"route-moths",label:"Route moths",kind:"organism",x:65,y:66,summary:"Opening indicators"},
 {id:"revised-map",label:"Revised map",kind:"artifact",x:35,y:36,summary:"Layered estate evidence"},
 {id:"outside-gap",label:"Outside-time gap",kind:"historical claim",x:66,y:36,summary:otherAliceChronology.outsideGap},
 {id:"corridor-stain",label:"Corridor residue",kind:"visitor imprint",x:50,y:64,summary:"A mark reused locally"},
];

export const relationshipEdges: RelationshipEdge[] = [
 {id:"e1",source:"hearts",target:"labyrinth",kind:"authority",label:"titles",evidence:"Central estate survey",certainty:"confirmed"},
 {id:"e2",source:"diamonds",target:"labyrinth",kind:"material",label:"circulates",evidence:"Market and room contracts",certainty:"confirmed"},
 {id:"e3",source:"spades",target:"reservoir",kind:"ecology",label:"maintains",evidence:"Water tests and shift calendars",certainty:"confirmed"},
 {id:"e4",source:"clubs",target:"burrow",kind:"authority",label:"restricts",evidence:"Outer checkpoint register",certainty:"recorded"},
 {id:"e5",source:"alice",target:"revised-map",kind:"knowledge",label:"compares",evidence:"Field annotations",certainty:"recorded"},
 {id:"e6",source:"alice",target:"outside-gap",kind:"body",label:"outlived",evidence:"Arrival and present-age record",certainty:"confirmed"},
 {id:"e7",source:"route-moths",target:"burrow",kind:"ecology",label:"gathers near",evidence:"Depot observations",certainty:"inferred"},
 {id:"e8",source:"corridor-stain",target:"burrow",kind:"echo",label:"repeats",evidence:"Matched residue samples",certainty:"recorded"},
 {id:"e9",source:"reservoir",target:"diamonds",kind:"material",label:"supplies",evidence:"Highland distribution ledger",certainty:"confirmed"},
];

export const relationshipLegend: {id:RelationshipEdgeKind;label:string}[] = [
 {id:"body",label:"Body"},{id:"knowledge",label:"Knowledge"},{id:"material",label:"Material"},{id:"authority",label:"Authority"},{id:"ecology",label:"Ecology"},{id:"echo",label:"Echo"},
];

export type UnsuitedDossier = { id:string; title:string; summary:string };
export const unsuitedDossiers: UnsuitedDossier[] = [{id:"chester",title:"Chester",summary:"Unsuited route authority whose refusal can outweigh a registered road."}];
export const affiliationLayers = ["body","work","House","region","route","debt"] as const;
