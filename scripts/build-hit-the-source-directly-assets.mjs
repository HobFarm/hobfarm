import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = resolve("assets/hit-the-source-directly");
const heroSource = resolve(root, "diagrams/01-direct-line.svg");
const suppliedIllustration = resolve(
  "_cdn/articles/hit-the-source-directly/source/engagement-factory-illustration-original.png",
);

await mkdir(root, { recursive: true });

await sharp(heroSource, { density: 192 })
  .resize(1600, 900, { fit: "fill" })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(root, "hero.webp"));

await sharp(heroSource, { density: 192 })
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .webp({ quality: 90, effort: 6 })
  .toFile(resolve(root, "social.webp"));

await sharp(suppliedIllustration)
  .rotate()
  .resize({ width: 1491, withoutEnlargement: true })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "engagement-factory-illustration-v2.webp"));

await sharp(suppliedIllustration)
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "north" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "social-illustrated-v2.webp"));

console.log("Built Hit the Source Directly publication derivatives.");
