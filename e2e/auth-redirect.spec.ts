import { test, expect } from "@playwright/test";

test.describe("Auth-protected routes redirect to login", () => {
  test("should redirect /characters to /login without auth", async ({ page }) => {
    await page.goto("/characters");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect /characters/new to /login without auth", async ({ page }) => {
    await page.goto("/characters/new");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect /characters/some-id to /login without auth", async ({ page }) => {
    await page.goto("/characters/00000000-0000-0000-0000-000000000000");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect /characters/some-id/print to /login without auth", async ({ page }) => {
    await page.goto("/characters/00000000-0000-0000-0000-000000000000/print");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect /sessions to /login without auth", async ({ page }) => {
    await page.goto("/sessions");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect /sessions/new to /login without auth", async ({ page }) => {
    await page.goto("/sessions/new");
    await expect(page).toHaveURL(/\/login/);
  });
});
