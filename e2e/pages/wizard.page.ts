import type { Page, Locator } from "@playwright/test";

export class WizardPage {
  readonly page: Page;
  readonly container: Locator;
  readonly nameInput: Locator;
  readonly levelInput: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly createButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("character-wizard");
    this.nameInput = page.getByTestId("wizard-name-input");
    this.levelInput = page.getByTestId("wizard-level-input");
    this.nextButton = page.getByTestId("wizard-next-button");
    this.prevButton = page.getByTestId("wizard-prev-button");
    this.createButton = page.getByTestId("wizard-create-button");
    this.errorMessage = page.getByTestId("wizard-error");
  }

  async goto() {
    await this.page.goto("/characters/new");
  }

  abilityInput(ability: string): Locator {
    return this.page.getByTestId(`wizard-ability-${ability}`);
  }

  raceCard(raceId: string): Locator {
    return this.page.getByTestId(`wizard-race-${raceId}`);
  }

  classCard(classId: string): Locator {
    return this.page.getByTestId(`wizard-class-${classId}`);
  }

  get hpMaxInput(): Locator {
    return this.page.getByTestId("wizard-hp-max");
  }

  get thac0Display(): Locator {
    return this.page.getByTestId("wizard-thac0");
  }

  get summaryStep(): Locator {
    return this.page.getByTestId("wizard-step-summary");
  }
}
