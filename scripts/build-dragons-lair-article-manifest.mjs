import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const slug = "dragons-lair-was-better-once-we-stopped-playing-it";
const reportRoot = resolve(`reports/${slug}`);
const manifestPath = resolve(reportRoot, "asset-manifest.json");
const prefix = `articles/${slug}/`;

let previousManifest;
try {
  previousManifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {
  previousManifest = undefined;
}
const previousAssets = new Map((previousManifest?.assets ?? []).map((asset) => [asset.destination_key, asset]));

const definitions = [
  {
    asset_id: "hero",
    source_file: `assets/${slug}/hero.webp`,
    destination_key: `${prefix}hero.webp`,
    purpose: "Article hero",
    caption: "The cartoon was spectacular. The two-quarter transaction was not.",
    alt_text: "Original editorial artwork of a glowing two-quarter arcade cabinet built like a small theater, surrounded by quarter-priced cabinets with a home computer visible in the distance.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Article hero",
  },
  {
    asset_id: "social",
    source_file: `assets/${slug}/social.webp`,
    destination_key: `${prefix}social.webp`,
    purpose: "Open Graph and social image",
    caption: "Dragon's Lair looked like the future. Two quarters bought a very short look.",
    alt_text: "A glowing two-quarter animated arcade cabinet dominates a dark arcade while a home computer waits in the distance.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Social metadata",
  },
];

const assets = [];
for (const definition of definitions) {
  const bytes = await readFile(resolve(definition.source_file));
  const metadata = await sharp(bytes).metadata();
  const record = {
    ...definition,
    width: metadata.width,
    height: metadata.height,
    destination_bucket: "hobfarm-cdn",
    public_url: `https://cdn.hob.farm/${definition.destination_key}`,
    content_type: "image/webp",
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    credit: "HobFarm",
    rights_basis: "Original HobFarm editorial graphic created from source-controlled vector shapes without third-party game art.",
    construction: "Source-controlled SVG rendered to a deterministic WebP derivative with Sharp.",
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
  };
  const previous = previousAssets.get(record.destination_key);
  assets.push(previous?.sha256 === record.sha256 ? { ...previous, ...record } : {
    ...record,
    mobile_qa: "pending",
    collision_check: "pending",
    upload_status: "not-checked",
    verification_status: "not-checked",
  });
}

const manifest = {
  version: 1,
  article_slug: slug,
  generated_at: new Date().toISOString(),
  scheduled_publication: "2026-08-23T16:20:00-07:00",
  predecessor_publication: "2026-08-22T16:20:00-07:00",
  successor_publication: "2026-08-24T16:20:00-07:00",
  schedule_difference_seconds: 86400,
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: [prefix],
  },
  assets,
};

await mkdir(reportRoot, { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${assets.length} asset records for ${prefix}`);
