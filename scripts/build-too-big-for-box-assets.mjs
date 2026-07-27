import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = join(root, "assets", "too-big-for-box");
const sourceRoot = join(assetRoot, "sources");

const palette = {
  ink: "#090b12",
  panel: "#131925",
  panelLight: "#1c2432",
  cream: "#f4ead4",
  muted: "#aeb8c5",
  amber: "#f1b84b",
  cyan: "#4bd4d8",
  magenta: "#e667a9",
  green: "#74d39a",
  red: "#ff6b6b",
  violet: "#9d82f5",
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const lineText = (
  x,
  y,
  lines,
  className = "body",
  lineHeight = 34,
  anchor = "start",
) => {
  const values = Array.isArray(lines) ? lines : [lines];
  return `<text x="${x}" y="${y}" class="${className}" text-anchor="${anchor}">${values
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`,
    )
    .join("")}</text>`;
};

const panel = (x, y, width, height, accent, opacity = 0.94) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="${palette.panel}" fill-opacity="${opacity}" stroke="${accent}" stroke-width="2"/>`;

const chip = (x, y, width, label, accent = palette.cyan) =>
  `<g><rect x="${x}" y="${y}" width="${width}" height="40" rx="20" fill="${accent}" fill-opacity=".12" stroke="${accent}"/><text x="${x + width / 2}" y="${y + 26}" class="chip" text-anchor="middle" fill="${accent}">${esc(label)}</text></g>`;

const arrow = (x1, y1, x2, y2, accent = palette.cream, dashed = false) =>
  `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${accent}" stroke-width="4" ${dashed ? 'stroke-dasharray="11 10"' : ""} marker-end="url(#arrow)"/>`;

const svgShell = ({ title, subtitle, description, body }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1050" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(description)}</desc>
  <defs>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="${palette.cream}" stroke-opacity=".035"/></pattern>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker>
    <filter id="shadow"><feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000" flood-opacity=".3"/></filter>
  </defs>
  <style>
    text { font-family: "IBM Plex Sans", Arial, sans-serif; }
    .kicker { fill: ${palette.cyan}; font-family: "IBM Plex Mono", monospace; font-size: 20px; font-weight: 700; letter-spacing: 3px; }
    .title { fill: ${palette.cream}; font-size: 58px; font-weight: 700; }
    .subtitle { fill: ${palette.muted}; font-size: 24px; }
    .heading { fill: ${palette.cream}; font-size: 30px; font-weight: 700; }
    .body { fill: ${palette.muted}; font-size: 22px; }
    .small { fill: ${palette.muted}; font-family: "IBM Plex Mono", monospace; font-size: 17px; }
    .big { fill: ${palette.cream}; font-size: 38px; font-weight: 700; }
    .chip { font-family: "IBM Plex Mono", monospace; font-size: 15px; font-weight: 700; letter-spacing: 1px; }
  </style>
  <rect width="1800" height="1050" fill="${palette.ink}"/>
  <rect width="1800" height="1050" fill="url(#grid)"/>
  <rect x="48" y="42" width="1704" height="966" rx="30" fill="none" stroke="${palette.cream}" stroke-opacity=".16" stroke-width="2"/>
  ${lineText(84, 98, "HOBFARM FIELD DIAGRAM", "kicker")}
  ${lineText(84, 172, title, "title")}
  ${lineText(84, 216, subtitle, "subtitle")}
  ${body}
</svg>`;

const diagrams = {
  "where-the-game-lives.svg": svgShell({
    title: "Where the Game Lives",
    subtitle:
      "The terminal in front of you and the machine running the world are not always the same thing.",
    description:
      "Three common game arrangements compare a timeshared mainframe and terminal, a local computer installed from disc, and a thin client connected to distributed infrastructure.",
    body: `
      ${panel(84, 278, 514, 594, palette.amber)}
      ${lineText(120, 330, "01 / TIMESHARING", "kicker")}
      ${lineText(120, 382, "Terminal + mainframe", "heading")}
      ${lineText(120, 428, ["The screen and keyboard are local.", "The running world, state, and", "computation live on the host."], "body", 34)}
      <g transform="translate(120 566)">
        <rect width="160" height="108" rx="9" fill="${palette.panelLight}" stroke="${palette.amber}" stroke-width="3"/>
        <rect x="16" y="16" width="128" height="64" rx="4" fill="${palette.amber}" fill-opacity=".12"/>
        <path d="M36 44h60M36 58h82M36 72h48" stroke="${palette.amber}" stroke-width="5"/>
        <path d="M30 108v34h100v-34M12 150h136" stroke="${palette.cream}" stroke-width="6"/>
      </g>
      ${arrow(294, 632, 398, 632, palette.amber)}
      <g transform="translate(414 548)">
        <rect width="136" height="190" rx="12" fill="${palette.panelLight}" stroke="${palette.amber}" stroke-width="3"/>
        <circle cx="34" cy="42" r="9" fill="${palette.green}"/>
        <path d="M60 42h48M26 78h84M26 106h84M26 134h84M26 162h84" stroke="${palette.muted}" stroke-width="7"/>
      </g>
      ${chip(120, 782, 194, "LOCAL: TERMINAL", palette.amber)}
      ${chip(326, 782, 224, "REMOTE: WORLD", palette.amber)}

      ${panel(643, 278, 514, 594, palette.cyan)}
      ${lineText(679, 330, "02 / INSTALLED", "kicker")}
      ${lineText(679, 382, "Disc + home computer", "heading")}
      ${lineText(679, 428, ["The package carries installation data.", "The local machine runs the world", "and usually stores the save."], "body", 34)}
      <g transform="translate(700 550)">
        <circle cx="92" cy="92" r="82" fill="${palette.cream}" fill-opacity=".12" stroke="${palette.cyan}" stroke-width="4"/>
        <circle cx="92" cy="92" r="18" fill="${palette.ink}" stroke="${palette.cyan}" stroke-width="4"/>
        <path d="M92 10A82 82 0 0 1 170 70" stroke="${palette.magenta}" stroke-width="7" fill="none"/>
      </g>
      ${arrow(892, 642, 988, 642, palette.cyan)}
      <g transform="translate(1000 552)">
        <rect width="116" height="170" rx="12" fill="${palette.panelLight}" stroke="${palette.cyan}" stroke-width="3"/>
        <path d="M24 42h68M24 74h68M24 106h68M24 138h48" stroke="${palette.muted}" stroke-width="8"/>
        <circle cx="90" cy="140" r="8" fill="${palette.green}"/>
      </g>
      ${chip(679, 782, 430, "LOCAL: WORLD + STATE + COMPUTE", palette.cyan)}

      ${panel(1202, 278, 514, 594, palette.magenta)}
      ${lineText(1238, 330, "03 / SERVICE", "kicker")}
      ${lineText(1238, 382, "Thin client + network", "heading")}
      ${lineText(1238, 428, ["The local device sends input and", "shows output. A remote service may", "own the running state and compute."], "body", 34)}
      <g transform="translate(1244 570)">
        <path d="M20 34h146l-14 92H36Z" fill="${palette.panelLight}" stroke="${palette.magenta}" stroke-width="4"/>
        <path d="M52 126h84M66 148h56" stroke="${palette.cream}" stroke-width="6"/>
      </g>
      ${arrow(1420, 636, 1510, 636, palette.magenta)}
      <g transform="translate(1528 560)">
        <rect width="130" height="176" rx="14" fill="${palette.panelLight}" stroke="${palette.magenta}" stroke-width="3"/>
        <path d="M24 40h82M24 72h82M24 104h82M24 136h82" stroke="${palette.muted}" stroke-width="8"/>
      </g>
      ${chip(1238, 782, 198, "LOCAL: CLIENT", palette.magenta)}
      ${chip(1448, 782, 220, "REMOTE: SERVICE", palette.magenta)}

      ${lineText(900, 946, "These are common arrangements, not a claim that every game in an era worked the same way.", "small", 28, "middle")}
    `,
  }),

  "the-box-empties.svg": svgShell({
    title: "The Box Empties",
    subtitle:
      "Three specific receipts show the package losing its old job. They do not prove a universal law.",
    description:
      "A timeline shows Civilization V requiring Steamworks in 2010, Grand Theft Auto VI physical packaging containing a download code but no disc in 2026, and PlayStation ending new physical disc production in January 2028.",
    body: `
      <path d="M180 550H1618" stroke="${palette.cream}" stroke-opacity=".3" stroke-width="8"/>
      <circle cx="300" cy="550" r="24" fill="${palette.amber}"/>
      <circle cx="900" cy="550" r="24" fill="${palette.cyan}"/>
      <circle cx="1500" cy="550" r="24" fill="${palette.magenta}"/>

      ${panel(114, 294, 520, 208, palette.amber)}
      ${lineText(148, 344, "2010", "big")}
      ${lineText(148, 392, "Civilization V retail PC", "heading")}
      ${lineText(148, 432, ["Steam said every PC version would use", "Steamworks for activation, updates, DLC,", "achievements, and multiplayer."], "body", 32)}
      ${arrow(300, 502, 300, 526, palette.amber)}

      ${panel(640, 596, 520, 208, palette.cyan)}
      ${lineText(674, 646, "2026", "big")}
      ${lineText(674, 694, "Grand Theft Auto VI package", "heading")}
      ${lineText(674, 734, ["Rockstar says the physical version", "contains a download code and no disc.", "That is a code in a box, not cloud rendering."], "body", 32)}
      ${arrow(900, 574, 900, 596, palette.cyan)}

      ${panel(1166, 294, 520, 208, palette.magenta)}
      ${lineText(1200, 344, "JANUARY 2028", "big")}
      ${lineText(1200, 392, "New PlayStation releases", "heading")}
      ${lineText(1200, 432, ["Sony says disc production ends for new", "PlayStation-console games. Previously", "released physical games are unaffected."], "body", 32)}
      ${arrow(1500, 502, 1500, 526, palette.magenta)}

      <g transform="translate(264 840)">
        <rect width="228" height="104" rx="12" fill="${palette.panelLight}" stroke="${palette.amber}" stroke-width="3"/>
        <path d="M30 32h168M30 52h168M30 72h106" stroke="${palette.amber}" stroke-width="6"/>
      </g>
      ${arrow(506, 892, 720, 892, palette.cream, true)}
      <g transform="translate(740 840)">
        <rect width="228" height="104" rx="12" fill="${palette.panelLight}" stroke="${palette.cyan}" stroke-width="3"/>
        <path d="M66 22h96v60H66zM88 40h52M88 58h34" stroke="${palette.cyan}" stroke-width="6" fill="none"/>
      </g>
      ${arrow(982, 892, 1196, 892, palette.cream, true)}
      <g transform="translate(1216 840)">
        <rect width="320" height="104" rx="12" fill="${palette.panelLight}" stroke="${palette.magenta}" stroke-width="3"/>
        ${lineText(160, 44, "THE ACCOUNT + NETWORK", "chip", 24, "middle")}
        ${lineText(160, 74, "become part of the medium", "small", 24, "middle")}
      </g>
    `,
  }),

  "bounded-wonder-machine.svg": svgShell({
    title: "The Bounded Wonder Machine",
    subtitle:
      "Authored material is compiled once. Deterministic code owns the running world.",
    description:
      "The Grimoire compiler produces an immutable world pack. Wonder Machine code creates mutable sessions and owns state, time, seeded outcomes, saves, replay, and route eligibility. AI may map grounded language or describe a result, but cannot invent effects or write the pack.",
    body: `
      ${panel(84, 286, 412, 610, palette.violet)}
      ${lineText(120, 338, "GRIMOIRE", "kicker")}
      ${lineText(120, 392, "Authored sources", "heading")}
      ${lineText(120, 438, ["Places and objects", "Rules and routes", "Opportunities", "Narrative references"], "body", 39)}
      <path d="M134 650h312M134 692h252M134 734h286" stroke="${palette.violet}" stroke-opacity=".55" stroke-width="10"/>
      ${chip(120, 806, 334, "PRIVATE AUTHORING BOUNDARY", palette.violet)}

      ${arrow(496, 554, 612, 554, palette.violet)}
      ${panel(612, 354, 286, 394, palette.amber)}
      ${lineText(755, 416, "COMPILE", "kicker", 30, "middle")}
      <path d="M684 474h142l28 40-28 40H684l-28-40Z" fill="${palette.amber}" fill-opacity=".14" stroke="${palette.amber}" stroke-width="3"/>
      ${lineText(755, 523, "validate", "heading", 30, "middle")}
      ${lineText(755, 608, ["One explicit", "world pack"], "big", 44, "middle")}
      ${chip(658, 676, 194, "IMMUTABLE", palette.amber)}

      ${arrow(898, 554, 1012, 554, palette.amber)}
      ${panel(1012, 286, 704, 610, palette.cyan)}
      ${lineText(1048, 338, "WONDER MACHINE RUNTIME", "kicker")}
      ${lineText(1048, 390, "Mutable session, deterministic rules", "heading")}
      ${panel(1048, 430, 300, 184, palette.green, 0.8)}
      ${lineText(1076, 474, "CODE OWNS", "kicker")}
      ${lineText(1076, 516, ["state transitions", "time + seeded outcomes", "route eligibility"], "body", 34)}
      ${panel(1380, 430, 300, 184, palette.green, 0.8)}
      ${lineText(1408, 474, "PERSISTENCE", "kicker")}
      ${lineText(1408, 516, ["save + restore", "event log + replay", "same seed, same outcome"], "body", 34)}
      ${panel(1048, 648, 632, 178, palette.magenta, 0.8)}
      ${lineText(1076, 692, "AI IS AN ADAPTER, NOT THE REFEREE", "kicker")}
      ${lineText(1076, 734, ["May map grounded language and describe code-owned results.", "Cannot invent effects, destinations, state, or pack changes."], "body", 34)}

      ${chip(1070, 842, 264, "BLANK INPUT: NO ACTION", palette.red)}
      ${chip(1350, 842, 302, "WAIT: EXPLICIT ACTION", palette.green)}
      ${lineText(900, 966, "A session may change. The compiled pack does not.", "small", 28, "middle")}
    `,
  }),

  "dark-factory-bullshit-factory.svg": svgShell({
    title: "Dark Factory / Bullshit Factory",
    subtitle:
      "Both hide labor. Only one builds a system that can argue with its own promises.",
    description:
      "A dark software factory begins with explicit intent, external scenarios, a test environment, and observable behavior. A bullshit factory begins with an income claim and a reusable prompt, then routes attention toward a funnel without independent receipts.",
    body: `
      ${panel(84, 278, 788, 632, palette.green)}
      ${lineText(120, 332, "DARK SOFTWARE FACTORY", "kicker")}
      ${lineText(120, 382, "Automation under pressure", "heading")}
      ${lineText(120, 432, ["Human intent + constraints", "Scenarios kept outside the implementation", "A test universe with observable behavior", "Iteration until the scenarios are satisfied"], "body", 42)}
      ${arrow(188, 646, 722, 646, palette.green)}
      <g transform="translate(120 686)">
        ${chip(0, 0, 178, "SPECIFY", palette.green)}
        ${chip(198, 0, 178, "GENERATE", palette.green)}
        ${chip(396, 0, 178, "VALIDATE", palette.green)}
        ${chip(594, 0, 158, "REPEAT", palette.green)}
      </g>
      ${lineText(120, 790, ["Receipt: scenarios, tests, observed trajectories,", "cost, failures, and behavior someone can inspect."], "body", 36)}
      ${chip(120, 852, 450, "OUTPUT MUST SURVIVE CONTACT WITH EVIDENCE", palette.green)}

      ${panel(928, 278, 788, 632, palette.red)}
      ${lineText(964, 332, "BULLSHIT FACTORY", "kicker")}
      ${lineText(964, 382, "Automation as a promise", "heading")}
      ${lineText(964, 432, ["Income or reach claim", "A handful of prompts or a copied template", "Missing baseline, costs, denominator, and failures", "Attention routed into a kit, course, or funnel"], "body", 42)}
      ${arrow(1032, 646, 1566, 646, palette.red)}
      <g transform="translate(964 686)">
        ${chip(0, 0, 178, "CLAIM", palette.red)}
        ${chip(198, 0, 178, "PROMPT", palette.red)}
        ${chip(396, 0, 178, "POST", palette.red)}
        ${chip(594, 0, 158, "FUNNEL", palette.red)}
      </g>
      ${lineText(964, 790, ["Receipt needed: attributable business, time window,", "revenue basis, costs, audience history, and replicable method."], "body", 36)}
      ${chip(964, 852, 436, "OUTPUT SURVIVES AS LONG AS ATTENTION", palette.red)}

      ${lineText(900, 976, "The diagram distinguishes evidence structures. It does not declare that every public income claim is false.", "small", 28, "middle")}
    `,
  }),
};

async function buildDiagrams() {
  await Promise.all(
    Object.entries(diagrams).map(([filename, source]) =>
      writeFile(join(assetRoot, filename), source, "utf8"),
    ),
  );
}

const montageCards = [
  {
    file: "instagram-01-automated-business-15000-month.jpg",
    title: "$15,000 a month / one automated business",
    extract: { left: 30, top: 274, width: 430, height: 210 },
  },
  {
    file: "instagram-02-claude-audit-million-reach.jpg",
    title: "One million reach / 7,000 followers",
    extract: { left: 36, top: 330, width: 425, height: 246 },
  },
  {
    file: "instagram-03-trained-claude-194k-followers.jpg",
    title: "194,000 followers / seven prompts",
    extract: { left: 64, top: 46, width: 360, height: 132 },
  },
  {
    file: "instagram-04-pinterest-2000-day-faceless.jpg",
    title: "$2,000 a day on Pinterest",
    extract: { left: 30, top: 318, width: 447, height: 286 },
  },
  {
    file: "instagram-05-claude-instagram-5767-month.jpg",
    title: "$5,767 a month / even a 16-year-old",
    extract: { left: 34, top: 214, width: 421, height: 190 },
  },
  {
    file: "instagram-06-duplicate-reels-unlimited-reach.jpg",
    title: "Duplicate reels / unlimited reach",
    extract: { left: 54, top: 322, width: 378, height: 222 },
  },
  {
    file: "instagram-07-five-prompts-25m-views.jpg",
    title: "2.5 million views / five prompts",
    extract: { left: 48, top: 300, width: 396, height: 206 },
  },
];

const montageWidth = 2000;
const montageHeight = 2360;
const cardWidth = 900;
const cardHeight = 480;
const positions = [
  [70, 250],
  [1030, 250],
  [70, 750],
  [1030, 750],
  [70, 1250],
  [1030, 1250],
  [550, 1750],
];

async function buildMontage() {
  const composites = [];

  for (let index = 0; index < montageCards.length; index += 1) {
    const card = montageCards[index];
    const [x, y] = positions[index];
    const crop = await sharp(join(sourceRoot, card.file))
      .extract(card.extract)
      .resize({
        width: cardWidth - 64,
        height: 342,
        fit: "contain",
        background: palette.panelLight,
      })
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer();

    composites.push({
      input: crop,
      left: x + 32,
      top: y + 96,
    });
  }

  const overlay = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${montageWidth}" height="${montageHeight}" viewBox="0 0 ${montageWidth} ${montageHeight}">
    <style>
      text { font-family: "IBM Plex Sans", Arial, sans-serif; }
      .kicker { fill: ${palette.magenta}; font-family: "IBM Plex Mono", monospace; font-size: 24px; font-weight: 700; letter-spacing: 4px; }
      .title { fill: ${palette.cream}; font-size: 66px; font-weight: 700; }
      .card-title { fill: ${palette.cream}; font-size: 28px; font-weight: 700; }
      .number { fill: ${palette.magenta}; font-family: "IBM Plex Mono", monospace; font-size: 24px; font-weight: 700; }
      .note { fill: ${palette.muted}; font-size: 24px; }
    </style>
    <rect width="${montageWidth}" height="${montageHeight}" fill="${palette.ink}"/>
    <rect x="44" y="40" width="1912" height="2272" rx="30" fill="none" stroke="${palette.cream}" stroke-opacity=".16" stroke-width="2"/>
    <text x="78" y="104" class="kicker">DOCUMENTARY MONTAGE / CLAIMS, NOT RECEIPTS</text>
    <text x="78" y="184" class="title">Claude Has Apparently Solved Capitalism</text>
    ${montageCards
      .map((card, index) => {
        const [x, y] = positions[index];
        return `
          <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="22" fill="${palette.panel}" stroke="${palette.magenta}" stroke-opacity=".55" stroke-width="2"/>
          <text x="${x + 32}" y="${y + 54}" class="number">${String(index + 1).padStart(2, "0")}</text>
          <text x="${x + 86}" y="${y + 54}" class="card-title">${esc(card.title)}</text>`;
      })
      .join("")}
    <text x="1000" y="2278" class="note" text-anchor="middle">Seven public Instagram posts supplied to HobFarm, cropped for criticism and commentary. The displayed results are claims, not independently verified outcomes.</text>
  </svg>`;

  await sharp({
    create: {
      width: montageWidth,
      height: montageHeight,
      channels: 3,
      background: palette.ink,
    },
  })
    .composite([{ input: Buffer.from(overlay), left: 0, top: 0 }, ...composites])
    .png({ compressionLevel: 9, palette: false })
    .toFile(join(assetRoot, "claude-solved-capitalism-montage.png"));
}

await mkdir(assetRoot, { recursive: true });
await buildDiagrams();
await buildMontage();

const generated = [
  ...Object.keys(diagrams),
  "claude-solved-capitalism-montage.png",
];
for (const filename of generated) {
  const bytes = await readFile(join(assetRoot, filename));
  console.log(`${filename}: ${bytes.length} bytes`);
}
