import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = "assets/put-on-the-glasses";
const reportRoot = join(root, "reports", "put-on-the-glasses");
const manifestPath = join(reportRoot, "asset-manifest.json");
const bucket = "hobfarm-cdn";
const publicHostname = "https://cdn.hob.farm";
const prefix = "articles/they-live/";

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
};

const asset = ({
  id,
  filename,
  purpose,
  caption,
  alt,
  credit,
  rights,
  sourceUrl = null,
  generation = null,
  video = null,
}) => ({
  asset_id: id,
  source_file: `${assetRoot}/${filename}`,
  destination_bucket: bucket,
  destination_key: `${prefix}${filename}`,
  public_url: `${publicHostname}/${prefix}${filename}`,
  classification: "public-editorial",
  related_content: ["article:put-on-the-glasses"],
  purpose,
  caption,
  alt_text: alt,
  credit,
  rights_basis: rights,
  source_url: sourceUrl,
  generation,
  video,
});

const assets = [
  asset({
    id: "put-on-the-glasses-hero",
    filename: "they-live-hero.png",
    purpose: "Article hero and Open Graph image",
    caption:
      "A user-controlled diagnostic tool reveals the ownership structure beneath a colorful augmented-reality layer.",
    alt:
      "Black sunglasses rest on a handmade electronics workbench while one lens reveals the ownership and contract structure beneath a colorful augmented-reality interface.",
    credit:
      "HobFarm / generated with OpenAI image generation under human direction",
    rights: "Original HobFarm editorial illustration.",
    generation: {
      provider: "OpenAI image generation",
      model:
        "Provider-managed image generation model; exact model identifier not returned",
      calls: 2,
      reported_cost_usd: null,
      note:
        "The second call removed accidental pseudo-lettering while preserving the selected composition.",
    },
  }),
  asset({
    id: "they-live-clip-web",
    filename: "they-live-clip-web.mp4",
    purpose: "Short article excerpt demonstrating the film's anti-interface",
    caption:
      "Nada puts on the sunglasses and the consumer world resolves into monochrome commands.",
    alt:
      "Nada first puts on the sunglasses and walks through signs and packages that become monochrome commands.",
    credit: "They Live (1988), directed by John Carpenter",
    rights:
      "Short film excerpt supplied by the author and optimized for criticism and commentary.",
    video: {
      width: 1440,
      height: 612,
      duration_seconds: 31.82,
      codec: "H.264 video with AAC audio",
      autoplay: false,
    },
  }),
  asset({
    id: "they-live-clip-poster",
    filename: "they-live-clip-poster.jpg",
    purpose: "Poster image for the article video excerpt",
    caption: "Nada raises the sunglasses before the first reveal.",
    alt: "Nada raises a pair of black sunglasses toward his face.",
    credit: "They Live (1988), directed by John Carpenter",
    rights:
      "Frame from an author-supplied film excerpt, used for criticism and commentary.",
  }),
  asset({
    id: "atheer-one-2013",
    filename: "atheer-one-2013.jpg",
    purpose: "Documentary image of Atheer's 2013 consumer and developer hardware",
    caption:
      "Atheer One consumer glasses and the developer headset shown during the December 2013 crowdfunding launch.",
    alt:
      "Black Atheer One consumer glasses sit beside the larger white-and-black Atheer developer headset on a table.",
    credit: "Atheer publicity image published by Engadget",
    rights:
      "Publicity image reproduced at editorial scale for documentary comparison, criticism, and commentary.",
    sourceUrl:
      "https://www.engadget.com/2013-12-19-atheer-labs-smart-glasses.html/",
  }),
  asset({
    id: "atheer-work-execution-2026",
    filename: "atheer-work-execution-2026.png",
    purpose: "Dated documentary capture of Atheer's current enterprise positioning",
    caption:
      "Atheer's enterprise work-execution page, captured July 27, 2026. Provider performance claims shown in the image are not independently verified.",
    alt:
      "Atheer's July 2026 website presents an execution-gap panel with promotional percentages for issue resolution, procedure compliance, error reduction, and repeat visits.",
    credit: "Atheer website / HobFarm capture",
    rights:
      "Dated company-site screenshot reproduced for documentary comparison, criticism, and commentary.",
    sourceUrl: "https://atheer.ai/",
  }),
];

for (const item of assets) {
  const absolute = join(root, item.source_file);
  const bytes = await readFile(absolute);
  const fileStat = await stat(absolute);
  const extension = extname(absolute).toLowerCase();
  const dimensions = item.video
    ? { width: item.video.width, height: item.video.height }
    : await sharp(bytes).metadata();

  Object.assign(item, {
    content_type: mimeTypes[extension],
    bytes: fileStat.size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    width: dimensions.width,
    height: dimensions.height,
    replacement_policy:
      "new-key-only; version filename on conflict; never overwrite",
    upload_status: "planned",
    verification_status: "not-checked",
  });
}

const manifest = {
  version: 1,
  article_slug: "put-on-the-glasses",
  generated_at: new Date().toISOString(),
  bucket,
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

await mkdir(reportRoot, { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${assets.length} public assets to ${manifestPath}`);
