import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const slug = "the-feed-is-the-problem";
const root = resolve(`assets/${slug}`);
const source = resolve(root, "hero.svg");

await mkdir(root, { recursive: true });

await sharp(source, { density: 180 })
  .resize(1600, 900, { fit: "cover" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "hero.webp"));

await sharp(source, { density: 180 })
  .resize(1200, 630, { fit: "contain", background: "#090a12" })
  .webp({ quality: 92, effort: 6 })
  .toFile(resolve(root, "social.webp"));

console.log("Built The Feed Is the Problem hero and social derivatives.");
