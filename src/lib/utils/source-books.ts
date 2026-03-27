/** Maps full book names to short abbreviations for UI display. */
const BOOK_ABBREVIATIONS: Record<string, string> = {
  "Players Handbook": "PHB",
  "Dungeon Masters Guide": "DMG",
  "Arms and Equipment Guide": "AEG",
  "Tome of Magic": "ToM",
  "Wizards Spell Compendium Volume 1": "WSC1",
  "Wizards Spell Compendium Volume 2": "WSC2",
  "Wizards Spell Compendium Volume 3": "WSC3",
  "Wizards Spell Compendium Volume 4": "WSC4",
  "Priest Spell Compendium Volume 1": "PSC1",
  "Priest Spell Compendium Volume 2": "PSC2",
  "Priest Spell Compendium Volume 3": "PSC3",
  "Complete Fighters Handbook": "CFH",
  "Complete Thiefs Handbook": "CTH",
  "Complete Priests Handbook": "CPH",
  "Complete Wizards Handbook": "CWH",
  "Complete Bards Handbook": "CBH",
  "Complete Rangers Handbook": "CRH",
  "Complete Paladins Handbook": "CPaH",
  "Complete Druids Handbook": "CDH",
  "Complete Barbarians Handbook": "CBarH",
  "Players Option Skills and Powers": "PO:S&P",
  "Players Option Combat and Tactics": "PO:C&T",
  "Players Option Spells and Magic": "PO:S&M",
};

export function getBookAbbreviation(fullName: string): string {
  return BOOK_ABBREVIATIONS[fullName] ?? fullName;
}

export function getAllBookNames(): string[] {
  return Object.keys(BOOK_ABBREVIATIONS);
}
