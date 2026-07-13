import { expect, test } from "@playwright/test";
import path from "node:path";

const route = "/workshop/stylefusion/prototype/";

test("StyleFusion prototype is responsive, private, and keyboard-readable", async ({ page }, testInfo) => {
  await page.goto(route);

  await expect(page).toHaveTitle(/StyleFusion application prototype/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Reference images become an inspectable generation system.");
  await expect(page.getByRole("heading", { name: "Inputs, exports, results, and production assets stay separate." })).toBeVisible();
  await expect(page.getByText("subject_extraction_failed: true", { exact: true })).toBeVisible();

  const headingLevels = await page.locator("[data-private-prototype] h1, [data-private-prototype] h2, [data-private-prototype] h3, [data-private-prototype] h4").evaluateAll((headings) =>
    headings.map((heading) => Number(heading.tagName.slice(1))),
  );
  for (let index = 1; index < headingLevels.length; index += 1) {
    expect(headingLevels[index] - headingLevels[index - 1]).toBeLessThanOrEqual(1);
  }

  const rawDetails = page.locator(".document-viewer__raw").first();
  await expect(rawDetails).not.toHaveAttribute("open", "");
  const rawSummary = rawDetails.locator("summary");
  await rawSummary.focus();
  await page.keyboard.press("Space");
  await expect(rawDetails).toHaveAttribute("open", "");
  await expect(rawDetails).toContainText("The full source document stays local");

  expect(await page.locator("[data-private-prototype] img").count()).toBe(0);
  expect(await page.locator("[data-private-prototype] a").evaluateAll((links) =>
    links.every((link) => {
      const href = link.getAttribute("href") ?? "";
      return href.startsWith("/") || href.startsWith("#");
    }),
  )).toBe(true);

  const viewport = page.viewportSize();
  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pageWidth).toBeLessThanOrEqual(viewport?.width ?? pageWidth);

  const screenshotName = testInfo.project.name === "mobile-chromium"
    ? "stylefusion-prototype-mobile.png"
    : "stylefusion-prototype-desktop.png";
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.resolve("reports", screenshotName),
    fullPage: true,
    animations: "disabled",
  });
});

test("StyleFusion prototype honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);

  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("core application boundaries and case-study facts remain available", async ({ page }) => {
    await page.goto(route);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tuxedo cat fusion" })).toBeVisible();
    await expect(page.getByText("gpt-5.5", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Reference image withheld from this prototype.").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Downstream production stays separate." })).toBeVisible();
  });
});
