import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { parse } from "yaml";
import {
  getEditorialEntity,
  getEditorialSubject,
} from "../src/data/editorial-mesh.ts";
import {
  getArticleDek,
  getArticleDescription,
  getArticleDocumentTitle,
} from "../src/lib/article-metadata.ts";

const root = process.cwd();
const articleRoot = join(root, "src", "content", "articles");
const siteOrigin = "https://hob.farm";

function articleFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return articleFiles(path);
    return /\.mdx?$/.test(entry.name) ? [path] : [];
  });
}

function readArticle(path) {
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${relative(root, path)} has no YAML frontmatter.`);

  const data = parse(match[1]);
  const id = relative(articleRoot, path).replaceAll("\\", "/").replace(/\.mdx?$/, "");
  const slug = basename(id);
  return { data, id, path, slug };
}

function releaseDate(entry) {
  const value = entry.data.publishedAt ?? entry.data.pubDate;
  return value ? new Date(value) : undefined;
}

function isUpcoming(entry, now = new Date()) {
  const release = releaseDate(entry);
  return (
    entry.data.status === "scheduled" &&
    !entry.data.draft &&
    release &&
    release.getTime() > now.getTime()
  );
}

function prefix(value, length) {
  const characters = Array.from(value);
  return characters.length <= length
    ? value
    : `${characters.slice(0, length).join("")}…`;
}

function conceptLabels(entry) {
  return (entry.data.mesh?.subjects ?? []).map(
    (id) => getEditorialSubject(id)?.label ?? id,
  );
}

function entityLabels(entry) {
  const entities = entry.data.mesh?.entities ?? {};
  return Object.entries(entities).flatMap(([type, ids]) =>
    ids.slice(0, 3).map((id) => `${getEditorialEntity(id)?.label ?? id} (${type})`),
  );
}

function canonicalUrl(entry) {
  const path = entry.data.canonical ?? `/articles/${entry.id}/`;
  return new URL(path, siteOrigin).toString();
}

function printPreview(entry) {
  const searchTitle = getArticleDocumentTitle(entry.data);
  const description = getArticleDescription(entry.data);
  const dek = getArticleDek(entry.data);
  const concepts = conceptLabels(entry);
  const entities = entityLabels(entry);
  const release = releaseDate(entry);

  console.log(`\n=== ${entry.slug} ===`);
  console.log(`Editorial H1:      ${entry.data.title}`);
  console.log(`Search title:      ${searchTitle}`);
  console.log(`Meta description:  ${description}`);
  console.log(`Visible dek start: ${prefix(dek, 180)}`);
  console.log(`Canonical URL:     ${canonicalUrl(entry)}`);
  console.log(`Primary concepts:  ${concepts.length ? concepts.join("; ") : "None declared"}`);
  console.log(`Primary entities:  ${entities.length ? entities.join("; ") : "None declared"}`);
  console.log(`Short title view:  ${prefix(searchTitle, 45)}`);
  console.log(`Medium title view: ${prefix(searchTitle, 65)}`);
  console.log(`Title source:      ${entry.data.seoTitle ? "authored seoTitle" : "editorial title fallback"}`);
  console.log(`Description source:${entry.data.description ? " authored description" : entry.data.dek ? " visible dek fallback" : " excerpt fallback"}`);
  if (release) console.log(`Release:           ${release.toISOString()} (${entry.data.status ?? "published"})`);
}

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("Usage: npm run preview:article-search -- [slug ...]");
  console.log("Without a slug, the command previews every future scheduled article.");
  process.exit(0);
}

const entries = articleFiles(articleRoot).map(readArticle);
const requestedSlugs = args.filter((arg) => !arg.startsWith("--"));
let selected;

if (requestedSlugs.length) {
  const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  const missing = requestedSlugs.filter((slug) => !bySlug.has(slug));
  if (missing.length) {
    console.error(`Unknown article slug${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
    process.exit(1);
  }
  selected = requestedSlugs.map((slug) => bySlug.get(slug));
} else {
  selected = entries
    .filter((entry) => isUpcoming(entry))
    .sort((a, b) => releaseDate(a).getTime() - releaseDate(b).getTime());
}

if (!selected.length) {
  console.log("No future scheduled articles found. Pass an article slug to preview it directly.");
  process.exit(0);
}

for (const entry of selected) printPreview(entry);
