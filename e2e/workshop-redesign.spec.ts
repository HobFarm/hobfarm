import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const programRoutes = [
  "/workshop/workshop-notes/",
  "/workshop/character-mannequin/",
  "/workshop/avatar-host/",
  "/workshop/before-and-after/",
  "/workshop/cute-and-corrupted/",
  "/workshop/alter-ego/",
] as const;

const programLabels = [
  "Overview",
  "Projects",
  "Workshop Notes",
  "HobFarm project",
  "StyleFusion",
  "Before & After",
  "Future Carriage",
] as const;

async function expectStablePage(page: Page, route: string, width: number) {
  const errors: string[] = [];
  const onPageError = (error: Error) => errors.push(error.message);
  page.on("pageerror", onPageError);
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response?.status(), route).toBeLessThan(400);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  expect(errors).toEqual([]);
  page.off("pageerror", onPageError);
}

async function loadPageImages(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    images.forEach((image) => { image.loading = "eager"; });
    const step = Math.max(400, window.innerHeight * .8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    await Promise.all(images.map((image) => image.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          const done = () => resolve();
          image.addEventListener("load", done, { once: true });
          image.addEventListener("error", done, { once: true });
          setTimeout(done, 5_000);
        })));
    window.scrollTo(0, 0);
  });
}

test("desktop and mobile Workshop menus lead with system layers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/");

  const desktopLinks = page.locator('#nav-wrapper nav.hidden .nav-group:has(> a[href="/workshop/"]) .nav-menu > a');
  await expect(desktopLinks).toHaveCount(programLabels.length);
  expect(await desktopLinks.allTextContents()).toEqual([...programLabels]);
  await expect(page.locator('#nav-wrapper nav.hidden .nav-group:has(> a[href="/workshop/"]) .nav-menu > a[href="/workshop/stylefusion/"]')).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle main menu" }).click();
  const details = page.locator('#mobile-menu details:has(summary[aria-label="Toggle Workshop links"])');
  await details.locator("summary").click({ force: true });
  const mobileLinks = details.locator('a[href^="/workshop/"]');
  expect(await mobileLinks.allTextContents()).toEqual([...programLabels]);
  await expect(details.locator('a[href="/workshop/stylefusion/"]')).toHaveCount(1);
});

test("Workshop hub hierarchy and all primary program links are visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/");

  const selectors = [
    ".workshop-hero",
    ".notes-intro",
    "#method",
    "#system",
    ".representation-section",
    ".production-paths",
    "#projects",
    ".future-carriage",
    '[aria-labelledby="outputs-heading"]',
    ".tools-section",
    ".final-routes",
  ];
  const positions = await Promise.all(selectors.map(async (selector) => (await page.locator(selector).boundingBox())!.y));
  expect(positions).toEqual([...positions].sort((a, b) => a - b));

  await expect(page.locator('#projects [data-workshop-project]')).toHaveCount(6);
  for (const route of programRoutes) {
    await expect(page.locator(`a[href="${route}"]`).first()).toBeVisible();
  }
  await expect(page.getByText("A working frame for the next pass.")).toHaveCount(0);
});

test("Projects hub and HobFarm case study remain stable across responsive widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await expectStablePage(page, "/workshop/projects/", viewport.width);
    await expectStablePage(page, "/workshop/projects/hobfarm/", viewport.width);
  }
  await page.goto("/workshop/projects/");
  await expect(page.locator("[data-workshop-project]")).toHaveCount(8);
});

test("Presents Funnies overview no longer renders a bright white field", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/presents/");
  const comics = page.locator("#funnies");
  await expect(comics).toBeVisible();
  const background = await comics.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(background).not.toBe("rgb(244, 242, 237)");
  await expect(comics.getByRole("heading", { name: "Funnies", exact: true })).toBeVisible();
});

test("changed surfaces load their published images without broken assets", async ({ page }) => {
  test.setTimeout(120_000);
  for (const route of ["/", "/workshop/", "/workshop/projects/", "/workshop/projects/hobfarm/", "/presents/"]) {
    await page.goto(route, { waitUntil: "networkidle" });
    await loadPageImages(page);
    const broken = await page.locator("img").evaluateAll((images) => (images as HTMLImageElement[])
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src")));
    expect(broken, route).toEqual([]);
  }
});

test("program pages stay stable and previous-next navigation follows the registry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of programRoutes) await expectStablePage(page, route, viewport.width);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/avatar-host/");
  const sequence = page.getByRole("navigation", { name: "Workshop programs" }).last();
  await expect(sequence.getByRole("link", { name: /Previous program Character \/ Mannequin/ })).toHaveAttribute("href", "/workshop/character-mannequin/");
  await expect(sequence.getByRole("link", { name: /Next program Before & After/ })).toHaveAttribute("href", "/workshop/before-and-after/");
});

test("Future Carriage cross-links and media behavior remain explicit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/");
  const caseStudy = page.locator(".future-carriage");
  await expect(caseStudy.getByRole("link", { name: "See Ami in Avatar & Host" })).toHaveAttribute("href", "/workshop/avatar-host/");
  await expect(caseStudy.getByRole("link", { name: "Follow the stable-base method" })).toHaveAttribute("href", "/workshop/character-mannequin/");

  await page.goto("/workshop/future-carriage/");
  await expect(page.getByRole("link", { name: "View the avatar host system" }).first()).toHaveAttribute("href", "/workshop/avatar-host/");
  await expect(page.getByRole("link", { name: "Follow the stable-base method" })).toHaveAttribute("href", "/workshop/character-mannequin/");

  await page.goto("/workshop/avatar-host/");
  await expect(page.locator("#hobgal-prototype video")).toHaveAttribute("preload", "none");
  await expect(page.locator("#ami-future-carriage video")).toHaveCount(0);
  const source = await page.content();
  expect(source).not.toMatch(/voiceId|avatarGroupId|xi_api|heygen_api/i);
});

test("Before & After comparison remains keyboard-safe", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/before-and-after/");
  const comparison = page.locator('[role="slider"]').first();
  await comparison.focus();
  await expect(comparison).toBeFocused();
  const before = await comparison.getAttribute("aria-valuenow");
  await page.keyboard.press("ArrowRight");
  await expect(comparison).not.toHaveAttribute("aria-valuenow", before!);
  await expect(page.locator("[data-featured-player]")).toHaveAttribute("preload", "none");
});

test("capture rebuilt Workshop pages at desktop and mobile widths", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Chromium owns the shared evidence files.");
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  const routes = [
    { slug: "hub", route: "/workshop/" },
    { slug: "projects", route: "/workshop/projects/" },
    { slug: "site-project", route: "/workshop/projects/hobfarm/" },
    { slug: "stylefusion", route: "/workshop/stylefusion/" },
    { slug: "presents", route: "/presents/" },
    { slug: "workshop-notes", route: "/workshop/workshop-notes/" },
    { slug: "character-mannequin", route: "/workshop/character-mannequin/" },
    { slug: "avatar-host", route: "/workshop/avatar-host/" },
    { slug: "before-after", route: "/workshop/before-and-after/" },
    { slug: "cute-corrupted", route: "/workshop/cute-and-corrupted/" },
    { slug: "alter-ego", route: "/workshop/alter-ego/" },
    { slug: "future-carriage", route: "/workshop/future-carriage/" },
  ] as const;

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ] as const) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const item of routes) {
      await page.goto(item.route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: "#nav-wrapper, astro-dev-toolbar, .fixed.inset-x-0.bottom-0 { display: none !important; }" });
      await loadPageImages(page);
      await page.screenshot({
        path: path.resolve("reports", "workshop-rebuild", `${item.slug}-${viewport.name}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
});
