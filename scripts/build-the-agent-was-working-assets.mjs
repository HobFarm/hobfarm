import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const slug = "the-agent-was-working";
const root = resolve(`assets/${slug}`);
const heroSource = resolve(root, "hero.svg");
const screenshotUrl = "https://cdn.hob.farm/articles/hobbot/hobbot-moltbook.png";
const expectedScreenshotSha256 = "c2e7c82067a563eed1c3d210dcaafeff51e91f773575b291743510094910aaf2";

await mkdir(root, { recursive: true });

const heroCanvas = await sharp(heroSource, { density: 180 })
  .resize(1600, 900, { fit: "fill" })
  .png()
  .toBuffer();

await sharp(heroCanvas)
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "its-so-agentic-hero-v1.webp"));

await sharp(heroCanvas)
  .resize(1200, 630, { fit: "contain", background: "#0b0c0e" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "its-so-agentic-social-v1.webp"));

await sharp(heroCanvas)
  .extract({ left: 350, top: 0, width: 900, height: 900 })
  .resize(1080, 1080, { fit: "fill" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "its-so-agentic-square-v1.webp"));

const verticalCanvas = await sharp(heroCanvas)
  .extract({ left: 470, top: 0, width: 474, height: 705 })
  .extend({ top: 69, bottom: 69, left: 0, right: 0, background: "#0b0c0e" })
  .png()
  .toBuffer();

await sharp(verticalCanvas)
  .resize(1080, 1920, { fit: "fill" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "its-so-agentic-vertical-v2.webp"));

const response = await fetch(screenshotUrl, { headers: { "cache-control": "no-cache" } });
if (!response.ok) throw new Error(`Could not fetch documentary screenshot: HTTP ${response.status}`);
const screenshot = Buffer.from(await response.arrayBuffer());
const screenshotSha256 = createHash("sha256").update(screenshot).digest("hex");
if (screenshotSha256 !== expectedScreenshotSha256) {
  throw new Error(`Documentary screenshot changed: ${screenshotSha256}`);
}

const metadata = await sharp(screenshot).metadata();
if (metadata.width !== 1524 || metadata.height !== 4549) {
  throw new Error(`Unexpected documentary screenshot dimensions: ${metadata.width}x${metadata.height}`);
}

await sharp(screenshot)
  .extract({ left: 0, top: 0, width: 1524, height: 1880 })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(root, "hobbot-moltbook-profile-top-v1.webp"));

console.log("Built It's so agentic hero, social derivatives, and native-resolution Moltbook crop.");
