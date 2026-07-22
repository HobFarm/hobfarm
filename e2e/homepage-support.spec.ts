import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const kofiUrl = "https://ko-fi.com/hobfarm";

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
  await expect(supportLinks.first()).toHaveAttribute("data-support-placement", "homepage-hero");
  await expect(supportLinks.last()).toHaveAttribute("data-support-placement", "site-footer");
  expect(kofiRequests).toEqual([]);

  const heroFigure = page.getByLabel("HobFarm animated drip logo");
  const figureBox = await heroFigure.boundingBox();
  expect(figureBox).not.toBeNull();
  expect(Math.abs((figureBox?.width ?? 0) - (figureBox?.height ?? 0))).toBeLessThanOrEqual(1);

  const heroLink = supportLinks.first();
  await heroLink.focus();
  await expect(heroLink).toBeFocused();
  expect(await heroLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  expect(await heroLink.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(width);

  await page.screenshot({
    path: path.resolve("reports", screenshotName),
    fullPage: true,
    animations: "disabled",
  });
}

test("homepage support layout is stable at 1440px", async ({ page }) => {
  await expectSupportLayout(page, 1440, 1000, "homepage-support-desktop.png");
});

test("homepage support layout is stable at 390px", async ({ page }) => {
  await expectSupportLayout(page, 390, 844, "homepage-support-mobile.png");
});

test("homepage logo uses its reduced-motion fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByLabel("HobFarm animated drip logo").locator("video")).toBeHidden();
  await expect(page.getByLabel("HobFarm animated drip logo").locator("picture")).toBeVisible();
});

test("Ko-fi support links are keyboard reachable and open a new tab", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const heroLink = page.locator('a[data-support-placement="homepage-hero"]');
  for (let index = 0; index < 30; index += 1) {
    await page.keyboard.press("Tab");
    if (await heroLink.evaluate((element) => element === document.activeElement)) break;
  }
  await expect(heroLink).toBeFocused();

  const popupPromise = page.waitForEvent("popup");
  await page.keyboard.press("Enter");
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded").catch(() => undefined);
  expect(popup.url()).toMatch(/^https:\/\/(?:www\.)?ko-fi\.com\/hobfarm\/?/);
  await popup.close();
});
