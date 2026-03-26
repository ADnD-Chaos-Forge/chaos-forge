import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  test("should use dark theme background on 404 pages", async ({ page }) => {
    await page.goto("/nonexistent-page");
    // The 404 page should not have a white background
    const body = page.locator("body");
    const bgColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Should not be white (rgb(255,255,255))
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });

  test("should show a themed 404 message", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByTestId("not-found-page")).toBeVisible();
  });
});
