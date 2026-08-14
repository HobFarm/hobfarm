import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const articleSlug = "salton-sea-needs-an-outlet";
const sourcePrefix = "articles/salton-sea/";
const outputPrefix = `articles/${articleSlug}/`;
const cdn = "https://cdn.hob.farm";
const sourceDir = resolve(root, ".tmp/salton-sea-source");
const reportDir = resolve(root, "reports/salton-sea");

const sourceFiles = [
  "SaltonCity500fourthAnnual.jpg",
  "aerial-club-harbor-motel-1962.jpg",
  "boat-races-1946.jpg",
  "boat-races-1948.jpg",
  "boat-races-beach.jpg",
  "boat-races-beach2.JPG",
  "boat-races-lift.jpg",
  "boat-races.jpg",
  "club-harbor-motel-abanoned-tennis.JPG",
  "dead-pelican.JPG",
  "north-shore-ad.jpg",
  "north-shore-aerial-render.jpg",
  "north-shore-aerial.jpg",
  "north-shore-marina-above-2008.jpg",
  "north-shore-marina-above-2026.jpg",
  "north-shore-marina1.jpg",
  "north-shore-marina2.jpg",
  "north-shore-marina3.JPG",
  "north-shore-yacht-club-2010-1.JPG",
  "north-shore-yacht-club-2010-2.JPG",
  "north-shore-yacht-club-2010-3.JPG",
  "north-shore-yacht-club-2010-4.JPG",
  "north-shore-yacht-club-2010-5.JPG",
  "north-shore-yacht-club-classic.jpg",
  "north-shore-yacht-club-drawing.jpg",
  "north-shore-yacht-club-original.jpg",
  "salton-city-500.jpg",
  "salton-city-boat-lauch-abandoned.JPG",
  "salton-sea-beach1.JPG",
  "salton-sea-beach2.JPG",
  "salton-sea-beach3.JPG"
];

const authorOwned = new Set([
  "club-harbor-motel-abanoned-tennis.JPG",
  "dead-pelican.JPG",
  "north-shore-marina3.JPG",
  "north-shore-yacht-club-2010-1.JPG",
  "north-shore-yacht-club-2010-2.JPG",
  "north-shore-yacht-club-2010-3.JPG",
  "north-shore-yacht-club-2010-4.JPG",
  "north-shore-yacht-club-2010-5.JPG",
  "salton-city-boat-lauch-abandoned.JPG",
  "salton-sea-beach1.JPG",
  "salton-sea-beach2.JPG",
  "salton-sea-beach3.JPG"
]);

const museumArchive = new Set([
  "SaltonCity500fourthAnnual.jpg",
  "aerial-club-harbor-motel-1962.jpg",
  "boat-races-1946.jpg",
  "boat-races-1948.jpg",
  "boat-races-beach.jpg",
  "boat-races-beach2.JPG",
  "boat-races-lift.jpg",
  "boat-races.jpg",
  "north-shore-ad.jpg",
  "north-shore-aerial-render.jpg",
  "north-shore-aerial.jpg",
  "north-shore-marina1.jpg",
  "north-shore-marina2.jpg",
  "north-shore-yacht-club-classic.jpg",
  "north-shore-yacht-club-drawing.jpg",
  "north-shore-yacht-club-original.jpg",
  "salton-city-500.jpg"
]);

const museumArchiveDates = {
  "aerial-club-harbor-motel-1962.jpg": "1962-04-10",
  "boat-races-1946.jpg": "1946 (museum archive filename)",
  "boat-races-1948.jpg": "1948 (museum archive filename)"
};

const publicSelections = new Set([
  ...museumArchive,
  "north-shore-marina-above-2008.jpg",
  "north-shore-marina-above-2026.jpg",
  "north-shore-yacht-club-2010-1.JPG",
  "north-shore-yacht-club-2010-2.JPG",
  "north-shore-yacht-club-2010-4.JPG",
  "salton-sea-beach1.JPG",
  "salton-sea-beach2.JPG",
  "salton-sea-beach3.JPG"
]);

const promptReferences = new Set([
  "north-shore-aerial-render.jpg",
  "north-shore-yacht-club-2010-2.JPG",
  "north-shore-marina-above-2026.jpg"
]);

const placementByFile = {
  "SaltonCity500fourthAnnual.jpg": {
    subject: "Fourth annual Salton City 500 poster",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "A poster promoted the fourth annual Salton City 500 over Veterans Day weekend; the retained scan does not establish the year.",
    alt: "Yellow poster advertising the fourth annual Salton City 500 speedboat race over Veterans Day weekend with twenty-five thousand dollars in guaranteed prize money.",
  },
  "aerial-club-harbor-motel-1962.jpg": {
    subject: "North Shore Beach promotional supplement",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "A Los Angeles Times promotional page dated April 10, 1962, sold North Shore as a complete resort.",
    alt: "Sepia Los Angeles Times promotional page titled The North Shore Beach Story with an aerial view of the yacht club, harbor, motel, roads, and shoreline.",
  },
  "boat-races-1946.jpg": {
    subject: "Salton Sea hydroplane race photograph",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "A press photograph filed by the museum archive as 1946 shows hydroplane 7-A cutting across the Sea.",
    alt: "Black-and-white press photograph of hydroplane 7-A throwing a high wake during a Salton Sea boat race.",
  },
  "boat-races-1948.jpg": {
    subject: "Salton Sea hydroplane race photograph",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "A second race photograph, filed as 1948, records a hydroplane running across open water.",
    alt: "Black-and-white photograph of a driver racing a small hydroplane across the Salton Sea with a long wake behind it.",
  },
  "boat-races-beach.jpg": {
    subject: "Salton Sea boat-race shoreline crowd",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "Cars, trailers, spectators, and boats crowd an undated race-day shoreline.",
    alt: "Black-and-white elevated view of cars, trailers, boats, and spectators packed along the Salton Sea shore for a boat race.",
  },
  "boat-races-beach2.JPG": {
    subject: "Salton Sea race pits",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "Race boats and support vehicles line the water's edge in an undated archive print.",
    alt: "Black-and-white photograph of racing boats, support vehicles, crews, and spectators lined along the Salton Sea shoreline.",
  },
  "boat-races-lift.jpg": {
    subject: "Hydroplane handling at the Salton Sea",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "A crane lifts a hydroplane beside a working Salton Sea dock.",
    alt: "Black-and-white photograph of a crane lifting a hydroplane above a dock while workers watch from shore and a small boat.",
  },
  "boat-races.jpg": {
    subject: "Salton Sea race pits",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "A wider race-day view shows how much temporary infrastructure gathered at the shore.",
    alt: "Wide black-and-white photograph of race boats, cars, trailers, crews, and spectators covering a Salton Sea beach.",
  },
  "north-shore-ad.jpg": {
    subject: "North Shore Beach advertisement",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "An undated color advertisement called North Shore Beach the Salton Sea's glamour capital.",
    alt: "Color North Shore Beach advertisement with illustrations of the yacht club, swimming, boating, golf, housing, and desert recreation.",
  },
  "north-shore-aerial-render.jpg": {
    subject: "North Shore Beach master-plan rendering",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "The master-plan rendering joined homes, roads, a marina, and the Sea into one development image.",
    alt: "Painted aerial master-plan rendering of North Shore Beach with houses, roads, a marina, breakwaters, yacht club, and mountains around the Salton Sea.",
  },
  "north-shore-aerial.jpg": {
    subject: "North Shore marina aerial photograph",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "An undated aerial photograph records the built marina, breakwaters, roads, and shoreline.",
    alt: "Black-and-white aerial photograph of North Shore roads, buildings, marina basin, curved breakwaters, and the adjoining Salton Sea.",
  },
  "north-shore-marina1.jpg": {
    subject: "North Shore launch ramp",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "A car and boat use the North Shore launch ramp below the yacht club.",
    alt: "Archival color photograph of people launching a small boat beside a pale car with the North Shore Yacht Club above the water.",
  },
  "north-shore-marina2.jpg": {
    subject: "Working North Shore marina",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "Boats, palms, docks, and harbor equipment filled the working marina.",
    alt: "Black-and-white photograph of boats, docks, palms, a crane, and waterfront buildings in the North Shore marina.",
  },
  "north-shore-yacht-club-classic.jpg": {
    subject: "North Shore Yacht Club harbor view",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "An archival color view shows boats between the camera and the yacht club.",
    alt: "Archival color photograph of the North Shore Yacht Club across marina water with several motorboats in the foreground.",
  },
  "north-shore-yacht-club-drawing.jpg": {
    subject: "North Shore Yacht Club architectural drawing",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "An architectural perspective placed the yacht club directly over the harbor edge.",
    alt: "Architectural perspective drawing of the North Shore Yacht Club, marina, boats, palms, and mountains beyond the Salton Sea.",
  },
  "north-shore-yacht-club-original.jpg": {
    subject: "Early North Shore Yacht Club photograph",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "An early photograph shows the finished yacht club beside an open marina basin.",
    alt: "Black-and-white archival photograph of the North Shore Yacht Club beside water, pilings, palms, and an open shoreline.",
  },
  "salton-city-500.jpg": {
    subject: "Salton City 500 promotional photograph",
    section: "First too much water, then too little",
    comparison: "Resort and racing boom",
    caption: "A promotional photograph called the Salton City 500 the world's richest powerboat race.",
    alt: "Black-and-white promotional image headed The Salton City 500 above a crowd gathered beside the water for a powerboat race.",
  },
  "north-shore-marina-above-2008.jpg": {
    subject: "North Shore marina and yacht club aerial",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "The North Shore harbor and breakwaters in February 2008, with the main Sea still close to the marina entrance.",
    alt: "Google Earth view of the North Shore Yacht Club, marina basin, breakwaters, roads, and nearby Salton Sea shoreline in February 2008.",
  },
  "north-shore-marina-above-2026.jpg": {
    subject: "North Shore marina and yacht club aerial",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "The same fixed harbor geometry in 2026, after the main shoreline withdrew beyond the breakwaters.",
    alt: "Google Earth view of the North Shore Yacht Club, stranded marina basin, breakwaters, roads, and distant Salton Sea shoreline in 2026.",
  },
  "north-shore-yacht-club-2010-1.JPG": {
    subject: "North Shore Yacht Club exterior",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "The rehabilitated North Shore Yacht Club in 2010.",
    alt: "The curved concrete North Shore Yacht Club building and palms seen from the land side in 2010.",
  },
  "north-shore-yacht-club-2010-2.JPG": {
    subject: "North Shore marina and yacht club",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "The yacht club and harbor water shared the same working edge in 2010.",
    alt: "North Shore Yacht Club beside water inside the marina basin in 2010, with pilings and the breakwater visible.",
  },
  "north-shore-yacht-club-2010-4.JPG": {
    subject: "North Shore marina pilings",
    section: "North Shore, connected and disconnected",
    comparison: "North Shore through time",
    caption: "Pilings stood in harbor water during the 2010 visit.",
    alt: "Rows of weathered pilings standing in the North Shore marina water in 2010.",
  },
  "salton-sea-beach1.JPG": {
    subject: "Salton Sea shoreline ecology",
    section: "Ecology does not end at a salinity target",
    comparison: "Ecological field observations",
    caption: "A Salton Sea shoreline reach photographed during the 2010 field visit.",
    alt: "A broad Salton Sea beach and shallow shoreline photographed in 2010.",
  },
  "salton-sea-beach2.JPG": {
    subject: "Salton Sea shoreline ecology",
    section: "Ecology does not end at a salinity target",
    comparison: "Ecological field observations",
    caption: "Foam, colored water, and dead fish on a shoreline reach in 2010; the image does not establish the cause.",
    alt: "Foam, algae-colored water, and many dead fish along the Salton Sea shore in 2010.",
  },
  "salton-sea-beach3.JPG": {
    subject: "Salton Sea birds",
    section: "Ecology does not end at a salinity target",
    comparison: "Ecological field observations",
    caption: "Birds use a quiet shoreline reach of the Salton Sea.",
    alt: "Birds standing and floating along the calm Salton Sea shore in 2010.",
  },
};

function editorialMetadata(file) {
  const selected = placementByFile[file];
  return {
    location: file.includes("north-shore") ? "North Shore, California" : "Salton Sea region, California",
    subject: selected?.subject ?? "Salton Sea source-media reference",
    source: museumArchive.has(file)
      ? "Salton Sea History Museum materials retained by HobFarm during 2010 volunteer work inside the North Shore Yacht Club"
      : "HobFarm-supplied R2 source package",
    owner_or_archive: authorOwned.has(file)
      ? "HobFarm"
      : museumArchive.has(file)
        ? "Salton Sea History Museum archive; item-level creator unverified"
      : file.includes("above-")
        ? "Google Earth imagery provider identified in embedded attribution"
        : "Supplied HobFarm historical archive; item-level owner unverified",
    rights_status: authorOwned.has(file)
      ? "author-owned"
      : museumArchive.has(file)
        ? "publisher-authorized archival reproduction; item-level creator unverified"
      : file.includes("above-")
        ? "editorial evidence with embedded attribution retained"
        : "unresolved; research use only",
    caption: selected?.caption ?? null,
    alt_text: selected?.alt ?? null,
    article_section: selected?.section ?? null,
    comparison_group: selected?.comparison ?? null,
    crop_restrictions: file.includes("above-")
      ? "Do not crop, cover, or remove embedded Google Earth and imagery-provider attribution."
      : museumArchive.has(file)
        ? "Preserve printed captions, borders, and identifying text where present; do not imply a date beyond the visible record or retained archive label."
        : "No crop restriction documented; preserve evidentiary content and avoid misleading crops.",
    derivative_keys: [],
    receipt_still_needed: !authorOwned.has(file) && !file.includes("above-") && !museumArchive.has(file),
  };
}

function rightsFor(file) {
  if (authorOwned.has(file)) {
    return {
      credit: "Photograph by HobFarm",
      rights_basis: "Author-owned photograph supplied for this article",
      source_date: file.includes("2010") ? "2010" : "2010 (author package; verify item date before reuse elsewhere)",
    };
  }
  if (file === "north-shore-marina-above-2008.jpg") {
    return {
      credit: "Google Earth; imagery attribution embedded in source image",
      rights_basis: "Editorial geographic comparison; embedded interface and attribution retained",
      source_date: "2008-02",
    };
  }
  if (file === "north-shore-marina-above-2026.jpg") {
    return {
      credit: "Google Earth / Airbus; imagery attribution embedded in source image",
      rights_basis: "Editorial geographic comparison; embedded interface and attribution retained",
      source_date: "2026",
    };
  }
  if (museumArchive.has(file)) {
    return {
      credit: "Salton Sea History Museum archive; retained by HobFarm during 2010 volunteer work; creator unverified",
      rights_basis: "Publisher-authorized historical archive reproduction with source context disclosed; no claim of authorship or item-level ownership",
      source_date: museumArchiveDates[file] ?? null,
    };
  }
  return {
    credit: "Supplied HobFarm historical archive; item-level creator unverified",
    rights_basis: "Rights unresolved; retain as research/reference unless an editorial-evidence use is separately justified",
    source_date: null,
  };
}

async function bytesFor(file) {
  const local = resolve(sourceDir, file);
  try {
    await access(local);
    return readFile(local);
  } catch {
    const url = `${cdn}/${sourcePrefix}${file.split("/").map(encodeURIComponent).join("/")}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
}

const sourceAssets = [];
for (const file of sourceFiles) {
  const bytes = await bytesFor(file);
  const metadata = await sharp(bytes).metadata();
  sourceAssets.push({
    object_key: `${sourcePrefix}${file}`,
    filename: file,
    file,
    source_key: `${sourcePrefix}${file}`,
    public_url: `${cdn}/${sourcePrefix}${file.split("/").map(encodeURIComponent).join("/")}`,
    public_cdn_url: `${cdn}/${sourcePrefix}${file.split("/").map(encodeURIComponent).join("/")}`,
    width: metadata.width,
    height: metadata.height,
    dimensions: { width: metadata.width, height: metadata.height },
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    content_type: "image/jpeg",
    mime_type: "image/jpeg",
    ...rightsFor(file),
    capture_or_publication_date: rightsFor(file).source_date,
    ...editorialMetadata(file),
    article_use: publicSelections.has(file) ? "selected" : promptReferences.has(file) ? "generation-reference" : "not selected",
    receipt_status: authorOwned.has(file)
      ? "author statement in build brief"
      : museumArchive.has(file)
        ? "publisher authorization recorded August 14, 2026; materials retained during 2010 Salton Sea History Museum volunteer work"
        : file.includes("above-")
          ? "embedded attribution"
          : "item-level receipt not supplied",
    notes: file === "dead-pelican.JPG"
      ? "Not selected: graphic carcass and cause cannot be established from the image."
      : file === "aerial-club-harbor-motel-1962.jpg"
        ? "Scanned Los Angeles Times supplement page visibly dated April 10, 1962."
        : undefined,
  });
}

const heroSource = "assets/articles/salton-sea-needs-an-outlet/generated/salton-sea-water-machine-proposal-v1.webp";
const heroBytes = await readFile(resolve(root, heroSource));
const heroMetadata = await sharp(heroBytes).metadata();
const hero = {
  asset_id: "proposal-hero-v1",
  object_key: `${outputPrefix}salton-sea-water-machine-proposal-v1.webp`,
  filename: "salton-sea-water-machine-proposal-v1.webp",
  source_file: heroSource,
  destination_key: `${outputPrefix}salton-sea-water-machine-proposal-v1.webp`,
  purpose: "Article hero and social preview",
  caption: "Proposal illustration: a managed Salton Sea water district with lake-side treatment, salt handling, habitat cells, agriculture, and a mixed geothermal, solar, and wind power system.",
  alt_text: "Proposal illustration looking across a working North Shore marina toward lake-water treatment trains, broad salt-handling ponds, canals, farms, habitat cells, geothermal steam, solar fields, wind turbines, and transmission lines in the Salton Sea basin.",
  credit: "HobFarm / generated with OpenAI image generation under human direction",
  rights_basis: "Original HobFarm editorial proposal illustration",
  construction: "Built-in OpenAI image generation with three supplied visual references; approved result converted to WebP without compositional edits.",
  editable_source: "assets/articles/salton-sea-needs-an-outlet/generated/salton-sea-water-machine-proposal-source.png",
  placement: "Article hero and social metadata",
  article_section: "Article hero and social metadata",
  subject: "Proposed managed Salton Sea regional water system",
  source: "OpenAI image generation directed by HobFarm",
  owner_or_archive: "HobFarm",
  rights_status: "original generated editorial illustration",
  comparison_group: null,
  crop_restrictions: "Preserve enough of the full basin composition to keep the harbor, treatment works, salt handling, power, habitat, and agriculture legible; do not present as documentary imagery.",
  derivative_keys: [],
  receipt_still_needed: false,
  width: heroMetadata.width,
  height: heroMetadata.height,
  dimensions: { width: heroMetadata.width, height: heroMetadata.height },
  destination_bucket: "hobfarm-cdn",
  public_url: `${cdn}/${outputPrefix}salton-sea-water-machine-proposal-v1.webp`,
  content_type: "image/webp",
  mime_type: "image/webp",
  bytes: heroBytes.length,
  sha256: createHash("sha256").update(heroBytes).digest("hex"),
  mobile_qa: "pending",
  collision_check: "pending",
  replacement_policy: "new-key-only; increment version filename on conflict; never overwrite",
  upload_status: "not-checked",
  verification_status: "not-checked"
};

let previousHero = {};
try {
  const priorManifest = JSON.parse(await readFile(resolve(reportDir, "asset-manifest.json"), "utf8"));
  previousHero = priorManifest.assets?.find((asset) => asset.asset_id === hero.asset_id) ?? {};
} catch {
  // The first deterministic manifest build has no prior upload receipt to preserve.
}

const preservedReceiptFields = [
  "collision_check",
  "upload_status",
  "verification_status",
  "remote_sha256",
  "http_status",
  "verified_content_type",
  "verified_cache_control",
  "public_response_sha256",
  "edge_transformed",
  "verified_at",
  "mobile_qa",
];
for (const field of preservedReceiptFields) {
  if (previousHero[field] !== undefined) hero[field] = previousHero[field];
}

await mkdir(reportDir, { recursive: true });
await writeFile(resolve(reportDir, "source-asset-ledger.json"), `${JSON.stringify({
  version: 1,
  article_slug: articleSlug,
  checked_at: assumptionsDate(),
  source_bucket: "hobfarm-cdn",
  source_prefix: sourcePrefix,
  source_object_count: sourceAssets.length,
  policy: "Source objects are read-only. No source key may be overwritten, moved, renamed, or deleted.",
  assets: sourceAssets,
}, null, 2)}\n`);

await writeFile(resolve(reportDir, "asset-manifest.json"), `${JSON.stringify({
  version: 1,
  article_slug: articleSlug,
  generated_at: assumptionsDate(),
  scheduled_publication: "2026-08-25T16:20:00-07:00",
  predecessor_publication: "2026-08-24T16:20:00-07:00",
  schedule_difference_seconds: 86400,
  bucket: "hobfarm-cdn",
  public_hostname: cdn,
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: [outputPrefix]
  },
  assets: [hero]
}, null, 2)}\n`);

function assumptionsDate() {
  return new Date().toISOString();
}

console.log(`Wrote ${sourceAssets.length} source records and 1 upload record.`);
