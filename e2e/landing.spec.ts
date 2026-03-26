import { test, expect } from "@playwright/test";
import { LandingPage } from "./pages/landing.page";

test.describe("Landing Page (unauthenticated)", () => {
  test("should show landing page with CTA", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();

    await expect(landing.heading).toContainText("Schmiede deine Legende");
    await expect(landing.ctaButton).toBeVisible();
  });

  test("should navigate to login when CTA is clicked", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();

    await landing.ctaButton.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
