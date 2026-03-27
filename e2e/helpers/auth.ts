import type { Page } from "@playwright/test";

const TEST_EMAIL = "christoph@chaos-forge.de";
const SUPABASE_PROJECT_REF = "ptozyrwvbngascgydjjt";

/**
 * Login via test-login API and set Supabase session cookies.
 * Supabase SSR stores auth tokens in cookies (not localStorage).
 */
export async function loginAsTestUser(page: Page) {
  // Step 1: Get tokens from test-login API
  const resp = await page.request.post("/api/test-login", {
    data: { email: TEST_EMAIL },
  });

  if (!resp.ok()) {
    throw new Error(`Test login API failed: ${resp.status()}`);
  }

  const { access_token, refresh_token } = await resp.json();

  if (!access_token) {
    throw new Error("No access_token in test-login response");
  }

  // Step 2: Build the session JSON that Supabase expects
  const sessionData = JSON.stringify({
    access_token,
    refresh_token,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  // Step 3: Set cookies in Playwright browser context
  // Supabase SSR stores session in chunked cookies: sb-{ref}-auth-token.0, .1, etc.
  // For sessions < 3500 chars, a single cookie suffices
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

  // Also set in localStorage via addInitScript (some Supabase client code reads from there)
  await page.context().addInitScript(
    ({ session, projectRef }) => {
      window.localStorage.setItem(`sb-${projectRef}-auth-token`, session);
    },
    { session: sessionData, projectRef: SUPABASE_PROJECT_REF }
  );

  // Step 4: Navigate to protected page
  await page.goto("/characters");
  await page.waitForTimeout(3000);

  if (page.url().includes("/login")) {
    throw new Error("Login failed — cookies did not establish session");
  }
}
