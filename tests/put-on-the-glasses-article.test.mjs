import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/put-on-the-glasses.md";
const sourceArticlePath = "src/content/articles/too-big-for-the-box.md";
const workflowPath = ".github/workflows/publish-put-on-the-glasses.yml";
const scheduleScriptPath =
  "scripts/publish-scheduled-put-on-the-glasses.mjs";
const manifestPath = "reports/put-on-the-glasses/asset-manifest.json";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

function articleWordCount(source) {
  const body = source.split(/^---$/m).slice(2).join("\n");
  const plain = body
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`>|~-]/g, " ");
  return plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu)?.length ?? 0;
}

test("Put On the Glasses is exactly 24 hours after Too Big for the Box", async () => {
  const [article, sourceArticle, scheduleScript, workflow] =
    await Promise.all([
      readFile(articlePath, "utf8"),
      readFile(sourceArticlePath, "utf8"),
      readFile(scheduleScriptPath, "utf8"),
      readFile(workflowPath, "utf8").catch((error) => {
        if (error.code === "ENOENT") return null;
        throw error;
      }),
    ]);

  const publication = field(article, "publishedAt");
  const sourcePublication = field(sourceArticle, "publishedAt");
  const status = field(article, "status");

  assert.equal(publication, "2026-07-30T17:20:00-07:00");
  assert.ok(sourcePublication);
  assert.equal(
    Date.parse(publication) - Date.parse(sourcePublication),
    24 * 60 * 60 * 1000,
  );
  assert.equal(publication.slice(-6), sourcePublication.slice(-6));
  assert.equal(publication.slice(11, 19), sourcePublication.slice(11, 19));
  assert.equal(field(article, "pubDate"), "2026-07-30");
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
    assert.match(
      workflow,
      /node scripts\/publish-scheduled-put-on-the-glasses\.mjs/,
    );
  } else {
    assert.equal(
      workflow,
      null,
      "Published article should not retain its one-time workflow.",
    );
  }
});

test("article preserves the requested structure, facts, links, and media", async () => {
  const article = await readFile(articlePath, "utf8");
  const body = article.split(/^---$/m).slice(2).join("\n");
  const suppliedFrames = [
    "they-live.png",
    "they-live1.png",
    "they-live-glasses1.png",
    "they-live-glasses2.png",
    "they-live-glasses3.png",
    "they-live-sign1_a.png",
    "they-live-sign1_b.png",
    "they-live-sign2_a.png",
    "they-live-sign2_b.png",
  ];
  const requiredLinks = [
    "/articles/too-big-for-the-box/",
    "/articles/brought-to-you-by-they-inc/",
    "/articles/the-card-catalog-started-talking-back/",
  ];

  assert.equal(field(article, "title"), '"Put On the Glasses"');
  assert.equal(field(article, "department"), "essays-arguments");
  assert.equal(field(article, "format"), "article");
  assert.equal(body.match(/^## /gm)?.length, 10);
  assert.equal(body.match(/class="article-grid article-comparison"/g)?.length, 3);
  assert.equal(body.includes("—"), false, "Public prose must not use em dashes.");

  const words = articleWordCount(article);
  assert.ok(
    words >= 3500 && words <= 5500,
    `Article word count ${words} is outside the brief.`,
  );

  for (const href of requiredLinks) {
    assert.ok(article.includes(`](${href})`), `Missing required link ${href}`);
  }
  for (const filename of suppliedFrames) {
    assert.ok(
      article.includes(
        `https://cdn.hob.farm/articles/they-live/${filename}`,
      ),
      `Missing supplied frame ${filename}`,
    );
  }

  assert.match(body, /“Open-source glasses” is my metaphor\./);
  assert.match(body, /personal recollection, not a recovered artifact/);
  assert.match(body, /about \$214,000/);
  assert.match(body, /procurement department/);
  assert.match(body, /enterprise software for an enterprise of one/);
  assert.match(body, /I found no precise Buck Flower and Dick Miller collaboration/);

  assert.match(
    body,
    /<video controls playsinline preload="metadata"[^>]+they-live-clip-poster\.jpg/,
  );
  assert.match(body, /they-live-clip-web\.mp4" type="video\/mp4"/);
  assert.doesNotMatch(body, /<video[^>]*\bautoplay\b/);
});

test("article media remains hash-verifiable after the protected R2 upload", async () => {
  const manifest = await readFile(manifestPath, "utf8").then(JSON.parse);

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.policy.new_keys_only, true);
  assert.equal(manifest.policy.overwrite_existing, false);
  assert.deepEqual(manifest.policy.allowed_prefixes, ["articles/they-live/"]);
  assert.equal(manifest.assets.length, 5);

  const expectedKeys = [
    "articles/they-live/they-live-hero.png",
    "articles/they-live/they-live-clip-web.mp4",
    "articles/they-live/they-live-clip-poster.jpg",
    "articles/they-live/atheer-one-2013.jpg",
    "articles/they-live/atheer-work-execution-2026.png",
  ];
  assert.deepEqual(
    manifest.assets.map((asset) => asset.destination_key),
    expectedKeys,
  );

  for (const asset of manifest.assets) {
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
});
