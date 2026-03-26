import type { Page, Locator } from "@playwright/test";

export class PrintSheetPage {
  readonly page: Page;
  readonly container: Locator;
  readonly personalSection: Locator;
  readonly abilitiesSection: Locator;
  readonly combatSection: Locator;
  readonly savesSection: Locator;
  readonly notesSection: Locator;
  readonly printTriggerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("print-sheet");
    this.personalSection = page.getByTestId("print-section-personal");
    this.abilitiesSection = page.getByTestId("print-section-abilities");
    this.combatSection = page.getByTestId("print-section-combat");
    this.savesSection = page.getByTestId("print-section-saves");
    this.notesSection = page.getByTestId("print-section-notes");
    this.printTriggerButton = page.getByTestId("print-trigger-button");
  }

  async goto(characterId: string) {
    await this.page.goto(`/characters/${characterId}/print`);
  }
}
