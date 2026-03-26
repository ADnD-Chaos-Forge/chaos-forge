import type { Page, Locator } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly container: Locator;
  readonly ctaButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("landing-page");
    this.ctaButton = page.getByTestId("cta-login-button");
    this.heading = page.locator("h1");
  }

  async goto() {
    await this.page.goto("/");
  }
}
