import { expect, test } from "@playwright/test";
import path from "node:path";

const route = "/workshop/visual-lab/";

test("visual lab is responsive, keyboard-operable, and lazy-loads motion", async ({ page }, testInfo) => {
  await page.goto(route);

  await expect(page).toHaveTitle(/Visual Lab: Sophia \/ Stella/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("slider")).toHaveCount(2);

  const slider = page.getByRole("slider", { name: "Reveal Sophia sheet or Sophia Hero" });
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "52");

  const video = page.locator("[data-ambient-video] video");
  await expect(video).not.toHaveAttribute("src", /.+/);

  const viewport = page.viewportSize();
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(viewport?.width ?? pageWidth);
  expect(await page.locator("img").evaluateAll((elements) => {
    const images = elements as HTMLImageElement[];
    return images.filter((image) => image.complete && image.naturalWidth === 0).length;
  })).toBe(0);

  const screenshotName = testInfo.project.name === "mobile-chromium"
    ? "visual-lab-mobile.png"
    : "visual-lab-desktop.png";
  await page.locator("img").evaluateAll(async (elements) => {
    const images = elements as HTMLImageElement[];
    await Promise.all(images.map(async (image) => {
      image.loading = "eager";
      if (image.complete) return;
      await new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    }));
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.resolve("reports", screenshotName),
    fullPage: true,
    animations: "disabled",
  });

  await page.getByRole("button", { name: /Load and play Sophia \/ Stella teaser video/ }).click();
  await expect(video).toHaveAttribute("src", /^https:\/\/cdn\.hob\.farm\//);
});

test("visual lab honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);

  await expect(page.getByRole("slider").first()).toBeVisible();
  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  expect(await page.locator(".bac__grip").first().evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("none");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("core content and media fallback remain available", async ({ page }) => {
    await page.goto(route);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("One identity, two visual systems");
    await expect(page.getByRole("heading", { name: "Asset manifest" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open the video preview" })).toHaveAttribute("href", /^https:\/\/cdn\.hob\.farm\//);
    await expect(page.locator("[data-ambient-video] video")).not.toHaveAttribute("src", /.+/);
  });
});
