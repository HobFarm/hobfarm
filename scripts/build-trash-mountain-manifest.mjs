import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const args = process.argv.slice(2);
const packFlag = args.indexOf("--pack");

if (packFlag === -1 || !args[packFlag + 1]) {
  throw new Error("Usage: node scripts/build-trash-mountain-manifest.mjs --pack <pack-root>");
}

const packRoot = args[packFlag + 1];
const stageRoot = join(root, "_cdn", "articles", "trash-mountain");
const reportRoot = join(root, "reports", "trash-mountain");
const assetLedgerPath = join(packRoot, "03_ASSETS", "asset-manifest.csv");

function parseCsv(value) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((item) => item.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])),
  );
}

function contentType(file) {
  return {
    ".csv": "text/csv; charset=utf-8",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  }[extname(file).toLowerCase()];
}

function stagedPathFor(row) {
  const filename = row.file_path.split("/").pop();
  if (row.asset_group === "user-owned") return join(stageRoot, "source", filename);
  if (row.asset_group === "google-earth") return join(stageRoot, "google-earth", filename);
  if (row.asset_group === "licensed-external") return join(stageRoot, "licensed", filename);
  return undefined;
}

function destinationKeyFor(row) {
  const filename = row.file_path.split("/").pop();
  if (row.asset_group === "user-owned") return `articles/trash-mountain/source/${filename}`;
  if (row.asset_group === "google-earth") return `articles/trash-mountain/google-earth/${filename}`;
  if (row.asset_group === "licensed-external") return `articles/trash-mountain/licensed/${filename}`;
  return undefined;
}

async function describeAsset({
  assetId,
  sourceFile,
  destinationKey,
  purpose,
  caption,
  altText,
  credit,
  rightsBasis,
  width,
  height,
}) {
  const bytes = await readFile(sourceFile);
  const metadata = await stat(sourceFile);
  return {
    asset_id: assetId,
    source_file: relative(root, sourceFile).replaceAll("\\", "/"),
    destination_bucket: "hobfarm-cdn",
    destination_key: destinationKey,
    public_url: `https://cdn.hob.farm/${destinationKey}`,
    classification: "public-editorial",
    related_content: ["article:trash-mountain"],
    purpose,
    caption,
    alt_text: altText,
    credit,
    rights_basis: rightsBasis,
    privacy: "safe for the documented editorial use",
    content_type: contentType(sourceFile),
    bytes: metadata.size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    ...(width ? { width: Number(width) } : {}),
    ...(height ? { height: Number(height) } : {}),
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
    upload_status: "ready",
    verification_status: "not-uploaded",
  };
}

const ledger = parseCsv(await readFile(assetLedgerPath, "utf8"));
const publishableRows = ledger.filter((row) => row.asset_group !== "reference-only");
const assets = [];

for (const row of publishableRows) {
  const sourceFile = stagedPathFor(row);
  const destinationKey = destinationKeyFor(row);
  if (!sourceFile || !destinationKey) {
    throw new Error(`No staging rule for ${row.asset_id}`);
  }

  assets.push(
    await describeAsset({
      assetId: row.asset_id,
      sourceFile,
      destinationKey,
      purpose: row.article_role,
      caption: row.caption_draft,
      altText: row.alt_text_draft,
      credit: row.credit,
      rightsBasis: row.ownership_rights,
      width: row.width,
      height: row.height,
    }),
  );
}

assets.push(
  await describeAsset({
    assetId: "trash-mountain-hero",
    sourceFile: join(stageRoot, "trash-mountain-hero.webp"),
    destinationKey: "articles/trash-mountain/trash-mountain-hero.webp",
    purpose: "article hero",
    caption: "An ordinary street container after its usable capacity is gone.",
    altText: "An overflowing blue sidewalk trash basket surrounded by bags and a dirty white comforter.",
    credit: "Photograph: HobFarm",
    rightsBasis: "user-owned photograph; editorial crop of U01",
    width: 1600,
    height: 900,
  }),
  await describeAsset({
    assetId: "trash-mountain-social",
    sourceFile: join(stageRoot, "trash-mountain-social.webp"),
    destinationKey: "articles/trash-mountain/trash-mountain-social.webp",
    purpose: "1200 by 630 social preview",
    caption: "An ordinary street container after its usable capacity is gone.",
    altText: "An overflowing blue sidewalk trash basket surrounded by bags and a dirty white comforter.",
    credit: "Photograph: HobFarm",
    rightsBasis: "user-owned photograph; editorial crop of U01",
    width: 1200,
    height: 630,
  }),
  await describeAsset({
    assetId: "fatal-waste-slope-events-csv",
    sourceFile: join(stageRoot, "data", "fatal-waste-slope-events.csv"),
    destinationKey: "articles/trash-mountain/data/fatal-waste-slope-events.csv",
    purpose: "downloadable 22-event research ledger",
    caption: "Audited working inventory of fatal waste-slope events from September 1996 through July 2026.",
    altText: "",
    credit: "HobFarm research audit",
    rightsBasis: "original structured research compiled for the article",
  }),
);

const manifest = {
  version: 1,
  article_slug: "trash-mountain",
  generated_at: new Date().toISOString(),
  bucket: "hobfarm-cdn",
  public_hostname: "https://cdn.hob.farm",
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: ["articles/trash-mountain/"],
  },
  editorial_rights_notes: {
    google_earth:
      "Editorial research/blog use only. Preserve the visible Google and provider attribution and imagery dates. Do not use as advertising, promotion, hero art, or social art.",
    licensed_external:
      "Retain the creator, source URL, license name, and share-alike terms recorded in the article and source pack.",
    reference_only:
      "The Guineematin ground photograph is excluded because the pack contains no publication license.",
  },
  assets,
  excluded_assets: ledger
    .filter((row) => row.asset_group === "reference-only")
    .map((row) => ({
      asset_id: row.asset_id,
      file_path: row.file_path,
      reason: "reference-only copyrighted image; no publication license in pack",
    })),
};

await mkdir(reportRoot, { recursive: true });
const output = join(reportRoot, "asset-manifest.json");
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Wrote ${relative(root, output)} with ${assets.length} ready assets.`);
