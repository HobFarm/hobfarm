import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const articleSlug = "hit-the-source-directly";
const prefix = `articles/${articleSlug}/`;
const publicHostname = "https://cdn.hob.farm";
const diagramRoot = `assets/${articleSlug}/diagrams`;

const definitions = [
  {
    asset_id: "hero",
    source_file: `assets/${articleSlug}/hero.webp`,
    destination_key: `${prefix}hero.webp`,
    purpose: "Article hero",
    caption: "A direct RSS line carries HobFarm releases to readers above an engagement factory that it does not enter.",
    alt_text: "An orange feed line runs from a HobFarm publishing terminal to three reader screens while a tangled engagement factory sits below.",
    editable_source: `${diagramRoot}/01-direct-line.svg`,
    placement: "Article hero",
  },
  {
    asset_id: "social",
    source_file: `assets/${articleSlug}/social.webp`,
    destination_key: `${prefix}social.webp`,
    purpose: "Open Graph and social image",
    caption: "Hit the source directly with RSS.",
    alt_text: "A direct feed line connects HobFarm to readers without entering an engagement-ranking system.",
    editable_source: `${diagramRoot}/01-direct-line.svg`,
    placement: "Social metadata",
  },
  ...[
    ["two-pipelines", "02-two-pipelines.svg", "Two distribution pipelines", "A social engagement pipeline and a reader-chosen RSS pipeline show where source selection occurs."],
    ["rss-timeline", "03-rss-timeline.svg", "RSS and feed-interface timeline", "A timeline follows open feed formats and the consumer interfaces that made them more or less visible."],
    ["many-consumers", "04-one-feed-many-consumers.svg", "One feed, many consumers", "A feed branches to readers, podcast apps, alerts, research tools, archives, scripts, and personal AI."],
    ["opml-lineage", "05-opml-lineage.svg", "The 92-feed OPML lineage", "Michael Lynch's list becomes Evan Schwartz's OPML file, which Andrej Karpathy shares as a cold start."],
  ].map(([asset_id, file, purpose, alt_text]) => ({
    asset_id,
    source_file: `${diagramRoot}/${file}`,
    destination_key: `${prefix}diagrams/${file}`,
    purpose,
    caption: purpose,
    alt_text,
    placement: "Article body",
  })),
];

function contentType(sourceFile) {
  return sourceFile.endsWith(".svg") ? "image/svg+xml" : "image/webp";
}

async function dimensions(sourceFile) {
  if (sourceFile.endsWith(".svg")) {
    const source = await readFile(resolve(sourceFile), "utf8");
    const match = source.match(/<svg[^>]+width="(\d+)"[^>]+height="(\d+)"/);
    if (!match) throw new Error(`Missing SVG dimensions: ${sourceFile}`);
    return { width: Number(match[1]), height: Number(match[2]) };
  }
  const metadata = await sharp(resolve(sourceFile)).metadata();
  return { width: metadata.width, height: metadata.height };
}

const assets = [];
for (const definition of definitions) {
  const bytes = await readFile(resolve(definition.source_file));
  assets.push({
    ...definition,
    ...(await dimensions(definition.source_file)),
    destination_bucket: "hobfarm-cdn",
    public_url: `${publicHostname}/${definition.destination_key}`,
    content_type: contentType(definition.source_file),
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    credit: "HobFarm",
    rights_basis: "Original HobFarm explanatory graphic created for this article.",
    construction: "Source-controlled SVG assembled from original vector shapes and live labels; WebP files are deterministic raster derivatives.",
    editable_source: definition.editable_source ?? definition.source_file,
    mobile_qa: "pending",
    collision_check: "pending",
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
    upload_status: "not-checked",
    verification_status: "not-checked",
  });
}

const manifest = {
  version: 1,
  article_slug: articleSlug,
  generated_at: new Date().toISOString(),
  scheduled_publication: "2026-08-21T16:20:00-07:00",
  predecessor_publication: "2026-08-20T16:20:00-07:00",
  successor_publication: null,
  schedule_difference_seconds: 86400,
  bucket: "hobfarm-cdn",
  public_hostname: publicHostname,
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: [prefix],
  },
  assets,
};

await mkdir(resolve(`reports/${articleSlug}`), { recursive: true });
await writeFile(
  resolve(`reports/${articleSlug}/asset-manifest.json`),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${assets.length} asset records for ${prefix}`);
