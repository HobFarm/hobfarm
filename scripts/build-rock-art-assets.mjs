import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const outputRoot = resolve(".tmp/rock-art-assets");
const reportRoot = resolve("reports/rock-art");
await mkdir(outputRoot, { recursive: true });
await mkdir(reportRoot, { recursive: true });

const sources = [
  {
    asset_id: "mega-chad-shorelines",
    source_url: "https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/146000/146304/lakechad_srtm_2000_labled_lrg.jpg",
    filename: "mega-chad-shorelines-nasa-v1.webp",
    purpose: "Documentary map of former Lake Mega-Chad shorelines",
    caption: "Former shorelines of Lake Mega-Chad remain visible in elevation data around the much smaller modern lake.",
    alt_text: "NASA elevation map of north-central Africa showing the broad former Lake Mega-Chad basin and the much smaller modern Lake Chad.",
    credit: "NASA Earth Observatory image by Joshua Stevens, using SRTM topographic data and USGS Landsat data",
    rights_basis: "NASA media used under the agency's image-use guidelines; source credit retained.",
  },
  {
    asset_id: "tadrart-acacus-elephants",
    source_url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Libya_5041_Petroglyphs_Tadrart_Acacus_Luca_Galuzzi_2007.jpg",
    filename: "tadrart-acacus-elephant-petroglyph-v1.webp",
    purpose: "Documentary photograph of Saharan elephant petroglyphs",
    caption: "Elephant carvings at Tadrart Acacus record animals that no longer inhabit this part of the Sahara.",
    alt_text: "Ancient elephant figures carved into a dark rock face at Tadrart Acacus in Libya.",
    credit: "Luca Galuzzi / Wikimedia Commons",
    rights_basis: "CC BY-SA 2.5; resized and converted to WebP without content alteration.",
  },
];

const assets = [];
for (const source of sources) {
  const response = await fetch(source.source_url, {
    headers: { "user-agent": "HobFarm editorial asset builder/1.0" },
  });
  if (!response.ok) throw new Error(`Could not fetch ${source.source_url}: HTTP ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const destination = resolve(outputRoot, source.filename);
  await sharp(input)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(destination);

  const metadata = await sharp(destination).metadata();
  const bytes = await readFile(destination);
  const destinationKey = `articles/rock-art/${source.filename}`;
  assets.push({
    ...source,
    source_file: `.tmp/rock-art-assets/${source.filename}`,
    source_page:
      source.asset_id === "mega-chad-shorelines"
        ? "https://science.nasa.gov/earth/earth-observatory/remnants-of-an-ancient-lake-146304/"
        : "https://commons.wikimedia.org/wiki/File:Libya_5041_Petroglyphs_Tadrart_Acacus_Luca_Galuzzi_2007.jpg",
    license_url:
      source.asset_id === "mega-chad-shorelines"
        ? "https://www.nasa.gov/nasa-brand-center/images-and-media/"
        : "https://creativecommons.org/licenses/by-sa/2.5/",
    destination_key: destinationKey,
    placement: "Article body",
    width: metadata.width,
    height: metadata.height,
    destination_bucket: "hobfarm-cdn",
    public_url: `https://cdn.hob.farm/${destinationKey}`,
    content_type: "image/webp",
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    construction: "Source image resized and converted to WebP with Sharp; no generative or content edits.",
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
    mobile_qa: "pending",
    collision_check: "pending",
    upload_status: "pending",
    verification_status: "pending",
  });
}

const manifest = {
  version: 1,
  article_slug: "rock-art",
  generated_at: new Date().toISOString(),
  scheduled_publication: "2026-09-04T16:20:00-07:00",
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: ["articles/rock-art/"],
  },
  assets,
};

await writeFile(resolve(reportRoot, "asset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built ${assets.length} Rock Art documentary derivatives and wrote the upload manifest.`);
