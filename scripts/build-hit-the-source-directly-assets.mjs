import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve("assets/hit-the-source-directly");
const heroSource = resolve(root, "diagrams/01-direct-line.svg");

await mkdir(root, { recursive: true });

await sharp(heroSource, { density: 192 })
  .resize(1600, 900, { fit: "fill" })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(root, "hero.webp"));

await sharp(heroSource, { density: 192 })
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(root, "social.webp"));

console.log("Built Hit the Source Directly publication derivatives.");
