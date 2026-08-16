import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { publicHobFarmEdges, publicHobFarmNodes } from "../src/data/workshop-node-mesh.ts";

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

test("the public mesh stays typed, static, and tied to real routes", () => {
  const mesh = read("src/data/workshop-node-mesh.ts");
  const diagram = read("src/components/workshop/WorkshopNodeMesh.astro");

  for (const kind of ["surface", "project", "infrastructure", "destination", "record"]) {
    assert.match(mesh, new RegExp(`"${kind}"`));
  }
  for (const href of ["/workshop/projects/hobfarm/", "/ezize/", "/workshop/stylefusion/", "/workshop/before-and-after/", "/workshop/future-carriage/", "/presents/other-alice-adventures/world-guide/"]) {
    assert.match(mesh, new RegExp(href.replaceAll("/", "\\/")));
  }
  assert.match(mesh, /id: "applications", label: "Applications", kind: "surface"/);
  assert.match(diagram, /<svg/);
  assert.match(diagram, /from\.href \? <a href=\{from\.href\}/);
  assert.match(diagram, /to\.href \? <a href=\{to\.href\}/);
  assert.doesNotMatch(diagram, /canvas|WebGL|three|force-graph/i);
});

test("public mesh edges resolve and project nodes stay aligned with the project registry", () => {
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
    if (node.kind === "project") {
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

test("HobFarm project follows the working loop described by the project record", () => {
  const page = read("src/pages/workshop/projects/hobfarm/index.astro");
  const diagram = read("src/components/workshop/HobFarmProductionDiagram.astro");
  const editorialFlow = read("src/components/workshop/EditorialProductionFlow.astro");
  const combined = `${page}\n${diagram}\n${editorialFlow}`;

  for (const phrase of ["How projects develop", "Working record", "Adding something new", "Editorial production", "Revision is the work", "Connected work", "Find the cost", "Put it somewhere"]) {
    assert.match(combined, new RegExp(phrase));
  }
  assert.match(combined, /The repository shows what actually changed/i);
  assert.match(combined, /does not have to become a business for the work to be useful/i);
});

test("HobFarm project documents editorial production with public proof", () => {
  const page = read("src/pages/workshop/projects/hobfarm/index.astro");
  const editorialFlow = read("src/components/workshop/EditorialProductionFlow.astro");

  for (const step of ["Trigger", "Research question", "Source collection", "Claim checking", "Structure", "Draft and revision", "Visual evidence", "Publish"]) {
    assert.match(editorialFlow, new RegExp(step));
  }
  assert.match(page, /Current models accelerate parts of an existing method/);
  assert.match(page, /Model output is not evidence merely because a model produced it/);
  assert.match(page, /A Workshop Note remains one canonical Article record and URL/);
  assert.match(page, /The site is a network, not a required funnel/);
  assert.match(page, /getPublishedArticles/);
  for (const slug of ["trash-mountain", "hey-its-that-guy", "the-model-is-free"]) {
    assert.match(page, new RegExp(`slug: "${slug}"`));
  }
  assert.equal((page.match(/slug: "/g) ?? []).length, 3);
  assert.match(page, /href="\/articles\/"/);
  assert.doesNotMatch(page, /private chat|raw prompt/i);
});

test("Presents Funnies overview uses a dark panel while the canonical Funnies page remains independent", () => {
  const presents = read("src/pages/presents/index.astro");
  const funnies = read("src/pages/presents/funnies/index.astro");

  assert.match(presents, /\.theme-comics\{[^}]*background:[^}]*#141013/);
  assert.doesNotMatch(presents, /\.theme-comics\{[^}]*#f4f2ed/);
  assert.match(funnies, /BaseLayout/);
});
