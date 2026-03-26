import type { Page, Locator } from "@playwright/test";

export class SessionsPage {
  readonly page: Page;
  readonly container: Locator;
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly noSessions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("sessions-page");
    this.heading = page.locator("h1");
    this.createButton = page.getByTestId("create-session-button");
    this.noSessions = page.getByTestId("no-sessions");
  }

  async goto() {
    await this.page.goto("/sessions");
  }
}

export class NewSessionPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly dateInput: Locator;
  readonly createButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByTestId("session-title-input");
    this.dateInput = page.getByTestId("session-date-input");
    this.createButton = page.getByTestId("session-create-button");
    this.error = page.getByTestId("session-create-error");
  }

  async goto() {
    await this.page.goto("/sessions/new");
  }
}

export class SessionDetailPage {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly generateSummaryButton: Locator;
  readonly saveSummaryButton: Locator;
  readonly summaryEditor: Locator;
  readonly entryForm: Locator;
  readonly entryContentTextarea: Locator;
  readonly entrySubmitButton: Locator;
  readonly tagSearchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("session-detail");
    this.title = page.getByTestId("session-title");
    this.generateSummaryButton = page.getByTestId("generate-summary-button");
    this.saveSummaryButton = page.getByTestId("save-summary-button");
    this.summaryEditor = page.getByTestId("summary-editor");
    this.entryForm = page.getByTestId("session-entry-form");
    this.entryContentTextarea = page.getByTestId("entry-content-textarea");
    this.entrySubmitButton = page.getByTestId("entry-submit-button");
    this.tagSearchInput = page.getByTestId("tag-search-input");
  }
}
