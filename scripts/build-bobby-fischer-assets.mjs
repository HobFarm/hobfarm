import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const articleSlug = "who-the-hell-is-bobby-fischer";
const outputRoot = resolve("public/articles", articleSlug);
const reportRoot = resolve("reports", articleSlug);
const originalPath = resolve(outputRoot, "bobby-fischer-hero-original.png");

await mkdir(outputRoot, { recursive: true });
await mkdir(reportRoot, { recursive: true });

const outputs = [
  {
    filename: "bobby-fischer-hero.webp",
    width: 1600,
    height: 900,
    position: "centre",
    quality: 88,
    role: "article hero",
  },
  {
    filename: "bobby-fischer-social.webp",
    width: 1200,
    height: 630,
    position: "centre",
    quality: 88,
    role: "social preview",
  },
  {
    filename: "bobby-fischer-thumbnail.webp",
    width: 800,
    height: 450,
    position: "centre",
    quality: 84,
    role: "article thumbnail",
  },
];

for (const output of outputs) {
  await sharp(originalPath)
    .resize(output.width, output.height, { fit: "cover", position: output.position })
    .webp({ quality: output.quality, smartSubsample: true })
    .toFile(resolve(outputRoot, output.filename));
}

async function fileRecord(path, publicPath, role) {
  const contents = await readFile(path);
  const details = await stat(path);
  const metadata = await sharp(path).metadata();
  return {
    role,
    publicPath,
    bytes: details.size,
    width: metadata.width,
    height: metadata.height,
    sha256: createHash("sha256").update(contents).digest("hex"),
  };
}

const manifest = {
  article: articleSlug,
  generatedAt: new Date().toISOString(),
  source: {
    path: `/articles/${articleSlug}/bobby-fischer-hero-original.png`,
    origin: "Original editorial illustration generated with OpenAI image generation for this article.",
    treatment: "No factual labels or headline are baked into the raster. Published derivatives are center-cropped WebP files.",
  },
  files: await Promise.all(outputs.map((output) => fileRecord(
    resolve(outputRoot, output.filename),
    `/articles/${articleSlug}/${output.filename}`,
    output.role,
  ))),
  codeNativeFigures: [
    "Chess skill: pattern recognition and selective search",
    "July 1972 FIDE top ten",
    "Chess as public metaphor, 1972 to now",
    "Broadcast fame versus personalized routing",
  ],
};

await writeFile(
  resolve(reportRoot, "asset-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Built ${outputs.length} Bobby Fischer article assets.`);
