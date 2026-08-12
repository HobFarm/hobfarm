import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const articleSlug = "reviewing-request-for-safety";
const prefix = `articles/${articleSlug}/`;
const publicHostname = "https://cdn.hob.farm";

const definitions = [
  {
    asset_id: "hero",
    source_file: "assets/reviewing-request-for-safety/hero-v2.webp",
    destination_key: `${prefix}hero-v2.webp`,
    purpose: "Article hero",
    caption: "A request passes through review layers that reorder its requirements before an altered approved output emerges.",
    alt_text: "A systems diagram shows an original request entering review layers, where requirements are reprioritized before an altered approved output emerges.",
    editable_source: "assets/reviewing-request-for-safety/diagrams/01-hero-reviewing-request-for-safety.svg",
    placement: "Article hero",
  },
  {
    asset_id: "social",
    source_file: "assets/reviewing-request-for-safety/social-v2.webp",
    destination_key: `${prefix}social-v2.webp`,
    purpose: "Open Graph and social image",
    caption: "The request is being reviewed. The user should review the review.",
    alt_text: "A systems diagram shows an AI request being reinterpreted as it passes through several review layers.",
    editable_source: "assets/reviewing-request-for-safety/diagrams/01-hero-reviewing-request-for-safety.svg",
    placement: "Social metadata",
  },
  {
    asset_id: "experiment-contact-sheet",
    source_file: "assets/reviewing-request-for-safety/experiment-contact-sheet.webp",
    destination_key: `${prefix}experiment-contact-sheet.webp`,
    purpose: "Six-output illustrative comparison",
    caption: "One controlled request produced a Meta AI sequence with one kneeling intermediate and three standing variations, plus kneeling controls in ChatGPT and Grok. This is an illustrative comparison, not a provider benchmark.",
    alt_text: "A six-image contact sheet shows one kneeling Meta AI intermediate, three standing Meta variations, and kneeling ChatGPT and Grok control outputs.",
    editable_source: "_cdn/articles/reviewing-request-for-safety/source/experiment-contact-sheet.png",
    placement: "Experiment section",
    rights_basis: "Author-held AI outputs reproduced as evidence of a controlled editorial experiment.",
  },
  ...[
    ["two-schemas", "02-two-schemas.svg", "Two schemas in one request", "A side-by-side diagram separates a request schema containing explicit constraints from an output schema inferred by the product."],
    ["priority-inversion", "03-priority-inversion.svg", "Instruction priority inversion", "A diagram shows explicit user requirements losing priority while an inferred safety interpretation becomes the governing requirement."],
    ["meta-process", "04-meta-process-timeline.svg", "Displayed Meta process narration", "A timeline separates Meta AI's displayed process narration from the generated outputs and from any claim about inaccessible internal reasoning."],
    ["interpretation-stack", "05-ai-interpretation-stack.svg", "The AI interpretation stack", "A layered diagram traces a request through interface, instruction hierarchy, prompt transformation, policy, model, tools, and output selection."],
    ["interpretation-debt", "06-interpretation-debt.svg", "Interpretation debt", "A diagram shows how repeated corrections accumulate when a product preserves its inferred interpretation instead of the user's explicit schema."],
    ["slop-pipeline", "07-slop-pipeline.svg", "The slop pipeline", "A pipeline traces a specific request through generic interpretation, polished nearby output, correction fatigue, and user acceptance."],
  ].map(([asset_id, file, caption, alt_text]) => ({
    asset_id,
    source_file: `assets/reviewing-request-for-safety/diagrams/${file}`,
    destination_key: `${prefix}diagrams/${file}`,
    purpose: caption,
    caption,
    alt_text,
  })),
  ...[
    ["meta-output-01", "meta-experiment/meta-output-01-kneeling.webp", "Meta AI output 1", "The first author-held Meta AI output from the controlled image request."],
    ["meta-output-02", "meta-experiment/meta-output-02-standing.webp", "Meta AI output 2", "The second author-held Meta AI output from the controlled image request."],
    ["meta-output-03", "meta-experiment/meta-output-03-standing.webp", "Meta AI output 3", "The third author-held Meta AI output from the controlled image request."],
    ["meta-output-04", "meta-experiment/meta-output-04-standing.webp", "Meta AI output 4", "The fourth author-held Meta AI output from the controlled image request."],
    ["chatgpt-control", "controls/chatgpt-control-kneeling.png", "ChatGPT control output", "The author-held ChatGPT control output from the same structured request."],
    ["grok-control", "controls/grok-control-kneeling.png", "Grok control output", "The author-held Grok control output from the same structured request."],
  ].map(([asset_id, file, caption, alt_text]) => ({
    asset_id,
    source_file: `_cdn/articles/reviewing-request-for-safety/source/${file}`,
    destination_key: `${prefix}evidence/${file}`,
    purpose: "Original experiment evidence",
    caption,
    alt_text,
    placement: "Evidence archive; contact sheet used in article",
    rights_basis: "Author-held AI output reproduced as evidence of a controlled editorial experiment.",
    construction: "Original supplied bytes retained without compositional editing.",
  })),
];

function contentType(sourceFile) {
  if (sourceFile.endsWith(".svg")) return "image/svg+xml";
  if (sourceFile.endsWith(".png")) return "image/png";
  return "image/webp";
}

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
  assets.push({
    ...definition,
    ...(await dimensions(definition.source_file)),
    destination_bucket: "hobfarm-cdn",
    public_url: `${publicHostname}/${definition.destination_key}`,
    content_type: contentType(definition.source_file),
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    credit: definition.credit ?? "HobFarm",
    rights_basis: definition.rights_basis ?? "Original HobFarm explanatory graphic supplied in the production packet.",
    construction: definition.construction ?? "Editable SVG supplied in the production packet; publication date corrected to the approved August 14 schedule.",
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
  scheduled_publication: "2026-08-14T16:20:00-07:00",
  predecessor_publication: "2026-08-13T16:20:00-07:00",
  successor_publication: "2026-08-15T16:20:00-07:00",
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

await mkdir(resolve("reports/reviewing-request-for-safety"), { recursive: true });
await writeFile(
  resolve("reports/reviewing-request-for-safety/asset-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${assets.length} asset records for ${prefix}`);
