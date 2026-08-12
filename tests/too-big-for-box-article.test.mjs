import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/too-big-for-the-box.md";
const sourceArticlePath =
  "src/content/articles/i-could-be-playing-civilization.md";
const manifestPath = "reports/too-big-for-box/asset-manifest.json";
const referenceManifestPath =
  "reports/too-big-for-box/reference-manifest.json";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

function articleWordCount(source) {
  const body = source.split(/^---$/m).slice(2).join("\n");
  const plain = body
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

test("Too Big for the Box is exactly 24 hours after the Civilization article", async () => {
  const [article, sourceArticle] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(sourceArticlePath, "utf8"),
  ]);

  const publication = field(article, "publishedAt");
  const sourcePublication = field(sourceArticle, "publishedAt");
  const status = field(article, "status");

  assert.ok(publication);
  assert.ok(sourcePublication);
  assert.equal(
    Date.parse(publication) - Date.parse(sourcePublication),
    24 * 60 * 60 * 1000,
  );
  assert.equal(publication.slice(-6), sourcePublication.slice(-6));
  assert.equal(publication.slice(11, 19), sourcePublication.slice(11, 19));
  assert.equal(field(article, "pubDate"), "2026-07-29");
  assert.ok(["scheduled", "published"].includes(status));
});

test("article preserves the scaffold, evidence limits, links, and graphics", async () => {
  const article = await readFile(articlePath, "utf8");
  const body = article.split(/^---$/m).slice(2).join("\n");
  const requiredLinks = [
    "/articles/everything-is-still-loading/",
    "/articles/take-me-to-phobos/",
    "/articles/gonna-be-different/",
    "/articles/i-could-be-playing-civilization/",
    "/articles/you-do-not-own-the-ai-you-pay-for/",
    "/articles/a-world-of-geniuses-needs-a-system/",
    "/articles/against-slop/",
    "/articles/how-to-fix-slop/",
    "/articles/how-psychedelia-went-beige/",
  ];
  const requiredAssets = [
    "where-the-game-lives.svg",
    "the-box-empties.svg",
    "bounded-wonder-machine.svg",
    "dark-factory-bullshit-factory.svg",
    "claude-solved-capitalism-montage.png",
  ];

  assert.equal(body.match(/^## /gm)?.length, 15);
  assert.equal(body.match(/<figure class="article-wide">/g)?.length, 5);
  assert.equal(
    body.match(/Open the full-size graphic\./g)?.length,
    5,
    "Each dense graphic needs a mobile-friendly full-size link.",
  );

  for (const href of requiredLinks) {
    assert.ok(article.includes(`](${href})`), `Missing required link ${href}`);
  }
  for (const filename of requiredAssets) {
    assert.ok(article.includes(filename), `Missing required visual ${filename}`);
  }

  assert.match(article, /Blank input sounds trivial/i);
  assert.match(article, /waiting is explicit/i);
  assert.match(article, /pack stays immutable/i);
  assert.match(article, /same seed and the same action sequence/i);
  assert.match(article, /contains a download code and no disc/i);
  assert.match(article, /do not know whether each claim is accurate/i);
  assert.match(article, /not a deployed public cloud game/i);

  const words = articleWordCount(article);
  assert.ok(
    words >= 4500 && words <= 7000,
    `Article word count ${words} is outside the brief.`,
  );
});

test("article media and supplied screenshot evidence remain hash-verifiable", async () => {
  const [manifest, referenceManifest] = await Promise.all([
    readFile(manifestPath, "utf8").then(JSON.parse),
    readFile(referenceManifestPath, "utf8").then(JSON.parse),
  ]);

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, [
    "articles/too-big-for-box/",
  ]);
  assert.equal(manifest.assets.length, 6);
  assert.equal(referenceManifest.references.length, 7);

  for (const asset of manifest.assets) {
    assert.match(
      asset.destination_key,
      /^articles\/too-big-for-box\/.+\.(?:jpg|png|svg)$/,
    );
    assert.equal(asset.upload_status, "uploaded");
    assert.equal(asset.verification_status, "verified");
    assert.equal(asset.http_status, 200);
    assert.equal(asset.verified_content_type, asset.content_type);
    assert.equal(
      asset.verified_cache_control,
      "public, max-age=31536000, immutable",
    );
    assert.equal(asset.remote_sha256, asset.sha256);
    assert.equal(asset.public_response_sha256, asset.sha256);
    const bytes = await readFile(asset.source_file);
    assert.equal(bytes.length, asset.bytes);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
    );
  }

  for (const reference of referenceManifest.references) {
    assert.equal(reference.published_individually, false);
    const bytes = await readFile(reference.source_file);
    assert.equal(bytes.length, reference.bytes);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      reference.sha256,
    );
  }
});
