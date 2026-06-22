// Local dev launcher for `wrangler pages dev`.
//
// Why this exists: @astrojs/cloudflare 13+ targets Cloudflare Workers (with
// Assets), not Pages. `astro build` writes `.wrangler/deploy/config.json`
// that redirects every subsequent wrangler command into the emitted Worker
// at dist/server/wrangler.json. `wrangler pages dev` then tries to boot
// that Worker and fails with `No such module "wrangler:modules-watch"`.
//
// We still need `pages dev` here because functions/api/* is the Pages
// Functions convention; `wrangler dev` (Workers mode) would not discover
// those routes. Long-term fix: migrate functions/api/* into src/pages/api/*
// as Astro endpoints and switch dev to `wrangler dev` on the Astro output.
// Until then, this script:
//   1. Builds dist/ if it's missing.
//   2. Hides .wrangler/deploy/config.json so pages dev runs unredirected.
//   3. Reads compat date + flags from dist/server/wrangler.json so the dev
//      runtime matches what `wrangler deploy` would produce.
//   4. Spawns `wrangler pages dev ./dist/client`, forwarding stdio.
//   5. Restores the redirect on Ctrl+C / child exit, so a follow-up
//      `wrangler deploy` works without rebuilding.

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEPLOY_CONFIG = join(ROOT, ".wrangler", "deploy", "config.json");
const DEPLOY_CONFIG_HIDDEN = `${DEPLOY_CONFIG}.dev-pages-hidden`;
const SERVER_WRANGLER = join(ROOT, "dist", "server", "wrangler.json");
const CLIENT_DIR = join(ROOT, "dist", "client");
const PORT = process.env.PAGES_DEV_PORT ?? "8788";

function buildIfNeeded() {
  if (existsSync(SERVER_WRANGLER) && existsSync(CLIENT_DIR)) return;
  console.log("[dev-pages] dist/ missing — running astro build first...");
  const r = spawnSync("npx", ["astro", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  if (r.status !== 0) {
    console.error("[dev-pages] astro build failed; aborting.");
    process.exit(r.status ?? 1);
  }
}

function readBuildCompat() {
  const cfg = JSON.parse(readFileSync(SERVER_WRANGLER, "utf8"));
  return {
    compatibilityDate: cfg.compatibility_date ?? "2026-03-10",
    compatibilityFlags: Array.isArray(cfg.compatibility_flags) ? cfg.compatibility_flags : [],
  };
}

function restoreRedirect() {
  // Idempotent: safe to call any number of times, including before hide.
  // Recovers state left behind by a hard-killed previous run.
  if (existsSync(DEPLOY_CONFIG_HIDDEN) && !existsSync(DEPLOY_CONFIG)) {
    renameSync(DEPLOY_CONFIG_HIDDEN, DEPLOY_CONFIG);
  }
}

function hideRedirect() {
  if (!existsSync(DEPLOY_CONFIG)) return;
  renameSync(DEPLOY_CONFIG, DEPLOY_CONFIG_HIDDEN);
}

restoreRedirect(); // recover from any prior hard-killed run
buildIfNeeded();
const { compatibilityDate, compatibilityFlags } = readBuildCompat();
hideRedirect();

const args = [
  "wrangler",
  "pages",
  "dev",
  CLIENT_DIR,
  "--port",
  PORT,
  "--compatibility-date",
  compatibilityDate,
];
for (const flag of compatibilityFlags) {
  args.push("--compatibility-flag", flag);
}

console.log(`[dev-pages] npx ${args.join(" ")}`);
const child = spawn("npx", args, { cwd: ROOT, stdio: "inherit", shell: true });

function cleanup(code) {
  restoreRedirect();
  process.exit(typeof code === "number" ? code : 0);
}

process.on("SIGINT", () => cleanup(0));
process.on("SIGTERM", () => cleanup(0));
process.on("exit", () => restoreRedirect());
child.on("exit", (code) => cleanup(code ?? 0));
child.on("error", (err) => {
  console.error(`[dev-pages] failed to spawn wrangler: ${err.message}`);
  cleanup(1);
});
