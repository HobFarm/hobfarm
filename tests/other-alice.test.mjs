import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
const root=process.cwd(); const read=(file)=>readFileSync(join(root,file),"utf8");

test("Other Alice public navigation has five living-world entries",()=>{
 const nav=read("src/data/other-alice/navigation.ts");
 assert.deepEqual([...nav.matchAll(/label:\s*"([^"]+)"/g)].slice(0,5).map((match)=>match[1]),["Start Here","World Guide","Houses","Cast","Web of Wonderland"]);
 assert.doesNotMatch(nav,/Adventure|Atlas|Bestiary|Archive|Workshop/);
});

test("Start Here presents the persistent game without landing-page chronology",()=>{
 const page=read("src/components/presents/other-alice/OtherAliceStartPage.astro");
 const series=read("src/data/story-series.ts");
 const boundary=read("src/components/presents/other-alice/living-world/BoundaryRecord.astro");
 assert.match(page,/Wonderland is already alive\. Alice is only one person inside it\./);
 assert.match(page,/Why Other Alice\?/);
 assert.match(page,/How an Adventure takes shape/);
 assert.match(page,/WonderMachineDevelopment/);
 assert.match(page,/Each Adventure begins with something small\. The long-form story accumulates from what happens next\./);
 assert.match(page,/A persistent interactive story and illustrated living world\. Each campaign becomes its own long-form account\./);
 assert.match(page,/The familiar story is the entrance\. What happens next belongs to the visit\./);
 assert.match(page,/other-alice\.alice\.representative-landscape/);
 assert.match(page,/Wonderland is inhabited, maintained, traded, taxed, and argued over\./);
 assert.match(page,/The world does not wait for Alice\./);
 assert.doesNotMatch(page,/otherAliceChronology|chronologyRail|VisitorImprint|Age \d+|Wonderland time|Outside route/);
 assert.match(series,/Other Alice Adventures \| A Persistent Interactive Wonderland/);
 assert.match(series,/A persistent story game set in an authored Wonderland where choices, relationships, time, and consequences build the long-form account of each campaign/);
 assert.match(boundary,/Exterior record incomplete/);
 assert.doesNotMatch(page,/Read Adventure|Adventure No\.|current fragment/i);
});

test("Other Alice presents Wonder Machine as a private runtime alpha",()=>{
 const component=read("src/components/presents/other-alice/WonderMachineDevelopment.astro");
 const status=read("src/data/other-alice-development.ts");
 const combined=`${component}\n${status}`;
 for(const phrase of [
  "Wonderland can remember your visit",
  "finding the anomaly is optional",
  "Refusing it creates a different history",
  "An authored world, not an unlimited prompt",
  "Private runtime alpha",
  "no public build yet",
  "Explore the world guide",
  "Read how the Grimoire authors the world",
 ]) assert.match(combined,new RegExp(phrase));
 for(const forbidden of ["content hash","repository path","D1","R2","fixture.clockwork","Park Anomaly production"]) {
  assert.doesNotMatch(component,new RegExp(forbidden,"i"));
 }
});

test("static Adventure publishing is retired while withdrawn story routes still redirect",()=>{
 assert.equal(existsSync(join(root,"src/lib/adventures.ts")),false);
 assert.equal(existsSync(join(root,"src/components/presents/AdventureCard.astro")),false);
 assert.equal(existsSync(join(root,"src/pages/presents/[series]/[slug].astro")),false);
 assert.equal(existsSync(join(root,"src/pages/presents/[series]/[slug]/index.md.ts")),false);
 const contentConfig=read("src/content.config.ts");
 assert.doesNotMatch(contentConfig,/const adventures = defineCollection|getCollection\("adventures"\)/);
 assert.equal(existsSync(join(root,"src/content/adventures/adventure-no-01-the-boundary-table.md")),false);
 assert.equal(existsSync(join(root,"src/content/adventures/adventure-no-01-the-wrong-tunnel.md")),false);
 assert.equal(existsSync(join(root,"docs/other-alice/narrative-architecture/private/drafts/withdrawn-story-draft-01.md")),true);
 const redirects=read("public/_redirects"); assert.match(redirects,/adventure-no-01-the-boundary-table.*other-alice-adventures\//);
});

test("public chronology does not infer a fixed outside calendar",()=>{
 const publicSources=[
  read("src/data/story-series.ts"),
  read("src/data/characters.ts"),
  read("src/data/other-alice/canon.ts"),
  read("src/data/other-alice/visitors.ts"),
  read("src/data/other-alice/residents.ts"),
  read("src/components/presents/other-alice/OtherAliceStartPage.astro"),
  read("src/pages/presents/[series]/world-guide.astro"),
 ].join("\n");
 assert.doesNotMatch(publicSources,/2070s|150\s*[–-]\s*200|eleven years|arrived at seven|age 7\b/i);
 assert.match(publicSources,/outsideYears: "about 200 years"/);
 assert.doesNotMatch(read("src/data/story-series.ts"),/otherAliceChronology|otherAliceCanon/);
});

test("Alice's choices, method, and first home resolve from shared canon",()=>{
 const canon=read("src/data/other-alice/canon.ts");
 const visitors=read("src/data/other-alice/visitors.ts");
 const characters=read("src/data/characters.ts");
 const residents=read("src/data/other-alice/residents.ts");
 assert.match(canon,/Alice chose to follow the White Rabbit into Wonderland/);
 assert.match(canon,/viable route home opened(?: later)?, she chose to stay/i);
 assert.match(canon,/natural philosopher, field observer, potion and remedy maker/);
 assert.match(canon,/began calling the Cheshire Cat Chester/);
 assert.match(canon,/changing group of local helpers helped her establish the cabin/);
 assert.match(visitors,/choices: otherAlicePublicCanon\.choices/);
 assert.match(characters,/otherAlicePublicCanon\.method\.summary/);
 assert.match(characters,/otherAlicePublicCanon\.firstHome/);
 assert.match(residents,/livingWorldConnection: otherAlicePublicCanon\.localImprint/);
 const publicSources=[canon,visitors,characters,residents].join("\n");
 assert.doesNotMatch(publicSources,/Alice (?:is|was) trapped|trying to (?:get|return) home|survived (?:entirely )?alone|monster[- ]hunter|sword[- ]first/i);
});
