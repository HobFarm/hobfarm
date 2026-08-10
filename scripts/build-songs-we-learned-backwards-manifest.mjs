import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const sourceRoot = resolve(".tmp/songs-we-learned-backwards-upload");
const outputPath = resolve("reports/songs-we-learned-backwards/asset-manifest.json");
const sourceSha256 = "98b037373f5772c97f564d85c0bc9bbe9cddd430c863e9018180db9cc12b5abe";

let previousByKey = new Map();
try {
  const previous = JSON.parse(await readFile(outputPath, "utf8"));
  previousByKey = new Map(previous.assets.map((asset) => [asset.destination_key, asset]));
} catch {
  // The first run has no prior upload state to preserve.
}

const assets = [
  {
    file: "songs-we-learned-backwards-hero-v1.webp",
    width: 1600,
    height: 900,
    original: `User-supplied PNG preserved as .tmp/songs-we-learned-backwards-upload/songs-we-learned-backwards-hero-source-v1.png; SHA-256 ${sourceSha256}`,
    purpose: "article hero and card image",
    alt: "Vintage collage tracing a looping path from 1970s jazz, funk, and soul through 1980s and 1990s hip-hop sampling to present-day listening, surrounded by records, instruments, a sampler, a dancer, headphones, and a phone.",
  },
  {
    file: "songs-we-learned-backwards-social-v1.webp",
    width: 1200,
    height: 630,
    original: `Centered social crop of the user-supplied hero PNG; SHA-256 ${sourceSha256}`,
    purpose: "social preview image",
    alt: "Wide vintage collage connecting 1970s jazz, funk, and soul to hip-hop sampling and present-day music discovery through records, instruments, a sampler, a dancer, and a phone.",
  },
];

const manifestAssets = [];
for (const asset of assets) {
  const absolute = resolve(sourceRoot, asset.file);
  const [buffer, details] = await Promise.all([readFile(absolute), stat(absolute)]);
  const destinationKey = `articles/songs-we-learned-backwards/${asset.file}`;
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const previous = previousByKey.get(destinationKey);
  const preservedVerification = previous?.sha256 === sha256
    ? Object.fromEntries(Object.entries(previous).filter(([key]) => [
        "upload_status",
        "verification_status",
        "remote_sha256",
        "http_status",
        "verified_content_type",
        "verified_cache_control",
        "public_response_sha256",
        "edge_transformed",
        "verified_at",
      ].includes(key)))
    : { upload_status: "pending", verification_status: "pending" };

  manifestAssets.push({
    id: basename(asset.file, ".webp"),
    source_file: `.tmp/songs-we-learned-backwards-upload/${asset.file}`,
    source_original_file: asset.original,
    destination_bucket: "hobfarm-cdn",
    destination_key: destinationKey,
    public_url: `https://cdn.hob.farm/${destinationKey}`,
    content_type: "image/webp",
    width: asset.width,
    height: asset.height,
    bytes: details.size,
    sha256,
    rights: "user-supplied-editorial-image",
    credit: "Image supplied by HobFarm",
    purpose: asset.purpose,
    alt_text: asset.alt,
    publication_status: "publish by explicit user direction",
    ...preservedVerification,
  });
}

const manifest = {
  schema_version: 1,
  article_slug: "songs-we-learned-backwards",
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  source_manifest: "User-supplied hero path and songs-we-learned-backwards-CODEX_TASK.md",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    allowed_prefixes: ["articles/songs-we-learned-backwards/"],
    publication_status_required: "publish by explicit user direction",
  },
  normalization: {
    hero: "1600 by 900 WebP at quality 88 from the approved 1672 by 941 PNG",
    social: "1200 by 630 centered crop from the approved PNG at quality 88",
    encoder: "Sharp/libvips WebP with source metadata omitted and no source overwrite",
  },
  source_originals: [
    {
      file: ".tmp/songs-we-learned-backwards-upload/songs-we-learned-backwards-hero-source-v1.png",
      original_location: "F:/Web-Stuff/HobFarm-web Project Files/Articles/songs we learned backward/ChatGPT Image Aug 10, 2026, 03_15_10 PM.png",
      width: 1672,
      height: 941,
      bytes: 3128168,
      sha256: sourceSha256,
      preserved: true,
    },
  ],
  prefix_inventory_before_upload: {
    checked_with: "scripts/r2-upload-manifest.mjs object-by-object remote checks",
    result: "v1 hero and social keys absent on dry run; no object overwritten",
  },
  assets: manifestAssets,
};

await mkdir(resolve("reports/songs-we-learned-backwards"), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${manifestAssets.length} assets to ${outputPath}`);
