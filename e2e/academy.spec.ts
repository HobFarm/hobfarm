import { expect, test } from "@playwright/test";

const screenshots = "reports/academy-qa";

test("Academy public routes, locked boundary, checkout return, and account view", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Desktop Academy QA runs once.");

  await page.goto("/academy/");
  await expect(page.getByRole("heading", { level: 1, name: "Learn the system behind the work." })).toBeVisible();
  await expect(page.getByText("Available now")).toBeVisible();
  await expect(page.getByText("Planned", { exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshots}/academy-catalog.png`, fullPage: true });

  await page.goto("/academy/courses/keep-the-character/");
  await expect(page.getByRole("heading", { level: 1, name: /Keep the Character/ })).toBeVisible();
  await expect(page.getByText("This course is not for sale yet.")).toBeVisible();
  await expect(page.locator("video track[kind=captions]")).toHaveCount(1);
  await page.screenshot({ path: `${screenshots}/character-course-preview.png`, fullPage: true });

  await page.route("**/api/academy/avatar-content-system/lesson/create-the-starter-source-file", (route) => route.fulfill({
    status: 401,
    contentType: "application/json",
    headers: { "Cache-Control": "private, no-store" },
    body: JSON.stringify({
      locked: true,
      error: "login_required",
      message: "Sign in to check permanent purchase or membership access.",
      login_url: "/login?next=/academy/avatar-content-system/course/create-the-starter-source-file",
      purchase_url: "/academy/courses/avatar-content-system/#access",
      membership_url: "/membership/",
    }),
  }));
  await page.goto("/academy/avatar-content-system/course/create-the-starter-source-file/");
  await expect(page.getByRole("heading", { name: "Permanent access or membership unlocks this lesson." })).toBeVisible();
  await page.screenshot({ path: `${screenshots}/avatar-locked-preview.png`, fullPage: true });

  await page.route("**/api/academy/checkout-status?session_id=cs_test_academyqa12345", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ status: "paid", course_url: "/academy/courses/avatar-content-system/" }),
  }));
  await page.goto("/academy/checkout/complete/?session_id=cs_test_academyqa12345");
  await expect(page.getByRole("heading", { name: "The permanent course grant is attached to your account." })).toBeVisible();
  await page.screenshot({ path: `${screenshots}/checkout-return-verified.png`, fullPage: true });

  await page.route("**/api/academy/access", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      subscription: { status: "active", current_period_end: 1798761600, cancel_at_period_end: 0 },
      active_membership: true,
      courses: [
        { course_id: "academy-course-avatar-v1", slug: "avatar-content-system", title: "Avatar Content System Starter Kit", href: "/academy/courses/avatar-content-system/", continue_href: "/academy/avatar-content-system/course/create-the-starter-source-file/", status: "available", access_source: "purchase", completed_lessons: 4, total_lessons: 16, complete: false, repair_code: "AC-AVATAR-QATEST" },
        { course_id: "academy-course-self-defense-v1", slug: "intellectual-self-defense", title: "Intellectual Self-Defense for Ordinary People", href: "/academy/courses/intellectual-self-defense/", continue_href: "/academy/intellectual-self-defense/", status: "available", access_source: "public", completed_lessons: 9, total_lessons: 9, complete: true, repair_code: "AC-DEFENSE-QATEST" },
      ],
      purchases: [{ purchase_id: "qa-purchase", product_key: "academy_avatar_content_system_v1", provider: "stripe", provider_order_id: "cs_test_redacted", amount: 700, currency: "USD", status: "paid", paid_at: 1785974400 }],
      progress: [],
    }),
  }));
  await page.route("**/api/auth/me", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ user: { id: "academy_qa_user", email: "academy-qa@example.com", email_verified_at: 1785974400, newsletter_opt_in: false, created_at: 1767225600 } }),
  }));
  await page.route("**/api/auth/me/subscription", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ subscription: { status: "active", current_period_end: 1798761600, cancel_at_period_end: false } }),
  }));
  await page.goto("/account/");
  await expect(page.getByText("Purchased courses", { exact: true })).toBeVisible();
  const academy = page.locator('section[aria-labelledby="account-academy-heading"]');
  await expect(academy.getByText("4 of 16 lessons complete")).toBeVisible();
  await page.screenshot({ path: `${screenshots}/account-academy-access.png`, fullPage: true });
});

test("Academy lesson is readable on a narrow mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile Academy QA runs once.");
  await page.goto("/academy/avatar-content-system/course/what-you-are-building/");
  await expect(page.getByRole("heading", { level: 1, name: "What You Are Building" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark lesson complete" })).toBeVisible();
  await page.screenshot({ path: `${screenshots}/mobile-avatar-lesson.png`, fullPage: true });
});
