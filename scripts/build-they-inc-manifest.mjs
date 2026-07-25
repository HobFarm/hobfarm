import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(
  root,
  "reports",
  "brought-to-you-by-they-inc",
  "brought-to-you-by-they-inc-asset-manifest.json",
);
const base = "assets/brought-to-you-by-they-inc";
const bucket = "hobfarm-cdn";
const hostname = "https://cdn.hob.farm";
const prefix = "articles/brought-to-you-by-they-inc/";
const relatedContent = ["article:brought-to-you-by-they-inc"];

const asset = (source, key, purpose, altText) => ({
  source_file: `${base}/${source}`,
  destination_bucket: bucket,
  destination_key: `${prefix}${key}`,
  public_url: `${hostname}/${prefix}${key}`,
  classification: "public-editorial",
  related_content: relatedContent,
  purpose,
  alt_text: altText,
});

const assets = [
  asset(
    "hero-brought-to-you-by-they-inc.png",
    "hero-brought-to-you-by-they-inc.png",
    "Article hero and social image",
    "Mid-century editorial illustration of a cheerful corporate presenter standing before an information factory that packages flags, headlines, phones, lettuce, and public certainty.",
  ),
  asset(
    "they-inc-information-supply-chain.png",
    "they-inc-information-supply-chain.png",
    "Information supply-chain diagram",
    "An event moves through source statement, reporting, commentary, clips, audience interpretation, memory, group talking point, and finally the phrase they say.",
  ),
  asset(
    "thirty-years-of-they-inc.png",
    "thirty-years-of-they-inc.png",
    "Thirty-year capability timeline",
    "Timeline from 1998 through 2026 showing each new capability acquired by They, Inc.",
  ),
  asset(
    "same-event-different-packages.png",
    "same-event-different-packages.png",
    "Audience-package branching diagram",
    "One press conference branches into establishment, opposition, corporate, foreign, influencer, and lunchroom editions.",
  ),
  asset(
    "identity-badge-department.png",
    "identity-badge-department.png",
    "Political identity retail display",
    "Flags, masks, celebrities, food, brands, and slogans are displayed as packaged political identity badges.",
  ),
  asset(
    "iran-vs-djibouti.png",
    "iran-vs-djibouti.png",
    "Dated search-result and infrastructure comparison",
    "Google News results for Iran and Djibouti on July 24, 2026 appear above a schematic map of Djibouti, the Bab el-Mandeb strait, and Camp Lemonnier.",
  ),
  asset(
    "factoid-factory.png",
    "factoid-factory.png",
    "Context-compression diagram",
    "A complex event enters a factory where scope, location, comparison, uncertainty, and causal detail are removed before a factoid is packaged.",
  ),
  asset(
    "some-people-llc.png",
    "some-people-llc.png",
    "Synthetic-consensus illustration",
    "A television pundit pulls a Some People Say lever and produces an anonymous crowd.",
  ),
  asset(
    "i-dont-care-thats-bullshit-flowchart.png",
    "i-dont-care-thats-bullshit-flowchart.png",
    "Narrator claim-inspection flowchart",
    "A decision tree asks who they are, what they said, whether the source is recoverable, whether it applies, and whether the conclusion survives without team packaging.",
  ),
  asset(
    "sources/google-news-iran-2026-07-24-public.png",
    "sources/google-news-iran-2026-07-24.png",
    "Cropped analytical source capture",
    "Cropped Google News results page for the search term Iran, captured July 24, 2026.",
  ),
  asset(
    "sources/google-news-djibouti-2026-07-24-public.png",
    "sources/google-news-djibouti-2026-07-24.png",
    "Cropped analytical source capture",
    "Cropped Google News results page for the search term Djibouti, captured July 24, 2026.",
  ),
];

const mimeTypes = {
  ".png": "image/png",
};

for (const item of assets) {
  const absolute = join(root, item.source_file);
  const bytes = await readFile(absolute);
  const fileStat = await stat(absolute);
  const extension = extname(absolute).toLowerCase();
  const metadata = await sharp(bytes).metadata();

  Object.assign(item, {
    content_type: mimeTypes[extension],
    dimensions:
      metadata.width && metadata.height
        ? { width: metadata.width, height: metadata.height }
        : null,
    bytes: fileStat.size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
    upload_status: "planned",
    verification_status: "not-checked",
  });
}

const manifest = {
  content_id: "brought-to-you-by-they-inc",
  generated_at: new Date().toISOString(),
  bucket,
  public_hostname: hostname,
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: [prefix],
  },
  assets,
};

await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${assets.length} assets to ${manifestPath}`);

