import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/you-should-write-about-sharks.mdx";
const sharksploitationPath = "src/content/articles/sharksploitation.mdx";
const manifestPath =
  "reports/you-should-write-about-sharks/asset-manifest.json";

const field = (source, name) =>
  source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();

function articleWordCount(article) {
  const body = article
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^import .*$/gm, "")
    .replace(/^\[\^[^\]]+\]:.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[\^.*?\]/g, "")
    .replace(/[#*_`>]/g, " ");
  return body.match(/[\p{L}\p{N}][\p{L}\p{N}’'–—-]*/gu)?.length ?? 0;
}

test("You Should Write About Sharks published after Sharksploitation", async () => {
  const [article, sharksploitation] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(sharksploitationPath, "utf8"),
  ]);

  assert.equal(field(article, "department"), "workshop-notes");
  assert.equal(field(article, "format"), "workshop-note");
  assert.equal(field(article, "pubDate"), "2026-08-08");
  assert.equal(field(article, "publishedAt"), "2026-08-08T16:20:00-07:00");
  assert.equal(field(article, "status"), "published");
  assert.equal(field(article, "draft"), "false");
  assert.equal(
    Date.parse(field(article, "publishedAt")) -
      Date.parse(field(sharksploitation, "publishedAt")),
    24 * 60 * 60 * 1000,
  );

  const wordCount = articleWordCount(article);
  assert.ok(wordCount >= 1800 && wordCount <= 2500, `article word count is ${wordCount}`);
});

test("the Workshop Note preserves the requested route, branches, and public boundary", async () => {
  const article = await readFile(articlePath, "utf8");

  assert.match(article, /I type a lot of shit into a box\./);
  assert.match(article, /The box is the interface\. The process is everything connected to it\./);
  assert.match(article, /<DarkStarRoute \/>/);
  assert.match(article, /<RouteBranchCut \/>/);
  assert.match(article, /<SharknadoPoster \/>/);
  assert.match(article, /<NodeMesh \/>/);
  assert.match(article, /<SharksploitationEvidence \/>/);
  assert.match(article, /six films have been released/);
  assert.match(article, /I could not verify a completed release or firm date/);
  assert.match(article, /Salvador Dalí/);
  assert.doesNotMatch(article, /contentWarnings|Content note:|fair-use disclaimer/i);
  assert.doesNotMatch(article, /[A-Z]:\\|\.github\/workflows|src\/content|asset-manifest/i);
});

test("article upload assets are verified and carry dimensions, rights, and provenance", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.generation.mode, "stylized-concept");
  assert.equal(manifest.generation.reference_images.length, 1);
  assert.ok(manifest.generation.exact_prompt);

  for (const asset of manifest.assets) {
    await access(asset.source_file);
    assert.ok(asset.width > 0);
    assert.ok(asset.height > 0);
    assert.ok(asset.rights_basis);
    assert.equal(asset.upload_status, "uploaded");
    assert.equal(asset.verification_status, "verified");
    assert.equal(asset.http_status, 200);
    assert.equal(asset.remote_sha256, asset.sha256);
    assert.equal(asset.public_response_sha256, asset.sha256);
  }

  assert.ok(manifest.upload_completed_at);
});
