import type { AtlasRecord } from "./types";

export type CourtDossier = AtlasRecord & {
  suit: "heart" | "diamond" | "spade" | "club";
  name: string;
  color: string;
  court: string;
  lived: string;
  dependency: string;
  estateLayer: string;
};

export const courtDossiers: CourtDossier[] = [
  { id:"hearts", title:"Hearts", name:"Hearts", suit:"heart", color:"#ef476f", canon:"locked", visibility:"public", court:"Ground, title, law, maps, courts, permits, and the Queen's central estate.", lived:"Tenancy, registration, hearings, rent, spectacle, and the daily fact that every address sits on Heart ground.", dependency:"Heart authority needs Diamond circulation, Spade continuity, and Club enforcement to remain physical.", estateLayer:"Title and jurisdiction", summary:"Hearts own the ground and write the official map.", evidence:[{label:"Court maps and title ledgers",kind:"record",certainty:"confirmed"}] },
  { id:"diamonds", title:"Diamonds", name:"Diamonds", suit:"diamond", color:"#f7c948", canon:"locked", visibility:"public", court:"Business, finance, processing, hospitality, markets, contracts, and distribution.", lived:"Wages, prices, rooms, credit, freight, kitchens, workshops, and the terms attached to circulation.", dependency:"Diamond business needs titled ground, maintained water and labor, and protected routes.", estateLayer:"Commerce and circulation", summary:"Diamonds own the business conducted on Heart ground.", evidence:[{label:"Market contracts and freight marks",kind:"record",certainty:"confirmed"}] },
  { id:"spades", title:"Spades", name:"Spades", suit:"spade", color:"#56c271", canon:"locked", visibility:"public", court:"Cultivation, water, fungi, labor, maintenance, repair, and underground service systems.", lived:"Reservoir shifts, crop cycles, root work, tunnel inspection, waste recovery, and the repairs everyone notices only when they fail.", dependency:"Spade continuity operates inside Heart estates, through Diamond budgets, under Club protection.", estateLayer:"Life support and labor", summary:"Spades keep the estate alive.", evidence:[{label:"Maintenance calendars and water tests",kind:"observation",certainty:"confirmed"}] },
  { id:"clubs", title:"Clubs", name:"Clubs", suit:"club", color:"#49c6d7", canon:"locked", visibility:"public", court:"Force, transport, security, depots, escorts, outer roads, and controlled reach.", lived:"Checkpoints, road crews, freight escorts, winter stations, salvage, border patrols, and the cost of moving safely.", dependency:"Club force protects a map it did not write and commerce it does not own, using supplies others maintain.", estateLayer:"Force and reach", summary:"Clubs make sure ownership stays owned.", evidence:[{label:"Depot registers and road markers",kind:"record",certainty:"confirmed"}] },
];

export const housePowerLayers = [
  { label:"Ground", owner:"Hearts", test:"Who can title, lease, forbid, or redraw this place?" },
  { label:"Business", owner:"Diamonds", test:"Who sets the contract, price, room, processing line, and distribution terms?" },
  { label:"Continuity", owner:"Spades", test:"Who keeps water, soil, fungi, labor, waste, and repair moving?" },
  { label:"Force", owner:"Clubs", test:"Who controls the road, escort, depot, checkpoint, and consequence?" },
] as const;

export const failureCascades = courtDossiers.map((house) => ({
  house: house.name,
  failure: `${house.estateLayer} fails first; the other three layers become visible as dependencies.`,
}));

export const politicalMapViews = [
  { label:"Official map", text:"Heart titles and court roads make the estate look singular." },
  { label:"Working map", text:"Markets, reservoirs, depots, labor paths, and unofficial routes reveal overlapping ownership." },
] as const;

export type RegionPowerRecord = { region:string; heart:string; diamond:string; spade:string; club:string };
export const regionPowerRecords: RegionPowerRecord[] = [
  { region:"Labyrinth City", heart:"Dense title and court control", diamond:"Markets, rooms, processing", spade:"Canals and service undercity", club:"Gates, freight, patrols" },
  { region:"Commercial Highlands", heart:"Estate claims and permits", diamond:"Companies, hotels, contracts", spade:"Water and slope repair", club:"Passes, convoys, depots" },
  { region:"Outer Cold", heart:"Distant claims", diamond:"Freight and extraction contracts", spade:"Heat, water, repair colonies", club:"Road and security control" },
];
