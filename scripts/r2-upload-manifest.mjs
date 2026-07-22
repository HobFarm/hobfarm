import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const args = process.argv.slice(2);
const upload = args.includes("--upload");
const resume = args.includes("--resume");
const manifestFlag = args.indexOf("--manifest");
const manifestPath = resolve(
  root,
  manifestFlag >= 0 ? args[manifestFlag + 1] : "reports/intellectual-self-defense-asset-manifest.json",
);
const wranglerCli = join(root, "node_modules", "wrangler", "bin", "wrangler.js");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (!manifest.policy?.new_keys_only || manifest.policy?.overwrite_existing !== false) {
  throw new Error("Manifest must require new keys and forbid overwrites.");
}

const expectedMime = {
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

function wrangler(parts, binary = false) {
  return spawnSync(process.execPath, [wranglerCli, ...parts], {
    cwd: root,
    encoding: binary ? null : "utf8",
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
}

function objectExists(bucket, key) {
  const result = wrangler(["r2", "object", "get", `${bucket}/${key}`, "--remote", "--pipe"], true);
  if (result.status === 0) return true;
  const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : String(result.stderr ?? "");
  if (stderr.includes("specified key does not exist")) return false;
  throw new Error(`Could not check ${bucket}/${key}: ${result.error?.message ?? stderr.trim() ?? `exit ${result.status}`}`);
}

function existingObjectMatches(item) {
  const result = wrangler(["r2", "object", "get", `${manifest.bucket}/${item.destination_key}`, "--remote", "--pipe"], true);
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : String(result.stderr ?? "");
    throw new Error(`Could not read existing object ${item.destination_key}: ${stderr.trim()}`);
  }
  const remoteSha256 = createHash("sha256").update(result.stdout).digest("hex");
  if (remoteSha256 !== item.sha256) {
    throw new Error(`Existing key has a different checksum; refusing to overwrite: ${item.destination_key}`);
  }
  return remoteSha256;
}

function sourcePath(item) {
  const absolute = isAbsolute(item.source_file) ? normalize(item.source_file) : resolve(root, item.source_file);
  const withinRoot = relative(root, absolute);
  if (withinRoot.startsWith("..") || isAbsolute(withinRoot)) {
    throw new Error(`Source is outside the repository: ${item.source_file}`);
  }
  return absolute;
}

const pause = (milliseconds) => new Promise((resolvePause) => setTimeout(resolvePause, milliseconds));

async function fetchVerifiedObject(item) {
  let lastFailure;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const cacheBust = `verify=${item.sha256.slice(0, 16)}-${attempt}`;
    const url = `${item.public_url}?${cacheBust}`;
    const head = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      headers: { "cache-control": "no-cache" },
    });
    const responseType = head.headers.get("content-type") ?? "";
    if (head.ok && responseType.toLowerCase().startsWith(item.content_type.split(";")[0])) {
      if (item.content_type.startsWith("text/html")) {
        const response = await fetch(url, {
          cache: "no-store",
          headers: { "cache-control": "no-cache" },
        });
        const publicBytes = Buffer.from(await response.arrayBuffer());
        if (response.ok && publicBytes.length > 0) {
          return {
            head,
            responseType,
            remoteSha256: existingObjectMatches(item),
            publicResponseSha256: createHash("sha256").update(publicBytes).digest("hex"),
            edgeTransformed: true,
          };
        }
      }
      const response = await fetch(url, {
        cache: "no-store",
        headers: { "cache-control": "no-cache" },
      });
      const remoteBytes = Buffer.from(await response.arrayBuffer());
      const remoteSha256 = createHash("sha256").update(remoteBytes).digest("hex");
      if (response.ok && remoteSha256 === item.sha256) {
        return { head, responseType, remoteSha256, publicResponseSha256: remoteSha256, edgeTransformed: false };
      }
      lastFailure = `checksum ${remoteSha256}`;
    } else {
      lastFailure = `HTTP ${head.status}, content-type ${responseType || "missing"}`;
    }
    await pause(1000 * attempt);
  }
  throw new Error(`Public verification failed for ${item.public_url}: ${lastFailure}`);
}

async function validateItem(item) {
  if (item.destination_bucket !== manifest.bucket) {
    throw new Error(`Bucket mismatch for ${item.destination_key}`);
  }
  if (!manifest.policy.allowed_prefixes.some((prefix) => item.destination_key.startsWith(prefix))) {
    throw new Error(`Destination is outside allowed prefixes: ${item.destination_key}`);
  }
  if (item.public_url !== `${manifest.public_hostname}/${item.destination_key}`) {
    throw new Error(`Public URL/key mismatch for ${item.destination_key}`);
  }
  const expected = expectedMime[extname(item.source_file).toLowerCase()];
  if (item.content_type !== expected) {
    throw new Error(`MIME mismatch for ${item.source_file}: ${item.content_type} !== ${expected}`);
  }
  const bytes = await readFile(sourcePath(item));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== item.bytes || sha256 !== item.sha256) {
    throw new Error(`Local file changed after manifest generation: ${item.source_file}`);
  }
}

console.log(`${upload ? resume ? "RESUME" : "UPLOAD" : "DRY RUN"}: ${manifest.assets.length} manifest assets`);

for (const item of manifest.assets) {
  await validateItem(item);
  if (objectExists(manifest.bucket, item.destination_key)) {
    if (resume) {
      item.remote_sha256 = existingObjectMatches(item);
      item.upload_status = "uploaded";
      if (item.verification_status !== "verified") {
        item.verification_status = "r2-checksum-matched";
      }
      console.log(`ADOPT ${item.destination_key}`);
      continue;
    }
    item.upload_status = "conflict-existing-key";
    item.verification_status = "blocked";
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    throw new Error(`Refusing to overwrite existing key: ${item.destination_key}`);
  }
  item.upload_status = "ready";
  item.verification_status = "destination-absent";
  console.log(`READY ${item.destination_key}`);
}

manifest.dry_run_at = new Date().toISOString();
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

if (!upload) {
  console.log("Dry run complete. No remote objects were written.");
  process.exit(0);
}

for (const item of manifest.assets) {
  if (objectExists(manifest.bucket, item.destination_key)) {
    if (!resume) {
      throw new Error(`Key appeared after dry run; refusing upload: ${item.destination_key}`);
    }
    item.remote_sha256 = existingObjectMatches(item);
    item.upload_status = "uploaded";
    if (item.verification_status === "verified") {
      console.log(`PRESERVED ${item.public_url}`);
      continue;
    }
  } else {
    const put = wrangler([
      "r2",
      "object",
      "put",
      `${manifest.bucket}/${item.destination_key}`,
      "--remote",
      "--file",
      sourcePath(item),
      "--content-type",
      item.content_type,
      "--cache-control",
      "public, max-age=31536000, immutable",
    ]);
    if (put.status !== 0) {
      item.upload_status = "upload-failed";
      item.verification_status = "not-verified";
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      throw new Error(`Upload failed for ${item.destination_key}: ${put.stderr}`);
    }
    item.upload_status = "uploaded";
    item.remote_sha256 = existingObjectMatches(item);
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  let verification;
  try {
    verification = await fetchVerifiedObject(item);
  } catch (error) {
    item.verification_status = "head-failed";
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    throw error;
  }

  item.verification_status = "verified";
  item.http_status = verification.head.status;
  item.verified_content_type = verification.responseType;
  item.verified_cache_control = verification.head.headers.get("cache-control");
  item.remote_sha256 = verification.remoteSha256;
  item.public_response_sha256 = verification.publicResponseSha256;
  item.edge_transformed = verification.edgeTransformed;
  item.verified_at = new Date().toISOString();
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`VERIFIED ${item.public_url}`);
}

manifest.upload_completed_at = new Date().toISOString();
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Upload and verification complete.");
