#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const scanRoots = ["src/content", "src/data"];
const reportJson = join(root, "reports/media-inventory.json");
const reportCsv = join(root, "reports/media-inventory.csv");
const CDN_BASE = "https://cdn.hob.farm/";
const mediaExt = new Set([".png", ".jpg", ".jpeg", ".webp", ".mp4", ".gif", ".svg"]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function repoPath(absPath) {
  return relative(root, absPath).split(sep).join("/");
}

function isMediaFile(value) {
  return mediaExt.has(extname(value).toLowerCase());
}

function urlFileName(url) {
  try {
    return new URL(url).pathname.split("/").pop() ?? "";
  } catch {
    return url.split("/").pop() ?? "";
  }
}

function fileTypeFromUrl(url) {
  const ext = extname(urlFileName(url)).replace(".", "").toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "gif"].includes(ext)) return "video";
  return ext || "unknown";
}

function inferUsage(sourceFile) {
  if (sourceFile.startsWith("src/content/gallery/")) return "gallery";
  if (sourceFile.startsWith("src/content/articles/")) return "article";
  if (sourceFile.startsWith("src/content/comics/")) return "comic";
  if (sourceFile.startsWith("src/content/projects/")) return "project";
  if (sourceFile.startsWith("src/content/products/")) return "product";
  if (sourceFile === "src/data/visual-systems.ts") return "visual-system";
  if (sourceFile.startsWith("src/data/")) return "data";
  return "unknown";
}

function inferDepartment(text, sourceFile) {
  const explicit = text.match(/department:\s*["']?([a-z0-9-]+)/);
  if (explicit) return explicit[1];
  if (sourceFile.includes("/cute-corrupted/")) return "cute-corrupted";
  if (sourceFile.includes("/character-dev/")) return "funnies";
  if (sourceFile.includes("/video-workflow/")) return "hobfarm-presents";
  return "";
}

function inferVisualSystem(text, sourceFile) {
  const explicit = text.match(/visualSystem:\s*["']?([a-z0-9-]+)/);
  if (explicit) return explicit[1];
  if (sourceFile === "src/data/visual-systems.ts") return "data-source";
  return "";
}

function leakRiskFor({ publicUrl, sourceText, mediaRole }) {
  const lower = publicUrl.toLowerCase();
  if (sourceText.includes("publicPreviewOnly: true") || sourceText.includes("publicPreviewOnly:")) return true;
  if (lower.includes("-hd.") || lower.includes("character-sheet") || lower.includes("premium-showcase")) return true;
  if (mediaRole === "preview" && lower.includes("sheet")) return true;
  return false;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function record({
  id,
  filename,
  sourceFile,
  publicUrl,
  currentPageUsage,
  proposedDepartment,
  visualSystem,
  mediaRole,
  status,
  leakRisk,
}) {
  return {
    id,
    filename,
    sourceFile,
    publicUrl,
    fileType: fileTypeFromUrl(publicUrl),
    currentPageUsage,
    proposedDepartment,
    visualSystem,
    mediaRole,
    status,
    leakRisk,
  };
}

const rows = [];
const seen = new Set();

for (const scanRoot of scanRoots) {
  const absRoot = join(root, scanRoot);
  for (const absFile of walk(absRoot)) {
    const sourceFile = repoPath(absFile);
    const sourceText = readFileSync(absFile, "utf8");
    const currentPageUsage = inferUsage(sourceFile);
    const proposedDepartment = inferDepartment(sourceText, sourceFile);
    const visualSystem = inferVisualSystem(sourceText, sourceFile);

    const literalUrlPattern = /https:\/\/cdn\.hob\.farm\/[^\s"'<>),]+/g;
    for (const match of sourceText.matchAll(literalUrlPattern)) {
      const publicUrl = match[0];
      if (!isMediaFile(urlFileName(publicUrl))) continue;
      const filename = urlFileName(publicUrl);
      const key = `${sourceFile}|${publicUrl}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(record({
        id: `${rows.length + 1}`,
        filename,
        sourceFile,
        publicUrl,
        currentPageUsage,
        proposedDepartment,
        visualSystem,
        mediaRole: "literal-url",
        status: "referenced",
        leakRisk: leakRiskFor({ publicUrl, sourceText, mediaRole: "literal-url" }),
      }));
    }

    let currentFolder = "";
    let currentRole = "";
    for (const line of sourceText.split(/\r?\n/)) {
      const folderMatch = line.match(/\bfolder:\s*["']([^"']+)["']/);
      if (folderMatch) currentFolder = folderMatch[1].replace(/^\/+|\/+$/g, "");

      const roleMatch = line.match(/\brole:\s*["']([^"']+)["']/);
      if (roleMatch) currentRole = roleMatch[1];

      const fileMatch = line.match(/\b(file|poster|heroImage|image):\s*["']([^"']+)["']/);
      if (!fileMatch || !currentFolder) continue;
      const filename = fileMatch[2];
      if (!isMediaFile(filename)) continue;

      const publicUrl = `${CDN_BASE}${currentFolder}/${filename}`;
      const key = `${sourceFile}|${publicUrl}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push(record({
        id: `${rows.length + 1}`,
        filename,
        sourceFile,
        publicUrl,
        currentPageUsage,
        proposedDepartment,
        visualSystem,
        mediaRole: currentRole || fileMatch[1],
        status: "referenced",
        leakRisk: leakRiskFor({ publicUrl, sourceText, mediaRole: currentRole || fileMatch[1] }),
      }));
    }
  }
}

rows.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile) || a.publicUrl.localeCompare(b.publicUrl));

mkdirSync(dirname(reportJson), { recursive: true });
writeFileSync(
  reportJson,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      scope:
        "Referenced assets only. R2 bucket enumeration requires owner Cloudflare auth and is out of scope for this local report.",
      rowCount: rows.length,
      rows,
    },
    null,
    2
  )}\n`
);

const columns = [
  "id",
  "filename",
  "sourceFile",
  "publicUrl",
  "fileType",
  "currentPageUsage",
  "proposedDepartment",
  "visualSystem",
  "mediaRole",
  "status",
  "leakRisk",
];
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
].join("\n");
writeFileSync(reportCsv, `${csv}\n`);

console.log(`Wrote reports/media-inventory.json (${rows.length} rows)`);
console.log("Wrote reports/media-inventory.csv");
console.log("Scope: referenced assets only; R2 bucket enumeration requires owner Cloudflare auth.");
