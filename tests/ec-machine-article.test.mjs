import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/ec-machine.mdx";
const cryptPath = "src/content/articles/hey-its-that-guy.mdx";
const assetManifestPath = "reports/ec-machine/asset-manifest.json";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

test("EC machine article has the requested route and publication date", async () => {
  const [article, crypt] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(cryptPath, "utf8"),
  ]);

  const publication = field(article, "publishedAt");
  const cryptPublication = field(crypt, "publishedAt");
  const status = field(article, "status");

  assert.equal(publication, "2026-08-04T17:20:00-07:00");
  assert.equal(field(article, "pubDate"), "2026-08-04");
  assert.equal(field(article, "canonical"), '"/articles/ec-machine/"');
  assert.equal(
    Date.parse(publication) - Date.parse(cryptPublication),
    24 * 60 * 60 * 1000,
    "The EC machine article should follow the linked Crypt article by one day.",
  );
  assert.ok(["scheduled", "published"].includes(status));
});

test("article preserves the film observation and required reporting boundaries", async () => {
  const [article, crypt] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(cryptPath, "utf8"),
  ]);

  assert.match(
    article,
    /I thought Paul McCartney was reading it\. He wasn’t\./,
  );
  assert.match(article, /It was Shake/);
  assert.match(article, /cannot prove which printing/);
  assert.match(article, /industry rule, not a law/);
  assert.match(article, /\/articles\/hey-its-that-guy\//);
  assert.match(crypt, /- ec-machine/);
  assert.match(article, /the-beatles-son-of-mad1\.png/);
  assert.match(article, /the-beatles-son-of-mad2\.png/);
  assert.match(article, /EcMachineDiagram/);
  assert.match(article, /ArticleSourceList/);
});

test("article body stays inside the requested editorial word range", async () => {
  const article = await readFile(articlePath, "utf8");
  const body = article
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/^import\s+[^;]+;\s*$/gm, "")
    .split("## Sources and further reading")[0]
    .replace(/<[^>]+>/g, " ")
    .replace(/[\\*_#[\]()]/g, " ");
  const words = body.match(/[\p{L}\p{N}][\p{L}\p{N}’'–-]*/gu) ?? [];

  assert.ok(
    words.length >= 1800,
    `Article has only ${words.length} body words.`,
  );
  assert.ok(words.length <= 2500, `Article has ${words.length} body words.`);
});

test("selected media has a verified R2 record and reproducible original graphics", async () => {
  const manifest = JSON.parse(await readFile(assetManifestPath, "utf8"));

  assert.equal(manifest.bucket, "hobfarm-cdn");
  assert.equal(manifest.prefix, "articles/ec-machine/");
  assert.equal(manifest.assets.length, 4);

  for (const asset of manifest.assets) {
    assert.match(
      asset.public_url,
      /^https:\/\/cdn\.hob\.farm\/articles\/ec-machine\//,
    );
    assert.equal(asset.http_status, 200);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);

    if (asset.source_path) {
      const bytes = await readFile(asset.source_path);
      const hash = createHash("sha256").update(bytes).digest("hex");
      assert.equal(
        hash,
        asset.sha256,
        `${asset.source_path} changed after upload.`,
      );
    }
  }
});
