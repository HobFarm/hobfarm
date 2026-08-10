import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import sharp from "sharp";

const expectedSource = {
  width: 1672,
  height: 941,
  bytes: 3128168,
  sha256: "98b037373f5772c97f564d85c0bc9bbe9cddd430c863e9018180db9cc12b5abe",
};

const outputRoot = resolve(".tmp/songs-we-learned-backwards-upload");
const preservedSource = resolve(outputRoot, "songs-we-learned-backwards-hero-source-v1.png");
const sourceFlag = process.argv.indexOf("--source");
const requestedSource = sourceFlag >= 0 ? process.argv[sourceFlag + 1] : preservedSource;

if (!requestedSource) {
  throw new Error("--source needs a PNG path.");
}

const source = isAbsolute(requestedSource) ? requestedSource : resolve(requestedSource);
await mkdir(outputRoot, { recursive: true });

if (source !== preservedSource) {
  await copyFile(source, preservedSource);
}

const [sourceBytes, sourceDetails, sourceMetadata] = await Promise.all([
  readFile(preservedSource),
  stat(preservedSource),
  sharp(preservedSource).metadata(),
]);
const sourceSha256 = createHash("sha256").update(sourceBytes).digest("hex");

if (
  sourceDetails.size !== expectedSource.bytes ||
  sourceSha256 !== expectedSource.sha256 ||
  sourceMetadata.width !== expectedSource.width ||
  sourceMetadata.height !== expectedSource.height
) {
  throw new Error("The supplied hero does not match the approved source PNG.");
}

const outputs = [
  {
    path: resolve(outputRoot, "songs-we-learned-backwards-hero-v1.webp"),
    width: 1600,
    height: 900,
    fit: "fill",
  },
  {
    path: resolve(outputRoot, "songs-we-learned-backwards-social-v1.webp"),
    width: 1200,
    height: 630,
    fit: "cover",
  },
];

for (const output of outputs) {
  await sharp(preservedSource)
    .resize({
      width: output.width,
      height: output.height,
      fit: output.fit,
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(output.path);

  const metadata = await sharp(output.path).metadata();
  if (metadata.width !== output.width || metadata.height !== output.height || metadata.format !== "webp") {
    throw new Error(`Unexpected derivative metadata for ${output.path}`);
  }
  console.log(`Built ${output.path} (${metadata.width}x${metadata.height})`);
}

console.log(`Preserved approved source ${preservedSource}`);
