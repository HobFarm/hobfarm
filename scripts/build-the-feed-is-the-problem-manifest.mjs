import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const slug = "the-feed-is-the-problem";
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
    caption: "A behavioral signal becomes a ranked feedback loop while a separate RSS line remains under reader control.",
    alt_text: "A control-board diagram shows negative information becoming an ambiguous attention signal, ranked distribution, and creator metrics, with a separate cyan route from a chosen source through RSS to the reader.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Article hero",
  },
  {
    asset_id: "social",
    source_file: `assets/${slug}/social.webp`,
    destination_key: `${prefix}social.webp`,
    purpose: "Open Graph and social image",
    caption: "Attention becomes a production signal.",
    alt_text: "An editorial signal-routing diagram contrasts a ranked engagement loop with a reader-chosen RSS route.",
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
    rights_basis: "Original HobFarm explanatory graphic created for this article.",
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
  scheduled_publication: "2026-08-22T16:20:00-07:00",
  predecessor_publication: "2026-08-21T16:20:00-07:00",
  successor_publication: "2026-08-23T16:20:00-07:00",
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
