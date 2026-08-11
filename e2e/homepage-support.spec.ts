import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const kofiUrl = "https://ko-fi.com/hobfarm";

async function primeLazyImages(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.8, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
    window.scrollTo(0, 0);
  });
}

async function expectSupportLayout(page: Page, width: number, height: number, screenshotName: string) {
  await page.setViewportSize({ width, height });

  const kofiRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname.endsWith("ko-fi.com")) {
      kofiRequests.push(request.url());
    }
  });

  await page.goto("/");

  const supportLinks = page.locator('a[data-support-provider="kofi"]');
  await expect(supportLinks).toHaveCount(2);
  await expect(supportLinks.first()).toHaveAttribute("href", kofiUrl);
  await expect(supportLinks.first()).toHaveAttribute("target", "_blank");
  await expect(supportLinks.first()).toHaveAttribute("rel", "noopener noreferrer");
  await expect(supportLinks.first()).toHaveAttribute("data-support-placement", "homepage-after-specials");
  await expect(supportLinks.last()).toHaveAttribute("data-support-placement", "site-footer");
  expect(kofiRequests).toEqual([]);

  await expect(page.locator(".publisher-masthead")).toBeVisible();
  await expect(page.locator(".publisher-feature")).toBeVisible();
  await expect(page.locator("#magazine-front-page video")).toHaveCount(0);

  const supportLink = supportLinks.first();
  await supportLink.focus();
  await expect(supportLink).toBeFocused();
  expect(await supportLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  expect(await supportLink.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(width);

  await primeLazyImages(page);
  await page.screenshot({
    path: path.resolve("reports", screenshotName),
    fullPage: true,
    animations: "disabled",
  });
}

test("homepage support layout is stable at 1440px", async ({ page }) => {
  await expectSupportLayout(page, 1440, 900, "homepage-masthead-1440x900.png");
  await page.locator("#explore-editorial-sections").screenshot({
    path: path.resolve("reports", "homepage-sections-1440.png"),
    animations: "disabled",
  });
  await page.locator("#editorial-specials").screenshot({
    path: path.resolve("reports", "homepage-specials-1440.png"),
    animations: "disabled",
  });
});

test("homepage support layout is stable at 390px", async ({ page }) => {
  await expectSupportLayout(page, 390, 844, "homepage-masthead-390x844.png");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.resolve("reports", "homepage-masthead-390x844-top.png"),
    animations: "disabled",
  });
});

test("current Editorial is substantially visible in the 1366px laptop fold", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const intro = page.locator(".publisher-front__intro");
  const feature = page.locator(".publisher-feature");
  const recent = page.locator(".recent-stories");
  await expect(intro).toBeVisible();
  await expect(feature).toBeVisible();

  const featureBox = await feature.boundingBox();
  const recentBox = await recent.boundingBox();
  expect(featureBox).not.toBeNull();
  expect(recentBox).not.toBeNull();
  if (featureBox) {
    const visibleHeight = Math.min(featureBox.y + featureBox.height, 768) - Math.max(featureBox.y, 0);
    expect(visibleHeight).toBeGreaterThan(Math.min(featureBox.height * 0.8, 300));
  }
  if (recentBox) expect(recentBox.y).toBeLessThan(768);

  await page.screenshot({
    path: path.resolve("reports", "homepage-masthead-1366x768.png"),
    animations: "disabled",
  });
});

test("section and Specials cards keep their canonical destinations and lazy visual media", async ({ page }) => {
  await page.goto("/");

  const sectionCards = page.locator("#explore-editorial-sections .section-overview__card");
  await expect(sectionCards).toHaveCount(6);
  await expect(sectionCards.locator(".section-overview__visual img")).toHaveCount(6);
  await expect(sectionCards.locator(".section-overview__latest time")).toHaveCount(6);
  expect(await sectionCards.locator(".section-overview__main").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual([
    "/articles/music/",
    "/articles/film-tv/",
    "/articles/art-design/",
    "/articles/technology/",
    "/articles/culture/",
    "/articles/places-systems/",
  ]);

  const specialCards = page.locator("#editorial-specials .editorial-specials__card");
  await expect(specialCards).toHaveCount(3);
  await expect(specialCards.locator(".editorial-specials__visual img")).toHaveCount(3);
  expect(await specialCards.evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual([
    "/presents/magazine-time-machine/",
    "/presents/3-degrees-of-dick-miller/",
    "/articles/series/built-over/",
  ]);

  for (const image of await page.locator("#explore-editorial-sections img, #editorial-specials img").all()) {
    await expect(image).toHaveAttribute("loading", "lazy");
  }
});

test("homepage keeps its critical layout inside every requested viewport", async ({ page }) => {
  const viewports = [
    { width: 375, height: 812 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".publisher-feature")).toBeVisible();
    await expect(page.locator(".publisher-front__actions")).toBeVisible();
    await expect(page.locator("#explore-editorial-sections .section-overview__card")).toHaveCount(6);
    await expect(page.locator("#editorial-specials .editorial-specials__card")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  }
});

test("homepage hero stays static under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".publisher-masthead")).toBeVisible();
  await expect(page.locator("#magazine-front-page video")).toHaveCount(0);
});

test("Ko-fi support links are keyboard reachable and open a new tab", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const heroLink = page.locator('a[data-support-placement="homepage-after-specials"]');
  let reachedSupport = false;
  for (let index = 0; index < 120; index += 1) {
    await page.keyboard.press("Tab");
    if (await heroLink.evaluate((element) => element === document.activeElement)) {
      reachedSupport = true;
      break;
    }
  }
  expect(reachedSupport).toBe(true);
  await expect(heroLink).toBeFocused();

  const popupPromise = page.waitForEvent("popup");
  await page.keyboard.press("Enter");
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded").catch(() => undefined);
  expect(popup.url()).toMatch(/^https:\/\/(?:www\.)?ko-fi\.com\/hobfarm\/?/);
  await popup.close();
});
