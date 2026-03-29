import type { FullConfig } from "@playwright/test";

const TEST_EMAIL = "christoph@chaos-forge.de";

/**
 * Global setup: seeds test characters (Gor, Elara) before all E2E tests.
 * Runs once before any test file. Idempotent — safe to run multiple times.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3000";

  // Wait for the server to be ready
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${baseURL}/login`);
      if (res.ok) break;
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Seed test characters
  const resp = await fetch(`${baseURL}/api/test-seed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    console.warn(`⚠ Test seed failed (${resp.status}): ${body}`);
  } else {
    const data = await resp.json();
    if (data.created?.length > 0) {
      console.log(`✓ Test characters seeded: ${data.created.join(", ")}`);
    } else {
      console.log("✓ Test characters already exist");
    }
  }
}
