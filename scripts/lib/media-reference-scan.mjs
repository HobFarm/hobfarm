import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative, sep } from "node:path";

export const CDN_ORIGIN = "https://cdn.hob.farm";

export const DEFAULT_SCAN_ROOTS = [
  "src",
  "functions",
  "workers",
  "public",
  "scripts",
  "reports",
  "docs",
  "_cdn",
  "cdn-upload",
  "content",
  "assets",
];

const ROOT_FILES = [
  ".pages.yml",
  "astro.config.mjs",
  "package.json",
  "wrangler.jsonc",
];

const GENERATED_REPORTS = new Set([
  "reports/media-inventory.csv",
  "reports/media-inventory.json",
  "reports/r2-cdn-inventory.json",
  "reports/r2-reference-inventory.json",
  "reports/r2-orphan-candidates.json",
  "reports/r2-duplicate-candidates.json",
  "reports/r2-cleanup-summary.md",
  "reports/r2-proposed-deletion-manifest.json",
]);

const TEXT_EXTENSIONS = new Set([
  ".astro",
  ".cjs",
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".jsonc",
  ".jsx",
  ".md",
  ".mdx",
  ".mjs",
  ".scss",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);

const MEDIA_EXTENSIONS = new Set([
  ".avif",
  ".bin",
  ".css",
  ".csv",
  ".gif",
  ".glb",
  ".gltf",
  ".html",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".m4a",
  ".md",
  ".mov",
  ".mp3",
  ".mp4",
  ".pdf",
  ".png",
  ".svg",
  ".txt",
  ".vtt",
  ".wasm",
  ".wav",
  ".webm",
  ".webp",
  ".woff",
  ".woff2",
  ".zip",
]);

const KNOWN_TWO_ARGUMENT_HELPERS = new Map([
  ["mediaUrl", (folder, file) => `${folder}/${file}`],
  ["mediaImageUrl", (folder, file) => `${folder}/${file}`],
  ["mediaImageSrcset", (folder, file) => `${folder}/${file}`],
  ["previewImageUrl", (folder, file) => `${folder}/${file}`],
  ["lightboxImageUrl", (folder, file) => `${folder}/${file}`],
  ["cdn.gallery", (folder, file) => `${folder}/${file}`],
  ["cdn.project", (slug, file) => `projects/${slug}/images/${file}`],
  ["cdn.agent", (agent, file) => `agents/${agent}/${file}`],
  ["cdn.page", (page, file) => `pages/${page}/${file}`],
]);

function slashPath(value) {
  return value.split(sep).join("/");
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function stripUrlPunctuation(value) {
  return value
    .replaceAll("&amp;", "&")
    .replace(/[.,;:!?]+$/g, "")
    .replace(/[\])}]+$/g, "");
}

export function normalizeR2Key(value) {
  if (!value) return "";
  let key = String(value).trim().replaceAll("\\", "/");
  key = key.replace(/^['"`]+|['"`]+$/g, "");
  key = key.split("#", 1)[0].split("?", 1)[0];
  key = safeDecode(key).replace(/^\/+/, "");
  return key.replace(/\/{2,}/g, "/");
}

export function publicUrlForKey(key) {
  const encoded = normalizeR2Key(key)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${CDN_ORIGIN}/${encoded}`;
}

export function r2KeyFromCdnUrl(rawValue) {
  if (!rawValue) return null;
  let raw = stripUrlPunctuation(String(rawValue).trim());

  const nestedIndex = raw.lastIndexOf(`${CDN_ORIGIN}/`);
  if (nestedIndex > 0) raw = raw.slice(nestedIndex);

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  if (parsed.hostname !== "cdn.hob.farm") return null;

  let pathname = parsed.pathname;
  if (pathname.startsWith("/cdn-cgi/image/")) {
    const parts = pathname.split("/");
    if (parts.length < 5) return null;
    pathname = `/${parts.slice(4).join("/")}`;
  }

  const key = normalizeR2Key(pathname);
  return key || null;
}

function hasObjectShape(key) {
  if (!key || key.endsWith("/")) return false;
  return MEDIA_EXTENSIONS.has(extname(key).toLowerCase());
}

function walkTextFiles(root, relativeRoot) {
  const absoluteRoot = join(root, relativeRoot);
  if (!existsSync(absoluteRoot)) return [];

  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (!entry.isFile() || !TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
      const sourceFile = slashPath(relative(root, absolute));
      if (GENERATED_REPORTS.has(sourceFile)) continue;
      if (statSync(absolute).size > 12 * 1024 * 1024) continue;
      files.push(absolute);
    }
  };

  walk(absoluteRoot);
  return files;
}

function walkAllFiles(root, relativeRoot) {
  const absoluteRoot = join(root, relativeRoot);
  if (!existsSync(absoluteRoot)) return [];
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  };
  walk(absoluteRoot);
  return files;
}

function getFrontmatter(text) {
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/);
  return match?.[1] ?? "";
}

function frontmatterDate(frontmatter) {
  const match = frontmatter.match(/^(?:publishedAt|pubDate|date):\s*["']?([^\s"']+)/m);
  if (!match) return null;
  const parsed = new Date(match[1]);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function contentIdFor(sourceFile) {
  if (!sourceFile.startsWith("src/content/")) return null;
  return basename(sourceFile, extname(sourceFile));
}

function routeFor(sourceFile) {
  if (sourceFile.startsWith("src/content/articles/")) {
    return `/articles/${basename(sourceFile, extname(sourceFile))}/`;
  }
  if (sourceFile.startsWith("src/content/gallery/")) {
    return `/${sourceFile.replace(/^src\/content\//, "").replace(/\.(?:md|mdx)$/i, "")}/`;
  }
  if (sourceFile.startsWith("src/content/comics/")) {
    return `/presents/funnies/${basename(sourceFile, extname(sourceFile))}/`;
  }
  if (sourceFile.startsWith("src/pages/")) {
    const page = sourceFile
      .replace(/^src\/pages\//, "")
      .replace(/(?:\/index)?\.(?:astro|md|mdx|ts|js)$/i, "")
      .replace(/\[(?:\.\.\.)?[^\]]+\]/g, ":dynamic");
    return `/${page ? `${page}/` : ""}`;
  }
  return null;
}

export function describeSource(sourceFile, text, now = new Date()) {
  const frontmatter = getFrontmatter(text);
  const draft = /(^|\n)draft:\s*true\b/i.test(frontmatter);
  const hiddenStatus = /(^|\n)status:\s*["']?(?:draft|scheduled|archived|private-prototype|hidden)\b/i.test(frontmatter);
  const releaseDate = frontmatterDate(frontmatter);
  const scheduled = releaseDate && releaseDate.getTime() > now.getTime();

  let sourceKind = "repository-record";
  let status = "protected";

  if (sourceFile.startsWith("src/content/")) {
    sourceKind = "content";
    status = draft || hiddenStatus || scheduled ? "staged" : "active";
  } else if (sourceFile.startsWith("dist/")) {
    sourceKind = "built-public-output";
    status = "active";
  } else if (/^(?:src|functions|workers|public)\//.test(sourceFile)) {
    sourceKind = sourceFile.startsWith("src/") ? "runtime-source" : "runtime-consumer";
    status = "active";
  } else if (/^(?:_cdn|cdn-upload)\//.test(sourceFile)) {
    sourceKind = "upload-staging";
    status = "staged";
  } else if (sourceFile.startsWith("reports/")) {
    sourceKind = /(?:asset|upload|reference)-manifest\.json$/i.test(sourceFile)
      ? "asset-manifest"
      : "production-record";
    status = sourceKind === "asset-manifest" ? "staged" : "protected";
  } else if (sourceFile.startsWith("scripts/")) {
    sourceKind = "build-or-upload-tooling";
    status = "staged";
  } else if (sourceFile.startsWith("docs/")) {
    sourceKind = "documentation";
    status = "protected";
  } else if (/^(?:content|assets)\//.test(sourceFile)) {
    sourceKind = "source-archive";
    status = "protected";
  } else {
    sourceKind = "configuration";
    status = "active";
  }

  return {
    sourceKind,
    status,
    contentId: contentIdFor(sourceFile),
    route: routeFor(sourceFile),
    stagedReason: draft
      ? "draft content"
      : hiddenStatus
        ? "unpublished content status"
        : scheduled
          ? `release date ${releaseDate.toISOString()} is in the future`
          : null,
  };
}

function lineAt(text, offset) {
  const start = text.lastIndexOf("\n", offset - 1) + 1;
  const end = text.indexOf("\n", offset);
  return text.slice(start, end === -1 ? text.length : end);
}

function statusAt(text, offset, descriptor) {
  const line = lineAt(text, offset);
  if (/futureCanonicalKey\s*:/.test(line)) {
    return { status: "staged", note: "future canonical key; no migration has been performed" };
  }
  if (/^\s*(?:\/\/|\/\*|\*|<!--)/.test(line)) {
    return { status: "protected", note: "documented in a source comment" };
  }
  if (/\bTODO\b/i.test(line) && descriptor.status === "active") {
    return { status: "staged", note: "marked TODO in source" };
  }
  return { status: descriptor.status, note: descriptor.stagedReason };
}

function stringTokens(text) {
  const tokens = [];
  const quoted = /(["'])([^\r\n]*?)\1/g;
  for (const match of text.matchAll(quoted)) {
    tokens.push({ value: match[2], offset: match.index ?? 0, kind: "quoted-string" });
  }

  const templates = /`([^`]*)`/gs;
  for (const match of text.matchAll(templates)) {
    const body = match[1];
    if (!body.includes("${")) {
      tokens.push({ value: body, offset: match.index ?? 0, kind: "template-string" });
      continue;
    }
    for (const part of body.split(/\$\{[^}]+\}/g)) {
      if (part) tokens.push({ value: part, offset: match.index ?? 0, kind: "template-segment" });
    }
  }
  return tokens;
}

function literalArgument(value) {
  const match = value.trim().match(/^(?:["']([^"']*)["']|`([^`$]*)`)$/s);
  return match ? (match[1] ?? match[2] ?? "") : null;
}

function splitArguments(value) {
  const args = [];
  let current = "";
  let quote = null;
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      current += character;
      if (character === quote && value[index - 1] !== "\\") quote = null;
      continue;
    }
    if (character === "\"" || character === "'" || character === "`") {
      quote = character;
      current += character;
      continue;
    }
    if (character === "(" || character === "[" || character === "{") depth += 1;
    if (character === ")" || character === "]" || character === "}") depth -= 1;
    if (character === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function functionBlocks(text) {
  const blocks = [];
  const pattern = /function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*(?::[^\{]+)?\{/g;
  for (const match of text.matchAll(pattern)) {
    const opening = (match.index ?? 0) + match[0].lastIndexOf("{");
    let depth = 0;
    let quote = null;
    let closing = -1;
    for (let index = opening; index < text.length; index += 1) {
      const character = text[index];
      if (quote) {
        if (character === quote && text[index - 1] !== "\\") quote = null;
        continue;
      }
      if (character === "\"" || character === "'" || character === "`") {
        quote = character;
        continue;
      }
      if (character === "{") depth += 1;
      if (character === "}") {
        depth -= 1;
        if (depth === 0) {
          closing = index;
          break;
        }
      }
    }
    if (closing === -1) continue;
    blocks.push({
      name: match[1],
      parameters: match[2]
        .split(",")
        .map((parameter) => parameter.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1])
        .filter(Boolean),
      body: text.slice(opening + 1, closing),
      offset: match.index ?? 0,
    });
  }
  return blocks;
}

function resolveTemplate(template, parameters, argumentsList) {
  const values = new Map();
  for (let index = 0; index < parameters.length; index += 1) {
    const value = literalArgument(argumentsList[index] ?? "");
    if (value !== null) values.set(parameters[index], value);
  }

  let unresolved = false;
  const resolved = template.replace(/\$\{([A-Za-z_$][\w$]*)\}/g, (_match, name) => {
    if (!values.has(name)) {
      unresolved = true;
      return "";
    }
    return values.get(name);
  });
  return unresolved ? null : resolved;
}

function normalizeCandidate(value) {
  if (!value) return null;
  if (/^https:\/\//i.test(value)) return r2KeyFromCdnUrl(value);
  return normalizeR2Key(value);
}

export function extractReferencesFromText({
  text,
  sourceFile,
  objectKeys = [],
  now = new Date(),
}) {
  const descriptor = describeSource(sourceFile, text, now);
  const keySet = objectKeys instanceof Set ? objectKeys : new Set(objectKeys);
  const references = [];
  const seen = new Set();

  const add = (keyValue, offset, referenceKind, evidence) => {
    const r2Key = normalizeCandidate(keyValue);
    if (!r2Key || r2Key.endsWith("/")) return;
    if (keySet.size === 0 && !hasObjectShape(r2Key)) return;
    const contextual = statusAt(text, offset, descriptor);
    const identity = `${r2Key}|${sourceFile}|${contextual.status}`;
    if (seen.has(identity)) return;
    seen.add(identity);
    references.push({
      r2Key,
      publicUrl: publicUrlForKey(r2Key),
      sourceFile,
      sourceKind: descriptor.sourceKind,
      referenceKind,
      contentId: descriptor.contentId,
      route: descriptor.route,
      status: contextual.status,
      evidence: evidence ?? contextual.note ?? null,
    });
  };

  const directPrefixes = new Set();
  const directPattern = /https:\/\/(?:cdn\.hob\.farm|hob\.farm\/cdn-cgi\/image)\/[^\s"'<>]+/g;
  for (const match of text.matchAll(directPattern)) {
    const raw = stripUrlPunctuation(match[0]);
    const key = r2KeyFromCdnUrl(raw);
    if (!key) continue;
    if (hasObjectShape(key) || (keySet.has(key) && !key.endsWith("/"))) {
      add(key, match.index ?? 0, raw.includes("/cdn-cgi/image/") ? "transformed-cdn-url" : "direct-cdn-url", raw);
    } else {
      directPrefixes.add(key.replace(/\/$/, ""));
    }
  }

  const tokens = stringTokens(text);
  const tokenValues = new Set();
  const filenameTokens = new Set();
  const folderTokens = new Set(directPrefixes);

  for (const token of tokens) {
    const value = safeDecode(token.value.trim()).replaceAll("\\", "/");
    if (!value || value.includes("${")) continue;
    tokenValues.add(value.replace(/^\/+|\/+$/g, ""));
    if (hasObjectShape(value)) filenameTokens.add(basename(value));

    const urlKey = r2KeyFromCdnUrl(value);
    if (urlKey && !hasObjectShape(urlKey)) folderTokens.add(urlKey.replace(/\/$/, ""));

    const normalized = normalizeR2Key(value);
    if (keySet.has(normalized) && !normalized.endsWith("/")) {
      add(normalized, token.offset, "literal-r2-key", value);
    }
  }

  let currentFolder = null;
  let runningOffset = 0;
  for (const line of text.split(/\r?\n/)) {
    const folderMatch = line.match(/\b(?:folder|assetBase|mediaBase|cdnBase|cdnRoot|mediaRoot|alterMediaRoot|PROCESS_ASSET_BASE|CDN)\s*[:=]\s*["']([^"']+)["']/);
    if (folderMatch) {
      const asUrl = r2KeyFromCdnUrl(folderMatch[1]);
      currentFolder = (asUrl ?? normalizeR2Key(folderMatch[1])).replace(/\/$/, "");
      if (currentFolder) folderTokens.add(currentFolder);
    }

    const filePattern = /\b(?:file|poster|image|hero|heroImage|beforeImage|afterImage|thumbnail|socialImage|src)\s*:\s*["']([^"']+)["']/g;
    for (const fileMatch of line.matchAll(filePattern)) {
      const fileValue = fileMatch[1];
      if (!currentFolder || !hasObjectShape(fileValue) || /^https?:\/\//.test(fileValue)) continue;
      const key = normalizeR2Key(`${currentFolder}/${fileValue}`);
      if (keySet.size === 0 || keySet.has(key)) {
        add(key, runningOffset + (fileMatch.index ?? 0), "folder-file-fields", `${currentFolder} + ${fileValue}`);
      }
    }
    runningOffset += line.length + 1;
  }

  for (const key of keySet) {
    if (key.endsWith("/")) continue;
    const lastSlash = key.lastIndexOf("/");
    if (lastSlash === -1) continue;
    const parent = key.slice(0, lastSlash);
    const file = key.slice(lastSlash + 1);
    const folderEvidence = folderTokens.has(parent) || tokenValues.has(parent);
    if (folderEvidence && filenameTokens.has(file)) {
      add(key, 0, "inventory-assisted-folder-file", `${parent} + ${file}`);
    }
  }

  for (const prefix of directPrefixes) {
    for (const file of filenameTokens) {
      const key = normalizeR2Key(`${prefix}/${file}`);
      if (keySet.size === 0 || keySet.has(key)) {
        add(key, 0, "cdn-base-and-filename", `${prefix} + ${file}`);
      }
    }
  }

  for (const [helper, resolver] of KNOWN_TWO_ARGUMENT_HELPERS) {
    const escaped = helper.replace(".", "\\.");
    const callPattern = new RegExp(`\\b${escaped}\\s*\\(([^)]*)\\)`, "g");
    for (const call of text.matchAll(callPattern)) {
      const args = splitArguments(call[1]);
      const first = literalArgument(args[0] ?? "");
      const second = literalArgument(args[1] ?? "");
      if (first === null || second === null) continue;
      const key = normalizeR2Key(resolver(first, second));
      if (keySet.size === 0 || keySet.has(key)) {
        add(key, call.index ?? 0, "cdn-helper-call", `${helper}(${first}, ${second})`);
      }
    }
  }

  for (const block of functionBlocks(text)) {
    const templates = [];
    const templatePattern = /(?:cdn\s*\(\s*)?`([^`]*(?:https:\/\/cdn\.hob\.farm|\/)[^`]*)`/g;
    for (const templateMatch of block.body.matchAll(templatePattern)) {
      if (!templateMatch[1].includes("${")) continue;
      templates.push(templateMatch[1]);
    }
    if (templates.length === 0) continue;

    const callPattern = new RegExp(`\\b${block.name}\\s*\\(([^)]*)\\)`, "g");
    for (const call of text.matchAll(callPattern)) {
      if ((call.index ?? 0) === block.offset) continue;
      const args = splitArguments(call[1]);
      for (const template of templates) {
        const resolved = resolveTemplate(template, block.parameters, args);
        const key = normalizeCandidate(resolved);
        if (!key || key.endsWith("/") || (keySet.size > 0 && !keySet.has(key))) continue;
        add(key, call.index ?? 0, "resolved-helper-template", `${block.name}: ${template}`);
      }
    }
  }

  references.sort((a, b) =>
    a.r2Key.localeCompare(b.r2Key) ||
    a.sourceFile.localeCompare(b.sourceFile) ||
    a.referenceKind.localeCompare(b.referenceKind),
  );
  return references;
}

export function scanRepositoryReferences({
  root,
  objectKeys = [],
  scanRoots = DEFAULT_SCAN_ROOTS,
  now = new Date(),
}) {
  const absoluteFiles = scanRoots.flatMap((scanRoot) => walkTextFiles(root, scanRoot));
  for (const rootFile of ROOT_FILES) {
    const absolute = join(root, rootFile);
    if (existsSync(absolute)) absoluteFiles.push(absolute);
  }

  const references = [];
  for (const absolute of [...new Set(absoluteFiles)].sort()) {
    const sourceFile = slashPath(relative(root, absolute));
    const text = readFileSync(absolute, "utf8");
    references.push(...extractReferencesFromText({ text, sourceFile, objectKeys, now }));
  }

  const keySet = objectKeys instanceof Set ? objectKeys : new Set(objectKeys);
  if (keySet.size > 0) {
    const keysByFilename = new Map();
    for (const key of keySet) {
      if (key.endsWith("/")) continue;
      const filename = basename(key);
      const list = keysByFilename.get(filename) ?? [];
      list.push(key);
      keysByFilename.set(filename, list);
    }

    const localFiles = scanRoots.flatMap((scanRoot) => walkAllFiles(root, scanRoot));
    for (const absolute of [...new Set(localFiles)]) {
      const sourceFile = slashPath(relative(root, absolute));
      if (GENERATED_REPORTS.has(sourceFile)) continue;
      const candidates = keysByFilename.get(basename(sourceFile)) ?? [];
      for (const key of candidates) {
        const suffixMatch = sourceFile === key || sourceFile.endsWith(`/${key}`);
        if (!suffixMatch) continue;
        const staged = /^(?:_cdn|cdn-upload|reports)\//.test(sourceFile);
        references.push({
          r2Key: key,
          publicUrl: publicUrlForKey(key),
          sourceFile,
          sourceKind: staged ? "local-upload-or-production-asset" : "local-source-asset",
          referenceKind: "local-asset-mirror",
          contentId: null,
          route: null,
          status: staged ? "staged" : "protected",
          evidence: "An exact-key local file is retained in the repository workspace.",
        });
      }
    }
  }

  const seen = new Set();
  return references.filter((reference) => {
    const identity = [
      reference.r2Key,
      reference.sourceFile,
      reference.status,
    ].join("|");
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}
