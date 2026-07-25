import type { Page, Locator } from "@playwright/test";
import type { ScannedUpdatePayload } from "../../src/lib/scan/character-scan-prompt";

export class RescanPage {
  readonly page: Page;
  readonly container: Locator;
  readonly dropzone: Locator;
  readonly fileInput: Locator;
  readonly preciseToggle: Locator;
  readonly scanButton: Locator;
  readonly changeList: Locator;
  readonly noChanges: Locator;
  readonly totalCount: Locator;
  readonly selectedCount: Locator;
  readonly selectAll: Locator;
  readonly selectNone: Locator;
  readonly applyButton: Locator;
  readonly newFilesButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId("rescan-page");
    this.dropzone = page.getByTestId("rescan-dropzone");
    this.fileInput = page.getByTestId("rescan-file-input");
    this.preciseToggle = page.getByTestId("rescan-precise-toggle");
    this.scanButton = page.getByTestId("rescan-scan-button");
    this.changeList = page.getByTestId("rescan-change-list");
    this.noChanges = page.getByTestId("rescan-no-changes");
    this.totalCount = page.getByTestId("rescan-total-count");
    this.selectedCount = page.getByTestId("rescan-selected-count");
    this.selectAll = page.getByTestId("rescan-select-all");
    this.selectNone = page.getByTestId("rescan-select-none");
    this.applyButton = page.getByTestId("rescan-apply-button");
    this.newFilesButton = page.getByTestId("rescan-new-files-button");
    this.error = page.getByTestId("rescan-error");
  }

  async goto(characterId: string) {
    await this.page.goto(`/characters/${characterId}/rescan`);
  }

  /**
   * Fängt den Vision-Endpoint ab und liefert einen festen Payload zurück.
   * Hält den Test deterministisch und kostet keine API-Tokens.
   */
  async mockScan(payload: Partial<ScannedUpdatePayload>) {
    await this.page.route("**/api/scan-character*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          payload: {
            printed: {},
            handwritten: {},
            equipment: [],
            spells: [],
            weaponProficiencies: [],
            nwps: [],
            languages: [],
            ...payload,
          },
        }),
      });
    });
  }

  /** Schiebt eine Attrappen-Datei in die Auswahl und startet den Scan. */
  async uploadAndScan() {
    await this.container.waitFor();
    await this.dropzone.waitFor({ state: "visible" });

    const file = {
      name: "sheet.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64"
      ),
    };

    await this.fileInput.setInputFiles(file);

    // Der Scan-Button erscheint erst, wenn React die Auswahl verarbeitet hat.
    // Trifft das change-Event den Input vor der Hydration, geht es ins Leere —
    // dann die Auswahl einmal neu setzen.
    try {
      await this.scanButton.waitFor({ state: "visible", timeout: 3000 });
    } catch {
      await this.fileInput.setInputFiles([]);
      await this.fileInput.setInputFiles(file);
      await this.scanButton.waitFor({ state: "visible", timeout: 10_000 });
    }

    await this.scanButton.click();
  }

  row(changeId: string): Locator {
    return this.page.getByTestId(`rescan-change-${changeId}`);
  }

  checkbox(changeId: string): Locator {
    return this.page.getByTestId(`rescan-change-${changeId}-checkbox`);
  }

  input(changeId: string): Locator {
    return this.page.getByTestId(`rescan-change-${changeId}-input`);
  }

  conflictToggle(changeId: string): Locator {
    return this.page.getByTestId(`rescan-change-${changeId}-conflict-toggle`);
  }

  groupToggle(category: string): Locator {
    return this.page.getByTestId(`rescan-group-toggle-${category}`);
  }

  groupCount(category: string): Locator {
    return this.page.getByTestId(`rescan-group-count-${category}`);
  }
}
