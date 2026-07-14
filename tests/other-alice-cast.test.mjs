import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/(?:([A-Za-z]:))/, "$1"));
const read = (file) => readFile(path.join(root, file), "utf8");

async function publicSourceBundle() {
  const files = [];
  const walk = async (directory) => {
    for (const name of await readdir(directory)) {
      const fullPath = path.join(directory, name);
      if ((await stat(fullPath)).isDirectory()) {
        if (fullPath.includes(`${path.sep}other-alice${path.sep}private`)) continue;
        await walk(fullPath);
      } else if (/\.(?:ts|tsx|astro|mjs)$/.test(name)) {
        files.push(fullPath);
      }
    }
  };
  await walk(path.join(root, "src"));
  return (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
}

test("public cast records have unique stable IDs and slugs", async () => {
  const residents = await read("src/data/other-alice/residents.ts");
  const recordBlock = residents.slice(
    residents.indexOf("const records:"),
    residents.indexOf("export const otherAliceResidents"),
  );
  const ids = [...recordBlock.matchAll(/^    id: "([^"]+)"/gm)].map((match) => match[1]);
  const slugs = [...recordBlock.matchAll(/^    slug: "([^"]+)"/gm)].map((match) => match[1]);
  assert.equal(ids.length, 14);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const required of [
    "other-alice", "chester", "ciryl-spade", "queen-of-hearts", "hatter",
    "white-rabbit", "rabbit-guild", "caterpillar", "club-road-crews",
    "tweedledum", "tweedledee", "humpty-dumpty", "mock-turtle", "gryphon",
  ]) assert.ok(ids.includes(required), `missing ${required}`);
});

test("paired and institutional records remain distinct", async () => {
  const residents = await read("src/data/other-alice/residents.ts");
  const tweedleGroupRefs = [...residents.matchAll(/displayGroupRef: "tweedle-pair"/g)];
  assert.equal(tweedleGroupRefs.length, 2);
  assert.match(residents, /id: "tweedledum"[\s\S]*?id: "tweedledee"/);
  assert.match(residents, /id: "white-rabbit"[\s\S]*?entityKind: "resident"/);
  assert.match(residents, /id: "rabbit-guild"[\s\S]*?entityKind: "institution"/);
});

test("Alice chronology is derived from the centralized canon record", async () => {
  const residents = await read("src/data/other-alice/residents.ts");
  const alice = residents.slice(residents.indexOf('id: "other-alice"'), residents.indexOf('id: "chester"'));
  assert.match(alice, /otherAliceChronology\.residentSummary/);
  assert.doesNotMatch(alice, /arrivedAge|presentAge|wonderlandYears|arrived at (?:eight|8)|is (?:eighteen|18) now/i);
});

test("the Green Queen remains a withheld private development record", async () => {
  const origins = await read("src/data/other-alice/private/character-origins.ts");
  const publicBundle = await publicSourceBundle();
  assert.match(origins, /characterRef: "green-queen"[\s\S]*?publicDisclosure: "withheld"/);
  assert.doesNotMatch(publicBundle, /Green Queen|green-queen|Red Queen|red-queen/i);
});

test("private origin mechanics are never imported or copied into public modules", async () => {
  const publicBundle = await publicSourceBundle();
  for (const token of [
    "character-origins",
    "privateCharacterOrigins",
    "formativeInteraction",
    "precontactLocalPosition",
    "visitorFunction",
    "localChoice",
    "uptakePath",
  ]) assert.doesNotMatch(publicBundle, new RegExp(token, "i"));
  const barrel = await read("src/data/other-alice/index.ts");
  assert.doesNotMatch(barrel, /\.\/private/);
});

test("cast route is wired into navigation, search, and sitemap", async () => {
  const [canon, nav, page, search, sitemap] = await Promise.all([
    read("src/data/other-alice/canon.ts"),
    read("src/data/other-alice/navigation.ts"),
    read("src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro"),
    read("src/lib/search-index.ts"),
    read("src/pages/sitemap.xml.ts"),
  ]);
  assert.match(canon, /OTHER_ALICE_CAST_PATH/);
  assert.match(nav, /label: "Cast"/);
  assert.match(page, /current="cast"/);
  assert.match(page, /publicOtherAliceCast/);
  assert.match(search, /title: "Cast of Wonderland"/);
  assert.match(sitemap, /otherAliceProjectNav/);
});

test("cast presentation is data-derived and complete without character art", async () => {
  const [page, folio] = await Promise.all([
    read("src/pages/departments/hobfarm-presents/other-alice-adventures/cast/index.astro"),
    read("src/components/presents/other-alice/cast/CastDossierFolio.astro"),
  ]);
  assert.match(page, /otherAliceCastGroups\.flatMap/);
  assert.doesNotMatch(page, /Queen of Hearts|White Rabbit|Tweedledum|Mock Turtle/);
  assert.match(folio, /folio-fallback/);
  assert.match(folio, /Visual design pending/);
  assert.match(folio, /record\.image \?/);
  assert.match(folio, /OTHER_ALICE_WEB_PATH/);
  assert.match(folio, /#node-\$\{record\.id\}/);
});

test("public relationship output includes the safe cast edges only", async () => {
  const relationships = await read("src/data/other-alice/relationships.ts");
  for (const id of [
    "alice-chester", "alice-queen", "alice-hatter", "rabbit-guild-membership",
    "hatter-tea-system", "caterpillar-mushroom", "tweedle-pair", "old-edge-witnesses",
  ]) assert.match(relationships, new RegExp(`id: "${id}"`));
  assert.doesNotMatch(relationships, /Green Queen|green-queen|Red Queen|red-queen/i);
});

test("approved promoted asset URLs match the recorded source hashes", async () => {
  const [assets, manifest] = await Promise.all([
    read("src/data/other-alice/assets.ts"),
    read("reports/other-alice-living-world/asset-manifest.md"),
  ]);
  assert.match(assets, /oaa-map-wonderland-living-atlas-v01-16x9\.webp/);
  assert.match(assets, /oaa-poster-other-alice-two-worlds-v01-2x3\.avif/);
  assert.match(manifest, /56cb06efd0e69eb2718e4b17a1c11a5aeb77fe1de283104f2e458d48eae90003/i);
  assert.match(manifest, /8a32ce2725333fb9707398860a09d54ea087fda235d758f21a53b77ee7b29f17/i);
  assert.match(manifest, /c2d9721963ce94c3f1bd1fa0ca76918dcdd0d7405250c8ff0d2905e8518025e4/i);
});

test("withdrawn Adventures remain redirected and absent from public content", async () => {
  const [redirects, qa] = await Promise.all([
    read("public/_redirects"),
    read("scripts/qa-other-alice.mjs"),
  ]);
  for (const slug of ["adventure-no-01-the-boundary-table", "adventure-no-01-the-wrong-tunnel"]) {
    assert.match(redirects, new RegExp(slug));
    assert.match(qa, new RegExp(slug));
  }
});
