import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
const root=process.cwd(); const dist=join(root,"dist");
assert.ok(existsSync(dist),"dist/ is required; run npm run build first");
const files=[]; const walk=(dir)=>{for(const name of readdirSync(dir)){const path=join(dir,name);statSync(path).isDirectory()?walk(path):files.push(path)}}; walk(dist);
const text=files.filter((file)=>/\.(html|js|json|xml|txt|css|map)$/i.test(file)).map((file)=>readFileSync(file,"utf8")).join("\n");
for(const banned of ["The Boundary Table","openingCycle","causalLedger","unresolvedCanonQuestions","PrivateStoryRecord","privateCharacterOrigins","formativeInteraction","Green Queen","Red Queen"]) assert.equal(text.includes(banned),false,`public bundle contains banned private or withdrawn token: ${banned}`);
const otherAliceText=files
 .filter((file)=>{
  const normalized=file.replaceAll("\\","/");
  return /departments\/hobfarm-presents\/other-alice-adventures\//.test(normalized)||/characters\/(?:alice|chester)\/index\.html$/.test(normalized);
 })
 .filter((file)=>/\.(html|js|json|txt|css|map)$/i.test(file))
 .map((file)=>readFileSync(file,"utf8"))
 .join("\n");
for(const banned of [
 /Alice (?:is|was) trapped/i,
 /trying to (?:get|return) home/i,
 /survived (?:entirely )?alone/i,
 /Alice.{0,40}(?:eleven Wonderland years|age seven|age 7\b)/i,
 /150\s*(?:to|[–-])\s*200.{0,30}(?:outside|Earth) years/i,
 /The Matrix|The Witcher|The Secret of NIMH/,
]) assert.doesNotMatch(otherAliceText,banned,`Other Alice public output contains stale or internal-only canon: ${banned}`);
for(const required of [
 "Wonderland begins with a choice.",
 "Followed the White Rabbit into Wonderland at age 8.",
 "Chose to stay when a viable route home opened.",
 "Preparation, observation, persuasion, size change, and reciprocal help.",
 "Visitor record / Alice",
]) assert.ok(otherAliceText.includes(required),`Other Alice public output is missing current canon: ${required}`);
assert.ok(text.includes("Wonderland World Guide"),"World Guide output missing from public bundle");
assert.ok(text.includes("Cast of Wonderland"),"Cast output missing from public bundle");
console.log(`Other Alice public-bundle audit passed across ${files.length} files.`);
