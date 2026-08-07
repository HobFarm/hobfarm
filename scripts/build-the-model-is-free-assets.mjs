import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const sourceRoot = resolve("_cdn/articles/the-model-is-free/source");
const outputRoot = resolve("assets/the-model-is-free");

await mkdir(outputRoot, { recursive: true });

await sharp(resolve(sourceRoot, "the-model-is-free-hero-master.png"))
  .resize(1600, 900, { fit: "cover", position: "centre" })
  .webp({ quality: 88, effort: 6 })
  .toFile(resolve(outputRoot, "hero.webp"));

await sharp(resolve(sourceRoot, "the-model-is-free-hero-master.png"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .webp({ quality: 88, effort: 6 })
  .toFile(resolve(outputRoot, "social.webp"));

await sharp(resolve(sourceRoot, "a16z-open-weights-feed-original.png"))
  .webp({ quality: 86, effort: 6 })
  .toFile(resolve(outputRoot, "a16z-open-weights-feed.webp"));

console.log("Built The Model Is Free publication derivatives.");
