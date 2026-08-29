#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  publicUrlForKey,
  scanRepositoryReferences,
} from "./lib/media-reference-scan.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const scanRoots = [
  "src/content",
  "src/data",
  "src/pages",
  "src/components",
  "src/layouts",
  "src/lib",
  "src/styles",
  "functions",
  "workers",
  "public",
];
const reportJson = join(root, "reports/media-inventory.json");
const reportCsv = join(root, "reports/media-inventory.csv");

function inferUsage(sourceFile) {
  if (sourceFile.startsWith("src/content/gallery/")) return "gallery";
  if (sourceFile.startsWith("src/content/articles/")) return "article";
  if (sourceFile.startsWith("src/content/comics/")) return "comic";
  if (sourceFile.startsWith("src/content/projects/")) return "project";
  if (sourceFile.startsWith("src/content/products/")) return "product";
  if (sourceFile.startsWith("src/data/")) return "data";
  if (sourceFile.startsWith("src/pages/")) return "page";
  if (sourceFile.startsWith("src/components/")) return "component";
  if (sourceFile.startsWith("src/layouts/")) return "layout";
  if (sourceFile.startsWith("src/styles/")) return "stylesheet";
  if (sourceFile.startsWith("src/lib/")) return "helper";
  if (sourceFile.startsWith("functions/")) return "pages-function";
  if (sourceFile.startsWith("workers/")) return "worker";
  if (sourceFile.startsWith("public/")) return "public-static";
  return "unknown";
}

function fileTypeFromKey(key) {
  const extension = extname(key).replace(/^\./, "").toLowerCase();
  if (["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"].includes(extension)) return "image";
  if (["m4a", "mov", "mp3", "mp4", "wav", "webm"].includes(extension)) return "video";
  if (["pdf", "txt", "vtt", "zip"].includes(extension)) return "document";
  return extension || "unknown";
}

function leakRiskFor(publicUrl) {
  const lower = publicUrl.toLowerCase();
  return lower.includes("-hd.") || lower.includes("character-sheet") || lower.includes("premium-showcase");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const references = scanRepositoryReferences({ root, scanRoots });
const rows = references.map((reference) => {
  const publicUrl = publicUrlForKey(reference.r2Key);
  return {
    id: "",
    filename: basename(reference.r2Key),
    sourceFile: reference.sourceFile,
    publicUrl,
    r2Key: reference.r2Key,
    fileType: fileTypeFromKey(reference.r2Key),
    currentPageUsage: inferUsage(reference.sourceFile),
    proposedDepartment: "",
    visualSystem: "",
    mediaRole: reference.referenceKind,
    status: reference.status === "active" ? "referenced" : reference.status,
    leakRisk: leakRiskFor(publicUrl),
  };
});

rows.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile) || a.publicUrl.localeCompare(b.publicUrl));
rows.forEach((row, index) => {
  row.id = String(index + 1);
});

mkdirSync(dirname(reportJson), { recursive: true });
writeFileSync(
  reportJson,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      scanRoots,
      scope:
        "Referenced assets only, scanned across content, data, pages, components, layouts, helpers, styles, functions, workers, and public files. This report does not enumerate or mutate R2 objects.",
      rowCount: rows.length,
      uniqueKeyCount: new Set(rows.map((row) => row.r2Key)).size,
      rows,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const columns = [
  "id",
  "filename",
  "sourceFile",
  "publicUrl",
  "r2Key",
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
writeFileSync(reportCsv, `${csv}\n`, "utf8");

console.log(`Wrote reports/media-inventory.json (${rows.length} rows)`);
console.log("Wrote reports/media-inventory.csv");
console.log(`Scope: referenced assets only across ${scanRoots.join(", ")}; R2 was not enumerated or changed.`);
