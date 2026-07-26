import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/i-could-be-playing-civilization.md";
const workflowPath = ".github/workflows/publish-civ-article.yml";
const scheduleScriptPath = "scripts/publish-scheduled-civ-article.mjs";
const manifestPath = "reports/could-be-playing-civ/asset-manifest.json";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function articleWordCount(source) {
  const body = source.split(/^---$/m).slice(2).join("\n");
  const plain = body
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

test("Civilization article preserves the brief, evidence links, and 60-hour schedule", async () => {
  const [article, scheduleScript, workflow] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(scheduleScriptPath, "utf8"),
    readFile(workflowPath, "utf8").catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    }),
  ]);

  const publication = article.match(/^publishedAt:\s*(.+)$/m)?.[1].trim();
  const status = article.match(/^status:\s*(.+)$/m)?.[1].trim();
  assert.ok(publication);
  assert.ok(["scheduled", "published"].includes(status));
  assert.match(
    scheduleScript,
    new RegExp(`expectedPublication = "${escapeRegExp(publication)}"`),
  );

  if (status === "scheduled") {
    assert.ok(workflow, "Scheduled article must retain its one-time workflow.");
    const trigger = new Date(Date.parse(publication) + 5 * 60 * 1000);
    const expectedCron = [
      trigger.getUTCMinutes(),
      trigger.getUTCHours(),
      trigger.getUTCDate(),
      trigger.getUTCMonth() + 1,
      "*",
    ].join(" ");
    assert.match(workflow, new RegExp(`cron: "${escapeRegExp(expectedCron)}"`));
    assert.match(workflow, /node scripts\/publish-scheduled-civ-article\.mjs/);
  } else {
    assert.equal(workflow, null, "Published article should not retain its one-time workflow.");
  }

  assert.match(article, /\[Gary and the Fork\]\(\/articles\/gary-and-the-fork\/\)/);
  assert.match(article, /\[A World of Geniuses Needs a System\]\(\/articles\/a-world-of-geniuses-needs-a-system\/\)/);
  assert.match(article, /\[You Do Not Own the AI You Pay For\]\(\/articles\/you-do-not-own-the-ai-you-pay-for\/\)/);
  assert.match(article, /\[Other Alice Adventures\]\(\/departments\/hobfarm-presents\/other-alice-adventures\/\)/);
  assert.match(article, /human-directed externalized correction/i);
  assert.match(article, /learn\.chatgpt\.com\/docs\/agent-configuration\/agents-md/);
  assert.match(article, /learn\.chatgpt\.com\/docs\/build-skills/);
  assert.match(article, /status\.claude\.com/);

  const words = articleWordCount(article);
  assert.ok(words >= 1800 && words <= 2800, `Article word count ${words} is outside the brief.`);
});

test("Civilization article media is verified, immutable PNG under the requested prefix", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/could-be-playing-civ/"]);
  assert.equal(manifest.assets.length, 4);

  for (const asset of manifest.assets) {
    assert.match(asset.destination_key, /^articles\/could-be-playing-civ\/.+\.png$/);
    assert.equal(asset.upload_status, "uploaded");
    assert.equal(asset.verification_status, "verified");
    assert.equal(asset.http_status, 200);
    assert.equal(asset.verified_content_type, "image/png");
    assert.equal(asset.verified_cache_control, "public, max-age=31536000, immutable");
    assert.equal(asset.remote_sha256, asset.sha256);
    assert.equal(asset.public_response_sha256, asset.sha256);

    const bytes = await readFile(asset.source_file);
    assert.equal(bytes.length, asset.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
  }
});
