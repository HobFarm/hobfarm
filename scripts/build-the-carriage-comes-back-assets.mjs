import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const base = "https://cdn.hob.farm/workshop/future-carriage";
const outputRoot = resolve("public/articles/the-carriage-comes-back");

const [sourceResponse, futureResponse] = await Promise.all([
  fetch(`${base}/design-for-4-seat-phaeton-no-top-no-4033-8d1316.jpg`),
  fetch(`${base}/future-carriage-4033.png`),
]);

if (!sourceResponse.ok || !futureResponse.ok) {
  throw new Error(
    `Could not retrieve Future Carriage sources (${sourceResponse.status}, ${futureResponse.status}).`,
  );
}

const [sourceBytes, futureBytes] = await Promise.all([
  Buffer.from(await sourceResponse.arrayBuffer()),
  Buffer.from(await futureResponse.arrayBuffer()),
]);

await mkdir(outputRoot, { recursive: true });

const backgroundSvg = (width, height, margin, panelWidth, gap) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#dce2d7"/>
        <stop offset="1" stop-color="#b8c3b8"/>
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#172019"/>
        <stop offset="1" stop-color="#080d0b"/>
      </linearGradient>
      <linearGradient id="bridge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b8c3b8" stop-opacity="0"/>
        <stop offset=".5" stop-color="#d0aa62" stop-opacity=".42"/>
        <stop offset="1" stop-color="#172019" stop-opacity="0"/>
      </linearGradient>
      <pattern id="paperLines" width="36" height="36" patternUnits="userSpaceOnUse">
        <path d="M36 0H0V36" fill="none" stroke="#172019" stroke-opacity=".04"/>
      </pattern>
      <pattern id="roadLines" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#d9e1d8" stroke-opacity=".035"/>
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="#070b09"/>
    <rect x="${margin}" y="${margin}" width="${panelWidth}" height="${height - margin * 2}" rx="18" fill="url(#paper)"/>
    <rect x="${margin}" y="${margin}" width="${panelWidth}" height="${height - margin * 2}" rx="18" fill="url(#paperLines)"/>
    <rect x="${margin + panelWidth + gap}" y="${margin}" width="${panelWidth}" height="${height - margin * 2}" rx="18" fill="url(#road)"/>
    <rect x="${margin + panelWidth + gap}" y="${margin}" width="${panelWidth}" height="${height - margin * 2}" rx="18" fill="url(#roadLines)"/>
    <rect x="${width / 2 - gap * 2.2}" y="${margin}" width="${gap * 4.4}" height="${height - margin * 2}" fill="url(#bridge)"/>
    <path d="M${width / 2} ${margin + 18}V${height - margin - 18}" stroke="#d0aa62" stroke-opacity=".55" stroke-width="2"/>
  </svg>`;

async function buildComposite({ width, height, filename }) {
  const margin = Math.round(width * 0.022);
  const gap = Math.round(width * 0.018);
  const panelWidth = Math.floor((width - margin * 2 - gap) / 2);
  const contentHeight = Math.round(height * 0.5);
  const baseline = Math.round(height * 0.67);

  // This extraction removes unused paper while retaining the complete carriage,
  // wheels, running line, and the source plate's material texture.
  const sourceVehicle = await sharp(sourceBytes)
    .extract({ left: 360, top: 380, width: 2680, height: 1300 })
    .resize({
      width: panelWidth - Math.round(width * 0.045),
      height: contentHeight,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  const futureVehicle = await sharp(futureBytes)
    .resize({
      width: panelWidth - Math.round(width * 0.045),
      height: contentHeight,
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  const [sourceMeta, futureMeta] = await Promise.all([
    sharp(sourceVehicle).metadata(),
    sharp(futureVehicle).metadata(),
  ]);

  const sourceLeft = margin + Math.floor((panelWidth - sourceMeta.width) / 2);
  const futurePanelLeft = margin + panelWidth + gap;
  const futureLeft = futurePanelLeft + Math.floor((panelWidth - futureMeta.width) / 2);

  await sharp(Buffer.from(backgroundSvg(width, height, margin, panelWidth, gap)))
    .composite([
      {
        input: sourceVehicle,
        left: sourceLeft,
        top: baseline - sourceMeta.height,
      },
      {
        input: futureVehicle,
        left: futureLeft,
        top: baseline - futureMeta.height,
      },
    ])
    .webp({ quality: 88, effort: 6 })
    .toFile(resolve(outputRoot, filename));
}

await Promise.all([
  buildComposite({
    width: 1600,
    height: 900,
    filename: "article-hero-4033-source-to-future.webp",
  }),
  buildComposite({
    width: 1200,
    height: 630,
    filename: "article-social-4033-source-to-future.webp",
  }),
]);

console.log("Built the source-to-Future Carriage hero and social derivatives.");
