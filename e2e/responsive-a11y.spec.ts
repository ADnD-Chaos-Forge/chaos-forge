import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loginAsTestUser } from "./helpers/auth";

// ─── Mobile Responsive Tests (iPhone 13 viewport) ──────────────────────────

const MOBILE_VIEWPORT = { width: 390, height: 844 };

test.describe("Mobile Responsive (iPhone 13)", () => {
  test("landing page renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto("/");
    await expect(page.getByTestId("landing-page")).toBeVisible();
    // Glass card should be visible
    const cta = page.getByTestId("cta-login-button");
    await expect(cta).toBeVisible();
    // No horizontal overflow
    const body = page.locator("body");
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("login page renders correctly on mobile", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto("/login");
    await expect(page.getByTestId("login-email-input")).toBeVisible();
    await expect(page.getByTestId("login-submit-button")).toBeVisible();
  });

  test("characters page — mobile nav has more menu", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await loginAsTestUser(page);
    // Mobile bottom nav should be visible
    await expect(page.getByTestId("app-nav-mobile")).toBeVisible();
    // More button should exist
    const moreTrigger = page.getByTestId("mobile-more-trigger");
    await expect(moreTrigger).toBeVisible();
    // Click more to open panel
    await moreTrigger.click();
    await expect(page.getByTestId("mobile-more-panel")).toBeVisible();
  });

  test("character cards render without overflow on mobile", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await loginAsTestUser(page);
    const grid = page.getByTestId("active-characters-grid");
    await expect(grid).toBeVisible({ timeout: 10000 });
    // Cards should not cause horizontal scroll
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 1);
  });

  test("character sheet tabs wrap on mobile", async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize(MOBILE_VIEWPORT);
    await loginAsTestUser(page);
    // Navigate to first character
    const firstCard = page.locator("[data-testid^='character-card-']").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    // Tabs should be visible and wrapped (not scrolling)
    const tabs = page.getByTestId("sheet-tabs");
    await expect(tabs).toBeVisible({ timeout: 15000 });
    const tabsScrollWidth = await tabs.evaluate((el) => el.scrollWidth);
    const tabsClientWidth = await tabs.evaluate((el) => el.clientWidth);
    // flex-wrap means scrollWidth should equal clientWidth (no overflow)
    expect(tabsScrollWidth).toBeLessThanOrEqual(tabsClientWidth + 2);
  });
});

// ─── Accessibility Tests (Authenticated Pages) ─────────────────────────────

test.describe("Accessibility — Authenticated Pages (WCAG 2 AA)", () => {
  test("characters page should have no critical a11y violations", async ({ page }) => {
    await loginAsTestUser(page);
    await page.getByTestId("active-characters-grid").waitFor({ timeout: 10000 });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude(".no-scrollbar") // exclude known utility class
      .analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    if (critical.length > 0) {
      console.log("A11y violations:", JSON.stringify(critical, null, 2));
    }
    expect(critical).toEqual([]);
  });

  test("character sheet should have no critical a11y violations", async ({ page }) => {
    test.setTimeout(60000);
    await loginAsTestUser(page);
    const firstCard = page.locator("[data-testid^='character-card-']").first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.getByTestId("sheet-tabs").waitFor({ timeout: 15000 });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    if (critical.length > 0) {
      console.log("A11y violations:", JSON.stringify(critical, null, 2));
    }
    expect(critical).toEqual([]);
  });

  test("new character choice page should have no critical a11y violations", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/characters/new");
    await page.getByTestId("new-character-page").waitFor({ timeout: 10000 });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical).toEqual([]);
  });

  test("dashboard should have no critical a11y violations", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/dashboard");
    await page.getByTestId("dashboard-page").waitFor({ timeout: 10000 });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical).toEqual([]);
  });
});
