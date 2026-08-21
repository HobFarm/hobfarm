import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { auditEditorialMesh } from "../scripts/audit-editorial-mesh.mjs";
import {
  editorialEntities,
  normalizeEditorialAlias,
} from "../src/data/editorial-mesh.ts";
import { isArticlePublicAt } from "../src/lib/article-publication.ts";
import { scoreEditorialMeshRelated } from "../src/lib/editorial-mesh.ts";

const emptyEntities = () => ({
  people: [],
  organizations: [],
  places: [],
  events: [],
  works: [],
  publications: [],
  technologies: [],
});

test("the migrated corpus has one valid primary section per live article", () => {
  const result = auditEditorialMesh();
  assert.equal(result.articles.length, 80);
  assert.equal(result.liveArticles.length, 79);
  assert.deepEqual(result.errors, []);
  assert.ok(result.liveArticles.every(({ data }) => data.mesh?.section));
});

test("strict MTM and 3DM membership survives the corpus audit", () => {
  const { liveArticles } = auditEditorialMesh();
  const mtm = liveArticles.filter(({ data }) => data.mesh.series.includes("magazine-time-machine"));
  const threeDm = liveArticles.filter(({ data }) => data.mesh.series.includes("3dm"));
  assert.equal(mtm.length, 4);
  assert.equal(threeDm.length, 5);
  assert.ok(
    mtm.every(({ data }) =>
      data.mesh.sourceArtifacts.some(
        (artifact) => artifact.type === "magazine" && artifact.role === "origin" && artifact.publication,
      ),
    ),
  );
  assert.ok(threeDm.every(({ data, body }) => data.mesh.entities.people.includes("dick-miller") && /Dick Miller/i.test(body)));
});

test("canonical entity aliases do not create parallel nodes", () => {
  const aliasMap = new Map();
  for (const entity of editorialEntities) {
    for (const value of [entity.id, entity.label, ...entity.aliases]) {
      const alias = normalizeEditorialAlias(value);
      assert.ok(!aliasMap.has(alias) || aliasMap.get(alias) === entity.id, `${value} duplicates ${aliasMap.get(alias)}`);
      aliasMap.set(alias, entity.id);
    }
  }
  assert.equal(aliasMap.get(normalizeEditorialAlias("The Grateful Dead")), "grateful-dead");
  assert.equal(aliasMap.get(normalizeEditorialAlias("Hugh Romney")), "wavy-gravy");
  assert.equal(aliasMap.get(normalizeEditorialAlias("Bonnie Beecher")), "jahanara-romney");
});

test("meaningful mesh overlap outranks a same-section recency fallback", () => {
  const current = {
    section: "culture",
    subjects: ["counterculture", "media-history"],
    series: [],
    entities: { ...emptyEntities(), people: ["wavy-gravy"] },
  };
  const recentSameSection = {
    section: "culture",
    subjects: ["publishing"],
    series: [],
    entities: emptyEntities(),
  };
  const connectedOlderArticle = {
    section: "music",
    subjects: ["counterculture", "media-history"],
    series: [],
    entities: { ...emptyEntities(), people: ["wavy-gravy"] },
  };

  const recentScore = scoreEditorialMeshRelated(current, recentSameSection);
  const connectedScore = scoreEditorialMeshRelated(current, connectedOlderArticle);
  assert.ok(connectedScore.score > recentScore.score);
  assert.match(connectedScore.reasons.join("; "), /Wavy Gravy/);
});

test("scheduled articles stay out of public output until their release instant", () => {
  const scheduled = {
    status: "scheduled",
    publishedAt: "2030-01-02T00:20:00.000Z",
    pubDate: "2030-01-02",
  };
  assert.equal(isArticlePublicAt(scheduled, new Date("2030-01-02T00:19:59.999Z")), false);
  assert.equal(isArticlePublicAt(scheduled, new Date("2030-01-02T00:20:00.000Z")), true);
  assert.equal(isArticlePublicAt({ ...scheduled, draft: true }, new Date("2031-01-01")), false);

  const graphRoute = readFileSync("src/pages/articles/mesh.json.ts", "utf8");
  assert.match(graphRoute, /getPublishedArticles\(\)/);
  assert.doesNotMatch(graphRoute, /getCollection\(/);
});
