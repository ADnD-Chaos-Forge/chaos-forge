import { test as setup, expect } from "@playwright/test";

const SUPABASE_PROJECT_REF = "ptozyrwvbngascgydjjt";
const TEST_EMAIL = "QA-primary@qa.chaosforge.test";

export const AUTH_FILE = "e2e/.auth/user.json";

/**
 * Runs once before all test files.
 * Authenticates via test-login API and saves browser state (cookies + localStorage)
 * so that parallel workers can reuse the same session without repeated API calls.
 *
 * Deliberately creates no data: the session is verified by loading a protected
 * page and confirming it does not bounce to the login screen.
 */
setup("authenticate", async ({ page }) => {
  const resp = await page.request.post("/api/test-login", {
    data: { email: TEST_EMAIL },
  });
  expect(resp.ok(), "test-login API should succeed").toBeTruthy();

  const { access_token, refresh_token } = await resp.json();
  expect(access_token, "access_token should be present").toBeTruthy();

  const sessionData = JSON.stringify({
    access_token,
    refresh_token,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  const cookieName = `sb-${SUPABASE_PROJECT_REF}-auth-token.0`;

  await page.context().addCookies([
    {
      name: cookieName,
      value: sessionData,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // Verify the session works — characters page loads (not redirect to login).
  // Waiting on the grid would require a seeded character; the redirect check
  // alone proves the session, and the setup leaves no data behind.
  await page.goto("/characters");
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  await expect(page.getByRole("main")).toBeVisible({ timeout: 15000 });

  // Pre-dismiss all tutorial overlays so they don't intercept clicks in tests.
  await page.evaluate(() => {
    localStorage.setItem(
      "chaos-forge-tutorial-dismissed",
      JSON.stringify({ dashboard: true, characters: true, party: true, chronicle: true })
    );
  });

  // Save state for all workers to reuse
  await page.context().storageState({ path: AUTH_FILE });
});
