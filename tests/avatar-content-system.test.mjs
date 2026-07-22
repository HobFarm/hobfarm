import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), "utf8");

test("avatar starter kit is framed inside Aesthetic Systems Lab without losing the beginner outcome", () => {
  const landing = read("src/pages/academy/avatar-content-system/index.astro");
  const data = read("src/data/avatar-content-system.ts");

  assert.match(data, /A beginner course inside Aesthetic Systems Lab/);
  assert.match(data, /repeatable avatar content system/);
  assert.match(data, /one reusable introduction video/);
  assert.match(data, /platform-specific captions, published posts, and review note/);

  for (const castTerm of ["Collect", "Arrange", "Set", "Task"]) {
    assert.match(data, new RegExp(`\\b${castTerm}\\b`), `${castTerm} should be part of the light CAST framing`);
  }

  assert.match(landing, /Where this fits/);
  assert.match(landing, /Aesthetic Systems Lab/);
  assert.match(data, /Color Becomes a Cast/);
});

test("starter source file is the first paid lesson after the free ChatGPT prompt", () => {
  const previews = read("src/data/avatar-content-system.ts");
  const paid = read("src/data/avatar-content-system-paid.ts");

  const firstPrompt = previews.indexOf('slug: "first-chatgpt-prompt"');
  const starterSourcePreview = previews.indexOf('slug: "create-the-starter-source-file"');
  const personalizationPreview = previews.indexOf('slug: "set-up-chatgpt-personalization"');

  assert(firstPrompt > -1, "free ChatGPT prompt lesson should exist");
  assert(starterSourcePreview > firstPrompt, "starter source file preview should follow the first ChatGPT prompt");
  assert(personalizationPreview > starterSourcePreview, "starter source file should precede ChatGPT personalization");

  assert.match(previews, /nextLessonSlug:\s*"create-the-starter-source-file"/);
  assert.match(previews, /number:\s*5,\s*slug:\s*"create-the-starter-source-file"/);
  assert.match(previews, /title:\s*"Create the Starter Source File"/);

  assert.match(paid, /slug:\s*"create-the-starter-source-file"/);
  for (const field of [
    "Project:",
    "Goal:",
    "Audience/use:",
    "Avatar role:",
    "Visual lane:",
    "Voice:",
    "Boundaries:",
    "Forbidden drift:",
    "Current output:",
    "Next task:",
  ]) {
    assert.match(paid, new RegExp(field.replace("/", "\\/")), `${field} should appear in the starter source template`);
  }
});

test("the course ends by resetting the thread and making the next avatar post", () => {
  const previews = read("src/data/avatar-content-system.ts");
  const paid = read("src/data/avatar-content-system-paid.ts");

  assert.match(previews, /title:\s*"Reset the Thread and Make the Next One"/);
  assert.match(paid, /title:\s*"Reset the Thread and Make the Next One"/);
  assert.match(paid, /Reset the thread/);
});

test("avatar starter course routes remain in place", () => {
  for (const file of [
    "src/pages/academy/avatar-content-system/index.astro",
    "src/pages/academy/avatar-content-system/free.astro",
    "src/pages/academy/avatar-content-system/course/index.astro",
    "src/pages/academy/avatar-content-system/course/[lessonSlug].astro",
  ]) {
    assert.equal(existsSync(join(root, file)), true, `${file} should exist`);
  }
});
