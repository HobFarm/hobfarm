import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import YAML from "yaml";
import {
  editorialEntities,
  editorialEntityTypes,
  editorialSectionSlugs,
  editorialSeriesIds,
  editorialStoryModes,
  editorialSubjectIds,
  normalizeEditorialAlias,
} from "../src/data/editorial-mesh.ts";

const articleRoot = path.resolve("src/content/articles");

function articleFiles(directory) {
  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

function readArticle(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  return {
    slug: path.relative(articleRoot, file).replaceAll("\\", "/").replace(/\.mdx?$/, ""),
    data: YAML.parse(match[1]),
    body: raw.slice(match[0].length),
  };
}

function duplicates(values) {
  const seen = new Set();
  return values.filter((value) => (seen.has(value) ? true : (seen.add(value), false)));
}

export function auditEditorialMesh() {
  const articles = articleFiles(articleRoot).map(readArticle);
  const liveArticles = articles.filter(
    ({ data }) => !data.draft && !["draft", "archived"].includes(data.status),
  );
  const slugs = new Set(articles.map(({ slug }) => slug));
  const sections = new Set(editorialSectionSlugs);
  const subjects = new Set(editorialSubjectIds);
  const series = new Set(editorialSeriesIds);
  const modes = new Set(editorialStoryModes);
  const entities = new Map(editorialEntities.map((entity) => [entity.id, entity]));
  const errors = [];
  const warnings = [];
  const usedEntities = new Set();

  const aliasOwners = new Map();
  for (const entity of editorialEntities) {
    for (const value of [entity.id, entity.label, ...entity.aliases]) {
      const alias = normalizeEditorialAlias(value);
      const owner = aliasOwners.get(alias);
      if (owner && owner !== entity.id) {
        errors.push(`registry: alias "${value}" resolves to both ${owner} and ${entity.id}`);
      } else {
        aliasOwners.set(alias, entity.id);
      }
    }
  }

  const duplicateEntityIds = duplicates(editorialEntities.map((entity) => entity.id));
  for (const id of duplicateEntityIds) errors.push(`registry: duplicate entity ID ${id}`);

  for (const article of liveArticles) {
    const { slug, data, body } = article;
    const mesh = data.mesh;
    if (!mesh) {
      errors.push(`${slug}: missing mesh metadata`);
      continue;
    }
    if (!sections.has(mesh.section)) errors.push(`${slug}: unknown section ${mesh.section}`);
    if (!Array.isArray(mesh.subjects) || mesh.subjects.length === 0) {
      errors.push(`${slug}: subjects must contain at least one meaningful value`);
    } else {
      for (const subject of mesh.subjects) {
        if (!subjects.has(subject)) errors.push(`${slug}: unknown subject ${subject}`);
      }
      for (const subject of duplicates(mesh.subjects)) errors.push(`${slug}: duplicate subject ${subject}`);
    }
    if (!Array.isArray(mesh.series)) errors.push(`${slug}: series must be an array`);
    for (const seriesId of mesh.series ?? []) {
      if (!series.has(seriesId)) errors.push(`${slug}: unknown series ${seriesId}`);
    }
    for (const seriesId of duplicates(mesh.series ?? [])) errors.push(`${slug}: duplicate series ${seriesId}`);

    if (!mesh.entities || typeof mesh.entities !== "object" || Array.isArray(mesh.entities)) {
      errors.push(`${slug}: malformed entity groups`);
    } else {
      for (const type of editorialEntityTypes) {
        const values = mesh.entities[type];
        if (!Array.isArray(values)) {
          errors.push(`${slug}: entities.${type} must be an array`);
          continue;
        }
        for (const id of values) {
          const entity = entities.get(id);
          if (!entity) errors.push(`${slug}: unknown ${type} entity ${id}`);
          else if (entity.type !== type) errors.push(`${slug}: ${id} belongs in entities.${entity.type}, not entities.${type}`);
          usedEntities.add(id);
        }
        for (const id of duplicates(values)) errors.push(`${slug}: duplicate ${type} entity ${id}`);
      }
    }

    if (!Array.isArray(mesh.sourceArtifacts)) errors.push(`${slug}: sourceArtifacts must be an array`);
    const artifactIds = (mesh.sourceArtifacts ?? []).map((artifact) => artifact?.id).filter(Boolean);
    for (const id of duplicates(artifactIds)) errors.push(`${slug}: duplicate source artifact ID ${id}`);
    if (!Array.isArray(mesh.storyModes)) errors.push(`${slug}: storyModes must be an array`);
    for (const mode of mesh.storyModes ?? []) {
      if (!modes.has(mode)) errors.push(`${slug}: unknown story mode ${mode}`);
    }

    if (mesh.series?.includes("magazine-time-machine")) {
      const origin = mesh.sourceArtifacts?.find(
        (artifact) => artifact.type === "magazine" && artifact.role === "origin" && artifact.publication,
      );
      if (!origin) errors.push(`${slug}: Magazine Time Machine requires a magazine origin artifact with a publication`);
      else if (!mesh.entities.publications.includes(origin.publication)) {
        errors.push(`${slug}: MTM origin publication ${origin.publication} is absent from entities.publications`);
      }
    }

    if (mesh.series?.includes("3dm")) {
      if (!mesh.entities.people.includes("dick-miller")) errors.push(`${slug}: 3DM requires the dick-miller person entity`);
      if (!/\bDick Miller\b/i.test(body)) errors.push(`${slug}: 3DM body does not document a Dick Miller connection`);
    }
    if (data.presentsSeries === "3dm" && !mesh.series?.includes("3dm")) {
      const expectedCanonical = `/articles/${slug}/`;
      if (data.canonical !== expectedCanonical) {
        errors.push(`${slug}: non-member legacy 3DM record must use canonical ${expectedCanonical}`);
      }
    }

    for (const related of data.relatedArticles ?? []) {
      const normalized = String(related).replace(/^\/articles\//, "").replace(/\/$/, "").replace(/\.mdx?$/, "");
      if (!slugs.has(normalized)) errors.push(`${slug}: relatedArticles target does not exist: ${related}`);
    }
  }

  for (const entity of editorialEntities) {
    if (!usedEntities.has(entity.id)) warnings.push(`registry: unused entity ${entity.id}`);
  }

  return { articles, liveArticles, errors, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = auditEditorialMesh();
  console.log(`Editorial mesh audit: ${result.liveArticles.length} published or scheduled articles (${result.articles.length} files total)`);
  for (const warning of result.warnings) console.warn(`WARN  ${warning}`);
  for (const error of result.errors) console.error(`ERROR ${error}`);
  console.log(`${result.errors.length} structural errors; ${result.warnings.length} review warnings.`);
  if (result.errors.length) process.exitCode = 1;
}
