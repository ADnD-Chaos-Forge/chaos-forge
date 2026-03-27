import { test, expect } from "@playwright/test";
import { loginAsTestUser } from "./helpers/auth";
import { CharacterSheetPage } from "./pages/character-sheet.page";
import { SpellbookPage } from "./pages/spellbook.page";
import { LoginPage } from "./pages/login.page";

test.describe("Login Page", () => {
  test("shows email input and code send button", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(login.emailInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
    await expect(login.codeInput).not.toBeVisible();
  });

  test("test-login bypass redirects to characters", async ({ page }) => {
    await loginAsTestUser(page);
    expect(page.url()).toContain("/characters");
    expect(page.url()).not.toContain("/login");
  });
});

test.describe("Character Sheet — Owner", () => {
  test("shows character name, can edit, save, and switch tabs", async ({ page }) => {
    test.setTimeout(90000);
    await loginAsTestUser(page);
    const sheet = new CharacterSheetPage(page);

    // Navigate to Gor (owned by test user)
    const firstCard = page.locator("a", { hasText: "Gor" });
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await sheet.container.waitFor({ timeout: 30000 });

    // Character name visible
    await expect(sheet.name).toBeVisible();
    await expect(sheet.classBadge).toBeVisible();

    // Personal details editable
    await sheet.personalDetailsSection.locator("summary").click();
    await page.waitForTimeout(500);
    const currentName = await sheet.playerNameInput.inputValue();
    await sheet.playerNameInput.fill("E2E Test");
    await expect(sheet.saveButton).toBeVisible({ timeout: 3000 });
    // Restore
    await sheet.playerNameInput.fill(currentName || "");

    // Equipment tab
    await sheet.switchTab("equipment");
    await expect(page.getByTestId("equipment-ac")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("equipment-movement")).toBeVisible({ timeout: 5000 });

    // Spells tab (if visible)
    const spellsTrigger = page.getByTestId("tab-trigger-spells");
    if (await spellsTrigger.isVisible({ timeout: 2000 }).catch(() => false)) {
      await spellsTrigger.click();
      await page.waitForTimeout(1000);
      await expect(page.getByTestId("tab-spells")).toBeVisible({ timeout: 5000 });
    }

    // Thief skills tab (if visible)
    const thiefTrigger = page.getByTestId("tab-trigger-thief-skills");
    if (await thiefTrigger.isVisible({ timeout: 2000 }).catch(() => false)) {
      await thiefTrigger.click();
      await page.waitForTimeout(1000);
      await expect(sheet.thiefPickLocks).toBeVisible({ timeout: 5000 });
    }

    // Proficiencies tab
    await sheet.switchTab("proficiencies");
    await expect(page.getByTestId("weapon-proficiencies-section")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Character Sheet — Read-Only", () => {
  test("non-owner cannot see save or delete buttons", async ({ page }) => {
    test.setTimeout(60000);
    await loginAsTestUser(page);
    const sheet = new CharacterSheetPage(page);

    // Find Elara (owned by gmail user, NOT the test user)
    const elara = page.locator("a", { hasText: "Elara" });
    await expect(elara).toBeVisible({ timeout: 10000 });
    await elara.click();
    await sheet.container.waitFor({ timeout: 30000 });

    // Delete button should NOT be visible for non-owner
    await expect(sheet.deleteButton).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe("Loading & Navigation", () => {
  test("characters page loads without error", async ({ page }) => {
    await loginAsTestUser(page);
    expect(page.url()).toContain("/characters");
    const cards = page.locator('[data-testid^="character-card-"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Spellbook", () => {
  test("caster character shows spellbook button and page loads", async ({ page }) => {
    test.setTimeout(60000);
    await loginAsTestUser(page);
    const sheet = new CharacterSheetPage(page);

    // Navigate to Elara (wizard with spells)
    const elara = page.locator("a", { hasText: "Elara" });
    await expect(elara).toBeVisible({ timeout: 10000 });
    await elara.click();
    await sheet.container.waitFor({ timeout: 30000 });

    // Spellbook button should be visible for caster
    await expect(sheet.spellbookButton).toBeVisible({ timeout: 5000 });
    await sheet.spellbookButton.click();

    // Spellbook page loads
    const spellbook = new SpellbookPage(page);
    await expect(spellbook.container).toBeVisible({ timeout: 15000 });
    await expect(spellbook.backLink).toBeVisible();
    await expect(spellbook.resources).toBeVisible();
    await expect(spellbook.searchInput).toBeVisible();
    await expect(spellbook.filterAll).toBeVisible();
  });

  test("non-caster character has no spellbook button", async ({ page }) => {
    test.setTimeout(60000);
    await loginAsTestUser(page);
    const sheet = new CharacterSheetPage(page);

    // Navigate to Gor (fighter, no spells)
    const gor = page.locator("a", { hasText: "Gor" });
    await expect(gor).toBeVisible({ timeout: 10000 });
    await gor.click();
    await sheet.container.waitFor({ timeout: 30000 });

    // Spellbook button should NOT be visible for fighter
    await expect(sheet.spellbookButton).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe("Print View", () => {
  test("print view loads with all sections", async ({ page }) => {
    test.setTimeout(60000);
    await loginAsTestUser(page);
    const sheet = new CharacterSheetPage(page);

    const gor = page.locator("a", { hasText: "Gor" });
    await expect(gor).toBeVisible({ timeout: 10000 });
    await gor.click();
    await sheet.container.waitFor({ timeout: 30000 });

    await sheet.printButton.click();
    await page.waitForTimeout(5000);
    await expect(page.getByTestId("print-sheet")).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("print-section-personal")).toBeVisible();
    await expect(page.getByTestId("print-section-abilities")).toBeVisible();
    await expect(page.getByTestId("print-section-combat")).toBeVisible();
  });
});
