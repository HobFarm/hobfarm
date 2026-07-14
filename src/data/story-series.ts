import { otherAliceCanon, otherAliceChronology, otherAliceResidents } from "@/data/other-alice-world-guide";

export type WorldConcept = { id:string; title:string; realm:string; image:string; imageAlt:string; description:string; width:number; height:number };
export type SeriesResident = { id:string; name:string; role:string; category:"character"|"faction"; image:string; imageAlt:string; summary:string[]; href?:string };
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
 seoTitle:"Other Alice Adventures: Wonderland World Guide", metaDescription:"Explore Wonderland as an inhabited country with regions, Houses, routes, civic time, visitor traces, ecology, residents, and an incomplete boundary record.",
 eyebrow:"HobFarm Presents", tagline:"A graphic novel that escaped the book and began using the whole website.",
 heroDeck:otherAliceChronology.startDeck,
 logline:otherAliceCanon.premise,
 heroIntro:["Wonderland is inhabited, maintained, traded, taxed, and argued over.","The public guide follows its regions, routes, institutions, organisms, and evidence without publishing private narrative records."],
 worldAtlas:{heading:"Wonderland at a glance",intro:["The public atlas moves from the Queen's central estate to the complete boundary mountain ring."],concepts:[{id:"living-atlas",title:"Living Wonderland atlas",realm:"Public world record",image:"https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp",imageAlt:"Aerial atlas plate of circular Wonderland, its inhabited regions, roads, forests, farms, and mountain boundary.",description:"A working visual record of one inhabited circular country. Exterior evidence remains incomplete.",width:1920,height:1072}]},
 residents:{heading:"Residents and working populations",intro:"Named residents are one layer of a much larger civic population.",entries:otherAliceResidents.map((resident)=>({...resident,summary:[...resident.summary]}))},
 description:["Other Alice Adventures uses the website as a public world guide: maps, diagrams, evidence objects, residents, institutions, ecology, and relationships.","Private narrative development remains outside public routes and bundles until it is reviewed for canon and publication."],
 cover:"https://cdn.hob.farm/pages/other-alice-adventures/other-alice-wonderland-wasteland-poster.webp",coverAlt:"Other Alice standing at a narrow boundary between wet Wonderland and hard geometric evidence beyond it.",
 heroMedia:{type:"image",file:"https://cdn.hob.farm/pages/other-alice-adventures/oaa-map-wonderland-living-atlas-v01-16x9.webp",alt:"Aerial atlas of circular Wonderland."},paletteHook:"wonderland",characters:["alice","chester","the-hatter"],contributors:[{name:"d00d",role:"Creator"}],displayOrder:1,
}];

const seriesBySlug=new Map(storySeries.map((series)=>[series.slug,series]));
export function getStorySeries(slug:string|undefined|null){return slug?seriesBySlug.get(slug):undefined}
export function storySeriesPath(slug:string){return `/departments/hobfarm-presents/${slug}/`}
export function getStorySeriesTitle(slug:string|undefined|null){return getStorySeries(slug)?.title??slug??"HobFarm Presents"}
