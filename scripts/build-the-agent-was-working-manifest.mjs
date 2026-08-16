import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const slug = "the-agent-was-working";
const reportRoot = resolve(`reports/${slug}`);
const manifestPath = resolve(reportRoot, "asset-manifest.json");
const prefix = "articles/hobbot/";

let previousManifest;
try {
  previousManifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {
  previousManifest = undefined;
}
const previousAssets = new Map((previousManifest?.assets ?? []).map((asset) => [asset.destination_key, asset]));

const definitions = [
  {
    asset_id: "hero-v1",
    source_file: `assets/${slug}/its-so-agentic-hero-v1.webp`,
    destination_key: `${prefix}its-so-agentic-hero-v1.webp`,
    purpose: "Article hero",
    caption: "HobBot works a scheduled night shift while the finished posts travel toward an almost empty auditorium.",
    alt_text: "A systems-manual illustration shows a small orange robot in an automated booth. A Groundhog Day calendar and cron clock start the run, instruction folders enter, posts leave on a conveyor, and coins fall into an API meter beside an almost empty social auditorium.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Article hero",
  },
  {
    asset_id: "social-v1",
    source_file: `assets/${slug}/its-so-agentic-social-v1.webp`,
    destination_key: `${prefix}its-so-agentic-social-v1.webp`,
    purpose: "Open Graph image",
    caption: "The machine works. The remaining question is what the work removes.",
    alt_text: "An editorial systems diagram shows HobBot completing a scheduled posting cycle while an API meter records the cost and the posts arrive at an almost empty audience.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Social metadata",
  },
  {
    asset_id: "square-v1",
    source_file: `assets/${slug}/its-so-agentic-square-v1.webp`,
    destination_key: `${prefix}its-so-agentic-square-v1.webp`,
    purpose: "Square social derivative",
    caption: "HobBot works the night shift.",
    alt_text: "A square derivative of the HobBot night-shift systems illustration.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Optional social package",
  },
  {
    asset_id: "vertical-v2",
    source_file: `assets/${slug}/its-so-agentic-vertical-v2.webp`,
    destination_key: `${prefix}its-so-agentic-vertical-v2.webp`,
    purpose: "Vertical social derivative",
    caption: "HobBot works the night shift.",
    alt_text: "A vertical derivative of the HobBot night-shift systems illustration.",
    editable_source: `assets/${slug}/hero.svg`,
    placement: "Optional social package",
  },
  {
    asset_id: "moltbook-profile-top-v1",
    source_file: `assets/${slug}/hobbot-moltbook-profile-top-v1.webp`,
    destination_key: `${prefix}hobbot-moltbook-profile-top-v1.webp`,
    purpose: "Readable documentary crop",
    caption: "H0BBOT on Moltbook, February 2026. The experiment worked. That turned out to be a different question from whether the experiment was useful.",
    alt_text: "A dark-mode screenshot crop of the H0BBOT Moltbook profile shows the orange robot avatar, a February 2, 2026 join date, and posts titled Provisions, Pump Patterns, Fallow Seasons, Strange Attractors, Fellow Travelers, and Cantilever Problems.",
    editable_source: "https://cdn.hob.farm/articles/hobbot/hobbot-moltbook.png",
    placement: "Documentary figure after the opening",
  },
];

const assets = [];
for (const definition of definitions) {
  const bytes = await readFile(resolve(definition.source_file));
  const metadata = await sharp(bytes).metadata();
  const isDocumentary = definition.asset_id.startsWith("moltbook");
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
    rights_basis: isDocumentary
      ? "Author-owned documentary screenshot cropped non-destructively at native resolution; the complete source object remains unchanged."
      : "Original HobFarm editorial illustration created for this article.",
    construction: isDocumentary
      ? "Native-resolution crop rendered from the checksum-verified complete PNG to WebP with Sharp."
      : "Source-controlled SVG rendered to a deterministic WebP derivative with Sharp.",
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
  article_title: "It's so agentic",
  generated_at: new Date().toISOString(),
  scheduled_publication: "2026-08-27T16:20:00-07:00",
  predecessor_publication: "2026-08-26T16:20:00-07:00",
  predecessor_slug: "salton-sea-needs-an-outlet",
  schedule_difference_seconds: 86400,
  documentary_source: {
    url: "https://cdn.hob.farm/articles/hobbot/hobbot-moltbook.png",
    sha256: "c2e7c82067a563eed1c3d210dcaafeff51e91f773575b291743510094910aaf2",
    width: 1524,
    height: 4549,
    preservation: "Existing source is referenced but never uploaded, overwritten, moved, renamed, or deleted.",
  },
  superseded_assets: [
    {
      destination_key: `${prefix}its-so-agentic-vertical-v1.webp`,
      public_url: `https://cdn.hob.farm/${prefix}its-so-agentic-vertical-v1.webp`,
      dimensions: "1080x2058",
      reason: "The first derivative was 1080 by 2058 pixels because Sharp applied the extend operation after resize. It remains immutable and unused; vertical-v2 is the corrected 1080 by 1920 social asset.",
      preservation: "The existing object is not overwritten, moved, renamed, or deleted.",
    },
  ],
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
