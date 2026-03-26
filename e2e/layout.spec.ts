import { test, expect } from "@playwright/test";

test.describe("Layout & Branding", () => {
  test("should display header logo", async ({ page }) => {
    await page.goto("/");
    const headerLogo = page.locator('header img[alt="Chaos Forge"]');
    await expect(headerLogo).toBeVisible();
  });

  test("should display footer logo", async ({ page }) => {
    await page.goto("/");
    const footerLogo = page.locator('footer img[alt="Chaos Forge — Est. 2nd Ed."]');
    await expect(footerLogo).toBeVisible();
  });

  test("should display footer text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText("Chaos RPG");
  });

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
