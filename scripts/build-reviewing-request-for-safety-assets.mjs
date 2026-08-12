import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const sourceRoot = resolve("_cdn/articles/reviewing-request-for-safety/source");
const diagramRoot = resolve("assets/reviewing-request-for-safety/diagrams");
const outputRoot = resolve("assets/reviewing-request-for-safety");

await mkdir(outputRoot, { recursive: true });

await sharp(resolve(diagramRoot, "01-hero-reviewing-request-for-safety.svg"), {
  density: 192,
})
  .resize(1600, 1000, { fit: "fill" })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(outputRoot, "hero-v2.webp"));

await sharp(resolve(diagramRoot, "01-hero-reviewing-request-for-safety.svg"), {
  density: 192,
})
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(outputRoot, "social-v2.webp"));

await sharp(resolve(sourceRoot, "experiment-contact-sheet.png"))
  .resize({ width: 1800, withoutEnlargement: true })
  .webp({ quality: 88, effort: 6 })
  .toFile(resolve(outputRoot, "experiment-contact-sheet.webp"));

console.log("Built Reviewing Request for Safety publication derivatives.");
