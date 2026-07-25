import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const assetDir = path.join(root, "assets", "brought-to-you-by-they-inc");
const sourceDir = path.join(assetDir, "source");
const sourceMaterialDir = path.join(assetDir, "sources");

const palette = {
  ink: "#182126",
  paper: "#ece1c6",
  paper2: "#d9c9a4",
  teal: "#2d6f72",
  tealDark: "#183f45",
  cyan: "#56c7c9",
  yellow: "#d7a53d",
  red: "#b74e3f",
  orange: "#c9713d",
  cream: "#fff7df",
  gray: "#7b817e",
  white: "#fffaf0",
};

const FONT = "Arial, Helvetica, sans-serif";
const DISPLAY = "'Arial Black', Impact, Arial, sans-serif";

await fs.mkdir(assetDir, { recursive: true });
await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(sourceMaterialDir, { recursive: true });

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock({
  text,
  x,
  y,
  width = 260,
  size = 32,
  lineHeight = 1.18,
  color = palette.ink,
  weight = 700,
  family = FONT,
  anchor = "start",
  maxLines,
  letterSpacing = 0,
}) {
  const chars = Math.max(8, Math.floor(width / (size * 0.57)));
  let lines = wrap(text, chars);
  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:]?$/, "")}…`;
  }
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${letterSpacing}">${lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : size * lineHeight}">${esc(line)}</tspan>`,
    )
    .join("")}</text>`;
}

function svgDocument(width, height, body, { background = palette.paper } = {}) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#0b1215" flood-opacity=".22"/>
    </filter>
    <pattern id="grain" width="13" height="13" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="3" r=".7" fill="#1a2528" opacity=".08"/>
      <circle cx="9" cy="8" r=".55" fill="#1a2528" opacity=".06"/>
    </pattern>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10z" fill="${palette.red}"/>
    </marker>
    <marker id="arrowTeal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10z" fill="${palette.teal}"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="${background}"/>
  ${body}
  <rect width="100%" height="100%" fill="url(#grain)" pointer-events="none"/>
</svg>`);
}

async function renderSvg(filename, width, height, body, options = {}) {
  const output = path.join(assetDir, filename);
  await sharp(svgDocument(width, height, body, options))
    .png({ compressionLevel: 9, palette: false })
    .toFile(output);
  return output;
}

function titleBand(kicker, title, subtitle, width) {
  return `
    <rect x="0" y="0" width="${width}" height="170" fill="${palette.ink}"/>
    <rect x="0" y="158" width="${width}" height="12" fill="${palette.yellow}"/>
    ${textBlock({ text: kicker.toUpperCase(), x: 70, y: 52, width: 650, size: 23, color: palette.cyan, family: DISPLAY, letterSpacing: 3 })}
    ${textBlock({ text: title.toUpperCase(), x: 70, y: 110, width: width - 140, size: 48, color: palette.cream, family: DISPLAY, maxLines: 1, letterSpacing: 1 })}
    ${textBlock({ text: subtitle, x: width - 70, y: 142, width: 760, size: 20, color: palette.paper2, weight: 500, anchor: "end" })}
  `;
}

async function buildHero() {
  const base = path.join(sourceDir, "hero-generated-base-v2.png");
  const titleOverlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
    <defs>
      <filter id="heroShadow"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#101719" flood-opacity=".5"/></filter>
    </defs>
    <rect x="0" y="0" width="1600" height="900" fill="none"/>
    <g filter="url(#heroShadow)">
      <text x="72" y="106" fill="${palette.yellow}" font-family="${DISPLAY}" font-size="28" font-weight="900" letter-spacing="5">A HOBFARM FIELD REPORT</text>
      <text x="68" y="184" fill="${palette.cream}" font-family="${DISPLAY}" font-size="69" font-weight="900" letter-spacing="1">BROUGHT TO YOU</text>
      <text x="68" y="260" fill="${palette.cream}" font-family="${DISPLAY}" font-size="69" font-weight="900" letter-spacing="1">BY THEY, INC.</text>
      <rect x="73" y="287" width="570" height="5" fill="${palette.red}"/>
      <text x="73" y="328" fill="${palette.paper}" font-family="${FONT}" font-size="23" font-weight="700">Thirty years of someone else telling me</text>
      <text x="73" y="359" fill="${palette.paper}" font-family="${FONT}" font-size="23" font-weight="700">what everybody knows.</text>
    </g>
    <g transform="translate(1120 405) rotate(-5)" filter="url(#heroShadow)">
      <circle cx="0" cy="0" r="98" fill="${palette.paper}" opacity=".93" stroke="${palette.ink}" stroke-width="9"/>
      <circle cx="0" cy="0" r="78" fill="none" stroke="${palette.red}" stroke-width="5" stroke-dasharray="8 7"/>
      <text x="0" y="-8" text-anchor="middle" fill="${palette.ink}" font-family="${DISPLAY}" font-size="30" font-weight="900">THEY, INC.</text>
      <text x="0" y="25" text-anchor="middle" fill="${palette.tealDark}" font-family="${FONT}" font-size="17" font-weight="700" letter-spacing="2">PUBLIC CERTAINTY</text>
      <text x="0" y="51" text-anchor="middle" fill="${palette.red}" font-family="${FONT}" font-size="15" font-weight="900" letter-spacing="3">SINCE FOREVER</text>
    </g>
  </svg>`);

  await sharp(base)
    .resize(1600, 900, { fit: "cover", position: "centre" })
    .composite([{ input: titleOverlay, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "hero-brought-to-you-by-they-inc-v2.png"));
}

async function buildSupplyChain() {
  const stages = [
    ["01", "EVENT", "Something happens"],
    ["02", "SOURCE", "A person or institution speaks"],
    ["03", "REPORT", "Facts are selected"],
    ["04", "COMMENTARY", "Meaning is assigned"],
    ["05", "HEADLINE / CLIP", "The portable edit"],
    ["06", "APPROVED TAKE", "The audience recognizes itself"],
    ["07", "MEMORY", "Detail decays"],
    ["08", "TALKING POINT", "The group supplies confidence"],
    ["09", "“THEY SAY”", "Provenance disappears"],
  ];
  let body = titleBand(
    "They, Inc. process diagram",
    "The Information Supply Chain",
    "Every arrow is a selection.",
    1800,
  );
  const yPositions = [280, 280, 280, 520, 520, 520, 760, 760, 760];
  const xPositions = [80, 650, 1220, 1220, 650, 80, 80, 650, 1220];
  const directions = [
    [540, 365, 635, 365],
    [1110, 365, 1205, 365],
    [1500, 450, 1500, 505],
    [1220, 605, 1110, 605],
    [650, 605, 540, 605],
    [360, 690, 360, 745],
    [540, 845, 635, 845],
    [1110, 845, 1205, 845],
  ];

  body += directions
    .map(
      ([x1, y1, x2, y2]) =>
        `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${palette.red}" stroke-width="10" fill="none" marker-end="url(#arrow)"/>`,
    )
    .join("");

  stages.forEach(([num, label, detail], index) => {
    const x = xPositions[index];
    const y = yPositions[index];
    const final = index === stages.length - 1;
    body += `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="500" height="170" rx="18" fill="${final ? palette.red : palette.cream}" stroke="${palette.ink}" stroke-width="5"/>
        <circle cx="${x + 62}" cy="${y + 57}" r="34" fill="${final ? palette.ink : palette.teal}"/>
        <text x="${x + 62}" y="${y + 68}" text-anchor="middle" fill="${palette.cream}" font-family="${DISPLAY}" font-size="26">${num}</text>
        ${textBlock({ text: label, x: x + 112, y: y + 65, width: 340, size: 29, color: final ? palette.cream : palette.ink, family: DISPLAY, maxLines: 1 })}
        ${textBlock({ text: detail, x: x + 42, y: y + 119, width: 415, size: 22, color: final ? palette.cream : palette.tealDark, weight: 600, maxLines: 2 })}
      </g>
    `;
  });

  body += `
    <rect x="80" y="990" width="1640" height="105" rx="16" fill="${palette.ink}"/>
    ${textBlock({ text: "SIGNATURE PRODUCT: THE INCOMPLETE TRUTH WITH THE UNCERTAINTY REMOVED", x: 900, y: 1056, width: 1480, size: 32, color: palette.yellow, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("they-inc-information-supply-chain.png", 1800, 1160, body);
}

async function buildTimeline() {
  const items = [
    ["1998", "CLINTON / LEWINSKY", "Private life becomes continuous programming"],
    ["2000", "BUSH v. GORE", "Reality forks live"],
    ["2001–03", "9/11 + IRAQ", "Emergency certifies uncertain claims"],
    ["2004", "SOME PEOPLE, LLC", "Synthetic consensus enters the room"],
    ["2005", "TERRI SCHIAVO", "A person becomes a national symbol"],
    ["2008–11", "BIRTHERISM", "A disproven identity claim performs membership"],
    ["2015–16", "TRUMP TV", "The politician becomes the program"],
    ["2016", "RETURN FROM VIETNAM", "Everybody has joined a club"],
    ["2020", "COVID", "The subscription becomes physical"],
    ["2020–21", "DISORDER LABELS", "Vocabulary becomes team property"],
    ["2022–25", "IDENTITY PRODUCTS", "Countries, celebrities, and brands become jerseys"],
    ["2025–26", "AI", "A technology becomes a personality test"],
  ];
  let body = titleBand(
    "Capability ledger",
    "Thirty Years of They, Inc.",
    "The subject changes. The capability stays.",
    1800,
  );
  const startY = 245;
  body += `<path d="M180 ${startY + 55} L1620 ${startY + 55} L1620 995 L180 995" fill="none" stroke="${palette.teal}" stroke-width="14" stroke-linecap="round"/>`;

  items.forEach(([year, name, capability], index) => {
    const row = Math.floor(index / 4);
    const colRaw = index % 4;
    const col = row % 2 === 0 ? colRaw : 3 - colRaw;
    const x = 70 + col * 430;
    const y = startY + row * 300;
    const accent = [palette.red, palette.yellow, palette.cyan][row];
    body += `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="370" height="225" rx="16" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="5"/>
        <rect x="${x}" y="${y}" width="370" height="55" rx="12" fill="${accent}"/>
        <text x="${x + 25}" y="${y + 38}" fill="${palette.ink}" font-family="${DISPLAY}" font-size="27" font-weight="900">${esc(year)}</text>
        ${textBlock({ text: name, x: x + 24, y: y + 102, width: 325, size: 26, family: DISPLAY, maxLines: 2 })}
        ${textBlock({ text: capability, x: x + 24, y: y + 158, width: 325, size: 21, color: palette.tealDark, weight: 600, maxLines: 3 })}
      </g>
    `;
  });
  body += `
    <rect x="70" y="1148" width="1660" height="105" rx="17" fill="${palette.ink}"/>
    ${textBlock({ text: "POST-COVID STATUS: THE EMERGENCY ENDED. THE SORTING SYSTEM DID NOT.", x: 900, y: 1214, width: 1500, size: 32, color: palette.cream, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("thirty-years-of-they-inc.png", 1800, 1325, body);
}

async function buildPackages() {
  const packages = [
    ["ESTABLISHMENT", "Reassurance", "Responsible leaders restore order"],
    ["OPPOSITION", "Betrayal", "They are hiding the real crisis"],
    ["CORPORATE", "Market impact", "What this means for customers"],
    ["FOREIGN", "Regional history", "The statement enters another timeline"],
    ["INFLUENCER", "The face clip", "Watch the moment they accidentally admit it"],
    ["LUNCHROOM", "Everybody knows", "They say this proves the president failed"],
  ];
  let body = titleBand(
    "Audience Satisfaction Department",
    "Same Event, Different Packages",
    "Selection can create competing products without changing the footage.",
    1800,
  );
  body += `
    <g filter="url(#shadow)">
      <ellipse cx="900" cy="545" rx="235" ry="110" fill="${palette.tealDark}" stroke="${palette.ink}" stroke-width="7"/>
      <rect x="835" y="365" width="130" height="165" rx="14" fill="${palette.gray}" stroke="${palette.ink}" stroke-width="5"/>
      <rect x="770" y="495" width="260" height="105" rx="8" fill="${palette.paper2}" stroke="${palette.ink}" stroke-width="6"/>
      <circle cx="870" cy="420" r="11" fill="${palette.red}"/>
      <circle cx="930" cy="420" r="11" fill="${palette.red}"/>
      <text x="900" y="548" text-anchor="middle" fill="${palette.ink}" font-family="${DISPLAY}" font-size="28">SOURCE</text>
      <text x="900" y="581" text-anchor="middle" fill="${palette.ink}" font-family="${FONT}" font-size="19" font-weight="700">ONE PRESS CONFERENCE</text>
    </g>
  `;

  const positions = [
    [70, 245],
    [1240, 245],
    [70, 650],
    [1240, 650],
    [425, 860],
    [1015, 860],
  ];
  const connectors = [
    [425, 405, 690, 480],
    [1375, 405, 1110, 480],
    [425, 810, 700, 610],
    [1375, 810, 1100, 610],
    [610, 860, 785, 640],
    [1190, 860, 1015, 640],
  ];
  connectors.forEach(([x1, y1, x2, y2]) => {
    body += `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" fill="none" stroke="${palette.red}" stroke-width="7" marker-end="url(#arrow)"/>`;
  });
  packages.forEach(([label, product, take], index) => {
    const [x, y] = positions[index];
    body += `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="490" height="210" rx="17" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="5"/>
        <rect x="${x}" y="${y}" width="490" height="56" rx="14" fill="${index % 2 ? palette.yellow : palette.cyan}"/>
        ${textBlock({ text: label, x: x + 25, y: y + 39, width: 440, size: 24, family: DISPLAY, maxLines: 1 })}
        ${textBlock({ text: product, x: x + 25, y: y + 105, width: 440, size: 32, color: palette.red, family: DISPLAY, maxLines: 1 })}
        ${textBlock({ text: take, x: x + 25, y: y + 153, width: 430, size: 21, color: palette.tealDark, weight: 600, maxLines: 2 })}
      </g>
    `;
  });
  body += `
    <rect x="70" y="1120" width="1660" height="95" rx="16" fill="${palette.ink}"/>
    ${textBlock({ text: "THE RECORDING STAYS THE SAME. THE CUSTOMER RECEIVES A DIFFERENT EDIT.", x: 900, y: 1181, width: 1500, size: 31, color: palette.yellow, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("same-event-different-packages.png", 1800, 1285, body);
}

async function buildIdentityBadges() {
  const products = [
    ["COUNTRY", "JERSEY", "A foreign state becomes a domestic club flag", "⚑"],
    ["MASK", "MORALITY", "A health measure becomes a character test", "✚"],
    ["CELEBRITY", "ALLEGIANCE", "A polite answer becomes betrayal", "★"],
    ["FOOD", "IDEOLOGY", "Lunch comes with a presumed party", "●"],
    ["BRAND", "ENDORSEMENT", "A purchase becomes the CEO’s politics", "◆"],
    ["SLOGAN", "PERSONHOOD", "One phrase supplies the whole customer", "”"],
  ];
  let body = titleBand(
    "Flags and Identity Products",
    "Political Badges for Every Occasion",
    "Now sold preloaded with strangers’ assumptions.",
    1800,
  );
  body += `
    <rect x="55" y="215" width="1690" height="910" rx="24" fill="${palette.tealDark}" stroke="${palette.ink}" stroke-width="8" filter="url(#shadow)"/>
    <rect x="95" y="255" width="1610" height="105" rx="13" fill="${palette.yellow}"/>
    <text x="900" y="324" text-anchor="middle" fill="${palette.ink}" font-family="${DISPLAY}" font-size="42" font-weight="900">BUILD A COMPLETE PERSON FROM ONE VISIBLE OBJECT</text>
  `;
  products.forEach(([type, name, detail, icon], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 105 + col * 540;
    const y = 405 + row * 345;
    body += `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="510" height="290" rx="18" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="5"/>
        <circle cx="${x + 92}" cy="${y + 95}" r="61" fill="${index % 2 ? palette.red : palette.teal}" stroke="${palette.ink}" stroke-width="5"/>
        <text x="${x + 92}" y="${y + 116}" text-anchor="middle" fill="${palette.cream}" font-family="${DISPLAY}" font-size="60">${icon}</text>
        ${textBlock({ text: type, x: x + 180, y: y + 77, width: 290, size: 22, color: palette.red, family: DISPLAY, maxLines: 1 })}
        ${textBlock({ text: name, x: x + 180, y: y + 118, width: 290, size: 32, family: DISPLAY, maxLines: 1 })}
        <line x1="${x + 35}" y1="${y + 178}" x2="${x + 475}" y2="${y + 178}" stroke="${palette.paper2}" stroke-width="5"/>
        ${textBlock({ text: detail, x: x + 36, y: y + 221, width: 435, size: 21, color: palette.tealDark, weight: 600, maxLines: 3 })}
      </g>
    `;
  });
  body += `
    <rect x="95" y="1042" width="1610" height="62" rx="10" fill="${palette.red}"/>
    ${textBlock({ text: "WARNING: DISPLAY MAY BE INTERPRETED AS CONSENT TO AN ENTIRE INFORMATION PACKAGE", x: 900, y: 1084, width: 1480, size: 25, color: palette.cream, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("identity-badge-department.png", 1800, 1190, body);
}

async function buildFactoidFactory() {
  let body = titleBand(
    "Public Certainty Division",
    "The Factoid Factory",
    "Real issue in. Membership product out.",
    1800,
  );
  body += `
    <g filter="url(#shadow)">
      <rect x="65" y="270" width="445" height="700" rx="26" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="7"/>
      ${textBlock({ text: "COMPLEX EVENT", x: 287, y: 340, width: 380, size: 38, family: DISPLAY, anchor: "middle", maxLines: 1 })}
      <circle cx="287" cy="505" r="112" fill="${palette.teal}" stroke="${palette.ink}" stroke-width="7"/>
      <path d="M210 505 C240 420, 300 590, 360 470" fill="none" stroke="${palette.yellow}" stroke-width="17"/>
      <circle cx="245" cy="465" r="15" fill="${palette.cream}"/>
      <circle cx="327" cy="545" r="19" fill="${palette.red}"/>
      ${["SCOPE", "LOCATION", "MAGNITUDE", "COMPARISON", "UNCERTAINTY", "CAUSAL CHAIN"].map((item, i) => `<rect x="112" y="${670 + i * 43}" width="350" height="32" rx="8" fill="${i % 2 ? palette.paper2 : palette.cyan}"/><text x="287" y="${694 + i * 43}" text-anchor="middle" fill="${palette.ink}" font-family="${FONT}" font-size="19" font-weight="900">${item}</text>`).join("")}
    </g>

    <path d="M520 620 L670 620" stroke="${palette.red}" stroke-width="12" marker-end="url(#arrow)"/>

    <g filter="url(#shadow)">
      <path d="M680 285 L1110 285 L1235 425 L1235 850 L1100 1010 L690 1010 L575 835 L575 425 Z" fill="${palette.ink}" stroke="${palette.red}" stroke-width="9"/>
      <text x="905" y="365" text-anchor="middle" fill="${palette.yellow}" font-family="${DISPLAY}" font-size="39">REMOVE</text>
      ${["CONTEXT", "LIMITS", "QUALIFIERS", "ALTERNATIVES", "TIME", "PROPORTION"].map((item, i) => `<text x="740" y="${430 + i * 63}" fill="${palette.cream}" font-family="${DISPLAY}" font-size="26">${item}</text><path d="M1000 ${420 + i * 63} l70 0" stroke="${palette.red}" stroke-width="11"/><path d="M1000 ${420 + i * 63} l70 0" stroke="${palette.red}" stroke-width="4" stroke-dasharray="6 6"/>`).join("")}
      <line x1="625" y1="835" x2="1188" y2="835" stroke="${palette.teal}" stroke-width="8"/>
      <text x="905" y="895" text-anchor="middle" fill="${palette.cyan}" font-family="${DISPLAY}" font-size="29">ADD CERTAINTY</text>
      <text x="905" y="938" text-anchor="middle" fill="${palette.cyan}" font-family="${DISPLAY}" font-size="29">ADD ENEMY</text>
    </g>

    <path d="M1245 620 L1395 620" stroke="${palette.red}" stroke-width="12" marker-end="url(#arrow)"/>

    <g filter="url(#shadow)">
      <rect x="1405" y="330" width="330" height="590" rx="24" fill="${palette.red}" stroke="${palette.ink}" stroke-width="8"/>
      <rect x="1440" y="370" width="260" height="115" rx="14" fill="${palette.cream}"/>
      ${textBlock({ text: "FACTOID", x: 1570, y: 438, width: 225, size: 42, family: DISPLAY, anchor: "middle", maxLines: 1 })}
      <text x="1570" y="580" text-anchor="middle" fill="${palette.cream}" font-family="${DISPLAY}" font-size="88">!</text>
      ${textBlock({ text: "SHORT ENOUGH TO REPEAT", x: 1570, y: 680, width: 250, size: 27, color: palette.cream, family: DISPLAY, anchor: "middle", maxLines: 2 })}
      ${textBlock({ text: "CERTAIN ENOUGH TO BELONG", x: 1570, y: 785, width: 250, size: 27, color: palette.yellow, family: DISPLAY, anchor: "middle", maxLines: 2 })}
    </g>
    <rect x="65" y="1080" width="1670" height="100" rx="16" fill="${palette.ink}"/>
    ${textBlock({ text: "THE INCOMPLETE TRUTH WITH THE UNCERTAINTY REMOVED", x: 900, y: 1144, width: 1500, size: 37, color: palette.yellow, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("factoid-factory.png", 1800, 1250, body);
}

async function buildSomePeople() {
  let body = titleBand(
    "Synthetic constituency services",
    "Some People, LLC",
    "Never name a source when an invisible crowd will do.",
    1800,
  );
  body += `
    <rect x="70" y="230" width="1660" height="890" rx="28" fill="${palette.tealDark}" stroke="${palette.ink}" stroke-width="8"/>
    <g filter="url(#shadow)">
      <rect x="120" y="390" width="585" height="500" rx="24" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="7"/>
      <circle cx="412" cy="520" r="105" fill="${palette.paper2}" stroke="${palette.ink}" stroke-width="7"/>
      <circle cx="375" cy="500" r="13" fill="${palette.ink}"/>
      <circle cx="449" cy="500" r="13" fill="${palette.ink}"/>
      <path d="M365 560 Q412 590 460 550" fill="none" stroke="${palette.ink}" stroke-width="9"/>
      <rect x="210" y="660" width="405" height="115" rx="12" fill="${palette.red}" stroke="${palette.ink}" stroke-width="6"/>
      <text x="412" y="711" text-anchor="middle" fill="${palette.cream}" font-family="${DISPLAY}" font-size="27">PUNDIT INPUT</text>
      <text x="412" y="748" text-anchor="middle" fill="${palette.yellow}" font-family="${FONT}" font-size="20" font-weight="900">ALLEGATION READY</text>
    </g>

    <path d="M725 650 L915 650" stroke="${palette.yellow}" stroke-width="16" marker-end="url(#arrowTeal)"/>
    <g filter="url(#shadow)">
      <rect x="805" y="350" width="255" height="485" rx="30" fill="${palette.ink}" stroke="${palette.red}" stroke-width="8"/>
      <text x="932" y="420" text-anchor="middle" fill="${palette.cyan}" font-family="${DISPLAY}" font-size="28">LEVER</text>
      <line x1="932" y1="515" x2="1035" y2="650" stroke="${palette.paper2}" stroke-width="22" stroke-linecap="round"/>
      <circle cx="1042" cy="658" r="49" fill="${palette.red}" stroke="${palette.cream}" stroke-width="9"/>
      <rect x="842" y="710" width="180" height="78" rx="10" fill="${palette.yellow}"/>
      ${textBlock({ text: "SOME PEOPLE SAY", x: 932, y: 744, width: 160, size: 20, family: DISPLAY, anchor: "middle", maxLines: 2 })}
    </g>

    <path d="M1075 650 L1240 650" stroke="${palette.yellow}" stroke-width="16" marker-end="url(#arrowTeal)"/>
    <g filter="url(#shadow)">
      <rect x="1190" y="300" width="470" height="620" rx="26" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="7"/>
      ${textBlock({ text: "INVISIBLE PUBLIC", x: 1425, y: 375, width: 400, size: 34, family: DISPLAY, anchor: "middle", maxLines: 1 })}
      ${Array.from({ length: 21 }, (_, i) => {
        const row = Math.floor(i / 7);
        const col = i % 7;
        const x = 1245 + col * 60;
        const y = 445 + row * 128;
        const color = i % 5 === 0 ? palette.red : i % 3 === 0 ? palette.teal : palette.gray;
        return `<circle cx="${x}" cy="${y}" r="23" fill="${color}"/><path d="M${x - 34} ${y + 59} Q${x} ${y + 20} ${x + 34} ${y + 59} V${y + 85} H${x - 34}Z" fill="${color}"/>`;
      }).join("")}
      <rect x="1235" y="830" width="380" height="53" rx="9" fill="${palette.red}"/>
      <text x="1425" y="867" text-anchor="middle" fill="${palette.cream}" font-family="${DISPLAY}" font-size="22">SOURCE COUNT: UNAVAILABLE</text>
    </g>

    <rect x="120" y="985" width="1540" height="82" rx="14" fill="${palette.yellow}"/>
    ${textBlock({ text: "THE CROWD CARRIES THE CLAIM. THE SPEAKER ONLY REPORTS THAT IT EXISTS.", x: 890, y: 1038, width: 1400, size: 30, color: palette.ink, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("some-people-llc.png", 1800, 1190, body);
}

async function buildFlowchart() {
  const nodes = [
    { x: 650, y: 210, w: 500, h: 95, text: "SOMEONE SAYS “THEY SAY…”", fill: palette.red, color: palette.cream },
    { x: 650, y: 360, w: 500, h: 95, text: "WHO ARE THEY?", fill: palette.cream },
    { x: 650, y: 510, w: 500, h: 95, text: "WHAT EXACTLY DID THEY SAY?", fill: palette.cream },
    { x: 650, y: 660, w: 500, h: 95, text: "IS THE SOURCE RECOVERABLE?", fill: palette.cream },
    { x: 650, y: 810, w: 500, h: 95, text: "DOES IT APPLY HERE?", fill: palette.cream },
    { x: 650, y: 960, w: 500, h: 115, text: "DOES THE CONCLUSION SURVIVE WITHOUT THE TEAM PACKAGE?", fill: palette.cream },
  ];
  let body = titleBand(
    "Field inspection",
    "I Don’t Care / That’s Bullshit",
    "A boundary is not a universal theory of truth.",
    1800,
  );
  nodes.forEach((node, index) => {
    body += `
      <g filter="url(#shadow)">
        <rect x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="18" fill="${node.fill}" stroke="${palette.ink}" stroke-width="6"/>
        ${textBlock({ text: node.text, x: node.x + node.w / 2, y: node.y + node.h / 2 + (node.text.length > 36 ? -4 : 10), width: node.w - 55, size: node.text.length > 36 ? 25 : 30, color: node.color || palette.ink, family: DISPLAY, anchor: "middle", maxLines: 2 })}
      </g>
    `;
    if (index < nodes.length - 1) {
      body += `<path d="M900 ${node.y + node.h} L900 ${nodes[index + 1].y - 15}" stroke="${palette.teal}" stroke-width="8" marker-end="url(#arrowTeal)"/>`;
    }
  });

  const exits = [
    [80, 455, "I DON’T CARE", "The subject does not get my attention.", palette.gray],
    [80, 780, "THAT’S BULLSHIT", "The package fails inspection.", palette.red],
    [1220, 455, "UNRESOLVED", "The evidence does not yet decide.", palette.yellow],
    [1220, 780, "USEFUL INFORMATION", "Scope, source, and relevance survive.", palette.cyan],
  ];
  exits.forEach(([x, y, label, detail, fill], index) => {
    const targetY = index % 2 === 0 ? 560 : 900;
    const startX = x < 900 ? 650 : 1150;
    const endX = x < 900 ? x + 500 : x;
    body += `<path d="M${startX} ${targetY} C${(startX + endX) / 2} ${targetY}, ${(startX + endX) / 2} ${y + 85}, ${endX} ${y + 85}" fill="none" stroke="${palette.ink}" stroke-width="5" stroke-dasharray="12 10" marker-end="url(#arrowTeal)"/>`;
    body += `
      <g filter="url(#shadow)">
        <rect x="${x}" y="${y}" width="500" height="175" rx="20" fill="${fill}" stroke="${palette.ink}" stroke-width="6"/>
        ${textBlock({ text: label, x: x + 250, y: y + 65, width: 440, size: 33, color: fill === palette.red || fill === palette.gray ? palette.cream : palette.ink, family: DISPLAY, anchor: "middle", maxLines: 1 })}
        ${textBlock({ text: detail, x: x + 250, y: y + 118, width: 420, size: 22, color: fill === palette.red || fill === palette.gray ? palette.cream : palette.tealDark, weight: 700, anchor: "middle", maxLines: 2 })}
      </g>
    `;
  });
  body += `
    <rect x="80" y="1160" width="1640" height="92" rx="16" fill="${palette.ink}"/>
    ${textBlock({ text: "THE QUESTION IS NOT WHETHER A TEAM LIKES THE ANSWER. THE QUESTION IS WHETHER THE CLAIM SURVIVES.", x: 900, y: 1218, width: 1500, size: 29, color: palette.yellow, family: DISPLAY, anchor: "middle", maxLines: 1 })}
  `;
  await renderSvg("i-dont-care-thats-bullshit-flowchart.png", 1800, 1325, body);
}

async function prepareSearchScreenshots() {
  const screenshots = [
    ["iran", "google-news-iran-2026-07-24.jpg"],
    ["djibouti", "google-news-djibouti-2026-07-24.jpg"],
  ];
  const outputs = {};
  for (const [name, filename] of screenshots) {
    const input = path.join(sourceMaterialDir, filename);
    const output = path.join(
      sourceMaterialDir,
      `google-news-${name}-2026-07-24-public.png`,
    );
    await sharp(input)
      .extract({ left: 0, top: 0, width: 1680, height: 900 })
      .png({ compressionLevel: 9 })
      .toFile(output);
    outputs[name] = output;
  }
  return outputs;
}

async function buildIranDjibouti(screenshots) {
  const width = 2000;
  const height = 1410;
  const iran = await sharp(screenshots.iran)
    .resize(900, 482, { fit: "cover", position: "top" })
    .png()
    .toBuffer();
  const djibouti = await sharp(screenshots.djibouti)
    .resize(900, 482, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  let body = titleBand(
    "Dated search snapshot",
    "Iran vs. Djibouti",
    "Spectacle is visible. Infrastructure is durable.",
    width,
  );
  body += `
    <rect x="60" y="215" width="920" height="585" rx="20" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="7" filter="url(#shadow)"/>
    <rect x="1020" y="215" width="920" height="585" rx="20" fill="${palette.cream}" stroke="${palette.ink}" stroke-width="7" filter="url(#shadow)"/>
    <rect x="60" y="215" width="920" height="70" rx="16" fill="${palette.red}"/>
    <rect x="1020" y="215" width="920" height="70" rx="16" fill="${palette.teal}"/>
    <text x="95" y="262" fill="${palette.cream}" font-family="${DISPLAY}" font-size="34">IRAN: STORY + SPECTACLE</text>
    <text x="1055" y="262" fill="${palette.cream}" font-family="${DISPLAY}" font-size="34">DJIBOUTI: SYSTEM + INFRASTRUCTURE</text>
    <rect x="80" y="302" width="880" height="470" fill="${palette.white}"/>
    <rect x="1040" y="302" width="880" height="470" fill="${palette.white}"/>

    <g filter="url(#shadow)">
      <rect x="60" y="850" width="1880" height="465" rx="24" fill="${palette.tealDark}" stroke="${palette.ink}" stroke-width="7"/>
      <path d="M250 930 C410 880, 590 900, 705 1020 C790 1110, 915 1130, 1010 1080 C1130 1020, 1215 940, 1405 920 L1490 1165 C1310 1190, 1130 1180, 980 1230 C835 1278, 690 1210, 600 1150 C480 1072, 355 1075, 235 1125 Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6"/>
      <path d="M740 850 C815 930, 870 1020, 930 1090 C960 1125, 992 1150, 1020 1178" fill="none" stroke="${palette.cyan}" stroke-width="75" opacity=".9"/>
      <path d="M1015 1180 C1080 1155, 1150 1150, 1240 1152" fill="none" stroke="${palette.cyan}" stroke-width="96" opacity=".9"/>
      <path d="M1008 1160 L1085 1125" stroke="${palette.yellow}" stroke-width="14" marker-end="url(#arrowTeal)"/>
      <circle cx="1035" cy="1170" r="18" fill="${palette.red}" stroke="${palette.cream}" stroke-width="5"/>
      <circle cx="1085" cy="1208" r="16" fill="${palette.yellow}" stroke="${palette.ink}" stroke-width="4"/>
      <text x="705" y="930" fill="${palette.ink}" font-family="${DISPLAY}" font-size="31">RED SEA</text>
      <text x="1165" y="1250" fill="${palette.ink}" font-family="${DISPLAY}" font-size="31">GULF OF ADEN</text>
      <text x="1060" y="1098" fill="${palette.cream}" font-family="${DISPLAY}" font-size="24">BAB EL-MANDEB</text>
      <text x="1110" y="1196" fill="${palette.cream}" font-family="${DISPLAY}" font-size="26">DJIBOUTI</text>
      <text x="1130" y="1230" fill="${palette.yellow}" font-family="${FONT}" font-size="20" font-weight="900">CAMP LEMONNIER</text>
      <text x="315" y="1270" fill="${palette.paper2}" font-family="${FONT}" font-size="22" font-weight="700">Major shipping chokepoint • U.S. regional base • port and logistics system</text>
    </g>
    <rect x="60" y="1335" width="1880" height="44" rx="8" fill="${palette.ink}"/>
    <text x="1000" y="1365" text-anchor="middle" fill="${palette.paper}" font-family="${FONT}" font-size="19" font-weight="700">Google News captured July 24, 2026. Results are temporary and query-dependent; map is schematic.</text>
  `;
  const base = sharp(svgDocument(width, height, body));
  await base
    .composite([
      { input: iran, left: 80, top: 302 },
      { input: djibouti, left: 1040, top: 302 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(assetDir, "iran-vs-djibouti.png"));
}

async function buildContactSheet() {
  const files = [
    "hero-brought-to-you-by-they-inc-v2.png",
    "they-inc-information-supply-chain.png",
    "thirty-years-of-they-inc.png",
    "same-event-different-packages.png",
    "identity-badge-department.png",
    "iran-vs-djibouti.png",
    "factoid-factory.png",
    "some-people-llc.png",
    "i-dont-care-thats-bullshit-flowchart.png",
  ];
  const tiles = [];
  for (const file of files) {
    const image = await sharp(path.join(assetDir, file))
      .resize(500, 300, { fit: "contain", background: palette.paper })
      .extend({ top: 0, bottom: 55, left: 0, right: 0, background: palette.ink })
      .composite([
        {
          input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="55"><text x="250" y="35" text-anchor="middle" fill="${palette.cream}" font-family="${FONT}" font-size="17" font-weight="700">${esc(file)}</text></svg>`),
          left: 0,
          top: 300,
        },
      ])
      .png()
      .toBuffer();
    tiles.push({ input: image, left: (tiles.length % 3) * 520, top: Math.floor(tiles.length / 3) * 375 });
  }
  await sharp({
    create: {
      width: 1540,
      height: 1110,
      channels: 3,
      background: palette.paper2,
    },
  })
    .composite(tiles)
    .png({ compressionLevel: 9 })
    .toFile(path.join(sourceDir, "asset-contact-sheet.png"));
}

await buildHero();
await buildSupplyChain();
await buildTimeline();
await buildPackages();
await buildIdentityBadges();
await buildFactoidFactory();
await buildSomePeople();
await buildFlowchart();
const screenshots = await prepareSearchScreenshots();
await buildIranDjibouti(screenshots);
await buildContactSheet();

const outputs = (await fs.readdir(assetDir))
  .filter((file) => file.endsWith(".png"))
  .sort();
console.log(`Built ${outputs.length} publication PNG assets:`);
for (const output of outputs) console.log(`- ${output}`);
