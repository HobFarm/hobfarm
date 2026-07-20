import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = join(root, "video", "workshop-process-film");
const manifest = JSON.parse(
  readFileSync(join(root, "src", "data", "workshop-process-film.json"), "utf8"),
);
const sharedFiles = ["composition.css", "composition.js"];
const localRenderAssets = [
  ["public/media/workshop/psygoth/zima-primary.mp4", "zima-primary.mp4"],
  ["public/media/workshop/psygoth/zima-primary.webp", "zima-primary.webp"],
  ["video/workshop-process-film/source/psygoth-zima-blue-v2.png", "psygoth-zima-blue-v2.png"],
];
const avatarFrameCount = 10;

function writeAvatarFrames(source, destination) {
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-hide_banner",
      "-loglevel", "error",
      "-ss", "0.8",
      "-i", source,
      "-vf", "fps=2",
      "-frames:v", String(avatarFrameCount),
      "-q:v", "3",
      join(destination, "zima-avatar-frame-%02d.jpg"),
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    throw new Error(`FFmpeg could not prepare the avatar frame sequence: ${result.stderr || result.error}`);
  }
}

for (const variant of ["vertical", "wide"]) {
  const destination = join(project, variant);
  mkdirSync(destination, { recursive: true });
  writeFileSync(
    join(destination, "manifest.js"),
    `window.WORKSHOP_PROCESS_FILM = Object.freeze(${JSON.stringify(manifest, null, 2)});\n`,
  );
  for (const file of sharedFiles) {
    copyFileSync(join(project, "shared", file), join(destination, file));
  }
  const assetsDirectory = join(destination, "assets");
  mkdirSync(assetsDirectory, { recursive: true });
  for (const [source, filename] of localRenderAssets) {
    copyFileSync(join(root, source), join(assetsDirectory, filename));
  }
  writeAvatarFrames(
    join(root, "public/media/workshop/psygoth/zima-primary.mp4"),
    assetsDirectory,
  );
}

console.log(`Synced Workshop Process Film ${manifest.id} to vertical and wide compositions.`);
