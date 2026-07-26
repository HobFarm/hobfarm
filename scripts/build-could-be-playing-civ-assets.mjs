import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const reportDir = join(root, "reports", "could-be-playing-civ");
const assetDir = join(reportDir, "assets");
const articlePrefix = "articles/could-be-playing-civ/";
const publicHostname = "https://cdn.hob.farm";

await mkdir(assetDir, { recursive: true });

const palette = {
  ink: "#11100e",
  night: "#171b21",
  paper: "#e6d7b7",
  paperDark: "#c7b58e",
  rust: "#a95a3f",
  teal: "#457d79",
  green: "#6e8461",
  purple: "#765477",
  cream: "#f3ead6",
  faded: "#81786a",
};

const svgOpen = (title, subtitle = "") => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1125" viewBox="0 0 1800 1125" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">${subtitle}</desc>
  <defs>
    <filter id="paper-noise" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="14" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.07"/>
      </feComponentTransfer>
    </filter>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 z" fill="${palette.rust}"/>
    </marker>
    <marker id="arrow-faded" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M0,0 L12,6 L0,12 z" fill="${palette.faded}"/>
    </marker>
  </defs>
  <rect width="1800" height="1125" fill="${palette.night}"/>
  <rect x="28" y="28" width="1744" height="1069" rx="24" fill="none" stroke="${palette.paperDark}" stroke-width="3"/>
  <rect width="1800" height="1125" filter="url(#paper-noise)" opacity="0.55"/>
  <text x="90" y="102" fill="${palette.paper}" font-family="Georgia, serif" font-size="56" font-weight="700" letter-spacing="2">${title}</text>
  ${subtitle ? `<text x="92" y="146" fill="${palette.paperDark}" font-family="Arial, sans-serif" font-size="25">${subtitle}</text>` : ""}
`;

const svgClose = `</svg>\n`;

const sameBrainRows = [
  ["Rules and mechanics", "Model behavior and instructions"],
  ["Patches and sequels", "Model updates and provider changes"],
  ["Save files", "Source files, articles, repositories, assets"],
  ["Mods", "Skills, plugins, adapters, scripts"],
  ["Strategy guides", "AGENTS.md, project maps, workflow docs"],
  ["Bugs and exploits", "Failure modes and workarounds"],
  ["Side quests", "Other Alice, avatars, tools, experiments"],
  ["Final score", "No stable score: output and satisfaction"],
];

function sameBrainSvg() {
  const top = 244;
  const rowHeight = 94;
  const rows = sameBrainRows
    .map(([game, work], index) => {
      const y = top + index * rowHeight;
      const fill = index % 2 === 0 ? "#25272a" : "#202226";
      const accent = index === 6 ? palette.purple : index % 2 === 0 ? palette.teal : palette.rust;
      return `
      <rect x="84" y="${y}" width="1632" height="78" rx="8" fill="${fill}" stroke="#504b41" stroke-width="1"/>
      <rect x="84" y="${y}" width="12" height="78" rx="4" fill="${accent}"/>
      <text x="126" y="${y + 49}" fill="${palette.cream}" font-family="Arial, sans-serif" font-size="29" font-weight="700">${game}</text>
      <path d="M690 ${y + 39} H790" stroke="${accent}" stroke-width="4" marker-end="url(#arrow)"/>
      <text x="835" y="${y + 49}" fill="${palette.paper}" font-family="Arial, sans-serif" font-size="28">${work}</text>`;
    })
    .join("");

  return `${svgOpen("SAME BRAIN / DIFFERENT GAME", "The interface changes. The pattern-seeking machinery keeps playing.")}
  <rect x="84" y="174" width="610" height="54" rx="6" fill="${palette.rust}"/>
  <rect x="792" y="174" width="924" height="54" rx="6" fill="${palette.teal}"/>
  <text x="112" y="211" fill="${palette.cream}" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="2">COMPUTER GAME</text>
  <text x="824" y="211" fill="${palette.cream}" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="2">AI-ASSISTED HOBFARM WORK</text>
  ${rows}
  <text x="90" y="1056" fill="${palette.paperDark}" font-family="Georgia, serif" font-size="27" font-style="italic">Experience transfers. Mastery does not.</text>
  ${svgClose}`;
}

function architectureSvg() {
  const mainBoxes = [
    { x: 80, y: 250, w: 385, h: 150, label: "GLOBAL AGENTS.md", note: "personal defaults and boundaries", color: palette.paperDark },
    { x: 515, y: 250, w: 385, h: 150, label: "ROUTING SKILL", note: "route-project-source-of-truth", color: palette.rust },
    { x: 950, y: 250, w: 385, h: 150, label: "GRIMOIRE", note: "canonical source", color: palette.teal },
    { x: 1335, y: 505, w: 385, h: 150, label: "GENERATED PIN", note: "versioned consumer artifact", color: palette.green },
    { x: 900, y: 760, w: 385, h: 150, label: "STYLEFUSION", note: "reads the generated pin", color: palette.purple },
    { x: 465, y: 760, w: 385, h: 150, label: "TESTS + BUILD", note: "verify the boundary", color: palette.rust },
  ];

  const boxes = mainBoxes
    .map(
      ({ x, y, w, h, label, note, color }) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#25272a" stroke="${color}" stroke-width="5"/>
    <rect x="${x}" y="${y}" width="${w}" height="18" rx="8" fill="${color}"/>
    <text x="${x + 26}" y="${y + 73}" fill="${palette.cream}" font-family="Arial, sans-serif" font-size="28" font-weight="700">${label}</text>
    <text x="${x + 26}" y="${y + 111}" fill="${palette.paperDark}" font-family="Arial, sans-serif" font-size="22">${note}</text>`,
    )
    .join("");

  return `${svgOpen("THE SYSTEM NEEDS A SYSTEM", "One source generates the consumer artifact. The consumer does not become a second source.")}
  <path d="M465 325 H500" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M900 325 H935" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M1335 325 C1580 325 1580 455 1528 490" fill="none" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M1335 580 C1190 580 1115 685 1090 744" fill="none" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M900 835 H865" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  ${boxes}
  <g opacity="0.52">
    <rect x="84" y="494" width="1080" height="154" rx="12" fill="#211d1b" stroke="${palette.faded}" stroke-width="3" stroke-dasharray="12 10"/>
    <text x="112" y="535" fill="${palette.paperDark}" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="2">REJECTED SIDE CHANNEL</text>
    <text x="112" y="579" fill="${palette.paper}" font-family="Arial, sans-serif" font-size="25">Copied Grimoire folders inside StyleFusion</text>
    <text x="112" y="616" fill="${palette.paper}" font-family="Arial, sans-serif" font-size="25">+ hardcoded versions and hashes + temporary builders</text>
    <path d="M1164 571 H1288" stroke="${palette.faded}" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#arrow-faded)"/>
  </g>
  <text x="90" y="1047" fill="${palette.paperDark}" font-family="Georgia, serif" font-size="27" font-style="italic">Direction is an architecture, not a folder copied until the error disappears.</text>
  ${svgClose}`;
}

function correctionLoopSvg() {
  const steps = [
    { x: 70, y: 228, n: "01", label: "HUMAN NOTICES", note: "friction, drift, or failure", color: palette.rust },
    { x: 405, y: 228, n: "02", label: "MODEL EXPLAINS", note: "a diagnosis is generated", color: palette.teal },
    { x: 740, y: 228, n: "03", label: "HUMAN VERIFIES", note: "against the real system", color: palette.rust },
    { x: 1075, y: 228, n: "04", label: "AGENT WRITES", note: "rule, skill, script, or repair", color: palette.teal },
    { x: 1410, y: 228, n: "05", label: "TESTS PASS", note: "the immediate fix holds", color: palette.green },
    { x: 1242, y: 670, n: "06", label: "WORKFLOW IMPROVES", note: "the fix becomes infrastructure", color: palette.green },
    { x: 840, y: 670, n: "07", label: "THE WORLD CHANGES", note: "projects, models, tools, scope", color: palette.purple },
    { x: 438, y: 670, n: "08", label: "THE RULE DRIFTS", note: "stale, broad, or conflicting", color: palette.rust },
    { x: 36, y: 670, n: "09", label: "FAILURE RETURNS", note: "the corrective layer needs audit", color: palette.rust },
  ];

  const cards = steps
    .map(
      ({ x, y, n, label, note, color }) => `
    <rect x="${x}" y="${y}" width="305" height="170" rx="12" fill="#25272a" stroke="${color}" stroke-width="4"/>
    <circle cx="${x + 43}" cy="${y + 42}" r="25" fill="${color}"/>
    <text x="${x + 43}" y="${y + 50}" text-anchor="middle" fill="${palette.cream}" font-family="Arial, sans-serif" font-size="20" font-weight="700">${n}</text>
    <text x="${x + 24}" y="${y + 100}" fill="${palette.cream}" font-family="Arial, sans-serif" font-size="24" font-weight="700">${label}</text>
    <text x="${x + 24}" y="${y + 137}" fill="${palette.paperDark}" font-family="Arial, sans-serif" font-size="19">${note}</text>`,
    )
    .join("");

  return `${svgOpen("THE AGENTIC CORRECTION LOOP", "The agent can write the fix. The human still notices when the fix becomes the next bug.")}
  <path d="M375 313 H390 M710 313 H725 M1045 313 H1060 M1380 313 H1395" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M1562 398 C1610 490 1580 610 1510 652" fill="none" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M1242 755 H1160 M840 755 H758 M438 755 H356" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  <path d="M188 670 C86 610 75 505 150 414" fill="none" stroke="${palette.rust}" stroke-width="5" marker-end="url(#arrow)"/>
  ${cards}
  <rect x="410" y="468" width="980" height="126" rx="63" fill="${palette.paper}" stroke="${palette.rust}" stroke-width="5"/>
  <text x="900" y="520" text-anchor="middle" fill="${palette.ink}" font-family="Georgia, serif" font-size="29" font-weight="700">THE CORRECTION BECOMES INFRASTRUCTURE</text>
  <text x="900" y="560" text-anchor="middle" fill="#5f5545" font-family="Arial, sans-serif" font-size="22">and infrastructure becomes another maintenance surface</text>
  <text x="90" y="1047" fill="${palette.paperDark}" font-family="Georgia, serif" font-size="27" font-style="italic">This is human-directed externalized correction, not autonomous self-correction.</text>
  ${svgClose}`;
}

const generated = [
  {
    id: "same-brain-different-game",
    svg: sameBrainSvg(),
    caption: "A comparison between computer-game systems and the AI-assisted HobFarm workflow.",
  },
  {
    id: "source-of-truth-architecture",
    svg: architectureSvg(),
    caption: "The repaired path from global guidance and canonical Grimoire data to a generated StyleFusion consumer artifact.",
  },
  {
    id: "agentic-correction-loop",
    svg: correctionLoopSvg(),
    caption: "The human-directed correction loop, including the point where durable guidance becomes stale or conflicting.",
  },
];

for (const item of generated) {
  const svgPath = join(assetDir, `${item.id}.svg`);
  const pngPath = join(assetDir, `${item.id}.png`);
  await writeFile(svgPath, item.svg, "utf8");
  await sharp(Buffer.from(item.svg)).png({ compressionLevel: 9, palette: true }).toFile(pngPath);
}

const assetSpecs = [
  {
    id: "i-could-be-playing-civilization-hero",
    file: "i-could-be-playing-civilization-hero.png",
    caption: "Original editorial illustration of a late-night solo operator working across a project map instead of playing a strategy game.",
    credit: "HobFarm / generated with OpenAI image generation under human direction",
    rights: "Original HobFarm editorial illustration.",
  },
  ...generated.map((item) => ({
    id: item.id,
    file: `${item.id}.png`,
    caption: item.caption,
    credit: "HobFarm",
    rights: "Original HobFarm editorial graphic.",
  })),
];

const assets = [];
for (const spec of assetSpecs) {
  const source = join(assetDir, spec.file);
  const bytes = await readFile(source);
  const metadata = await sharp(bytes).metadata();
  const destinationKey = `${articlePrefix}${spec.file}`;
  assets.push({
    asset_id: spec.id,
    source_file: relative(root, source).replaceAll("\\", "/"),
    destination_bucket: "hobfarm-cdn",
    destination_key: destinationKey,
    public_url: `${publicHostname}/${destinationKey}`,
    content_type: "image/png",
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    width: metadata.width,
    height: metadata.height,
    caption: spec.caption,
    credit: spec.credit,
    rights_basis: spec.rights,
    upload_status: "ready",
    verification_status: "not-checked",
  });
}

const manifest = {
  version: 1,
  article_slug: "i-could-be-playing-civilization",
  bucket: "hobfarm-cdn",
  public_hostname: publicHostname,
  policy: {
    new_keys_only: true,
    overwrite_existing: false,
    allowed_prefixes: [articlePrefix],
  },
  assets,
};

await writeFile(
  join(reportDir, "asset-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Built ${generated.length} diagrams and ${assets.length} manifest entries.`);
