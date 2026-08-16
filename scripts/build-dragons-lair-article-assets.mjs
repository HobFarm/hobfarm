import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const slug = "dragons-lair-was-better-once-we-stopped-playing-it";
const root = resolve(`assets/${slug}`);
const source = resolve(root, "hero.svg");

await mkdir(root, { recursive: true });

await sharp(source, { density: 180 })
  .resize(1600, 900, { fit: "fill" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "hero.webp"));

await sharp(source, { density: 180 })
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "social.webp"));

console.log("Built Dragon's Lair article hero and social derivatives.");
