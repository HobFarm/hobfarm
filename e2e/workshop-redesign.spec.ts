import { expect, test, type Locator, type Page } from "@playwright/test";
import path from "node:path";

const primaryRoutes = ["/", "/workshop/", "/workshop/ami-legacy/"] as const;
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "small-desktop", width: 1024, height: 900 },
  { name: "tablet", width: 768, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;
const deliverableViewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
] as const;
const screenshotOverlayStyle =
  "#nav-wrapper, #searchButton, astro-dev-toolbar, .fixed.inset-x-0.bottom-0 { display: none !important; }";

async function expectStablePage(page: Page, route: string, width: number) {
  const pageErrors: string[] = [];
  const onPageError = (error: Error) => pageErrors.push(error.message);
  page.on("pageerror", onPageError);

  try {
    await page.goto(route, { waitUntil: "domcontentloaded" });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("ERR_ABORTED")) throw error;
    await page.goto(route, { waitUntil: "domcontentloaded" });
  }
  const pageHeading = page.getByRole("heading", { level: 1 });
  await expect(pageHeading).toHaveCount(1);
  await expect(pageHeading).toBeVisible();
  await expect(page.locator("#nav-wrapper")).toHaveCount(1);

  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(width);
  expect(pageErrors).toEqual([]);

  page.off("pageerror", onPageError);
}

async function loadImagesIn(target: Locator) {
  const images = target.locator("img");

  for (let index = 0; index < (await images.count()); index += 1) {
    const image = images.nth(index);
    if (!(await image.isVisible())) continue;
    const source = await image.getAttribute("src");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          image.evaluate((element) => {
            const imageElement = element as HTMLImageElement;
            return imageElement.complete && imageElement.naturalWidth > 0;
          }),
        { message: `Image failed to load: ${source ?? "(no src)"}`, timeout: 15_000 },
      )
      .toBe(true);
  }
}

test("primary Workshop routes stay stable at the required viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of primaryRoutes) {
      await expectStablePage(page, route, viewport.width);
    }
  }
});

test("selected projects, media behavior, and inquiry preselection are wired", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/");

  const heroProjects = page.locator(".hero-media-wall a");
  await expect(heroProjects).toHaveCount(4);
  await expect(
    page.locator('.hero-media-wall a[href="/workshop/ami-legacy/"]'),
  ).toHaveCount(0);
  await expect(
    page.locator(
      '.hero-media-wall a[href="/departments/hobfarm-presents/other-alice-adventures/world-guide/"]',
    ),
  ).toHaveCount(1);

  const projectCards = page.locator("[data-workshop-project]");
  await expect(projectCards).toHaveCount(5);
  await loadImagesIn(projectCards);

  for (const href of [
    "/workshop/ami-legacy/",
    "/workshop/before-and-after/",
    "/workshop/stylefusion/",
    "/workshop/character-mannequin/",
    "/departments/hobfarm-presents/other-alice-adventures/world-guide/",
  ]) {
    await expect(projectCards.locator(`a[href="${href}"]`).or(page.locator(`[data-workshop-project][href="${href}"]`))).toHaveCount(1);
  }

  await page.goto("/");
  await expect(page.locator("[data-capability]")).toHaveCount(4);
  await expect(page.locator('[data-capability="before-after"] .evidence-board')).toBeVisible();
  await expect(page.locator('[data-capability="character-mannequin"] .production-rail')).toBeVisible();
  await expect(page.locator('[data-capability="stylefusion"] .compiler')).toBeVisible();
  await expect(page.locator('[data-capability="other-alice-world"] .world-teaser')).toBeVisible();
  await expect(page.locator(".future-carriage")).toBeVisible();

  await page.goto("/workshop/");
  const processVideo = page.locator("[data-process-video]");
  await expect(processVideo).toHaveAttribute("preload", "none");
  await expect(processVideo).toHaveAttribute("poster", /zima-process-film-wide-poster/);

  await page.goto("/workshop/ami-legacy/");
  const amiVideo = page.locator(".ami-video video");
  await expect(amiVideo).toHaveAttribute("preload", "none");
  await expect(amiVideo).toHaveAttribute("poster", /ami01\.WEBP/);
  await expect(amiVideo).not.toHaveAttribute("autoplay", "");

  for (const subjectCase of [
    {
      route: "/contact/?subject=creative-project",
      value: "creative-project",
      label: "Creative Project / Commission",
    },
    { route: "/contact/", value: "support", label: "Support" },
    {
      route: "/contact/?subject=not-a-real-subject",
      value: "support",
      label: "Support",
    },
  ]) {
    await page.goto(subjectCase.route);
    await expect(page.locator('select[name="subject"]')).toHaveValue(subjectCase.value);
    await expect(page.locator('select[name="subject"] option:checked')).toHaveText(subjectCase.label);
    if (subjectCase.value === "creative-project") {
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tell me what you're trying to make");
      await expect(page.getByText("A useful first brief")).toBeVisible();
    }
  }
});

test("homepage narrative, Wonder Machine status, and project routes stay explicit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sectionSelectors = [
    "#magazine-front-page",
    "#now-at-hobfarm",
    ".publication-bridge",
    "#home-workshop",
    "#wonder-machine",
    ".future-carriage",
    ".creative-inquiry",
    "#sections",
    "#shop-directory",
    "#explore",
  ];
  const positions = await Promise.all(
    sectionSelectors.map(async (selector) => {
      const box = await page.locator(selector).boundingBox();
      expect(box, selector).not.toBeNull();
      return box!.y;
    }),
  );
  expect(positions).toEqual([...positions].sort((a, b) => a - b));

  await expect(page.getByRole("link", { name: "Explore the Workshop" }).first()).toHaveAttribute("href", "/workshop/");
  await expect(page.getByRole("link", { name: "Start a project" }).first()).toHaveAttribute(
    "href",
    "/contact/?subject=creative-project",
  );
  await expect(page.locator("#wonder-machine")).toContainText(
    "Working locally. Public play is still in development.",
  );
  await expect(page.locator("#wonder-machine")).toContainText("Anomaly: known point of interest, not a mandatory quest");
  await expect(page.locator(".future-carriage")).toContainText("Self-directed HobFarm concept campaign");

  await page.goto("/departments/hobfarm-presents/other-alice-adventures/");
  await expect(page.locator("#wonder-machine")).toContainText("Wonderland can remember your visit");
  await expect(page.locator("#wonder-machine")).toContainText("finding the anomaly is optional");
  await expect(page.locator("#wonder-machine")).toContainText("There is no public build yet");

  await page.goto("/grimoire/");
  await expect(page.getByRole("heading", { name: "The first persistent Wonderland is running locally." })).toBeVisible();
  await expect(page.getByText("preserve refusal as a valid path", { exact: false })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/departments/hobfarm-presents/other-alice-adventures/",
    "/grimoire/",
    "/contact/?subject=creative-project",
  ]) {
    await expectStablePage(page, route, 390);
  }
});

test("Before & After comparison and avatar host navigation remain keyboard-safe", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/before-and-after/", { waitUntil: "domcontentloaded" });

  const comparison = page.locator('[role="slider"]').first();
  await comparison.focus();
  await expect(comparison).toBeFocused();
  await expect(comparison).toHaveAttribute("aria-valuenow", "50");
  await page.keyboard.press("ArrowRight");
  await expect(comparison).not.toHaveAttribute("aria-valuenow", "50");

  await page.goto("/workshop/character-mannequin/avatar-host-system/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#nav-wrapper")).toHaveCount(1);
  await expect(page.locator("[data-account-cta]")).toHaveCount(2);
  await expect(page.locator("[data-account-cta]:visible")).toHaveCount(1);
  await expect(page.locator("[data-account-cta]:visible")).toHaveAttribute(
    "href",
    "/login?next=/account",
  );
  await expect(page.getByRole("navigation", { name: "Avatar host system related routes" })).toBeVisible();
});

test("global navigation preserves active, authenticated, and mobile states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/workshop/ami-legacy/");

  const activeWorkshopLink = page.locator(
    '#nav-wrapper nav.hidden .nav-group > a[href="/workshop/"]',
  );
  await expect(activeWorkshopLink).toHaveCount(1);
  await expect(activeWorkshopLink).toHaveClass(/border-accent-500/);
  await expect(page.locator("[data-account-cta]:visible")).toHaveAttribute(
    "href",
    "/login?next=/account",
  );

  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ authenticated: true }),
    });
  });
  await page.reload();
  await expect(page.locator("[data-account-cta]:visible")).toHaveAttribute(
    "href",
    "/account",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about/");
  const menuToggle = page.getByRole("button", { name: "Toggle main menu" });
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu")).not.toHaveAttribute("inert", "");
  await expect(page.locator("#mobile-menu")).not.toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("#mobile-menu [data-account-cta]")).toHaveAttribute(
    "href",
    "/account",
  );
});

test("capture Workshop redesign evidence", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const homeWorkshopDesktop = page.locator("#home-workshop");
  await loadImagesIn(homeWorkshopDesktop);
  await homeWorkshopDesktop.screenshot({
    path: path.resolve("reports", "workshop-redesign-home-desktop.png"),
    animations: "disabled",
  });

  await page.goto("/workshop/");
  const workshopHeroDesktop = page.locator(".workshop-hero");
  await loadImagesIn(workshopHeroDesktop);
  await workshopHeroDesktop.screenshot({
    path: path.resolve("reports", "workshop-redesign-landing-hero-desktop.png"),
    animations: "disabled",
  });
  const selectedProjectsDesktop = page.locator("#selected-projects");
  await loadImagesIn(selectedProjectsDesktop);
  await selectedProjectsDesktop.screenshot({
    path: path.resolve("reports", "workshop-redesign-selected-projects-desktop.png"),
    animations: "disabled",
  });
  const futureCarriageDesktop = page.locator(".future-carriage-feature");
  await loadImagesIn(futureCarriageDesktop);
  await futureCarriageDesktop.screenshot({
    path: path.resolve("reports", "workshop-redesign-future-carriage-feature-desktop.png"),
    animations: "disabled",
  });

  await page.goto("/workshop/ami-legacy/");
  const carriageCaseDesktop = page.locator(".campaign-reveal");
  await loadImagesIn(carriageCaseDesktop);
  await carriageCaseDesktop.screenshot({
    path: path.resolve("reports", "workshop-redesign-carriage-case-desktop.png"),
    animations: "disabled",
  });

  await page.goto("/workshop/before-and-after/");
  const programDesktop = page.locator(".archive-hero");
  await loadImagesIn(programDesktop);
  await programDesktop.screenshot({
    path: path.resolve("reports", "workshop-redesign-program-desktop.png"),
    animations: "disabled",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const homeWorkshopMobile = page.locator("#home-workshop");
  await loadImagesIn(homeWorkshopMobile);
  await homeWorkshopMobile.screenshot({
    path: path.resolve("reports", "workshop-redesign-home-mobile.png"),
    animations: "disabled",
  });

  await page.goto("/workshop/");
  const workshopHeroMobile = page.locator(".workshop-hero");
  await loadImagesIn(workshopHeroMobile);
  await workshopHeroMobile.screenshot({
    path: path.resolve("reports", "workshop-redesign-landing-hero-mobile.png"),
    animations: "disabled",
  });
  const selectedProjectsMobile = page.locator("#selected-projects");
  await loadImagesIn(selectedProjectsMobile);
  await selectedProjectsMobile.screenshot({
    path: path.resolve("reports", "workshop-redesign-selected-projects-mobile.png"),
    animations: "disabled",
  });

  await page.goto("/workshop/ami-legacy/");
  const carriageCaseMobile = page.locator(".campaign-reveal");
  await loadImagesIn(carriageCaseMobile);
  await carriageCaseMobile.screenshot({
    path: path.resolve("reports", "workshop-redesign-carriage-case-mobile.png"),
    animations: "disabled",
  });
});

test("capture homepage restructuring evidence", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium", "One browser owns the evidence files.");
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of deliverableViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await loadImagesIn(page.locator("body"));
    await page.addStyleTag({ content: screenshotOverlayStyle });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.resolve("reports", "homepage-restructure", `final-home-${viewport.name}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }

  for (const viewport of [
    { name: "1440x900", width: 1440, height: 900 },
    { name: "390x844", width: 390, height: 844 },
  ] as const) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    await page.goto("/");
    await page.addStyleTag({ content: screenshotOverlayStyle });
    const homeWonderMachine = page.locator("#wonder-machine");
    await loadImagesIn(homeWonderMachine);
    await homeWonderMachine.screenshot({
      path: path.resolve("reports", "homepage-restructure", `final-home-wonder-machine-${viewport.name}.png`),
      animations: "disabled",
    });

    await page.goto("/departments/hobfarm-presents/other-alice-adventures/");
    await page.addStyleTag({ content: screenshotOverlayStyle });
    const otherAliceWonderMachine = page.locator("#wonder-machine");
    await loadImagesIn(otherAliceWonderMachine);
    await otherAliceWonderMachine.screenshot({
      path: path.resolve("reports", "homepage-restructure", `final-other-alice-${viewport.name}.png`),
      animations: "disabled",
    });

    await page.goto("/grimoire/");
    await page.addStyleTag({ content: screenshotOverlayStyle });
    const grimoireCurrentState = page.locator("#grimoire-current-state");
    await loadImagesIn(grimoireCurrentState);
    await grimoireCurrentState.screenshot({
      path: path.resolve("reports", "homepage-restructure", `final-grimoire-${viewport.name}.png`),
      animations: "disabled",
    });
  }
});
