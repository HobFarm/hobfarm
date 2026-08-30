import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const workflowDirectory = join(root, ".github", "workflows");
const scriptDirectory = join(root, "scripts");

const read = (path) => readFile(join(root, path), "utf8");
const readDirectory = async (path) => {
  try {
    return await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
};
const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("remaining one-time article publishers are paired and self-removing", async () => {
  const [workflowEntries, scriptEntries] = await Promise.all([
    readDirectory(workflowDirectory),
    readDirectory(scriptDirectory),
  ]);
  const workflows = workflowEntries
    .filter((entry) => entry.isFile() && /^publish-.+\.yml$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const scripts = scriptEntries
    .filter((entry) => entry.isFile() && /^publish-scheduled-.+\.mjs$/.test(entry.name))
    .map((entry) => `scripts/${entry.name}`)
    .sort();
  const referencedScripts = new Set();

  for (const workflowName of workflows) {
    const workflowPath = `.github/workflows/${workflowName}`;
    const workflow = await read(workflowPath);
    const command = workflow.match(/\bnode\s+(scripts\/publish-scheduled-[a-z0-9-]+\.mjs)\b/);
    assert.ok(command, `${workflowPath} must call one publication helper`);

    const scriptPath = command[1];
    referencedScripts.add(scriptPath);
    const script = await read(scriptPath);

    assert.match(workflow, new RegExp(`git rm ${escapeRegExp(workflowPath)}`));
    assert.match(workflow, new RegExp(`git rm ${escapeRegExp(scriptPath)}`));
    assert.match(workflow, /if: steps\.article\.outputs\.published == 'true'/);

    const articlePath = script.match(/const articlePath = resolve\(\s*"([^"]+)"\s*\);/)?.[1];
    const release = script.match(/const expectedPublication = "([^"]+)";/)?.[1];
    assert.ok(articlePath, `${scriptPath} must identify one article`);
    assert.ok(release && Number.isFinite(Date.parse(release)), `${scriptPath} must use a valid release instant`);

    const article = await read(articlePath);
    assert.match(article, new RegExp(`^publishedAt:\\s*${escapeRegExp(release)}$`, "m"));
    assert.match(article, /^status:\s*(?:scheduled|published)$/m);
  }

  assert.deepEqual(
    [...referencedScripts].sort(),
    scripts,
    "Every remaining publication helper must be owned by an active self-removing workflow.",
  );
});

test("article tests verify durable content behavior, not one-time task artifacts", async () => {
  const testEntries = await readdir(join(root, "tests"), { withFileTypes: true });
  const forbiddenWorkflowPath = [".github", "workflows", "publish-"].join("/");
  const forbiddenScriptName = ["publish", "scheduled"].join("-");

  for (const entry of testEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".test.mjs") || entry.name === "publication-infrastructure.test.mjs") {
      continue;
    }
    const source = await read(`tests/${entry.name}`);
    assert.equal(source.includes(forbiddenWorkflowPath), false, `${entry.name} references a one-time workflow`);
    assert.equal(source.includes(forbiddenScriptName), false, `${entry.name} references a one-time helper`);
  }
});

test("repository guidance defines the publication automation boundary", async () => {
  const guidance = await read("docs/codex/publishing-surfaces.md");
  assert.match(
    guidance,
    /Use existing publication infrastructure\. Content is data inside the publishing system, not a reason to create another publishing system\./,
  );
  assert.match(guidance, /Do not create an article-specific workflow, cron job, deployment path, build pipeline, permanent CI test/);
  assert.match(guidance, /Test durable publishing behavior/);
});
