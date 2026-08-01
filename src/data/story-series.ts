import { otherAliceResidents } from "@/data/other-alice-world-guide";

export type WorldConcept = { id:string; title:string; realm:string; image:string; imageAlt:string; description:string; width:number; height:number };
export type SeriesResident = { id:string; name:string; role:string; category:"character"|"faction"; image?:string; imageAlt?:string; summary:string[]; href?:string };
export type StorySeries = {
 slug:string; title:string; status:"active"|"planned"|"complete"; seoTitle?:string; metaDescription?:string; eyebrow?:string; tagline:string; heroDeck?:string; logline:string; heroIntro?:string[];
 explainer?:{heading:string;lead:string;paragraphs:string[]}; differentiation?:{heading:string;paragraphs:string[]}; profile?:{title:string;text:string}[];
 worldAtlas?:{heading:string;intro:string[];concepts:WorldConcept[]}; residents?:{heading:string;intro?:string;entries:SeriesResident[]}; description:string[]; cover:string; coverAlt?:string;
 heroMedia?:{type:"image"|"video";file:string;alt:string;poster?:string}; characterMedia?:{type:"video";file:string;alt:string;poster?:string}; paletteHook?:string;
 worldStrip?:{title:string;paragraphs:string[];details?:{label:string;value:string}[];image?:string;imageAlt?:string}[]; loreSections?:{heading:string;paragraphs?:string[];items?:{title:string;text:string}[]}[];
 faq?:{question:string;answer:string}[]; endLine?:string[]; characters?:string[]; contributors?:{name:string;role:string}[]; relatedContent?:{label:string;href:string}[]; displayOrder?:number;
};

export const storySeries: StorySeries[] = [{
 slug:"other-alice-adventures", title:"Other Alice Adventures", status:"active",
 seoTitle:"Other Alice Adventures | A Living Illustrated Wonderland", metaDescription:"A web-native surreal fantasy serial, illustrated world archive, and developing interactive story system built around choice, consequence, persistent history, and literary characters reimagined through Wonderland.",
 eyebrow:"HobFarm Presents", tagline:"A web-native surreal fantasy serial, illustrated world archive, and developing interactive story system.",
 heroDeck:"Wonderland is already alive. Alice is only one person inside it.",
 logline:"Other Alice Adventures follows the Alice who chose to stay in Wonderland and the living country she became part of.",
 heroIntro:["The familiar story is the doorway. The project follows the settlements, economies, ecologies, institutions, species, infrastructure, histories, and borders beyond its famous scenes.","Stories, character dossiers, maps, bestiary records, artifacts, diagrams, and visual studies reveal different parts of the same Wonderland."],
 worldAtlas:{heading:"Wonderland at a glance",intro:["The public atlas moves from the Queen's central estate to the complete boundary mountain ring."],concepts:[{id:"living-atlas",title:"Living Wonderland atlas",realm:"Public world record",image:"https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp",imageAlt:"Aerial atlas plate of circular Wonderland, its inhabited regions, roads, forests, farms, and mountain boundary.",description:"A working visual record of one inhabited circular country. Exterior evidence remains incomplete.",width:1920,height:1072}]},
 residents:{heading:"Residents and working populations",intro:"Named residents are one layer of a much larger civic population.",entries:otherAliceResidents.map((resident)=>({...resident,summary:[...resident.summary]}))},
 description:["Other Alice Adventures unfolds across the website as an illustrated serial, world archive, and developing interactive story system. Its stories, maps, diagrams, characters, creatures, artifacts, and records share one connected Wonderland.","Alice lives inside this country rather than passing through its famous scenes. She studies local conditions, prepares remedies, investigates routes, and works with people whose systems follow their own rules."],
 cover:"https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wonderland-wasteland-poster.webp",coverAlt:"Other Alice standing at a narrow boundary between wet Wonderland and hard geometric evidence beyond it.",
 heroMedia:{type:"image",file:"https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp",alt:"Aerial atlas of circular Wonderland."},paletteHook:"wonderland",characters:["alice","chester","the-hatter"],contributors:[{name:"d00d",role:"Creator"}],displayOrder:1,
}];

const seriesBySlug=new Map(storySeries.map((series)=>[series.slug,series]));
export function getStorySeries(slug:string|undefined|null){return slug?seriesBySlug.get(slug):undefined}
export function storySeriesPath(slug:string){return `/presents/${slug}/`}
export function getStorySeriesTitle(slug:string|undefined|null){return getStorySeries(slug)?.title??slug??"HobFarm Presents"}
