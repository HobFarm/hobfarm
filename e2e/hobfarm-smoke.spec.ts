import { expect, test, type Page } from "@playwright/test";

const smokeRoutes = [
  "/",
  "/articles/",
  "/presents/",
  "/presents/funnies/",
  "/workshop/",
  "/workshop/projects/",
  "/gallery/",
  "/academy/",
  "/shop/",
  "/about/",
];

const plannedDepartmentNames = [
  "WTFacts?",
  "Commercial Satire",
  "Picture Stories",
  "Critter Feed",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function expectPageShell(page: Page) {
  await expect(page).toHaveTitle(/HobFarm/);
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("main, h1").first()).toBeVisible();
}

async function expectNoPlannedDepartmentPromotion(page: Page) {
  for (const name of plannedDepartmentNames) {
    const startsWithName = new RegExp(`^${escapeRegExp(name)}(?:\\s|$)`);
    await expect(page.getByRole("heading", { name, exact: true })).toHaveCount(0);
    await expect(page.getByRole("link", { name: startsWithName })).toHaveCount(0);
  }
}

test.describe("HobFarm public smoke routes", () => {
  for (const route of smokeRoutes) {
    test(`${route} loads with a page shell`, async ({ page }) => {
      await page.goto(route);
      await expectPageShell(page);
    });
  }
});

test("homepage does not promote planned departments", async ({ page }) => {
  await page.goto("/");

  await expectNoPlannedDepartmentPromotion(page);
});

test("current Articles and Presents hubs do not promote planned legacy departments", async ({ page }) => {
  await page.goto("/articles/");

  await expectNoPlannedDepartmentPromotion(page);

  await page.goto("/presents/");

  await expectNoPlannedDepartmentPromotion(page);
});

test("canonical Funnies route visibly identifies itself", async ({ page }) => {
  await page.goto("/presents/funnies/");

  await expect(page.getByRole("heading", { name: "Funnies", exact: true }).first()).toBeVisible();
});
