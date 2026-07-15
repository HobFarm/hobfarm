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

test("Start Here uses the approved hero and chronology",()=>{
 const page=read("src/components/presents/other-alice/OtherAliceStartPage.astro");
 const canon=read("src/data/other-alice/canon.ts");
 const boundary=read("src/components/presents/other-alice/living-world/BoundaryRecord.astro");
 assert.match(canon,/arrivedAge: 8/);
 assert.match(canon,/presentAge: 18/);
 assert.match(canon,/wonderlandYears: 10/);
 assert.match(canon,/outsideYears: "about 200 years"/);
 assert.match(page,/otherAliceChronology\.startDeck/);
 assert.match(page,/A graphic novel that escaped the book and began using the whole website\./);
 assert.match(page,/otherAliceChronology\.rail/);
 assert.match(page,/Wonderland is inhabited, maintained, traded, taxed, and argued over\./);
 assert.match(page,/The world does not wait for Alice\./);
 assert.match(boundary,/Exterior record incomplete/);
 assert.doesNotMatch(page,/Read Adventure|Adventure No\.|current fragment/i);
});

test("withdrawn story routes redirect and story files are outside public content",()=>{
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
  read("src/pages/departments/hobfarm-presents/[series]/world-guide.astro"),
 ].join("\n");
 assert.doesNotMatch(publicSources,/2070s|150\s*[–-]\s*200|eleven years|arrived at seven|age 7\b/i);
 assert.match(publicSources,/outsideYears: "about 200 years"/);
 assert.match(read("src/data/story-series.ts"),/otherAliceChronology\.startDeck/);
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
