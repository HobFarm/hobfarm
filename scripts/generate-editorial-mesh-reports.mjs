import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { editorialMeshBackfill } from "./backfill-editorial-mesh.mjs";
import {
  editorialEntities,
  editorialSeries,
  getEditorialSection,
} from "../src/data/editorial-mesh.ts";

const articleRoot = path.resolve("src/content/articles");
const reportRoot = path.resolve("reports/editorial-mesh");

function files(directory) {
  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function parseArticle(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  const slug = path.relative(articleRoot, file).replaceAll("\\", "/").replace(/\.mdx?$/, "");
  return { slug, data: YAML.parse(match[1]) };
}

function isoDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function counts(values) {
  const map = new Map();
  for (const value of values.filter(Boolean)) map.set(value, (map.get(value) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
}

function table(rows) {
  return ["| Value | Articles |", "| --- | ---: |", ...rows.map(([value, count]) => `| ${value} | ${count} |`)].join("\n");
}

function csvCell(value) {
  const string = Array.isArray(value) || (value && typeof value === "object") ? JSON.stringify(value) : String(value ?? "");
  return `"${string.replaceAll('"', '""')}"`;
}

const articles = files(articleRoot)
  .map(parseArticle)
  .filter(({ data }) => !data.draft && !["draft", "archived"].includes(data.status))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const inventory = articles.map(({ slug, data }) => {
  const annotation = editorialMeshBackfill[slug];
  if (!annotation) throw new Error(`Missing migration annotation: ${slug}`);
  return {
    slug,
    title: data.title,
    status: data.status ?? "published",
    date: isoDate(data.publishedAt ?? data.pubDate),
    legacy: {
      category: data.category ?? "",
      department: data.department ?? "",
      series: data.series ?? "",
      presentsSeries: data.presentsSeries ?? "",
      workshopProgram: data.workshopProgram ?? "",
      entryType: data.entryType ?? "",
      format: data.format ?? "",
    },
    tags: data.tags ?? [],
    relatedArticles: data.relatedArticles ?? [],
    centralObject: annotation.centralObject,
    primarySection: data.mesh.section,
    subjects: data.mesh.subjects,
    seriesAndSpecials: data.mesh.series,
    entities: data.mesh.entities,
    sourceArtifacts: data.mesh.sourceArtifacts,
    storyModes: data.mesh.storyModes,
    confidence: annotation.confidence,
    ambiguityNotes: annotation.ambiguityNotes,
  };
});

fs.mkdirSync(reportRoot, { recursive: true });
fs.writeFileSync(
  path.join(reportRoot, "article-inventory.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), articleCount: inventory.length, articles: inventory }, null, 2)}\n`,
);

const csvHeaders = [
  "slug", "title", "status", "date", "category", "department", "legacySeries", "presentsSeries",
  "workshopProgram", "entryType", "format", "tags", "relatedArticles", "centralObject", "primarySection",
  "subjects", "seriesAndSpecials", "people", "organizations", "places", "events", "works", "publications",
  "technologies", "sourceArtifacts", "storyModes", "confidence", "ambiguityNotes",
];
const csvRows = inventory.map((item) => [
  item.slug, item.title, item.status, item.date, item.legacy.category, item.legacy.department,
  item.legacy.series, item.legacy.presentsSeries, item.legacy.workshopProgram, item.legacy.entryType,
  item.legacy.format, item.tags, item.relatedArticles, item.centralObject, item.primarySection, item.subjects,
  item.seriesAndSpecials, item.entities.people, item.entities.organizations, item.entities.places,
  item.entities.events, item.entities.works, item.entities.publications, item.entities.technologies,
  item.sourceArtifacts, item.storyModes, item.confidence, item.ambiguityNotes,
]);
fs.writeFileSync(
  path.join(reportRoot, "article-inventory.csv"),
  `${csvHeaders.map(csvCell).join(",")}\n${csvRows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`,
);

const taxonomyDimensions = ["category", "department", "series", "presentsSeries", "workshopProgram", "entryType", "format"];
const taxonomySections = taxonomyDimensions.map((key) => {
  const values = inventory.map((item) => item.legacy[key]);
  return `## ${key}\n\n${inventory.filter((item) => item.legacy[key]).length} of ${inventory.length} articles use this field.\n\n${table(counts(values))}`;
});
const currentTaxonomy = `# Current Article Taxonomy Audit

This inventory records ${inventory.length} published or scheduled articles. The one draft placeholder is excluded.

The legacy model mixes broad desks, formats, imprints, projects, series, and workflow programs. These fields remain in place for route and template compatibility, but they no longer define the canonical semantic layer.

${taxonomySections.join("\n\n")}

## Migration finding

No single legacy field can answer both “where should a reader browse?” and “what is this article connected to?” without collapsing distinct dimensions. The editorial mesh therefore gives each article one broad primary section and keeps its subjects, strict series, named entities, source artifacts, story modes, and explicit related articles separate.
`;
fs.writeFileSync(path.join(reportRoot, "current-taxonomy.md"), currentTaxonomy);

const sectionCounts = counts(inventory.map((item) => item.primarySection));
const seriesCounts = counts(inventory.flatMap((item) => item.seriesAndSpecials));
const subjectCounts = counts(inventory.flatMap((item) => item.subjects)).slice(0, 30);
const proposedMesh = `# Proposed Editorial Mesh

The corpus supports six broad reader-facing sections. Every one of the ${inventory.length} published or scheduled articles has exactly one.

## Primary sections

| Section | Articles | Definition | Exclusion test |
| --- | ---: | --- | --- |
${sectionCounts.map(([slug, count]) => {
  const section = getEditorialSection(slug);
  return `| ${section.label} | ${count} | ${section.definition} | ${section.exclusionTest} |`;
}).join("\n")}

## Strict series and specials

| Series | Articles | Membership rule |
| --- | ---: | --- |
${editorialSeries.map((series) => `| ${series.label} | ${seriesCounts.find(([id]) => id === series.id)?.[1] ?? 0} | ${series.membershipRule} |`).join("\n")}

Three legacy 3DM records do not pass the Dick Miller test. Their old fields and URLs remain, but the canonical \`mesh.series\` field omits 3DM so they do not appear in the strict series archive.

## Most-used subjects

${table(subjectCounts)}

## Canonical dimensions

- \`mesh.section\`: one stable human-facing shelf.
- \`mesh.subjects\`: conceptual domains that materially shape the article.
- \`mesh.series\`: rule-based recurring editorial properties.
- \`mesh.entities\`: canonical people, organizations, places, events, works, publications, and technologies.
- \`mesh.sourceArtifacts\`: artifacts that originate or organize the article, not ordinary citations.
- \`mesh.storyModes\`: recurring editorial engines such as archive trails, media genealogy, and systems investigation.
- \`relatedArticles\`: the existing explicit editorial override remains authoritative.

The old taxonomy remains an additive compatibility input. Public section navigation, structured article metadata, the related-reading fallback, and the public graph use the new mesh.
`;
fs.writeFileSync(path.join(reportRoot, "proposed-mesh.md"), proposedMesh);

const reviewItems = inventory.filter((item) => item.confidence !== "high" || item.ambiguityNotes);
const aliasRows = editorialEntities
  .filter((entity) => entity.aliases.length)
  .map((entity) => `| ${entity.label} | ${entity.id} | ${entity.aliases.join(", ")} |`)
  .join("\n");
const reviewQueue = `# Editorial Mesh Review Queue

The migration is structurally valid. These ${reviewItems.length} records retain a medium or low confidence note for editorial review; none blocks the schema, routes, or build.

| Article | Section | Confidence | Ambiguity or decision |
| --- | --- | --- | --- |
${reviewItems.map((item) => `| ${item.slug} | ${getEditorialSection(item.primarySection).label} | ${item.confidence} | ${item.ambiguityNotes || "Review the primary section against the central object."} |`).join("\n")}

## Strict legacy conflicts

- \`the-censor-eats-its-own-tail\`, \`they-had-names-doll-family\`, and \`topless-party-in-outer-space\` keep their legacy 3DM fields and URLs, but canonical 3DM membership is omitted because their article bodies contain no Dick Miller connection.
- Magazine Time Machine is canonical only for four articles with a specific magazine origin artifact: \`1956-automation\`, \`1985-future-tech\`, \`mad-trump-and-the-magazine-time-machine\`, and \`susan-denbergs-american-dream\`.

## Alias decisions

Aliases resolve to one internal entity ID and do not generate parallel archive routes.

| Display label | Canonical ID | Accepted aliases |
| --- | --- | --- |
${aliasRows}
`;
fs.writeFileSync(path.join(reportRoot, "review-queue.md"), reviewQueue);

console.log(`Generated five editorial mesh reports for ${inventory.length} articles.`);
console.log(`Section counts: ${sectionCounts.map(([slug, count]) => `${slug}=${count}`).join(", ")}`);
