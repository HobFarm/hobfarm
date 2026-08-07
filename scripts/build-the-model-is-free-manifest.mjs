import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const articleSlug = "the-model-is-free";
const prefix = `articles/${articleSlug}/`;
const publicHostname = "https://cdn.hob.farm";

const definitions = [
  {
    asset_id: "hero",
    source_file: "assets/the-model-is-free/hero.webp",
    destination_key: `${prefix}hero.webp`,
    purpose: "Article hero",
    caption: "An older workstation holds the durable workflow while a free model crate, a specialty AI appliance, rented GPU machinery, and modular compute parts compete for the job.",
    alt_text: "A satirical technical-magazine cutaway shows an older workstation controlling files and workflows, a crate of model weights too large for its memory gate, an expensive specialty AI appliance, a link to rented GPU machinery, and modular compute bricks.",
    credit: "HobFarm / generated with OpenAI image generation under human direction",
    rights_basis: "Original HobFarm editorial illustration.",
    construction: "Built-in OpenAI image generation; prompt retained in reports/the-model-is-free/hero-prompt.md; resized to 1600 by 900 WebP without compositional edits.",
    editable_source: "_cdn/articles/the-model-is-free/source/the-model-is-free-hero-master.png",
    placement: "Article hero",
  },
  {
    asset_id: "social",
    source_file: "assets/the-model-is-free/social.webp",
    destination_key: `${prefix}social.webp`,
    purpose: "Open Graph and social image",
    caption: "The free model still needs a machine.",
    alt_text: "An older workstation, a crate of model weights, a compact AI appliance, and remote GPU machinery share a technical-magazine workbench.",
    credit: "HobFarm / generated with OpenAI image generation under human direction",
    rights_basis: "Original HobFarm editorial illustration.",
    construction: "Centered 1200 by 630 derivative of the approved hero source.",
    editable_source: "_cdn/articles/the-model-is-free/source/the-model-is-free-hero-master.png",
    placement: "Social metadata",
  },
  {
    asset_id: "a16z-feed",
    source_file: "assets/the-model-is-free/a16z-open-weights-feed.webp",
    destination_key: `${prefix}a16z-open-weights-feed.webp`,
    purpose: "Opening documentary screenshot",
    caption: "The first thing X showed me while I was thinking about this article: an infrastructure argument about open weights, cost, and control.",
    alt_text: "Screenshot of an a16z post quoting Simon Mo on open-weight models, infrastructure control, cost, latency, and reliance on proprietary APIs, with a video still below the text.",
    credit: "Author-supplied screenshot of a public a16z post, captured August 6, 2026",
    rights_basis: "Editorial commentary and criticism.",
    construction: "Full-context WebP derivative with no crop; original bytes retained in _cdn/articles/the-model-is-free/source.",
    editable_source: "_cdn/articles/the-model-is-free/source/a16z-open-weights-feed-original.png",
    placement: "Opening section",
  },
  {
    asset_id: "three-routes",
    source_file: "assets/the-model-is-free/diagrams/01-three-routes.svg",
    destination_key: `${prefix}diagrams/01-three-routes.svg`,
    purpose: "Qualitative comparison of three payment routes",
    caption: "The cheapest route cannot be chosen before the job, frequency, privacy need, maintenance tolerance, and replacement risk are known.",
    alt_text: "Three columns compare a closed service or API, an owned local appliance, and a hybrid local workflow with rented burst compute across capital cost, control, maintenance, and best-fit use.",
  },
  {
    asset_id: "hybrid-workflow",
    source_file: "assets/the-model-is-free/diagrams/02-rent-gpu-own-workflow.svg",
    destination_key: `${prefix}diagrams/02-rent-gpu-own-workflow.svg`,
    purpose: "Hybrid local control plane and rented GPU workflow",
    caption: "Keep the durable production layer local. Attach the expensive accelerator only when the job exceeds the box.",
    alt_text: "A local control plane sends a bounded job and required assets to a temporary rented GPU, receives results and logs, then terminates compute while local files and records remain owned.",
  },
  {
    asset_id: "upgrade-cascade",
    source_file: "assets/the-model-is-free/diagrams/03-upgrade-cascade.svg",
    destination_key: `${prefix}diagrams/03-upgrade-cascade.svg`,
    purpose: "Conditional GPU upgrade dependencies",
    caption: "The card may fit the slot. The useful upgrade can still become a whole-system decision.",
    alt_text: "A new GPU sits at the center of conditional arrows to power and connectors, case clearance, cooling, platform value, RAM and storage, and drivers and migration.",
  },
  {
    asset_id: "modular-backplane",
    source_file: "assets/the-model-is-free/diagrams/04-modular-backplane-concept.svg",
    destination_key: `${prefix}diagrams/04-modular-backplane-concept.svg`,
    purpose: "Speculative modular AI computer",
    caption: "The pieces of composable computing exist. The affordable hobbyist system that makes them feel like one ordinary computer does not.",
    alt_text: "A clearly labeled what-if diagram connects a local controller, accelerator bricks, memory, storage, serviceable power and cooling, and a cloud-burst port through an open backplane and runtime.",
  },
  {
    asset_id: "compute-boring",
    source_file: "assets/the-model-is-free/diagrams/05-compute-becomes-boring.svg",
    destination_key: `${prefix}diagrams/05-compute-becomes-boring.svg`,
    purpose: "Television commoditization analogy",
    caption: "The category changes when useful local AI becomes an ordinary property of a computer instead of a separate infrastructure purchase.",
    alt_text: "Two qualitative timelines compare televisions moving from specialized equipment to an ordinary household baseline and ask whether local AI compute can follow a similar path.",
  },
];

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
  const size = await dimensions(definition.source_file);
  const contentType = definition.source_file.endsWith(".svg")
    ? "image/svg+xml"
    : "image/webp";
  assets.push({
    ...definition,
    ...size,
    destination_bucket: "hobfarm-cdn",
    public_url: `${publicHostname}/${definition.destination_key}`,
    content_type: contentType,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    credit: definition.credit ?? "HobFarm",
    rights_basis: definition.rights_basis ?? "Original HobFarm explanatory graphic supplied in the production packet and refined for publication.",
    construction: definition.construction ?? "Editable SVG supplied in the production packet; publication label refined without changing the information design.",
    editable_source: definition.editable_source ?? definition.source_file,
    placement: definition.placement ?? "Article body",
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
  scheduled_publication: "2026-08-13T16:20:00-07:00",
  predecessor_publication: "2026-08-12T16:20:00-07:00",
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

await writeFile(
  resolve("reports/the-model-is-free/asset-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${assets.length} asset records for ${prefix}`);
