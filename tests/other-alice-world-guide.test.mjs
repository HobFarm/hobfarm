import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const read=(path)=>readFile(new URL(`../${path}`,import.meta.url),"utf8");

test("World Guide publishes the eight required sections",async()=>{
 const page=await read("src/pages/departments/hobfarm-presents/[series]/world-guide.astro");
 for(const id of ["regions","routes","access","time","visitors","ecology","residents","boundary"]) assert.match(page,new RegExp(`id=\\"${id}\\"`));
 assert.match(page,/SectionNav/); assert.match(page,/LivingAtlas/); assert.match(page,/RouteAtlas/); assert.match(page,/AccessSequence/); assert.match(page,/ThreeClocks/); assert.match(page,/VisitorImprint/);
});

test("visitor routes establish choice before imprint and attach Alice's record",async()=>{
 const [page,component,visitors,canon]=await Promise.all([
  read("src/pages/departments/hobfarm-presents/[series]/world-guide.astro"),
  read("src/components/presents/other-alice/living-world/VisitorImprint.astro"),
  read("src/data/other-alice/visitors.ts"),
  read("src/data/other-alice/canon.ts"),
 ]);
 assert.match(page,/05 \/ Visitors, choice, and time/);
 assert.match(page,/Wonderland begins with a choice\./);
 assert.match(page,/the final step belongs to the visitor/);
 for(const stage of ["Invitation","Recognition","Choice","Crossing"]) assert.match(visitors,new RegExp(`title: "${stage}"`));
 for(const stage of ["Contact","Residue","Uptake","Rejection or failure","Adaptation","Repetition","Institution or ecology","Myth or countereffect"]) assert.match(visitors,new RegExp(`title: "${stage}"`));
 assert.match(component,/threshold-route/);
 assert.match(component,/imprint-route/);
 assert.match(component,/<ol>/);
 assert.match(component,/aliceVisitorRecord/);
 assert.match(component,/Two choices establish the resident\./);
 assert.match(canon,/Followed the White Rabbit into Wonderland at age \$\{otherAliceCanon\.arrivedAge\}/);
 assert.match(canon,/Chose to stay when a viable route home opened\./);
 assert.doesNotMatch(page+component+visitors,/The Matrix|The Witcher|The Secret of NIMH/);
});

test("House assignments and sovereignty language match canon",async()=>{
 const houses=await read("src/data/other-alice/houses.ts"); const canon=await read("src/data/other-alice/canon.ts");
 assert.match(houses,/Diamonds.*Business, finance, processing, hospitality, markets, contracts, and distribution/s);
 assert.match(houses,/Spades.*Cultivation, water, fungi, labor, maintenance, repair/s);
 assert.match(houses,/Clubs.*Force, transport, security, depots, escorts, outer roads/s);
 assert.match(canon,/Hearts own the ground\. Diamonds own the business\. Spades keep it alive\. Clubs make sure it stays owned\./);
 assert.match(canon,/The Hearts own the map\. The other Houses own the places on it\./);
});

test("route, House, and relationship controls are keyboard and URL aware",async()=>{
 const route=await read("src/components/presents/other-alice/living-world/RouteAtlas.astro");
 const houses=await read("src/components/presents/other-alice/living-world/HousePowerStack.astro");
 const web=await read("src/components/presents/other-alice/OaaRelationshipWeb.astro");
 for(const source of [route,houses,web]){assert.match(source,/ArrowRight/);assert.match(source,/ArrowLeft/);assert.match(source,/searchParams/);assert.match(source,/aria-pressed/)}
 assert.match(web,/Connection ledger/); assert.match(web,/Evidence:/); assert.match(web,/role="img"/);
 for(const source of [route,houses,web]) assert.match(source,/valid\.includes/);
});

test("every public relationship and map region has a text evidence path",async()=>{
 const relationships=await read("src/data/other-alice/relationships.ts");
 const edges=[...relationships.matchAll(/\{ id: "[^"]+"[^}]+evidence: "[^"]+"[^}]+\}/g)].map((match)=>match[0]);
 assert.ok(edges.length>0);
 assert.equal(edges.every((edge)=>/evidence:\s*"[^"]+"/.test(edge)),true);
 const atlas=await read("src/components/presents/other-alice/living-world/LivingAtlas.astro");
 assert.match(atlas,/atlas-fallback/);
 assert.match(atlas,/regions\.map/);
});

test("Hatter material is labeled as a disputed reconstruction",async()=>{
 const characters=await read("src/data/characters.ts");
 const start=characters.indexOf('slug: "the-hatter"');
 const end=characters.indexOf('slug: "hillary-hobfarm"');
 const hatter=characters.slice(start,end);
 assert.match(hatter,/Disputed working reconstruction/);
 assert.doesNotMatch(hatter,/failed consignment|Mad Tea Party|punitive substance|Napoleon/i);
});

test("private narrative modules are excluded from the public barrel",async()=>{
 const barrel=await read("src/data/other-alice/index.ts");
 assert.doesNotMatch(barrel,/\.\/private/);
 const publicImports=await Promise.all(["src/components/presents/other-alice/OtherAliceStartPage.astro","src/pages/departments/hobfarm-presents/[series]/world-guide.astro","src/pages/departments/hobfarm-presents/other-alice-adventures/houses/index.astro","src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro","src/pages/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/index.astro"].map(read));
 assert.doesNotMatch(publicImports.join("\n"),/other-alice\/private|opening-cycle|causal-ledger|open-canon/);
});

test("asset records carry alt text, status, crop guidance, and public visibility",async()=>{
 const assets=await read("src/data/other-alice/assets.ts");
 for(const field of ["aspectRatio:","cropNotes:","status:","altText:","visibility:","tool:","referenceImages:"]) assert.match(assets,new RegExp(field));
 assert.match(assets,/oaa-map-wonderland-living-atlas-v01-16x9/);
 assert.match(assets,/publicOtherAliceAssets.*visibility === "public".*status === "published"/s);
});

test("public Workshop contact sheet exposes process without private records",async()=>{
 const sheet=await read("src/components/presents/other-alice/living-world/WorkshopContactSheet.astro");
 const start=await read("src/components/presents/other-alice/OtherAliceStartPage.astro");
 assert.match(start,/WorkshopContactSheet/);
 assert.match(sheet,/asset\.visibility === "public" \|\| asset\.visibility === "teaser"/);
 assert.doesNotMatch(sheet,/other-alice\/private|openingCycle|causalLedger/);
});
