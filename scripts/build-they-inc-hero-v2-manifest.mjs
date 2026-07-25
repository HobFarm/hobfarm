import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(
  root,
  "reports",
  "brought-to-you-by-they-inc",
  "brought-to-you-by-they-inc-hero-v2-manifest.json",
);
const sourceFile =
  "assets/brought-to-you-by-they-inc/hero-brought-to-you-by-they-inc-v2.png";
const destinationKey =
  "articles/brought-to-you-by-they-inc/hero-brought-to-you-by-they-inc-v2.png";
const absolute = join(root, sourceFile);
const bytes = await readFile(absolute);
const fileStat = await stat(absolute);
const metadata = await sharp(bytes).metadata();

const manifest = {
  content_id: "brought-to-you-by-they-inc-hero-v2",
  generated_at: new Date().toISOString(),
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: ["articles/brought-to-you-by-they-inc/"],
  },
  assets: [
    {
      source_file: sourceFile,
      destination_bucket: "hobfarm-cdn",
      destination_key: destinationKey,
      public_url: `https://cdn.hob.farm/${destinationKey}`,
      classification: "public-editorial",
      related_content: ["article:brought-to-you-by-they-inc"],
      purpose: "Corrected article hero and social image",
      alt_text:
        "Mid-century editorial illustration of a two-armed corporate presenter standing before an information factory that packages flags, headlines, phones, lettuce, and public certainty.",
      content_type: "image/png",
      dimensions:
        metadata.width && metadata.height
          ? { width: metadata.width, height: metadata.height }
          : null,
      bytes: fileStat.size,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      replacement_policy:
        "new-key-only; version filename on conflict; never overwrite",
      upload_status: "planned",
      verification_status: "not-checked",
    },
  ],
};

await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote corrected hero manifest to ${manifestPath}`);

