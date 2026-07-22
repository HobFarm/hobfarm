import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "reports", "intellectual-self-defense-asset-manifest.json");
const base = "assets/intellectual-self-defense";
const bucket = "hobfarm-cdn";
const hostname = "https://cdn.hob.farm";

const asset = (source, key, relatedContent, purpose, altText = "") => ({
  source_file: `${base}/${source}`,
  destination_bucket: bucket,
  destination_key: key,
  public_url: `${hostname}/${key}`,
  classification: "public-editorial",
  related_content: relatedContent,
  purpose,
  alt_text: altText,
});

const assets = [
  asset("article/hero-card-catalog-talks-back-v1-16x9.webp", "articles/the-card-catalog-started-talking-back/hero-card-catalog-talks-back-v1-16x9.webp", ["article:the-card-catalog-started-talking-back"], "Article hero", "A wooden library card catalog opened into a cutaway research machine while a human operator holds a red pencil and the final judgment lever."),
  asset("article/hero-card-catalog-talks-back-v1-og.webp", "articles/the-card-catalog-started-talking-back/hero-card-catalog-talks-back-v1-og.webp", ["article:the-card-catalog-started-talking-back"], "Direct-CDN Open Graph image", "A wooden library card catalog opened into a cutaway research machine under human control."),
  asset("article/card-catalog-vs-chatbot-v1-wide.svg", "articles/the-card-catalog-started-talking-back/card-catalog-vs-chatbot-v1-wide.svg", ["article:the-card-catalog-started-talking-back"], "Research friction diagram", "The visible library route compared with a compressed chatbot answer route."),
  asset("article/three-lanes-learn-make-live-v1-wide.svg", "articles/the-card-catalog-started-talking-back/three-lanes-learn-make-live-v1-wide.svg", ["article:the-card-catalog-started-talking-back"], "Three-lane course map", "Learn, Make, and Live Around AI stations connected through a human operator."),
  asset("article/three-gap-rule-v1-wide.svg", "articles/the-card-catalog-started-talking-back/three-gap-rule-v1-wide.svg", ["article:the-card-catalog-started-talking-back"], "Three-gap rule", "Fact gaps need evidence, creative gaps allow authorized invention, and decision gaps require permission."),

  asset("course/course-cover-v1-16x9.webp", "self-defense/shared/course-cover-v1-16x9.webp", ["academy:intellectual-self-defense"], "Course cover 16:9", "A human operator routes source cards, creative materials, and media frames through a three-station mechanical workbench while holding the final control lever."),
  asset("course/course-cover-v1-4x5.webp", "self-defense/shared/course-cover-v1-4x5.webp", ["academy:intellectual-self-defense"], "Course cover 4:5", "A human operator routes research, creative work, and media inspection through three connected mechanical stations in a vertical illustration."),
  asset("course/three-lanes-learn-make-live-v1.svg", "self-defense/shared/three-lanes-learn-make-live-v1.svg", ["academy:intellectual-self-defense"], "Course lane map", "Learn, Make, and Live Around AI stations connected through a human operator."),

  asset("course/card-catalog-talks-back-v1.svg", "self-defense/lessons/00-card-catalog/card-catalog-talks-back-v1.svg", ["academy:intellectual-self-defense", "lesson:the-card-catalog-started-talking-back"], "Orientation diagram", "A visible library route compared with a compressed chatbot answer route."),
  asset("course/name-the-job-control-panel-v1.svg", "self-defense/lessons/01-name-the-job/name-the-job-control-panel-v1.svg", ["academy:intellectual-self-defense", "lesson:give-the-chatbot-a-research-job"], "Research contract control panel", "Fields for role, question, freshness, source priority, evidence labels, scope, output, and stop condition."),
  asset("course/answer-receipt-cutaway-v1.svg", "self-defense/lessons/02-open-the-receipt/answer-receipt-cutaway-v1.svg", ["academy:intellectual-self-defense", "lesson:open-the-receipt"], "Answer receipt cutaway", "A polished answer separated into claims, sources, excerpts, inference, and unknowns."),
  asset("course/ask-audit-rebuild-v1.svg", "self-defense/lessons/03-ask-audit-rebuild/ask-audit-rebuild-v1.svg", ["academy:intellectual-self-defense", "lesson:ask-audit-rebuild"], "Research workflow diagram", "Ask, Audit, Open, Compare, Rebuild, and Decide stages."),
  asset("course/source-files-beat-vibes-v1.svg", "self-defense/lessons/04-source-files/source-files-beat-vibes-v1.svg", ["academy:intellectual-self-defense", "lesson:source-files-beat-vibes"], "Creative source workflow", "Markdown source, constraints, model output, and human review stages."),
  asset("course/three-gap-rule-v1.svg", "self-defense/lessons/05-circuit-mint/three-gap-rule-v1.svg", ["academy:intellectual-self-defense", "lesson:i-asked-for-a-picture-it-built-a-system"], "Three-gap rule", "Fact gaps need evidence, creative gaps allow authorized invention, and decision gaps require permission."),
  asset("course/assignment-fidelity-matrix-v1.svg", "self-defense/lessons/05-circuit-mint/assignment-fidelity-matrix-v1.svg", ["academy:intellectual-self-defense", "lesson:i-asked-for-a-picture-it-built-a-system"], "Assignment fidelity matrix", "Output quality compared with whether the assignment was followed."),
  asset("course/circuit-mint-scope-drift-v1.svg", "self-defense/lessons/05-circuit-mint/circuit-mint-scope-drift-v1.svg", ["academy:intellectual-self-defense", "lesson:i-asked-for-a-picture-it-built-a-system"], "Circuit Mint scope-drift route", "A useful portrait separated from unsolicited naming, locking, numbering, and expansion decisions."),
  asset("course/circuit-mint-portrait-v1.webp", "self-defense/lessons/05-circuit-mint/circuit-mint-portrait-v1.webp", ["article:the-card-catalog-started-talking-back", "lesson:i-asked-for-a-picture-it-built-a-system"], "Optimized case-study portrait", "Mint-cyan gothic character portrait with amber-and-teal eyes, black lacquer tear makeup, black hair, and crescent earrings."),
  asset("course/circuit-mint-portrait-v1-hq.webp", "self-defense/lessons/05-circuit-mint/circuit-mint-portrait-v1-hq.webp", ["article:the-card-catalog-started-talking-back", "lesson:i-asked-for-a-picture-it-built-a-system"], "High-quality case-study portrait", "Mint-cyan gothic character portrait with amber-and-teal eyes, black lacquer tear makeup, black hair, and crescent earrings."),
  asset("course/circuit-mint-character-sheet-v1.webp", "self-defense/lessons/05-circuit-mint/circuit-mint-character-sheet-v1.webp", ["article:the-card-catalog-started-talking-back", "lesson:i-asked-for-a-picture-it-built-a-system"], "Optimized downstream character sheet", "Multiview character sheet showing the mint-cyan gothic character from the front, back, and three-quarter angle in black and purple clothing."),
  asset("course/circuit-mint-character-sheet-v1-hq.webp", "self-defense/lessons/05-circuit-mint/circuit-mint-character-sheet-v1-hq.webp", ["article:the-card-catalog-started-talking-back", "lesson:i-asked-for-a-picture-it-built-a-system"], "High-quality downstream character sheet", "Multiview character sheet showing the mint-cyan gothic character from the front, back, and three-quarter angle in black and purple clothing."),
  asset("course/route-the-work-v1.svg", "self-defense/lessons/06-route-the-work/route-the-work-v1.svg", ["academy:intellectual-self-defense", "lesson:route-the-work"], "Tool-route diagram", "Research and creative routes with human checks between specialized jobs."),
  asset("course/slop-relay-v1.svg", "self-defense/lessons/07-living-around-ai/slop-relay-v1.svg", ["academy:intellectual-self-defense", "lesson:human-ai-and-hybrid-slop"], "Slop Relay diagram", "Information handoffs from event through recording, caption, AI rewrite, ranking, reaction, summary, and opinion."),
  asset("course/personal-protocol-v1.svg", "self-defense/lessons/08-personal-protocol/personal-protocol-v1.svg", ["academy:intellectual-self-defense", "lesson:build-your-own-protocol"], "Personal protocol control panel", "Editable fields for pause signals, source thresholds, gap rules, approvals, sharing, uncertainty, and revision."),
  asset("course/ai-output-receipt-v1.svg", "self-defense/downloads/ai-output-receipt-v1.svg", ["academy:intellectual-self-defense", "lesson:i-asked-for-a-picture-it-built-a-system"], "AI Output Receipt visual worksheet", "Printable receipt for inspecting retrieved, inferred, invented, unauthorized, useful, and discarded output."),

  asset("downloads/research-chatbot-custom-instructions.md", "self-defense/downloads/research-chatbot-custom-instructions.md", ["lesson:give-the-chatbot-a-research-job"], "Editable Research Assistant Contract"),
  asset("downloads/creative-source-file-starter.md", "self-defense/downloads/creative-source-file-starter.md", ["lesson:source-files-beat-vibes"], "Editable Creative Source File"),
  asset("downloads/ai-output-receipt.md", "self-defense/downloads/ai-output-receipt.md", ["lesson:i-asked-for-a-picture-it-built-a-system"], "Editable AI Output Receipt"),
  asset("downloads/receipt-report.md", "self-defense/downloads/receipt-report.md", ["lesson:open-the-receipt", "lesson:ask-audit-rebuild"], "Editable Receipt Report"),
  asset("downloads/my-intellectual-self-defense-protocol-v1.md", "self-defense/downloads/my-intellectual-self-defense-protocol-v1.md", ["lesson:build-your-own-protocol"], "Editable personal protocol"),
  asset("downloads/ai-output-receipt-print.html", "self-defense/downloads/ai-output-receipt-print.html", ["lesson:i-asked-for-a-picture-it-built-a-system"], "Print-friendly AI Output Receipt"),
  asset("downloads/my-intellectual-self-defense-protocol-v1-print.html", "self-defense/downloads/my-intellectual-self-defense-protocol-v1-print.html", ["lesson:build-your-own-protocol"], "Print-friendly personal protocol"),
];

const mimeTypes = {
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

for (const item of assets) {
  const absolute = join(root, item.source_file);
  const bytes = await readFile(absolute);
  const fileStat = await stat(absolute);
  const extension = extname(absolute).toLowerCase();
  let width = null;
  let height = null;

  if (extension === ".webp" || extension === ".svg") {
    const metadata = await sharp(bytes).metadata();
    width = metadata.width ?? null;
    height = metadata.height ?? null;
  }

  Object.assign(item, {
    content_type: mimeTypes[extension],
    dimensions: width && height ? { width, height } : null,
    bytes: fileStat.size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    replacement_policy: "new-key-only; version filename on conflict; never overwrite",
    upload_status: "planned",
    verification_status: "not-checked",
  });
}

const manifest = {
  content_id: "intellectual-self-defense",
  generated_at: new Date().toISOString(),
  bucket,
  public_hostname: hostname,
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    delete_or_rename_existing: false,
    dry_run_before_upload: true,
    allowed_prefixes: [
      "articles/the-card-catalog-started-talking-back/",
      "self-defense/",
    ],
  },
  assets,
};

await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${assets.length} assets to ${manifestPath}`);
