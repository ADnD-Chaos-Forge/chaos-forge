import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";

test.describe("Login Page", () => {
  test("should display login form", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toHaveText("Magic Link senden");
  });

  test("should require email before submitting", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // HTML5 validation should prevent submission without email
    await expect(loginPage.emailInput).toHaveAttribute("required", "");
  });
});
