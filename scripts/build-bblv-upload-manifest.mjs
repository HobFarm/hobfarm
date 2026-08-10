import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const root = resolve(".");
const sourceRoot = resolve(".tmp/bblv-upload");
const outputPath = resolve("reports/bblv/upload-manifest.json");

let previousByKey = new Map();
try {
  const previous = JSON.parse(await readFile(outputPath, "utf8"));
  previousByKey = new Map(previous.assets.map((asset) => [asset.destination_key, asset]));
} catch {
  // The first run has no prior upload state to preserve.
}

const assets = [
  {
    file: "linq-wash-high-roller-2025-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20250504_093633.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "linq-garage-flood-entrance-2025-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20250504_093650.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "brooklyn-bowl-stage-2025-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20250510_224123.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "linq-garage-flash-flood-2025-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20251115_183209.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "linq-garage-flood-debris-2025-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20251115_183327.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "flamingo-hotel-night-2026-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20260112_181240.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "brooklyn-bowl-empty-room-2026-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20260115_165222.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "brooklyn-bowl-empty-room-wide-2026-v1.jpg",
    width: 2048,
    height: 907,
    original: "references/author-originals/20260115_165458.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "linq-promenade-brooklyn-bowl-2026-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20260116_194103.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "jrad-brooklyn-bowl-las-vegas-2026-v1.jpg",
    width: 2048,
    height: 1536,
    original: "references/author-originals/20260730_202250.jpg in the supplied Codex pack",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
  },
  {
    file: "unlv-flamingo-aerial-1952-v1.jpg",
    width: 2400,
    height: 1402,
    original: "UNLV Digital ID sky000086 IIIF derivative",
    rights: "copyright-not-evaluated-editorial-context",
    rights_basis: "UNLV marks the item Copyright Not Evaluated. The user approved limited editorial publication with archive credit and context.",
    credit: "UNLV Special Collections and Archives, Las Vegas News Bureau Photograph Collection, sky000086",
    source_url_or_note: "https://special.library.unlv.edu/ark:/62930/d14f1mx4f",
    editorial_context: "Shows the Flamingo and surrounding corridor before later resort and LINQ development.",
  },
  {
    file: "unlv-paluzzi-strip-panorama-1982-v1.jpg",
    width: 4096,
    height: 976,
    original: "UNLV Digital ID PH_00414_132-01 IIIF derivative",
    rights: "in-copyright-educational-use-permitted",
    rights_basis: "UNLV marks the item In Copyright - Educational Use Permitted. The user approved a limited editorial derivative with archive credit and context.",
    credit: "Bob Paluzzi / UNLV Special Collections and Archives, PH_00414_132-01",
    source_url_or_note: "https://special.library.unlv.edu/ark:/62930/d1qb9z35k",
    editorial_context: "Period visual evidence for the Strip corridor discussed in the article.",
  },
  {
    file: "unlv-paluzzi-strip-detail-1982-v1.jpg",
    width: 1400,
    height: 3174,
    original: "Deterministic IIIF crop from UNLV Digital ID PH_00414_132-01",
    rights: "in-copyright-educational-use-permitted",
    rights_basis: "UNLV marks the item In Copyright - Educational Use Permitted. The user approved a limited editorial crop with archive credit and context.",
    credit: "Bob Paluzzi / UNLV Special Collections and Archives, PH_00414_132-01",
    source_url_or_note: "https://special.library.unlv.edu/ark:/62930/d1qb9z35k",
    editorial_context: "Annotated crop identifying visible landmarks while explicitly declining parcel-level claims.",
  },
  {
    file: "linq-garage-flood-2026-v1-poster.jpg",
    width: 1280,
    height: 720,
    original: "Frame from the supplied linq-garage-flood_1.mp4",
    rights: "author-owned",
    credit: "Author video / HobFarm",
  },
  {
    file: "jrad-brooklyn-bowl-las-vegas-2026-v1-poster.jpg",
    width: 1280,
    height: 720,
    original: "Frame from the supplied 20260730_jrad.mp4",
    rights: "author-owned",
    credit: "Author video / HobFarm",
  },
  {
    file: "linq-garage-flood-2026-v1-480p-h264.mp4",
    width: 854,
    height: 480,
    original: "https://cdn.hob.farm/articles/bblv/linq-garage-flood_1.mp4",
    rights: "author-owned",
    credit: "Author video / HobFarm",
  },
  {
    file: "jrad-brooklyn-bowl-las-vegas-2026-v1-480p-h264.mp4",
    width: 854,
    height: 480,
    original: "https://cdn.hob.farm/articles/bblv/20260730_jrad.mp4",
    rights: "author-owned",
    credit: "Author video / HobFarm",
  },
];

const manifestAssets = [];
for (const asset of assets) {
  const absolute = resolve(sourceRoot, asset.file);
  const [buffer, details] = await Promise.all([readFile(absolute), stat(absolute)]);
  const destinationKey = `articles/bblv/${asset.file}`;
  const contentType = asset.file.endsWith(".mp4") ? "video/mp4" : "image/jpeg";

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
    id: basename(asset.file, asset.file.endsWith(".mp4") ? ".mp4" : ".jpg"),
    source_file: `.tmp/bblv-upload/${asset.file}`,
    source_original_file: asset.original,
    destination_bucket: "hobfarm-cdn",
    destination_key: destinationKey,
    public_url: `https://cdn.hob.farm/${destinationKey}`,
    content_type: contentType,
    width: asset.width,
    height: asset.height,
    bytes: details.size,
    sha256,
    rights: asset.rights,
    ...(asset.rights_basis ? { rights_basis: asset.rights_basis } : {}),
    credit: asset.credit,
    source_url_or_note: asset.source_url_or_note ?? asset.original,
    ...(asset.editorial_context ? { editorial_context: asset.editorial_context } : {}),
    publication_status: "publish by explicit user direction",
    ...preservedVerification,
  });
}

const manifest = {
  schema_version: 1,
  article_slug: "from-wetlands-to-the-wash",
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  source_manifest: "from-wetlands-to-the-wash-codex-pack.zip/data/asset-manifest.json",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    allowed_prefixes: ["articles/bblv/"],
    publication_status_required: "publish by explicit user direction",
  },
  normalization: {
    image_maximum_dimensions: "4096px on the long edge for the archive panorama; 2400px or source size for other images",
    jpeg_encoder: "ffmpeg mjpeg with metadata removed",
    video: "854x480 H.264 High Profile, yuv420p, AAC, fast-start; full supplied originals remain linked as fallbacks",
    preserve_full_frame: true,
  },
  prefix_inventory_before_upload: {
    checked_at: "2026-08-10T03:36:00.000Z",
    method: "Read-only remote R2 binding list with prefix articles/bblv/",
    object_count: 4,
    existing_keys: [
      "articles/bblv/",
      "articles/bblv/20260730_jrad.mp4",
      "articles/bblv/bblv-high-roller-sphere-linq.jpg",
      "articles/bblv/linq-garage-flood_1.mp4",
    ],
  },
  assets: manifestAssets,
};

await mkdir(resolve(root, "reports/bblv"), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${manifestAssets.length} assets to ${outputPath}`);
