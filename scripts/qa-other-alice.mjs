import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.OAA_PREVIEW_URL ?? "http://127.0.0.1:4321";
const outputDir = path.resolve("reports/other-alice-living-world/after");
const routes = [
  { id: "start", path: "/departments/hobfarm-presents/other-alice-adventures/" },
  { id: "world-guide", path: "/departments/hobfarm-presents/other-alice-adventures/world-guide/" },
  { id: "houses", path: "/departments/hobfarm-presents/other-alice-adventures/houses/" },
  { id: "web", path: "/departments/hobfarm-presents/other-alice-adventures/web-of-wonderland/" },
];
const viewports = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];
const expectedNav = ["Start Here", "World Guide", "Houses", "Web of Wonderland"];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const findings = [];

try {
  for (const route of routes) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__oaaPerformance = { lcp: 0, cls: 0, longTasks: [] };
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          window.__oaaPerformance.lcp = entries.at(-1)?.startTime ?? 0;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__oaaPerformance.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((list) => {
          window.__oaaPerformance.longTasks.push(...list.getEntries().map((entry) => entry.duration));
        }).observe({ type: "longtask", buffered: true });
      });
      const consoleErrors = [];
      const failedRequests = [];
      let sawAnonymousAuth401 = false;
      page.on("response", (response) => {
        const pathname = new URL(response.url()).pathname;
        if (pathname === "/api/auth/me" && response.status() === 401) sawAnonymousAuth401 = true;
      });
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("requestfailed", (request) => {
        const errorText = request.failure()?.errorText ?? "failed";
        const expectedLocalAuthAbort = new URL(request.url()).pathname === "/api/auth/me" && errorText === "net::ERR_ABORTED";
        if (!expectedLocalAuthAbort) failedRequests.push(`${request.method()} ${request.url()} — ${errorText}`);
      });

      const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `${route.id} returned ${response?.status()} at ${viewport.width}px`);
      const images = page.locator("img");
      for (let index = 0; index < await images.count(); index += 1) {
        await images.nth(index).scrollIntoViewIfNeeded();
        await page.waitForTimeout(60);
      }
      await page.waitForFunction(() => [...document.images].every((image) => image.complete), null, { timeout: 15_000 });
      await page.evaluate(() => scrollTo(0, 0));

      const audit = await page.evaluate(() => {
        const text = (element) => [
          element.getAttribute("aria-label"),
          element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent : "",
          element.getAttribute("title"),
          element.getAttribute("alt"),
          element.getAttribute("placeholder"),
          element.textContent,
        ].filter(Boolean).join(" ").trim();
        const duplicateIds = [...document.querySelectorAll("[id]")]
          .map((element) => element.id)
          .filter((id, index, ids) => ids.indexOf(id) !== index);
        const brokenImages = [...document.images]
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src);
        const unnamedControls = [...document.querySelectorAll("a[href],button,input,select,textarea")]
          .filter((element) => !text(element))
          .map((element) => element.outerHTML.slice(0, 180));
        const missingAlt = [...document.querySelectorAll("img:not([alt])")]
          .map((image) => image.getAttribute("src"));
        return {
          h1Count: document.querySelectorAll("h1").length,
          horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
          brokenImages,
          missingAlt,
          unnamedControls,
          duplicateIds,
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          landmarks: {
            main: document.querySelectorAll("main").length,
            nav: document.querySelectorAll("nav").length,
            footer: document.querySelectorAll("footer").length,
          },
          performance: {
            lcp: window.__oaaPerformance?.lcp ?? 0,
            cls: window.__oaaPerformance?.cls ?? 0,
            maxLongTask: Math.max(0, ...(window.__oaaPerformance?.longTasks ?? [])),
          },
        };
      });

      assert.equal(audit.h1Count, 1, `${route.id} needs exactly one h1 at ${viewport.width}px`);
      assert.ok(audit.horizontalOverflow <= 1, `${route.id} overflows horizontally by ${audit.horizontalOverflow}px at ${viewport.width}px`);
      assert.deepEqual(audit.brokenImages, [], `${route.id} has broken images at ${viewport.width}px`);
      assert.deepEqual(audit.missingAlt, [], `${route.id} has images without alt at ${viewport.width}px`);
      assert.deepEqual(audit.unnamedControls, [], `${route.id} has unnamed controls at ${viewport.width}px`);
      assert.deepEqual(audit.duplicateIds, [], `${route.id} has duplicate IDs at ${viewport.width}px`);
      assert.equal(audit.reducedMotion, true, `${route.id} did not honor reduced-motion emulation`);
      assert.equal(audit.landmarks.main, 1, `${route.id} needs one main landmark`);
      assert.ok(audit.landmarks.nav >= 2, `${route.id} is missing site or project navigation`);
      assert.equal(audit.landmarks.footer, 1, `${route.id} needs one footer landmark`);

      const navLabels = await page.locator('nav[aria-label="Other Alice"] a').allTextContents();
      assert.deepEqual(navLabels.map((label) => label.trim()), expectedNav, `${route.id} project navigation changed`);

      await page.keyboard.press("Tab");
      const focusVisible = await page.evaluate(() => document.activeElement !== document.body);
      assert.equal(focusVisible, true, `${route.id} did not expose a keyboard focus target`);

      const unexpectedConsoleErrors = consoleErrors.filter((message) => !(
        sawAnonymousAuth401 &&
        message.includes("Failed to load resource") &&
        message.includes("401")
      ));
      assert.deepEqual(unexpectedConsoleErrors, [], `${route.id} logged console errors at ${viewport.width}px`);
      assert.deepEqual(failedRequests, [], `${route.id} had failed requests at ${viewport.width}px`);

      await page.screenshot({
        path: path.join(outputDir, `${route.id}-${viewport.width}.png`),
        fullPage: true,
      });
      findings.push({ route: route.id, viewport: viewport.width, audit });
      await context.close();
    }
  }

  const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${routes[1].path}?route=orbital`, { waitUntil: "networkidle" });
  const orbital = page.locator('[data-route="orbital"]');
  await orbital.waitFor();
  assert.equal(await orbital.getAttribute("aria-pressed"), "true", "route query did not restore Orbital");
  await orbital.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-route="burrow"]').getAttribute("aria-pressed"), "true", "route keyboard selection failed");
  assert.match(page.url(), /[?&]route=burrow(?:&|$)/, "route selection did not update the URL");

  await page.goto(`${baseUrl}${routes[2].path}?house=diamonds`, { waitUntil: "networkidle" });
  const diamonds = page.locator('[data-house="diamonds"]');
  assert.equal(await diamonds.getAttribute("aria-pressed"), "true", "House query did not restore Diamonds");
  assert.equal(await page.locator('[data-house-layer="diamonds"]').evaluate((layer) => layer.classList.contains("dim")), false, "House filter dimmed the selected system");
  assert.equal(await page.locator('[data-house-layer="hearts"]').evaluate((layer) => layer.classList.contains("dim")), true, "House filter left an unrelated system emphasized");
  await diamonds.focus();
  await page.keyboard.press("ArrowRight");
  assert.match(page.url(), /[?&]house=spades(?:&|$)/, "House keyboard selection did not update the URL");

  await page.goto(`${baseUrl}${routes[3].path}?relation=ecology`, { waitUntil: "networkidle" });
  const ecology = page.locator('[data-relation="ecology"]');
  assert.equal(await ecology.getAttribute("aria-pressed"), "true", "relationship query did not restore Ecology");
  const visibleEcology = await page.locator('[data-ledger-kind="ecology"]:visible').count();
  const visibleOther = await page.locator('[data-ledger-kind]:visible:not([data-ledger-kind="ecology"])').count();
  assert.ok(visibleEcology > 0, "Ecology filter hid every matching ledger entry");
  assert.equal(visibleOther, 0, "Ecology filter left unrelated ledger entries visible");
  await ecology.focus();
  await page.keyboard.press("ArrowLeft");
  assert.match(page.url(), /[?&]relation=authority(?:&|$)/, "relationship keyboard selection did not update the URL");

  for (const retired of ["adventure-no-01-the-boundary-table", "adventure-no-01-the-wrong-tunnel"]) {
    await page.goto(`${baseUrl}${routes[0].path}${retired}/`, { waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, routes[0].path, `${retired} did not redirect to Start Here`);
  }
  const sitemap = await (await context.request.get(`${baseUrl}/sitemap.xml`)).text();
  const searchIndex = await (await context.request.get(`${baseUrl}/search-index.json`)).text();
  for (const retired of ["adventure-no-01-the-boundary-table", "adventure-no-01-the-wrong-tunnel"]) {
    assert.doesNotMatch(sitemap, new RegExp(retired, "i"), `${retired} remains in the sitemap`);
    assert.doesNotMatch(searchIndex, new RegExp(retired, "i"), `${retired} remains in search`);
  }
  await context.close();

  const worst = findings.reduce((current, finding) => ({
    lcp: Math.max(current.lcp, finding.audit.performance.lcp),
    cls: Math.max(current.cls, finding.audit.performance.cls),
    maxLongTask: Math.max(current.maxLongTask, finding.audit.performance.maxLongTask),
  }), { lcp: 0, cls: 0, maxLongTask: 0 });
  console.log(`Other Alice browser QA passed: ${findings.length} route/viewport combinations, three filter systems, and retired-route checks.`);
  console.log(`Local headless performance maxima: LCP ${worst.lcp.toFixed(1)}ms; CLS ${worst.cls.toFixed(4)}; long task ${worst.maxLongTask.toFixed(1)}ms.`);
} finally {
  await browser.close();
}
