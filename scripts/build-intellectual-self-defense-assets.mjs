import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = join(root, "assets", "intellectual-self-defense");
const sourceRoot = join(assetRoot, "source");
const articleRoot = join(assetRoot, "article");
const courseRoot = join(assetRoot, "course");

const palette = {
  ink: "#0b0711",
  violet: "#20112d",
  panel: "#2b1839",
  cream: "#f3e6c8",
  paper: "#fff7e6",
  cyan: "#56e5ee",
  magenta: "#f45fc5",
  yellow: "#ffd34d",
  red: "#ff5d64",
  green: "#73df9a",
  muted: "#b9aeca",
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const text = (x, y, lines, className = "body", lineHeight = 30, anchor = "start") => {
  const values = Array.isArray(lines) ? lines : [lines];
  return `<text x="${x}" y="${y}" class="${className}" text-anchor="${anchor}">${values
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`)
    .join("")}</text>`;
};

const panel = (x, y, width, height, accent = palette.cyan, extra = "") =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="18" class="panel" style="--accent:${accent}" ${extra}/>`;

const chip = (x, y, width, label, color = palette.cyan) =>
  `<g><rect x="${x}" y="${y}" width="${width}" height="38" rx="19" fill="${color}" fill-opacity=".13" stroke="${color}"/><text x="${x + width / 2}" y="${y + 25}" class="chip" text-anchor="middle" fill="${color}">${esc(label)}</text></g>`;

const arrow = (x1, y1, x2, y2, color = palette.cream, dashed = false) =>
  `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="4" ${dashed ? 'stroke-dasharray="10 10"' : ""} marker-end="url(#arrow)"/>`;

const box = (x, y, width, height, label, accent = palette.cyan) =>
  `${panel(x, y, width, height, accent)}${text(x + width / 2, y + height / 2 + 8, label, "box-label", 26, "middle")}`;

const svg = ({ title, description, subtitle, body }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(description)}</desc>
  <defs>
    <pattern id="paper" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M0 35.5H36" stroke="#f3e6c8" stroke-opacity=".035"/></pattern>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker>
    <filter id="shadow"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000" flood-opacity=".28"/></filter>
  </defs>
  <style>
    text { font-family: "IBM Plex Sans", Arial, sans-serif; }
    .kicker { fill: ${palette.cyan}; font-family: "IBM Plex Mono", monospace; font-size: 20px; font-weight: 700; letter-spacing: 3px; }
    .title { fill: ${palette.cream}; font-size: 52px; font-weight: 700; }
    .subtitle { fill: ${palette.muted}; font-size: 22px; }
    .heading { fill: ${palette.cream}; font-size: 28px; font-weight: 700; }
    .body { fill: ${palette.muted}; font-size: 21px; }
    .small { fill: ${palette.muted}; font-family: "IBM Plex Mono", monospace; font-size: 17px; }
    .box-label { fill: ${palette.cream}; font-size: 20px; font-weight: 700; }
    .chip { font-family: "IBM Plex Mono", monospace; font-size: 15px; font-weight: 700; letter-spacing: 1px; }
    .panel { fill: ${palette.panel}; fill-opacity: .9; stroke: var(--accent); stroke-width: 2; filter: url(#shadow); }
  </style>
  <rect width="1600" height="900" fill="${palette.ink}"/>
  <rect width="1600" height="900" fill="url(#paper)"/>
  <rect x="54" y="46" width="1492" height="808" rx="28" fill="none" stroke="${palette.cream}" stroke-opacity=".18" stroke-width="2"/>
  ${text(86, 96, "HOBFARM FIELD DIAGRAM", "kicker")}
  ${text(86, 160, title, "title")}
  ${text(86, 202, subtitle, "subtitle")}
  ${body}
</svg>`;

const diagrams = {
  friction: svg({
    title: "The friction moved",
    subtitle: "A faster interface hides more handoffs.",
    description: "The old library route is compared with a chatbot route whose hidden stages still require human verification.",
    body: `
      ${panel(86, 258, 680, 500, palette.cyan)}
      ${text(120, 306, "VISIBLE RESEARCH ROUTE", "kicker")}
      ${["Question", "Catalog", "Call number", "Shelf", "Book", "Index", "Notes", "Compare", "Paper"].map((label, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        return box(120 + col * 205, 345 + row * 110, 170, 70, label, palette.cyan);
      }).join("")}
      ${panel(812, 258, 702, 500, palette.magenta)}
      ${text(846, 306, "COMPRESSED ANSWER ROUTE", "kicker")}
      ${box(846, 348, 180, 74, "Question", palette.magenta)}
      ${arrow(1026, 385, 1100, 385, palette.magenta)}
      ${box(1100, 338, 370, 94, ["Answer box", "one polished surface"], palette.magenta)}
      ${text(846, 486, "Open the box", "heading")}
      ${text(846, 528, ["Instructions → retrieval or model memory → source selection", "→ compression → inference → generated connective language", "→ formatted answer → human verification"], "body", 38)}
      ${chip(846, 676, 244, "ACCESS: FASTER", palette.green)}
      ${chip(1108, 676, 362, "VERIFICATION: STILL YOUR JOB", palette.yellow)}
    `,
  }),
  lanes: svg({
    title: "Three ways of living with AI",
    subtitle: "Learn the first two lanes. Use them to inspect the third.",
    description: "Learn, Make, and Live Around AI are connected by a human operator who retains judgment.",
    body: `
      ${panel(86, 278, 436, 408, palette.cyan)}
      ${text(120, 334, "01 / LEARN", "kicker")}
      ${text(120, 390, "Use AI to learn", "heading")}
      ${text(120, 440, ["Find sources", "Compare accounts", "Translate with originals", "Mark inference", "Verify the important claim"], "body", 42)}
      ${panel(582, 278, 436, 408, palette.magenta)}
      ${text(616, 334, "02 / MAKE", "kicker")}
      ${text(616, 390, "Use AI to make", "heading")}
      ${text(616, 440, ["Write source files", "Set constraints", "Reserve decisions", "Route tools by job", "Approve canon"], "body", 42)}
      ${panel(1078, 278, 436, 408, palette.yellow)}
      ${text(1112, 334, "03 / LIVE AROUND", "kicker")}
      ${text(1112, 390, "Inspect the relay", "heading")}
      ${text(1112, 440, ["Trace the source", "Inspect the caption", "Notice selection", "Separate origin from truth", "Keep the opinion last"], "body", 42)}
      ${arrow(522, 718, 1070, 718, palette.cyan)}
      ${arrow(1018, 746, 1070, 746, palette.magenta)}
      ${chip(585, 708, 430, "HUMAN OPERATOR AT EVERY HANDOFF", palette.green)}
    `,
  }),
  gaps: svg({
    title: "Three kinds of gaps",
    subtitle: "Missing information does not always authorize the same repair.",
    description: "Fact gaps need evidence, creative gaps may allow invention, and decision gaps require human permission.",
    body: `
      ${panel(86, 278, 436, 430, palette.cyan)}
      ${text(120, 334, "FACT GAP", "kicker")}
      ${text(120, 390, "Evidence or unknown", "heading")}
      ${text(120, 444, ["Missing date", "Missing source", "Missing quotation", "Missing cause"], "body", 44)}
      ${chip(120, 628, 250, "DO NOT INVENT", palette.red)}
      ${panel(582, 278, 436, 430, palette.magenta)}
      ${text(616, 334, "CREATIVE GAP", "kicker")}
      ${text(616, 390, "Authorized invention", "heading")}
      ${text(616, 444, ["Accessory", "Pose", "Soundtrack", "Fictional background"], "body", 44)}
      ${chip(616, 628, 276, "INVENT WITHIN SCOPE", palette.magenta)}
      ${panel(1078, 278, 436, 430, palette.yellow)}
      ${text(1112, 334, "DECISION GAP", "kicker")}
      ${text(1112, 390, "Permission required", "heading")}
      ${text(1112, 444, ["Name or canon", "Final argument", "Publish or share", "Belief or action"], "body", 44)}
      ${chip(1112, 628, 304, "RETURN TO THE HUMAN", palette.yellow)}
    `,
  }),
  nameJob: svg({
    title: "Give the chatbot a job",
    subtitle: "A reusable research contract makes the assignment inspectable.",
    description: "A control panel names the role, question, source standard, evidence labels, scope, output, and stop condition.",
    body: `
      ${panel(86, 268, 1428, 478, palette.cyan)}
      ${text(120, 320, "RESEARCH ASSISTANT CONTRACT", "kicker")}
      ${["Role", "Question", "Freshness", "Source priority", "Evidence labels", "Scope", "Output format", "Stop condition"].map((label, index) => {
        const col = index % 4;
        const row = Math.floor(index / 4);
        return `${panel(120 + col * 340, 356 + row * 138, 300, 106, index === 7 ? palette.red : palette.cyan)}${text(145 + col * 340, 395 + row * 138, label, "heading")}${text(145 + col * 340, 430 + row * 138, index === 7 ? "Insufficient evidence = stop" : "Write the rule here", "small")}`;
      }).join("")}
      ${chip(120, 666, 470, "ASK BEFORE EXPANDING THE ASSIGNMENT", palette.yellow)}
      ${chip(612, 666, 460, "SOURCE MAP BEFORE CONCLUSION", palette.green)}
      ${chip(1094, 666, 386, "NEVER FABRICATE A RECEIPT", palette.red)}
    `,
  }),
  receiptCutaway: svg({
    title: "Open the receipt",
    subtitle: "Typography cannot tell you whether a citation supports the claim.",
    description: "A polished answer unfolds into claims, sources, excerpts, inference, and unknowns that must be inspected separately.",
    body: `
      ${box(86, 342, 252, 120, ["Polished answer", "looks complete"], palette.magenta)}
      ${arrow(338, 402, 434, 402, palette.cream)}
      ${[ ["CLAIMS", palette.cream], ["SOURCES", palette.cyan], ["EXCERPTS", palette.green], ["INFERENCE", palette.magenta], ["UNKNOWNS", palette.yellow] ].map(([label, color], index) => `${panel(434 + index * 210, 292 + index * 54, 184, 122, color)}${text(526 + index * 210, 348 + index * 54, label, "box-label", 24, "middle")}${text(526 + index * 210, 382 + index * 54, index === 1 ? "open it" : index === 4 ? "keep open" : "inspect", "small", 24, "middle")}`).join("")}
      ${chip(434, 664, 328, "SOURCE EXISTS?", palette.cyan)}
      ${chip(784, 664, 360, "SOURCE SUPPORTS CLAIM?", palette.green)}
      ${chip(1166, 664, 310, "WHAT IS MISSING?", palette.yellow)}
    `,
  }),
  askAudit: svg({
    title: "Ask, audit, rebuild",
    subtitle: "Use the first answer as a map, not a verdict.",
    description: "A six-stage workflow moves from a provisional question through claim audit, source opening, comparison, rebuilding, and a human decision.",
    body: `
      ${[ ["ASK", "Provisional map"], ["AUDIT", "Extract claims"], ["OPEN", "Read sources"], ["COMPARE", "Support + contrary"], ["REBUILD", "Evidence carries"], ["DECIDE", "State confidence"] ].map(([label, note], index) => {
        const x = 86 + index * 244;
        return `${box(x, 350, 198, 146, [label, note], index === 5 ? palette.green : index === 1 ? palette.magenta : palette.cyan)}${index < 5 ? arrow(x + 198, 423, x + 236, 423, palette.cream) : ""}`;
      }).join("")}
      ${panel(86, 570, 1428, 138, palette.yellow)}
      ${text(120, 620, "RECEIPT REPORT", "kicker")}
      ${text(120, 663, "Question · sources opened · direct support · inference · uncertainty · confidence · next check", "body")}
    `,
  }),
  sourceFiles: svg({
    title: "Source files beat vibes",
    subtitle: "Visible decisions travel farther than another pile of adjectives.",
    description: "A Markdown source file supplies constraints to a model output that a human reviews before approving an asset.",
    body: `
      ${box(86, 332, 270, 188, ["MARKDOWN SOURCE", "purpose", "invariants", "permissions"], palette.cyan)}
      ${arrow(356, 426, 448, 426, palette.cyan)}
      ${box(448, 332, 270, 188, ["CONSTRAINTS", "locked", "flexible", "ask first"], palette.yellow)}
      ${arrow(718, 426, 810, 426, palette.yellow)}
      ${box(810, 332, 270, 188, ["MODEL OUTPUT", "one assigned", "deliverable"], palette.magenta)}
      ${arrow(1080, 426, 1172, 426, palette.magenta)}
      ${box(1172, 332, 342, 188, ["HUMAN REVIEW", "keep / salvage", "iterate / dump"], palette.green)}
      ${panel(86, 596, 1428, 120, palette.red)}
      ${text(120, 644, "DECISIONS RESERVED FOR THE HUMAN", "kicker")}
      ${text(120, 686, "Names · canon changes · final argument · public claims · publishing · upload", "body")}
    `,
  }),
  fidelity: svg({
    title: "Assignment fidelity × output quality",
    subtitle: "A beautiful result can still be a failed response.",
    description: "A matrix separates output quality from whether the tool followed the assignment.",
    body: `
      ${text(112, 494, "OUTPUT QUALITY", "kicker")}
      <g transform="translate(120 700) rotate(-90)">${text(0, 0, "LOW → HIGH", "small")}</g>
      ${panel(328, 300, 500, 190, palette.magenta)}
      ${text(578, 365, "SALVAGE", "heading", 30, "middle")}
      ${text(578, 405, ["Strong output", "Ignored assignment"], "body", 30, "middle")}
      ${panel(850, 300, 500, 190, palette.green)}
      ${text(1100, 365, "KEEP", "heading", 30, "middle")}
      ${text(1100, 405, ["Strong output", "Followed assignment"], "body", 30, "middle")}
      ${panel(328, 512, 500, 190, palette.yellow)}
      ${text(578, 577, "DUMP", "heading", 30, "middle")}
      ${text(578, 617, ["Weak output", "Ignored assignment"], "body", 30, "middle")}
      ${panel(850, 512, 500, 190, palette.cyan)}
      ${text(1100, 577, "ITERATE", "heading", 30, "middle")}
      ${text(1100, 617, ["Weak output", "Followed assignment"], "body", 30, "middle")}
      ${text(838, 760, "ASSIGNMENT FIDELITY  LOW → HIGH", "kicker", 30, "middle")}
    `,
  }),
  scopeDrift: svg({
    title: "The machine made an asset and a bureaucracy",
    subtitle: "The useful portrait survived. The unauthorized system did not become canon.",
    description: "The Circuit Mint case moves from source files and a portrait request through unsolicited naming and locks to human scope review and a separate character-sheet tool.",
    body: `
      ${box(86, 344, 210, 144, ["Source files", "+ picture job"], palette.cyan)}
      ${arrow(296, 416, 350, 416, palette.cyan)}
      ${box(350, 344, 210, 144, ["Portrait", "useful asset"], palette.green)}
      ${arrow(560, 416, 614, 416, palette.magenta)}
      ${panel(614, 286, 330, 260, palette.red)}
      ${text(644, 332, "UNSOLICITED SYSTEM", "kicker")}
      ${text(644, 378, ["Name chosen", "Anchor locked", "Set numbered", "Uses assigned", "Expansion proposed"], "body", 36)}
      ${arrow(944, 416, 998, 416, palette.yellow)}
      ${panel(998, 286, 250, 260, palette.yellow)}
      ${text(1028, 332, "HUMAN CHECK", "kicker")}
      ${text(1028, 380, ["Keep portrait", "Reject canon", "Define next job"], "body", 42)}
      ${arrow(1248, 416, 1302, 416, palette.green)}
      ${box(1302, 344, 212, 144, ["Second tool", "multiview sheet"], palette.green)}
      ${chip(350, 628, 300, "SAFE TO SALVAGE", palette.green)}
      ${chip(674, 628, 356, "SCOPE DRIFT DETECTED", palette.red)}
      ${chip(1054, 628, 352, "DECISION NOT DELEGATED", palette.yellow)}
    `,
  }),
  routeWork: svg({
    title: "Route the work",
    subtitle: "Output is something a machine gives you. Workflow is a sequence of decisions.",
    description: "Research and creative routes separate jobs, tool handoffs, and human approval points.",
    body: `
      ${text(86, 294, "RESEARCH ROUTE", "kicker")}
      ${["Discover", "Read", "Organize", "Human decision", "Draft", "Verify"].map((label, index) => `${box(86 + index * 244, 324, 196, 96, label, index === 3 ? palette.green : palette.cyan)}${index < 5 ? arrow(282 + index * 244, 372, 322 + index * 244, 372, palette.cyan) : ""}`).join("")}
      ${text(86, 500, "CREATIVE ROUTE", "kicker")}
      ${["Source file", "Portrait", "Human select", "Character sheet", "Canon check", "Publish"].map((label, index) => `${box(86 + index * 244, 530, 196, 96, label, index === 2 || index === 4 ? palette.green : palette.magenta)}${index < 5 ? arrow(282 + index * 244, 578, 322 + index * 244, 578, palette.magenta) : ""}`).join("")}
      ${panel(86, 684, 1428, 82, palette.yellow)}
      ${text(800, 735, "Input contract · output contract · human check · next job · stop condition", "body", 30, "middle")}
    `,
  }),
  slopRelay: svg({
    title: "The slop relay",
    subtitle: "Inspect every handoff, including the human caption.",
    description: "A media chain can add false context through recording, cropping, captions, AI rewriting, ranking, reaction, and summary.",
    body: `
      ${text(86, 284, "CONTEXT CAN BECOME SYNTHETIC AROUND REAL PIXELS", "kicker")}
      ${["Event", "Recording", "Crop", "Caption", "AI rewrite", "Ranking", "Reaction", "Summary", "Opinion"].map((label, index) => {
        const x = 86 + index * 162;
        const color = index < 2 ? palette.cyan : index < 4 ? palette.yellow : index < 8 ? palette.magenta : palette.red;
        return `${box(x, 320, 128, 88, label, color)}${index < 8 ? arrow(x + 128, 364, x + 154, 364, color) : ""}`;
      }).join("")}
      ${text(86, 510, "RESPONSIBLE MIXED ROUTE", "kicker")}
      ${["Documented event", "Credible source", "AI summary", "Open source", "Compare", "Qualified conclusion"].map((label, index) => `${box(86 + index * 244, 548, 196, 104, label, index > 2 ? palette.green : palette.cyan)}${index < 5 ? arrow(282 + index * 244, 600, 322 + index * 244, 600, palette.green) : ""}`).join("")}
      ${chip(86, 712, 352, "PROVENANCE ≠ TRUTH", palette.yellow)}
      ${chip(460, 712, 420, "VISIBILITY ≠ FREQUENCY", palette.magenta)}
      ${chip(902, 712, 514, "THE ROBOT AND THE CAPTION GET CHECKED", palette.green)}
    `,
  }),
  outputReceipt: svg({
    title: "AI Output Receipt",
    subtitle: "Record the assignment before the useful parts blur into the unauthorized ones.",
    description: "A printable receipt lists what was asked, retrieved, inferred, invented, decided, kept, verified, discarded, and approved.",
    body: `
      ${panel(86, 262, 1428, 500, palette.cream)}
      ${text(120, 314, "OUTPUT INSPECTION", "kicker")}
      ${["What I asked for", "What the tool did", "Retrieved or quoted", "Inferred", "Invented", "Decided without permission", "Useful", "Needs verification", "Discarding", "Approving", "Next action", "Stop condition"].map((label, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = 120 + col * 456;
        const y = 350 + row * 92;
        return `${text(x, y, label, "heading")}${text(x, y + 33, "________________________________", "small")}`;
      }).join("")}
      ${chip(120, 708, 316, "FIDELITY: LOW / MED / HIGH", palette.cyan)}
      ${chip(458, 708, 318, "QUALITY: LOW / MED / HIGH", palette.magenta)}
      ${chip(798, 708, 598, "KEEP / SALVAGE / ITERATE / DUMP", palette.green)}
    `,
  }),
  protocol: svg({
    title: "My Intellectual Self-Defense Protocol — Version 1",
    subtitle: "An independent mind is maintained, not completed.",
    description: "A printable personal protocol records pause signals, source thresholds, gap rules, approval gates, sharing rules, uncertainty, and what changes the learner's mind.",
    body: `
      ${panel(86, 258, 1428, 510, palette.green)}
      ${[ ["PAUSE SIGNALS", "What makes me slow down?"], ["SOURCE THRESHOLD", "What requires the original?"], ["GAP RULES", "Evidence, invention, permission"], ["APPROVAL GATES", "What stays mine to decide?"], ["SCOPE DRIFT", "Salvage, restart, or stop?"], ["SHARING RULE", "What must I check first?"], ["UNCERTAINTY", "How will I say I do not know?"], ["CHANGE MY MIND", "Which evidence would count?"] ].map(([label, note], index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 120 + col * 700;
        const y = 306 + row * 104;
        return `${text(x, y, label, "kicker")}${text(x, y + 38, note, "body")}${text(x, y + 68, "________________________________________", "small")}`;
      }).join("")}
      ${chip(120, 716, 284, "VERSION / DATE", palette.cyan)}
      ${chip(426, 716, 390, "NEXT REVIEW DATE", palette.yellow)}
      ${chip(838, 716, 450, "READY TO BE REVISED", palette.green)}
    `,
  }),
};

async function output(relativePath, contents) {
  const target = join(assetRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function renderRasters() {
  await mkdir(articleRoot, { recursive: true });
  await mkdir(courseRoot, { recursive: true });

  const hero = join(sourceRoot, "card-catalog-machine-generated-source.png");
  await sharp(hero)
    .resize(2400, 1350, { fit: "cover", position: "center" })
    .webp({ quality: 90, effort: 6 })
    .toFile(join(articleRoot, "hero-card-catalog-talks-back-v1-16x9.webp"));
  await sharp(hero)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .webp({ quality: 88, effort: 6 })
    .toFile(join(articleRoot, "hero-card-catalog-talks-back-v1-og.webp"));

  const courseCover = join(sourceRoot, "course-three-station-generated-source.png");
  await sharp(courseCover)
    .resize(2400, 1350, { fit: "cover", position: "center" })
    .webp({ quality: 88, effort: 6 })
    .toFile(join(courseRoot, "course-cover-v1-16x9.webp"));

  const courseCoverPortrait = join(sourceRoot, "course-three-station-portrait-generated-source.png");
  await sharp(courseCoverPortrait)
    .resize(1200, 1500, { fit: "cover", position: "center" })
    .webp({ quality: 88, effort: 6 })
    .toFile(join(courseRoot, "course-cover-v1-4x5.webp"));

  const portrait = join(sourceRoot, "circuit-mint-portrait.png");
  await sharp(portrait)
    .resize(1200, 1200, { fit: "cover" })
    .webp({ quality: 88, effort: 6 })
    .toFile(join(courseRoot, "circuit-mint-portrait-v1.webp"));
  await sharp(portrait)
    .webp({ quality: 95, effort: 6, lossless: false })
    .toFile(join(courseRoot, "circuit-mint-portrait-v1-hq.webp"));

  const sheet = join(sourceRoot, "circuit-mint-character-sheet.png");
  await sharp(sheet)
    .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, effort: 6 })
    .toFile(join(courseRoot, "circuit-mint-character-sheet-v1.webp"));
  await sharp(sheet)
    .webp({ quality: 95, effort: 6, lossless: false })
    .toFile(join(courseRoot, "circuit-mint-character-sheet-v1-hq.webp"));
}

async function renderSvgs() {
  const articleFiles = {
    "card-catalog-vs-chatbot-v1-wide.svg": diagrams.friction,
    "three-lanes-learn-make-live-v1-wide.svg": diagrams.lanes,
    "three-gap-rule-v1-wide.svg": diagrams.gaps,
  };
  const courseFiles = {
    "card-catalog-talks-back-v1.svg": diagrams.friction,
    "three-lanes-learn-make-live-v1.svg": diagrams.lanes,
    "name-the-job-control-panel-v1.svg": diagrams.nameJob,
    "answer-receipt-cutaway-v1.svg": diagrams.receiptCutaway,
    "ask-audit-rebuild-v1.svg": diagrams.askAudit,
    "source-files-beat-vibes-v1.svg": diagrams.sourceFiles,
    "three-gap-rule-v1.svg": diagrams.gaps,
    "assignment-fidelity-matrix-v1.svg": diagrams.fidelity,
    "circuit-mint-scope-drift-v1.svg": diagrams.scopeDrift,
    "route-the-work-v1.svg": diagrams.routeWork,
    "slop-relay-v1.svg": diagrams.slopRelay,
    "ai-output-receipt-v1.svg": diagrams.outputReceipt,
    "personal-protocol-v1.svg": diagrams.protocol,
  };

  await Promise.all([
    ...Object.entries(articleFiles).map(([name, contents]) => output(join("article", name), contents)),
    ...Object.entries(courseFiles).map(([name, contents]) => output(join("course", name), contents)),
  ]);
}

await readFile(join(sourceRoot, "card-catalog-machine-generated-source.png"));
await readFile(join(sourceRoot, "course-three-station-generated-source.png"));
await readFile(join(sourceRoot, "course-three-station-portrait-generated-source.png"));
await Promise.all([renderRasters(), renderSvgs()]);

console.log(`Built Intellectual Self-Defense assets in ${assetRoot}`);
