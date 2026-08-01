import { appendFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const articlePath = resolve("src/content/articles/i-may-have-inspired-it.md");
const expectedPublication = "2026-08-01T17:20:00-07:00";
const outputPath = process.env.GITHUB_OUTPUT;
const article = await readFile(articlePath, "utf8");

function setOutput(value) {
  if (outputPath) {
    return appendFile(outputPath, `published=${value}\n`, "utf8");
  }
  console.log(`published=${value}`);
  return Promise.resolve();
}

const publicationMatch = article.match(/^publishedAt:\s*(.+)$/m);
if (!publicationMatch) {
  throw new Error("The Bangor and Derry article has no publishedAt field.");
}

if (publicationMatch[1].trim() !== expectedPublication) {
  throw new Error(
    `The publication date changed unexpectedly: ${publicationMatch[1].trim()}`,
  );
}

if (Date.now() < Date.parse(expectedPublication)) {
  console.log(`Not due until ${expectedPublication}.`);
  await setOutput("false");
  process.exit(0);
}

if (/^status:\s*published$/m.test(article)) {
  console.log("The Bangor and Derry article is already published.");
  await setOutput("true");
  process.exit(0);
}

if (!/^status:\s*scheduled$/m.test(article)) {
  throw new Error(
    "The Bangor and Derry article is neither scheduled nor published.",
  );
}

await writeFile(
  articlePath,
  article.replace(/^status:\s*scheduled$/m, "status: published"),
  "utf8",
);
console.log("Marked the Bangor and Derry article as published.");
await setOutput("true");
