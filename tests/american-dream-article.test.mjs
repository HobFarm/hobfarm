import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath =
  "src/content/articles/fear-and-loathing-after-the-american-dream.mdx";
const workflowPath = ".github/workflows/publish-american-dream.yml";
const scriptPath = "scripts/publish-scheduled-american-dream.mjs";
const manifestPath = "reports/american-dream/asset-manifest.json";

const field = (source, name) =>
  source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();

test("American Dream source article is complete and scheduled for August 5", async () => {
  const [article, workflow, script] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(workflowPath, "utf8"),
    readFile(scriptPath, "utf8"),
  ]);

  assert.equal(field(article, "pubDate"), "2026-08-05");
  assert.equal(field(article, "publishedAt"), "2026-08-05T16:20:00-07:00");
  assert.equal(field(article, "status"), "scheduled");
  assert.equal(field(article, "draft"), "false");
  assert.match(workflow, /cron: "25 23 5 8 \*"/);
  assert.match(workflow, /node scripts\/publish-scheduled-american-dream\.mjs/);
  assert.match(script, /2026-08-05T16:20:00-07:00/);
  assert.match(article, /## Building a Small Replacement/);
  assert.match(article, /## Sources and further viewing/);
  assert.doesNotMatch(article, /<!-- (?:IMAGE|VIDEO EMBED|HERO|OPTIONAL GALLERY)/);
});

test("American Dream article publishes only selected, verified media", async () => {
  const [article, manifestSource] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);

  assert.equal(manifest.assets.length, 13);
  for (const asset of manifest.assets) {
    assert.equal(asset.upload_status, "uploaded");
    assert.equal(asset.verification_status, "verified");
    assert.match(article, new RegExp(asset.destination_key.split("/").at(-1).replaceAll(".", "\\.")));
  }

  assert.doesNotMatch(article, /source-artifacts|route66-trading-post-with-car|crash-(?:white-suv|black-car)/);
  assert.match(article, /I never learned what happened to the people involved/);
  assert.match(article, /rescheduling, not national recreational legalization/);
  assert.match(article, /someone I know who works in casino security/i);
});
