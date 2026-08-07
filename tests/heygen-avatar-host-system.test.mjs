import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Avatar & Host is a first-class Workshop program with a durable production sequence", () => {
  const page = read("src/pages/workshop/avatar-host/index.astro");

  assert.match(page, /<h1>Avatar &amp; Host<\/h1>/);
  assert.match(page, /HobFarm Workshop program/);
  assert.match(page, /WorkshopProgramNav currentId="avatar-host"/);
  for (const heading of [
    "Character identity",
    "Canonical face and voice",
    "Look families",
    "Editorial role assignment",
    "Expression and motion direction",
    "Standardized host tests",
    "Continuity comparison",
    "Final program destinations",
    "HobFarm TV and Academy usage",
  ]) {
    assert.match(page, new RegExp(heading.replaceAll("/", "\\/")));
  }
  for (const principle of [
    "Article first",
    "Video for social",
    "Human review",
    "Link back to HobFarm",
  ]) {
    assert.match(page, new RegExp(principle));
  }
  assert.match(page, /A Codex production project/);
  assert.match(page, /PsyGoth is an existing experiment, not a separate media strategy/);
});

test("avatar host media slots remain registered without generated URLs", () => {
  const registry = read("src/data/media-registry.ts");

  for (const id of [
    "avatar-host.hillary.main.video",
    "avatar-host.hillary.main.captions",
    "avatar-host.hillary.workshop.video",
    "avatar-host.hillary.workshop.captions",
    "avatar-host.hillary.cinema.video",
    "avatar-host.hillary.cinema.captions",
    "avatar-host.ami.social.video",
    "avatar-host.ami.social.captions",
    "avatar-host.em.trio.video",
    "avatar-host.em.trio.captions",
    "avatar-host.nina.trio.video",
    "avatar-host.nina.trio.captions",
    "avatar-host.zima.trio.video",
    "avatar-host.zima.trio.captions",
  ]) {
    assert.match(registry, new RegExp(id.replaceAll(".", "\\.")));
  }

  assert.match(registry, /function avatarHostPlaceholder/);
  assert.match(registry, /src: ""/);
  assert.match(registry, /status: "registered"/);
});

test("HeyGen reports omit temporary signed preview URLs", () => {
  const reports = [
    read("reports/heygen-avatar-inventory.md"),
    read("reports/heygen-avatar-destination-map.md"),
    read("reports/heygen-avatar-generation-plan.md"),
  ].join("\n");

  assert.doesNotMatch(reports, /[?&]Expires=/i);
  assert.doesNotMatch(reports, /[?&]Signature=/i);
  assert.doesNotMatch(reports, /Key-Pair-Id=/i);
  assert.match(reports, /HeyGen credits spent by this work: \*\*0\*\*/);
});

test("PsyGoth uses three durable CDN clips with deferred playback and transcript inspectors", () => {
  const page = read("src/pages/workshop/workshop-notes/psygoth/index.astro");
  const registry = read("src/data/media-registry.ts");

  assert.match(page, /PsyGoth: One Visual System, Three Identities/);
  for (const name of ["Em", "Nina", "Zima"]) {
    assert.match(page, new RegExp(`name: "${name}"`));
  }

  const videoTags = page.match(/<video[\s\S]*?>/g) ?? [];
  assert.equal(videoTags.length, 1, "one mapped video tag should serve all three chapters");
  assert.match(videoTags[0], /preload="none"/);
  assert.match(videoTags[0], /poster=/);
  assert.doesNotMatch(videoTags[0], /autoplay/);
  assert.match(page, /<details>/);

  for (const id of [
    "workshop.psygoth.em.video",
    "workshop.psygoth.nina.video",
    "workshop.psygoth.zima.video",
    "avatar-host.hobgal.prototype.video",
  ]) {
    assert.match(registry, new RegExp(id.replaceAll(".", "\\.")));
  }
  assert.match(registry, /cdn\(`workshop\/\$\{file\}`\)/);
  for (const slug of ["em", "nina", "zima"]) {
    assert.match(registry, new RegExp(`workshop\\.psygoth\\.${slug}\\.video[\\s\\S]{0,600}workshopMedia\\(`));
  }
});

test("canonical avatar portraits and section graphics use approved R2 paths", () => {
  const registry = read("src/data/media-registry.ts");

  for (const file of [
    "hillary01.WEBP",
    "ami01.WEBP",
    "em01.jpg",
    "nina01.jpg",
    "zima01.WEBP",
    "hobgal01.jpg",
    "workshop.png",
    "workshop-hillary.png",
    "presents-with-avatars.png",
  ]) {
    assert.match(registry, new RegExp(file.replaceAll(".", "\\.")));
  }
});

test("follow-up avatar reports contain no signed HeyGen URLs", () => {
  const reports = [
    "reports/avatar-transcript-index.md",
    "reports/avatar-editorial-story-map.md",
    "reports/avatar-video-selection.md",
    "reports/hillary-site-guide-map.md",
    "reports/ami-legacy-campaign.md",
    "reports/avatar-generation-gap-report.md",
  ].map(read).join("\n");

  assert.doesNotMatch(reports, /[?&]Expires=/i);
  assert.doesNotMatch(reports, /[?&]Signature=/i);
  assert.doesNotMatch(reports, /Key-Pair-Id=/i);
});
