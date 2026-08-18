import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("contact subjects route to the support or general inbox", () => {
  const endpoint = read("functions/api/contact.ts");

  for (const subject of [
    "support",
    "billing",
    "refund",
    "stylefusion",
    "grimoire",
    "membership",
    "bug",
    "security",
  ]) {
    const property = subject.includes("-") ? `"${subject}"` : subject;
    assert.ok(
      endpoint.includes(`${property}: { destination: SUPPORT_DESTINATION`),
      `${subject} should route to Customer Help`,
    );
  }

  for (const subject of [
    "general",
    "employment",
    "editorial",
    "collaboration",
    "creative-project",
    "custom-character",
    "business",
  ]) {
    const property = subject.includes("-") ? `"${subject}"` : subject;
    assert.ok(
      endpoint.includes(`${property}: { destination: GENERAL_DESTINATION`),
      `${subject} should route to the general inbox`,
    );
  }
});

test("contact success waits for Cloudflare email acceptance", () => {
  const endpoint = read("functions/api/contact.ts");
  const form = read("src/components/ContactForm.tsx");
  const mailer = read("workers/commerce/src/index.ts");
  const config = read("workers/commerce/wrangler.toml");

  assert.match(endpoint, /await env\.COMMERCE\.fetch\(/);
  assert.match(endpoint, /https:\/\/commerce\.internal\/internal\/contact\/send/);
  assert.match(endpoint, /replyTo: email/);
  assert.match(endpoint, /text: plainTextMessage/);
  assert.match(endpoint, /html: htmlMessage/);
  assert.match(endpoint, /return jsonError\([\s\S]*Message delivery failed[\s\S]*502/);
  assert.match(endpoint, /Contact email accepted/);
  assert.doesNotMatch(endpoint, /messageLength|nameLength/);

  assert.match(mailer, /await env\.CONTACT_EMAIL\.send\(\{/);
  assert.match(mailer, /CONTACT_DESTINATIONS\.has\(to\)/);
  assert.match(mailer, /from: \{ email: CONTACT_SENDER, name: "HobFarm contact form" \}/);
  assert.match(mailer, /replyTo,/);

  assert.match(form, /It was sent to the right HobFarm inbox/);
  assert.match(form, /resetVerification\(\)/);

  assert.match(config, /\[\[send_email\]\]/);
  assert.match(config, /name = "CONTACT_EMAIL"/);
  assert.match(config, /allowed_sender_addresses = \["contact@forms\.hob\.farm"\]/);
  assert.match(
    config,
    /allowed_destination_addresses = \["support@hob\.farm", "hey@hob\.farm"\]/,
  );
});
