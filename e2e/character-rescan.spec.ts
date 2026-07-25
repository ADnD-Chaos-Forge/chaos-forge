import { test, expect, type Page } from "@playwright/test";
import { RescanPage } from "./pages/rescan.page";
import { CharacterSheetPage } from "./pages/character-sheet.page";

const TEST_EMAIL = "QA-primary@qa.chaosforge.test";
const BASE_URL = "http://localhost:3000";

/** Legt einen Charakter mit bekannten Werten an, gegen die gediffed wird. */
async function createRescanChar(request: Page["request"], name: string): Promise<string> {
  const resp = await request.put(`${BASE_URL}/api/test-seed`, {
    data: {
      email: TEST_EMAIL,
      character: {
        name,
        race_id: "elf",
        class_id: "thief",
        level: 3,
        str: 12,
        dex: 17,
        con: 13,
        int: 14,
        wis: 10,
        cha: 15,
        hp_current: 18,
        hp_max: 24,
        alignment: "chaotic_neutral",
        gold_gp: 120,
        classes: [{ class_id: "thief", level: 3, xp_current: 5500 }],
      },
    },
  });
  const data = await resp.json();
  return data.character_id;
}

test.describe("Charakterbogen-Rescan", () => {
  test("shows detected changes with the documented default selection", async ({
    page,
    request,
  }) => {
    const id = await createRescanChar(request, "QA-Rescan-Defaults");
    const rescan = new RescanPage(page);

    await rescan.mockScan({
      // Kernwert geändert, aktuelle TP geändert, Name geändert.
      printed: { hpMax: 29, hpCurrent: 22, name: "QA-Rescan-Umbenannt", goldGp: 200 },
    });
    await rescan.goto(id);
    await rescan.uploadAndScan();

    await expect(rescan.changeList).toBeVisible();
    await expect(rescan.totalCount).toHaveText("4");

    // Max. TP und Gold sind vorausgewählt, akt. TP und der Name nicht.
    await expect(rescan.selectedCount).toHaveText("2");
    await expect(rescan.checkbox("core:hp_max")).toBeChecked();
    await expect(rescan.checkbox("core:hp_current")).not.toBeChecked();

    // Stammdaten liegen in einer zugeklappten Gruppe, deren Zähler sie verrät.
    await expect(rescan.groupCount("identity")).toHaveText("1");
    await rescan.groupToggle("identity").click();
    await expect(rescan.checkbox("identity:name")).not.toBeChecked();
  });

  test("applies only the selected changes and returns to the sheet", async ({ page, request }) => {
    const id = await createRescanChar(request, "QA-Rescan-Apply");
    const rescan = new RescanPage(page);

    await rescan.mockScan({ printed: { hpMax: 29, goldGp: 200 } });
    await rescan.goto(id);
    await rescan.uploadAndScan();

    await expect(rescan.selectedCount).toHaveText("2");

    // Gold abwählen — nur die TP sollen geschrieben werden.
    await rescan.checkbox("core:gold_gp").click();
    await expect(rescan.selectedCount).toHaveText("1");

    await rescan.applyButton.click();
    await page.waitForURL(`**/characters/${id}/manage`);

    const sheet = new CharacterSheetPage(page);
    await expect(sheet.container).toBeVisible();
    // Die abgewählte Änderung darf nicht angekommen sein.
    await expect(page.getByTestId("rescan-error")).not.toBeVisible();
  });

  test("writes an edited value instead of the scanned proposal", async ({ page, request }) => {
    const id = await createRescanChar(request, "QA-Rescan-Edit");
    const rescan = new RescanPage(page);

    await rescan.mockScan({ printed: { hpMax: 29 } });
    await rescan.goto(id);
    await rescan.uploadAndScan();

    await rescan.input("core:hp_max").fill("33");
    await rescan.applyButton.click();
    await page.waitForURL(`**/characters/${id}/manage`);

    await expect(page.getByTestId("sheet-hp-max")).toHaveValue("33");
  });

  test("prefers the handwritten value and can switch to the printed one", async ({
    page,
    request,
  }) => {
    const id = await createRescanChar(request, "QA-Rescan-Konflikt");
    const rescan = new RescanPage(page);

    await rescan.mockScan({ printed: { hpMax: 26 }, handwritten: { hpMax: 31 } });
    await rescan.goto(id);
    await rescan.uploadAndScan();

    await expect(rescan.input("core:hp_max")).toHaveValue("31");
    await rescan.conflictToggle("core:hp_max").click();
    await expect(rescan.input("core:hp_max")).toHaveValue("26");
  });

  test("reports when the sheet matches the stored data", async ({ page, request }) => {
    const id = await createRescanChar(request, "QA-Rescan-Unveraendert");
    const rescan = new RescanPage(page);

    await rescan.mockScan({ printed: { hpMax: 24, hpCurrent: 18, goldGp: 120 } });
    await rescan.goto(id);
    await rescan.uploadAndScan();

    await expect(rescan.noChanges).toBeVisible();
    await expect(rescan.applyButton).toBeHidden();
  });

  test("select-all and select-none drive the counter", async ({ page, request }) => {
    const id = await createRescanChar(request, "QA-Rescan-Massenauswahl");
    const rescan = new RescanPage(page);

    await rescan.mockScan({ printed: { hpMax: 29, hpCurrent: 22, goldGp: 200 } });
    await rescan.goto(id);
    await rescan.uploadAndScan();

    await rescan.selectAll.click();
    await expect(rescan.selectedCount).toHaveText("3");
    await expect(rescan.applyButton).toBeEnabled();

    await rescan.selectNone.click();
    await expect(rescan.selectedCount).toHaveText("0");
    await expect(rescan.applyButton).toBeDisabled();
  });

  test("is reachable from the character sheet header", async ({ page, request }) => {
    const id = await createRescanChar(request, "QA-Rescan-Einstieg");
    await page.goto(`/characters/${id}/manage`);

    const button = page.getByTestId("sheet-rescan-button");
    await expect(button).toBeVisible();
    await button.click();
    await page.waitForURL(`**/characters/${id}/rescan`);
    await expect(new RescanPage(page).dropzone).toBeVisible();
  });
});
