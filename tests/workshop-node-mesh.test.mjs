import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  acadiaComposition,
  primaryComposition,
  publicHobFarmEdges,
  publicHobFarmNodes,
} from "../src/data/workshop-node-mesh.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Workshop Projects keeps eight current records and one historical EZIZE origin", () => {
  const page = read("src/pages/workshop/projects/index.astro");
  const projects = read("src/data/workshop-projects.ts");

  assert.equal(existsSync(new URL("../src/pages/workshop/projects/hobfarm/index.astro", import.meta.url)), true);
  assert.match(page, /Different jobs need different systems/);
  assert.match(page, /WorkshopProjectGrid surface="projects"/);
  const current = projects.slice(projects.indexOf("export const selectedWorkshopProjects"), projects.indexOf("export const historicalWorkshopProjects"));
  const historical = projects.slice(projects.indexOf("export const historicalWorkshopProjects"), projects.indexOf("export function getWorkshopProject"));
  for (const id of ["ezize", "hobfarm-site", "stylefusion", "before-after", "future-carriage", "character-mannequin", "avatar-host", "other-alice-world"]) {
    assert.match(current, new RegExp(`id: "${id}"`));
  }
  assert.doesNotMatch(current, /id: "cute-corrupted"/);
  assert.match(historical, /id: "cute-corrupted"[\s\S]*title: "EZIZE Origins"/);
  assert.match(historical, /status: "Project origin"/);
});

test("the public mesh stays typed, static, semantic, and tied to real routes", () => {
  const mesh = read("src/data/workshop-node-mesh.ts");
  const diagram = read("src/components/workshop/WorkshopNodeMesh.astro");

  for (const kind of ["surface", "project", "workflow", "application", "subject", "composite", "infrastructure", "destination", "record"]) {
    assert.match(mesh, new RegExp(`"${kind}"`));
  }
  for (const href of ["/workshop/projects/hobfarm/", "/ezize/", "/workshop/stylefusion/", "/workshop/before-and-after/", "/workshop/future-carriage/", "/workshop/avatar-host/", "/presents/other-alice-adventures/world-guide/"]) {
    assert.match(mesh, new RegExp(href.replaceAll("/", "\\/")));
  }
  assert.match(mesh, /id: "ezize", projectId: "ezize", label: "EZIZE", kind: "application"/);
  assert.match(diagram, /Curated HobFarm nodes/);
  assert.match(diagram, /Relationships with jobs/);
  assert.match(diagram, /from\.href \? <a href=\{from\.href\}/);
  assert.match(diagram, /to\.href \? <a href=\{to\.href\}/);
  assert.doesNotMatch(diagram, /canvas|WebGL|three|force-graph|<svg/i);
});

test("public mesh edges resolve and project-backed nodes align with the project registry", () => {
  const nodeById = new Map(publicHobFarmNodes.map((node) => [node.id, node]));
  const projectSource = read("src/data/workshop-projects.ts");
  const projectById = new Map(
    [...projectSource.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?destination:\s*"([^"]+)"/g)]
      .map((match) => [match[1], match[2]]),
  );

  assert.equal(nodeById.size, publicHobFarmNodes.length, "Public node ids must be unique.");
  for (const node of publicHobFarmNodes) {
    if (node.href) {
      assert.match(node.href, /^\/(?!account|api\/|login)/);
      assert.ok(node.href.endsWith("/"), `${node.id} must use a canonical trailing slash.`);
    }
    if (node.projectId) {
      const project = projectById.get(node.projectId);
      assert.ok(project, `${node.id} must map to a Workshop project record.`);
      assert.equal(node.href, project, `${node.id} must use the project registry destination.`);
    }
  }

  for (const edge of publicHobFarmEdges) {
    assert.ok(nodeById.has(edge.from), `${edge.from} must resolve to a public node.`);
    assert.ok(nodeById.has(edge.to), `${edge.to} must resolve to a public node.`);
  }
});

test("project and article relationships use established structured-data semantics", () => {
  const projects = read("src/pages/workshop/projects/index.astro");
  const hobfarm = read("src/pages/workshop/projects/hobfarm/index.astro");
  const articleLayout = read("src/layouts/ArticleLayout.astro");

  assert.match(projects, /hasPart/);
  assert.match(projects, /ItemList/);
  assert.match(hobfarm, /mainEntityOfPage/);
  assert.match(hobfarm, /isPartOf/);
  assert.match(articleLayout, /about: subjectEntities/);
  assert.match(articleLayout, /mentions: mentionedEntities/);
  assert.match(articleLayout, /citation: citations/);
  assert.doesNotMatch(`${projects}\n${hobfarm}\n${articleLayout}`, /hobfarmNode|meshConnection|relatedBecause|aiRelationship/);
});

test("HobFarm project centers independent nodes and keeps the working loop subordinate", () => {
  const page = read("src/pages/workshop/projects/hobfarm/index.astro");
  const diagram = read("src/components/workshop/HobFarmProductionDiagram.astro");
  const anatomy = read("src/components/workshop/ProjectNodeAnatomy.astro");
  const combined = `${page}\n${diagram}\n${anatomy}`;

  for (const phrase of ["Useful work can stand alone and still connect", "What is a node?", "Each node stands alone", "Connections have jobs", "Composition creates another node", "Nodes can compose again", "Articles become a living book", "Tools can change", "How one node develops", "Find the cost", "Put it somewhere"]) {
    assert.match(combined, new RegExp(phrase));
  }
  assert.ok(page.indexOf("Composition creates another node") < page.indexOf("How one node develops"));
  assert.match(page, /workshop\.hobfarm-project\.process/);
  assert.match(combined, /does not have to become a business for the work to be useful/i);
});

test("composition examples preserve parent nodes and label hypothetical work", () => {
  const page = read("src/pages/workshop/projects/hobfarm/index.astro");
  const diagram = read("src/components/workshop/NodeCompositionDiagram.astro");

  assert.equal(primaryComposition.status, "working");
  assert.equal(acadiaComposition.status, "hypothetical");
  assert.equal(primaryComposition.inputs.length, 2);
  assert.equal(acadiaComposition.inputs.length, 2);
  for (const example of [primaryComposition, acadiaComposition]) {
    for (const input of example.inputs) assert.ok(input.contribution.length > 20);
  }
  assert.match(diagram, /remains independently reusable/);
  assert.match(diagram, /contributes to/);
  assert.match(page, /not a factual Acadia study/);
  assert.match(page, /National Park Service/);
  assert.doesNotMatch(diagram, /canvas|WebGL|three|force-graph|<svg/i);
});

test("HobFarm project uses released Articles for the living-book example", () => {
  const page = read("src/pages/workshop/projects/hobfarm/index.astro");
  const diagram = read("src/components/workshop/ArticleSubjectMesh.astro");
  const subjectRoute = read("src/pages/articles/topics/[subject].astro");

  assert.match(page, /getPublishedArticles/);
  assert.match(page, /model-behavior/);
  for (const slug of ["gary-and-the-fork", "goth-get-boots"]) {
    assert.match(page, new RegExp(`"${slug}"`));
  }
  assert.match(diagram, /Released Article/);
  assert.match(diagram, /Recurring subject/);
  assert.match(diagram, /Each Article remains readable on its own/);
  assert.match(subjectRoute, /subject\.count >= 2/);
  assert.doesNotMatch(diagram, /canvas|WebGL|three|force-graph|<svg/i);
});

test("Presents Funnies overview uses a dark panel while the canonical Funnies page remains independent", () => {
  const presents = read("src/pages/presents/index.astro");
  const funnies = read("src/pages/presents/funnies/index.astro");

  assert.match(presents, /\.theme-comics\{[^}]*background:[^}]*#141013/);
  assert.doesNotMatch(presents, /\.theme-comics\{[^}]*#f4f2ed/);
  assert.match(funnies, /BaseLayout/);
});
