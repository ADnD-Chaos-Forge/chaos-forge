/**
 * Regression Tests
 *
 * These tests cover specific bugs that were found and fixed.
 * Each test ensures the bug does not resurface.
 */
import { describe, it, expect } from "vitest";
import {
  getPriestSpellPoints,
  getPriestBonusSpellPoints,
  getPriestSpellCost,
} from "../lib/rules/spellslots";
import { getMulticlassThac0, getMulticlassSaves } from "../lib/rules/multiclass";
import { getBackstabMultiplier, hasThiefSkills } from "../lib/rules/thief";
import { getAttacksPerRound } from "../lib/rules/combat";
import { lbsToKg, feetToMeters } from "../lib/utils/units";

import deMessages from "../../messages/de.json";
import enMessages from "../../messages/en.json";

// ─── BUG #2: Priest Spell Points ────────────────────────────────────────────
// Priests must receive spell points from the Player's Option system.
// Previously, getPriestSpellPoints was missing or returned 0.

describe("Bug #2: Priest Spell Points", () => {
  it("getPriestSpellPoints(1) returns 10", () => {
    expect(getPriestSpellPoints(1)).toBe(10);
  });

  it("getPriestSpellPoints(10) returns 92", () => {
    expect(getPriestSpellPoints(10)).toBe(92);
  });

  it("getPriestBonusSpellPoints(18) returns 16", () => {
    expect(getPriestBonusSpellPoints(18)).toBe(16);
  });

  it("getPriestSpellCost(3) returns 4", () => {
    expect(getPriestSpellCost(3)).toBe(4);
  });

  it("spell cost for out-of-range levels returns 0", () => {
    expect(getPriestSpellCost(0)).toBe(0);
    expect(getPriestSpellCost(8)).toBe(0);
  });

  it("bonus spell points for low WIS returns 0", () => {
    expect(getPriestBonusSpellPoints(12)).toBe(0);
    expect(getPriestBonusSpellPoints(3)).toBe(0);
  });
});

// ─── BUG #3: NWP Filter ─────────────────────────────────────────────────────
// All NWP group types must be present in i18n keys so no groups are filtered out.

describe("Bug #3: NWP group types in i18n", () => {
  const expectedGroups = ["general", "warrior", "priest", "rogue", "wizard"];

  it("de.json contains all NWP group keys", () => {
    for (const group of expectedGroups) {
      expect(deMessages.nwpGroups).toHaveProperty(group);
      expect((deMessages.nwpGroups as Record<string, string>)[group]).not.toBe("");
    }
  });

  it("en.json contains all NWP group keys", () => {
    for (const group of expectedGroups) {
      expect(enMessages.nwpGroups).toHaveProperty(group);
      expect((enMessages.nwpGroups as Record<string, string>)[group]).not.toBe("");
    }
  });
});

// ─── BUG #4: Multiclass THAC0 and Saves ─────────────────────────────────────
// Multiclass characters must use the best THAC0 / best save per category.

describe("Bug #4: Multiclass THAC0 and Saves", () => {
  it("Fighter/Mage L4: THAC0 = 17 (Fighter is better)", () => {
    const thac0 = getMulticlassThac0([
      { classId: "fighter", level: 4 },
      { classId: "mage", level: 4 },
    ]);
    // Fighter L4 THAC0 = 21-4 = 17, Mage L4 THAC0 = 20-1 = 19
    expect(thac0).toBe(17);
  });

  it("Fighter/Thief L8: Saves use best value per category", () => {
    const saves = getMulticlassSaves([
      { classId: "fighter", level: 8 },
      { classId: "thief", level: 8 },
    ]);

    // Fighter L8 saves: [10, 12, 11, 12, 13]
    // Rogue L8 saves:   [12, 12, 11, 15, 13]
    // Best per category: [10, 12, 11, 12, 13]
    expect(saves.paralyzation).toBe(10);
    expect(saves.rod).toBe(12);
    expect(saves.petrification).toBe(11);
    expect(saves.breath).toBe(12);
    expect(saves.spell).toBe(13);
  });

  it("empty class list returns worst-case values", () => {
    const thac0 = getMulticlassThac0([]);
    expect(thac0).toBe(20);

    const saves = getMulticlassSaves([]);
    expect(saves.paralyzation).toBe(20);
  });
});

// ─── BUG #5: Thief Skills ───────────────────────────────────────────────────
// Backstab multiplier and hasThiefSkills must work correctly.

describe("Bug #5: Thief Skills", () => {
  it("backstab multiplier at L5 = x3", () => {
    expect(getBackstabMultiplier(5)).toBe(3);
  });

  it("backstab multiplier at L1 = x2", () => {
    expect(getBackstabMultiplier(1)).toBe(2);
  });

  it("backstab multiplier at L13 = x5", () => {
    expect(getBackstabMultiplier(13)).toBe(5);
  });

  it('hasThiefSkills(["fighter", "thief"]) = true', () => {
    expect(hasThiefSkills(["fighter", "thief"])).toBe(true);
  });

  it('hasThiefSkills(["mage"]) = false', () => {
    expect(hasThiefSkills(["mage"])).toBe(false);
  });

  it('hasThiefSkills(["bard"]) = true (bards have thief skills)', () => {
    expect(hasThiefSkills(["bard"])).toBe(true);
  });
});

// ─── BUG #6: Attacks Per Round ──────────────────────────────────────────────
// Warriors gain extra attacks at higher levels, other classes always get 1.

describe("Bug #6: Attacks Per Round", () => {
  it('Warrior L7 = "3/2"', () => {
    expect(getAttacksPerRound("warrior", 7)).toBe("3/2");
  });

  it('Priest L10 = "1"', () => {
    expect(getAttacksPerRound("priest", 10)).toBe("1");
  });

  it('Warrior L13 = "2"', () => {
    expect(getAttacksPerRound("warrior", 13)).toBe("2");
  });

  it('Warrior L1 = "1"', () => {
    expect(getAttacksPerRound("warrior", 1)).toBe("1");
  });

  it('Rogue L20 = "1"', () => {
    expect(getAttacksPerRound("rogue", 20)).toBe("1");
  });
});

// ─── BUG #7: i18n Key Parity ────────────────────────────────────────────────
// de.json and en.json must have the same structure. No missing or empty keys.

describe("Bug #7: i18n key parity (de.json vs en.json)", () => {
  function getKeys(obj: Record<string, unknown>, prefix = ""): string[] {
    const keys: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        keys.push(...getKeys(value as Record<string, unknown>, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys.sort();
  }

  it("all keys in de.json exist in en.json", () => {
    const deKeys = getKeys(deMessages);
    const enKeys = new Set(getKeys(enMessages));
    const missing = deKeys.filter((k) => !enKeys.has(k));
    expect(missing).toEqual([]);
  });

  it("all keys in en.json exist in de.json", () => {
    const enKeys = getKeys(enMessages);
    const deKeys = new Set(getKeys(deMessages));
    const missing = enKeys.filter((k) => !deKeys.has(k));
    expect(missing).toEqual([]);
  });

  it("no empty string values in de.json", () => {
    const deKeys = getKeys(deMessages);
    const emptyKeys = deKeys.filter((key) => {
      const parts = key.split(".");
      let current: unknown = deMessages;
      for (const part of parts) {
        current = (current as Record<string, unknown>)[part];
      }
      return current === "";
    });
    expect(emptyKeys).toEqual([]);
  });

  it("no empty string values in en.json", () => {
    const enKeys = getKeys(enMessages);
    const emptyKeys = enKeys.filter((key) => {
      const parts = key.split(".");
      let current: unknown = enMessages;
      for (const part of parts) {
        current = (current as Record<string, unknown>)[part];
      }
      return current === "";
    });
    expect(emptyKeys).toEqual([]);
  });
});

// ─── BUG #8: Metric Utils ──────────────────────────────────────────────────
// Unit conversion must produce correct values for display.

describe("Bug #8: Metric utils", () => {
  it('lbsToKg(10) = "4.5"', () => {
    expect(lbsToKg(10)).toBe("4.5");
  });

  it('feetToMeters(60) = "18.3"', () => {
    expect(feetToMeters(60)).toBe("18.3");
  });

  it('lbsToKg(0) = "0.0"', () => {
    expect(lbsToKg(0)).toBe("0.0");
  });

  it('feetToMeters(0) = "0.0"', () => {
    expect(feetToMeters(0)).toBe("0.0");
  });
});
