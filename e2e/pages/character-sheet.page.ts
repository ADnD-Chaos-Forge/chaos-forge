import type { Page, Locator } from "@playwright/test";

export class CharacterSheetPage {
  readonly page: Page;
  readonly container: Locator;
  readonly name: Locator;
  readonly avatarUploadTrigger: Locator;
  readonly avatarImage: Locator;
  readonly avatarInitials: Locator;
  readonly avatarUploadModal: Locator;
  readonly avatarDropzone: Locator;
  readonly printButton: Locator;
  readonly saveButton: Locator;
  readonly tabs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("character-sheet");
    this.name = page.getByTestId("sheet-name");
    this.avatarUploadTrigger = page.getByTestId("avatar-upload-trigger");
    this.avatarImage = page.getByTestId("avatar-image");
    this.avatarInitials = page.getByTestId("avatar-initials");
    this.avatarUploadModal = page.getByTestId("avatar-upload-modal");
    this.avatarDropzone = page.getByTestId("avatar-dropzone");
    this.printButton = page.getByTestId("sheet-print-button");
    this.saveButton = page.getByTestId("sheet-save-button");
    this.tabs = page.getByTestId("sheet-tabs");
  }

  async goto(characterId: string) {
    await this.page.goto(`/characters/${characterId}`);
  }

  async openAvatarUpload() {
    await this.avatarUploadTrigger.click();
  }
}
