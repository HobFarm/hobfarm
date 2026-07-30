import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const articlePath = "src/content/articles/i-may-have-inspired-it.md";
const sourceArticlePath = "src/content/articles/hey-its-that-guy.mdx";
const articleWorkflowPath = ".github/workflows/publish-inspired-it.yml";
const sourceWorkflowPath = ".github/workflows/publish-hey-its-that-guy.yml";
const articleScriptPath = "scripts/publish-scheduled-inspired-it.mjs";
const sourceScriptPath = "scripts/publish-scheduled-hey-its-that-guy.mjs";
const assetRoot = "public/images/articles/i-may-have-inspired-it";

function field(source, name) {
  return source.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expectedCron(publication) {
  const trigger = new Date(Date.parse(publication) + 5 * 60 * 1000);
  return [
    trigger.getUTCMinutes(),
    trigger.getUTCHours(),
    trigger.getUTCDate(),
    trigger.getUTCMonth() + 1,
    "*",
  ].join(" ");
}

test("Bangor and Derry article is scheduled exactly 24 hours after the Crypt article", async () => {
  const [
    article,
    sourceArticle,
    articleWorkflow,
    sourceWorkflow,
    articleScript,
    sourceScript,
  ] = await Promise.all([
    readFile(articlePath, "utf8"),
    readFile(sourceArticlePath, "utf8"),
    readFile(articleWorkflowPath, "utf8").catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    }),
    readFile(sourceWorkflowPath, "utf8").catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    }),
    readFile(articleScriptPath, "utf8"),
    readFile(sourceScriptPath, "utf8"),
  ]);

  const publication = field(article, "publishedAt");
  const sourcePublication = field(sourceArticle, "publishedAt");
  const status = field(article, "status");
  const sourceStatus = field(sourceArticle, "status");

  assert.equal(publication, "2026-08-02T17:20:00-07:00");
  assert.equal(sourcePublication, "2026-08-01T17:20:00-07:00");
  assert.equal(
    Date.parse(publication) - Date.parse(sourcePublication),
    24 * 60 * 60 * 1000,
  );
  assert.equal(field(article, "pubDate"), "2026-08-02");
  assert.ok(["scheduled", "published"].includes(status));
  assert.ok(["scheduled", "published"].includes(sourceStatus));

  assert.match(
    articleScript,
    new RegExp(`expectedPublication = "${escapeRegExp(publication)}"`),
  );
  assert.match(
    sourceScript,
    new RegExp(`expectedPublication = "${escapeRegExp(sourcePublication)}"`),
  );

  if (status === "scheduled") {
    assert.ok(articleWorkflow, "Scheduled article must retain its workflow.");
    assert.match(
      articleWorkflow,
      new RegExp(`cron: "${escapeRegExp(expectedCron(publication))}"`),
    );
  } else {
    assert.equal(articleWorkflow, null);
  }

  if (sourceStatus === "scheduled") {
    assert.ok(sourceWorkflow, "Scheduled Crypt article must retain its workflow.");
    assert.match(
      sourceWorkflow,
      new RegExp(`cron: "${escapeRegExp(expectedCron(sourcePublication))}"`),
    );
  } else {
    assert.equal(sourceWorkflow, null);
  }
});

test("article uses the supplied public-safe photo set and preserves its reporting boundary", async () => {
  const article = await readFile(articlePath, "utf8");
  const requiredAssets = [
    "01-birdbath-hero.jpg",
    "02-thomas-hill-standpipe.jpg",
    "03-kenduskeag-downtown.jpg",
    "04-kenduskeag-natural.jpg",
    "05-hampden-academy-old.jpg",
    "06-hampden-academy-gym.jpg",
    "07-bucksport-mill-2014.jpg",
    "08-buck-monument.jpg",
  ];

  for (const filename of requiredAssets) {
    await access(`${assetRoot}/${filename}`);
    assert.ok(article.includes(filename), `Article does not use ${filename}`);
  }

  assert.match(article, /I may have inspired \*It\*\./);
  assert.match(article, /I have no proof\./);
  assert.match(article, /not an allegation that Stephen King observed or copied/);
  assert.match(article, /exact childhood home, street address, walking route/);
  assert.doesNotMatch(article, /09-standpipe-interior\.jpg/);
});
