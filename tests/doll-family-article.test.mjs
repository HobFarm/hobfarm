import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/they-had-names-doll-family.mdx";
const sourcesPath = "src/components/articles/doll-family/DollSources.astro";
const manifestPath = "reports/doll-family/asset-manifest.json";

test("Doll Family article is complete and published", async () => {
  const [article, sources] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(sourcesPath, "utf8"),
  ]);

  assert.match(article, /^publishedAt: 2026-07-26T23:40:00-07:00$/m);
  assert.match(article, /^status: published$/m);
  assert.match(article, /i-am-coming-col-wf-cody\.jpg/);
  assert.match(article, /harry-earles-olga-baclanova-freaks-1932\.jpg/);
  assert.doesNotMatch(article, /harry-earles-leila-hyams-freaks-1932\.jpg/);
  assert.doesNotMatch(article, /\[\^\d+\]/);

  for (let sourceNumber = 1; sourceNumber <= 23; sourceNumber += 1) {
    assert.match(article, new RegExp(`<SourceRef n=\\{${sourceNumber}\\} \\/>`));
    assert.match(sources, new RegExp(`id="source-${sourceNumber}"`));
  }
});

test("Doll Family upload manifest records six verified new-key assets", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/doll-family/"]);
  assert.equal(manifest.assets.length, 6);

  for (const asset of manifest.assets) {
    assert.match(asset.destination_key, /^articles\/doll-family\//);
    assert.equal(asset.upload_status, "uploaded");
    assert.equal(asset.verification_status, "verified");
    assert.equal(asset.http_status, 200);
    assert.equal(asset.verified_content_type, "image/jpeg");
    assert.equal(asset.remote_sha256, asset.sha256);
    assert.equal(asset.public_response_sha256, asset.sha256);

    const bytes = await readFile(asset.source_file);
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
  }
});
