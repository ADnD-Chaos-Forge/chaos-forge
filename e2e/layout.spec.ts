import { test, expect } from "@playwright/test";

test.describe("Layout & Branding", () => {
  test("should display header logo", async ({ page }) => {
    await page.goto("/");
    const headerLogo = page.locator('header img[alt="Chaos Forge"]');
    await expect(headerLogo).toBeVisible();
  });

  // Footer was removed in UI-Redesign (replaced by sidebar/bottom-nav)

  test("should have correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Chaos Forge/);
  });

  test("should display tagline on homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Schmiede deine Legende");
  });

  test("header logo should link to homepage", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("header a");
    await expect(link).toHaveAttribute("href", "/");
  });

  test("should have favicon configured", async ({ page }) => {
    await page.goto("/");
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon.first()).toHaveAttribute("href", /favicon/);
  });

  test("should have web manifest configured", async ({ page }) => {
    await page.goto("/");
    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute("href", "/site.webmanifest");
  });
});
