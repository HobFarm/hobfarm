import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = join(root, "reports", "doll-family", "assets");

const palette = {
  ink: "#171411",
  black: "#090806",
  paper: "#eadfc9",
  paperDark: "#c8b99d",
  red: "#a23e32",
  blue: "#315c6a",
  gold: "#d4a354",
  muted: "#8a7b68",
};

function paperTexture() {
  return `
    <filter id="paper-noise" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="7" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
      <feComponentTransfer in="gray" result="faded">
        <feFuncA type="table" tableValues="0 .13"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="faded" mode="multiply"/>
    </filter>
    <pattern id="rule-lines" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M0 47.5H48" stroke="${palette.paperDark}" stroke-opacity=".18"/>
    </pattern>
  `;
}

function nameCard({ x, y, width, civil, stage, accent, rotation = 0 }) {
  return `
    <g transform="translate(${x} ${y}) rotate(${rotation} ${width / 2} 105)" filter="url(#paper-noise)">
      <rect width="${width}" height="210" rx="7" fill="${palette.paper}"/>
      <rect x="0" y="0" width="17" height="210" fill="${accent}"/>
      <path d="M42 64H${width - 34}M42 137H${width - 34}" stroke="${palette.paperDark}" stroke-width="2"/>
      <text x="42" y="45" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="3">BIRTH RECORD</text>
      <text x="42" y="111" fill="${palette.ink}" font-family="Georgia, serif" font-size="38" font-weight="700">${civil}</text>
      <text x="42" y="180" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800" letter-spacing="1.4">${stage}</text>
    </g>
  `;
}

function route({ x, y, width, compact = false }) {
  const stops = compact
    ? ["STOLPEN", "FILM", "FREAKS", "RINGLING", "OZ", "SARASOTA"]
    : ["STOLPEN", "SILENT FILM", "FREAKS", "RINGLING", "OZ", "SARASOTA"];
  const step = width / (stops.length - 1);
  const labels = stops
    .map((stop, index) => {
      const stopX = x + step * index;
      const color = index === 0 ? palette.red : index === stops.length - 1 ? palette.blue : palette.gold;
      return `
        <circle cx="${stopX}" cy="${y}" r="${compact ? 10 : 13}" fill="${color}" stroke="${palette.paper}" stroke-width="4"/>
        <text x="${stopX}" y="${y + (index % 2 === 0 ? -30 : 48)}" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="${compact ? 22 : 25}" font-weight="700" text-anchor="middle" letter-spacing="1.7">${stop}</text>
      `;
    })
    .join("");
  return `
    <g>
      <path d="M${x} ${y}H${x + width}" fill="none" stroke="${palette.paperDark}" stroke-width="5" stroke-dasharray="17 14"/>
      ${labels}
    </g>
  `;
}

function landscapeSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1350" viewBox="0 0 2400 1350">
    <defs>${paperTexture()}</defs>
    <rect width="2400" height="1350" fill="${palette.black}"/>
    <rect x="54" y="48" width="2292" height="1254" rx="12" fill="${palette.ink}" stroke="${palette.paperDark}" stroke-width="3"/>
    <path d="M54 305H2346M54 1082H2346" stroke="${palette.paperDark}" stroke-opacity=".23" stroke-width="2"/>
    <rect x="54" y="48" width="2292" height="1254" fill="url(#rule-lines)" opacity=".55"/>

    <text x="120" y="122" fill="${palette.gold}" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="700" letter-spacing="8">MAGAZINE TIME MACHINE / FAMILY FILE</text>
    <text x="120" y="245" fill="${palette.paper}" font-family="Georgia, serif" font-size="112" font-weight="700" letter-spacing="-3">THEY HAD NAMES</text>
    <text x="2290" y="123" fill="${palette.paperDark}" font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="end" letter-spacing="4">STOLPEN → SARASOTA</text>

    ${nameCard({ x: 120, y: 360, width: 510, civil: "FRIEDA A. SCHNEIDER", stage: "GRACIE DOLL", accent: palette.red, rotation: -1.2 })}
    ${nameCard({ x: 670, y: 340, width: 510, civil: "KURT F. SCHNEIDER", stage: "HARRY EARLES", accent: palette.blue, rotation: 0.8 })}
    ${nameCard({ x: 1220, y: 355, width: 510, civil: "HILDA E. SCHNEIDER", stage: "DAISY EARLES", accent: palette.red, rotation: -0.6 })}
    ${nameCard({ x: 1770, y: 335, width: 510, civil: "ELLY A. SCHNEIDER", stage: "TINY DOLL", accent: palette.blue, rotation: 1.1 })}

    <g transform="translate(145 635)">
      <rect width="2100" height="170" rx="7" fill="#0d0c0a" stroke="${palette.paperDark}" stroke-opacity=".35"/>
      <text x="54" y="56" fill="${palette.muted}" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="4">INDIVIDUAL ROLES / COLLECTIVE BILLINGS</text>
      <text x="54" y="119" fill="${palette.paper}" font-family="Georgia, serif" font-size="39">Tweedledee · Hans · Frieda · Doll Family · Ringling roster · Munchkin ensemble</text>
    </g>

    ${route({ x: 170, y: 970, width: 2060 })}

    <text x="120" y="1246" fill="${palette.paperDark}" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="3">FOUR WORKERS INSIDE A CENTURY OF LABELS</text>
    <text x="2280" y="1246" fill="${palette.gold}" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="800" text-anchor="end" letter-spacing="4">HOB.FARM</text>
  </svg>`;
}

function verticalSvg() {
  const cards = [
    ["FRIEDA A. SCHNEIDER", "GRACIE DOLL", palette.red],
    ["KURT F. SCHNEIDER", "HARRY EARLES", palette.blue],
    ["HILDA E. SCHNEIDER", "DAISY EARLES", palette.red],
    ["ELLY A. SCHNEIDER", "TINY DOLL", palette.blue],
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <defs>${paperTexture()}</defs>
    <rect width="1080" height="1920" fill="${palette.black}"/>
    <rect x="45" y="42" width="990" height="1836" rx="10" fill="${palette.ink}" stroke="${palette.paperDark}" stroke-width="3"/>
    <rect x="45" y="42" width="990" height="1836" fill="url(#rule-lines)" opacity=".5"/>
    <text x="86" y="115" fill="${palette.gold}" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="700" letter-spacing="5">MAGAZINE TIME MACHINE</text>
    <text x="86" y="265" fill="${palette.paper}" font-family="Georgia, serif" font-size="106" font-weight="700">THEY HAD</text>
    <text x="86" y="365" fill="${palette.paper}" font-family="Georgia, serif" font-size="106" font-weight="700">NAMES</text>
    <text x="90" y="424" fill="${palette.paperDark}" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="3">THE DOLL FAMILY FROM FREAKS TO SARASOTA</text>

    ${cards
      .map(
        ([civil, stage, accent], index) =>
          nameCard({
            x: 88,
            y: 500 + index * 235,
            width: 904,
            civil,
            stage,
            accent,
            rotation: index % 2 === 0 ? -0.4 : 0.4,
          }),
      )
      .join("")}

    ${route({ x: 110, y: 1585, width: 860, compact: true })}
    <text x="86" y="1785" fill="${palette.paperDark}" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="2.6">FOUR WORKERS INSIDE A CENTURY OF LABELS</text>
    <text x="994" y="1840" fill="${palette.gold}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" text-anchor="end" letter-spacing="4">HOB.FARM</text>
  </svg>`;
}

await mkdir(outputDir, { recursive: true });

const cleanSvg = (value) => `${value.replace(/[ \t]+$/gm, "").trim()}\n`;
const landscape = cleanSvg(landscapeSvg());
const vertical = cleanSvg(verticalSvg());
await writeFile(join(outputDir, "doll-family-names-route-hero.svg"), landscape);
await writeFile(join(outputDir, "doll-family-names-route-vertical.svg"), vertical);

await sharp(Buffer.from(landscape))
  .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(join(outputDir, "doll-family-names-route-hero.jpg"));

await sharp(Buffer.from(landscape))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(join(outputDir, "doll-family-names-route-social-1200x630.jpg"));

await sharp(Buffer.from(vertical))
  .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(join(outputDir, "doll-family-names-route-vertical-1080x1920.jpg"));

console.log(`Built Doll Family article graphics in ${outputDir}`);
