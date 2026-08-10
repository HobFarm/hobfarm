import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const sourceRoot = resolve(".tmp/wavy-gravy-upload");
const outputPath = resolve("reports/wavy-gravy/asset-manifest.json");

let previousByKey = new Map();
try {
  const previous = JSON.parse(await readFile(outputPath, "utf8"));
  previousByKey = new Map(previous.assets.map((asset) => [asset.destination_key, asset]));
} catch {
  // The first run has no prior upload state to preserve.
}

const assets = [
  {
    file: "before-wavy-gravy-was-ice-cream-hero-v2.webp",
    width: 1600,
    height: 900,
    original: "User-supplied PNG preserved as .tmp/wavy-gravy-upload/before-wavy-gravy-was-ice-cream-hero-source-v2.png; SHA-256 f56dc39f9e9e8572cedc7304486448de09cb2eed9dc48c27beb500c9126246ca",
    rights: "user-supplied-editorial-image",
    credit: "Image supplied by HobFarm",
    purpose: "article hero and card image",
    alt: "An illustrated vintage-toned collage portraying Wavy Gravy with Jahanara, surrounded by Haight and Ashbury, a painted bus, a concert crowd, pigs, a shared meal, and communal cooking.",
  },
  {
    file: "before-wavy-gravy-was-ice-cream-social-v2.webp",
    width: 1200,
    height: 630,
    original: "Centered social crop of the user-supplied hero PNG",
    rights: "user-supplied-editorial-image",
    credit: "Image supplied by HobFarm",
    purpose: "social preview image",
    alt: "A wide crop of an illustrated vintage-toned collage portraying Wavy Gravy with Jahanara amid scenes of Haight-Ashbury, music, travel, and communal work.",
  },
  {
    file: "haight-ashbury-intersection-wide-early-2010s-1600-v1.webp",
    width: 1600,
    height: 1200,
    original: "references/user/haight-ashbury-intersection-wide-author.jpg in the supplied build pack; SHA-256 f1a9c49328e8f151eb2c2401c5afef8baf14dbd2bcdf500f2d6ac69048c040f1",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
    purpose: "early-2010s location after-image",
    alt: "Wide view of the Haight and Ashbury intersection in San Francisco, with a white corner building, shops, parked cars, pedestrians, and overhead transit wires.",
  },
  {
    file: "haight-ashbury-sign-close-early-2010s-1600-v1.webp",
    width: 1600,
    height: 1200,
    original: "references/user/haight-ashbury-sign-close-author.jpg in the supplied build pack; SHA-256 de7d21c23375f3d672261ee458ad8816a369a2c534a5a342d088b5c48f5d9b34",
    rights: "author-owned",
    credit: "Photograph by HobFarm",
    purpose: "early-2010s street-sign detail",
    alt: "Close view of intersecting Haight and Ashbury street signs mounted above a traffic signal against a cloudy sky.",
  },
];

const manifestAssets = [];
for (const asset of assets) {
  const absolute = resolve(sourceRoot, asset.file);
  const [buffer, details] = await Promise.all([readFile(absolute), stat(absolute)]);
  const destinationKey = `articles/wavy-gravy/${asset.file}`;
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
    source_file: `.tmp/wavy-gravy-upload/${asset.file}`,
    source_original_file: asset.original,
    destination_bucket: "hobfarm-cdn",
    destination_key: destinationKey,
    public_url: `https://cdn.hob.farm/${destinationKey}`,
    content_type: "image/webp",
    width: asset.width,
    height: asset.height,
    bytes: details.size,
    sha256,
    rights: asset.rights,
    credit: asset.credit,
    purpose: asset.purpose,
    alt_text: asset.alt,
    publication_status: "publish by explicit user direction",
    ...preservedVerification,
  });
}

const manifest = {
  schema_version: 1,
  article_slug: "before-wavy-gravy-was-ice-cream",
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  source_manifest: "hobfarm-wavy-gravy-before-woodstock-build-pack/data/asset-manifest.json",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    allowed_prefixes: ["articles/wavy-gravy/"],
    publication_status_required: "publish by explicit user direction",
  },
  normalization: {
    author_photos: "1600 by 1200 WebP derivatives at quality 86; source JPEG bytes left untouched",
    hero: "1600 by 900 WebP at quality 88 from the user-supplied 1672 by 941 PNG",
    social: "1200 by 630 centered crop from the user-supplied hero at quality 88",
    encoder: "FFmpeg 8.1.2 libwebp with no source overwrite",
  },
  source_originals: [
    {
      file: ".tmp/wavy-gravy-upload/before-wavy-gravy-was-ice-cream-hero-source-v2.png",
      width: 1672,
      height: 941,
      bytes: 3313312,
      sha256: "f56dc39f9e9e8572cedc7304486448de09cb2eed9dc48c27beb500c9126246ca",
      preserved: true,
    },
    {
      file: ".tmp/wavy-gravy-upload/haight-ashbury-intersection-wide-early-2010s-v1.jpg",
      width: 2048,
      height: 1536,
      bytes: 1035262,
      sha256: "f1a9c49328e8f151eb2c2401c5afef8baf14dbd2bcdf500f2d6ac69048c040f1",
      preserved: true,
    },
    {
      file: ".tmp/wavy-gravy-upload/haight-ashbury-sign-close-early-2010s-v1.jpg",
      width: 2048,
      height: 1536,
      bytes: 549711,
      sha256: "de7d21c23375f3d672261ee458ad8816a369a2c534a5a342d088b5c48f5d9b34",
      preserved: true,
    },
  ],
  prefix_inventory_before_upload: {
    checked_with: "scripts/r2-upload-manifest.mjs object-by-object remote checks",
    result: "v2 hero and social keys absent; existing author-photo v1 keys checksum-matched and preserved; no object overwritten",
  },
  assets: manifestAssets,
};

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${manifestAssets.length} assets to ${outputPath}`);
