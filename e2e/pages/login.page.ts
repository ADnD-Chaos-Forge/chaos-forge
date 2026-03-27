import type { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly codeInput: Locator;
  readonly verifyButton: Locator;
  readonly resendButton: Locator;
  readonly changeEmailButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("login-email-input");
    this.submitButton = page.getByTestId("login-submit-button");
    this.codeInput = page.getByTestId("login-code-input");
    this.verifyButton = page.getByTestId("login-verify-button");
    this.resendButton = page.getByTestId("login-resend-button");
    this.changeEmailButton = page
      .locator("text=Use a different email")
      .or(page.locator("text=Andere E-Mail verwenden"));
    this.successMessage = page.getByTestId("login-success-message");
    this.errorMessage = page.getByTestId("login-error-message");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
  }

  async fillCode(code: string) {
    await this.codeInput.fill(code);
  }

  async verify() {
    await this.verifyButton.click();
  }
}
