import { describe, it, expect } from "vitest";
import {
  getWizardSpellSlots,
  getPriestSpellSlots,
  getPriestBonusSlots,
  getPriestSpellPoints,
  getPriestBonusSpellPoints,
  getPriestSpellCost,
  canLearnSpell,
  getRangerSpellSlots,
  getPaladinSpellSlots,
} from "./spellslots";

describe("MAGIC-007: Wizard Spell Slots", () => {
  it("should give a level 1 wizard 1 first-level slot", () => {
    const slots = getWizardSpellSlots(1);
    expect(slots[0]).toBe(1);
    expect(slots[1]).toBe(0);
  });

  it("should give a level 3 wizard 2 first-level and 1 second-level slot", () => {
    const slots = getWizardSpellSlots(3);
    expect(slots[0]).toBe(2);
    expect(slots[1]).toBe(1);
  });

  it("should give a level 9 wizard access to 5th level spells", () => {
    const slots = getWizardSpellSlots(9);
    expect(slots[4]).toBeGreaterThan(0); // 5th level
  });
});

describe("MAGIC-008: Priest Spell Slots", () => {
  it("should give a level 1 priest 1 first-level slot", () => {
    const slots = getPriestSpellSlots(1);
    expect(slots[0]).toBe(1);
    expect(slots[1]).toBe(0);
  });

  it("should give a level 3 priest 2 first-level and 1 second-level slot", () => {
    const slots = getPriestSpellSlots(3);
    expect(slots[0]).toBe(2);
    expect(slots[1]).toBe(1);
  });
});

describe("MAGIC-009: Priest Bonus Slots", () => {
  it("should give no bonus slots for WIS 12 or below", () => {
    const bonus = getPriestBonusSlots(12);
    expect(bonus.every((s) => s === 0)).toBe(true);
  });

  it("should give 1 first-level bonus slot for WIS 13", () => {
    const bonus = getPriestBonusSlots(13);
    expect(bonus[0]).toBe(1);
  });

  it("should give bonus slots for WIS 18", () => {
    const bonus = getPriestBonusSlots(18);
    expect(bonus[0]).toBe(2); // 2 first-level
    expect(bonus[1]).toBe(2); // 2 second-level
    expect(bonus[2]).toBe(1); // 1 third-level
    expect(bonus[3]).toBe(1); // 1 fourth-level
  });
});

describe("MAGIC-010: Priest Spell Points (Player's Option)", () => {
  it("should give 10 spell points at level 1", () => {
    expect(getPriestSpellPoints(1)).toBe(10);
  });

  it("should give 92 spell points at level 10", () => {
    expect(getPriestSpellPoints(10)).toBe(92);
  });

  it("should give 287 spell points at level 20", () => {
    expect(getPriestSpellPoints(20)).toBe(287);
  });

  it("should give bonus points for high WIS", () => {
    expect(getPriestBonusSpellPoints(12)).toBe(0);
    expect(getPriestBonusSpellPoints(13)).toBe(1);
    expect(getPriestBonusSpellPoints(16)).toBe(8);
    expect(getPriestBonusSpellPoints(18)).toBe(16);
  });

  it("should return correct spell costs", () => {
    expect(getPriestSpellCost(1)).toBe(1);
    expect(getPriestSpellCost(3)).toBe(4);
    expect(getPriestSpellCost(7)).toBe(12);
  });
});

describe("MAGIC-005 MAGIC-006: canLearnSpell", () => {
  it("should allow a mage to learn any school", () => {
    const result = canLearnSpell("mage", "invocation", undefined, 1, 15);
    expect(result.allowed).toBe(true);
  });

  it("should block a necromancer from learning illusion spells", () => {
    const result = canLearnSpell("necromancer", "illusion", undefined, 1, 15);
    expect(result.allowed).toBe(false);
  });

  it("should block a wizard with INT 9 from level 5+ spells", () => {
    const result = canLearnSpell("mage", "invocation", undefined, 5, 9);
    expect(result.allowed).toBe(false);
  });

  it("should allow a cleric to learn healing sphere spells", () => {
    const result = canLearnSpell("cleric", undefined, "healing", 1, 10);
    expect(result.allowed).toBe(true);
  });

  it("should block a cleric from animal sphere", () => {
    const result = canLearnSpell("cleric", undefined, "animal", 1, 10);
    expect(result.allowed).toBe(false);
  });

  it("should allow a fighter to NOT learn spells", () => {
    const result = canLearnSpell("fighter", "invocation", undefined, 1, 15);
    expect(result.allowed).toBe(false);
  });
});

describe("CLASS-007: getRangerSpellSlots", () => {
  it("ranger level 7 has no spells", () => {
    const slots = getRangerSpellSlots(7);
    expect(slots.druid.every((s) => s === 0)).toBe(true);
    expect(slots.wizard.every((s) => s === 0)).toBe(true);
  });

  it("ranger level 8 has 1 druid spell level 1", () => {
    const slots = getRangerSpellSlots(8);
    expect(slots.druid[0]).toBe(1);
  });

  it("ranger level 9 has 1 wizard spell level 1", () => {
    const slots = getRangerSpellSlots(9);
    expect(slots.wizard[0]).toBe(1);
  });

  it("ranger level 16 has druid spells up to level 3", () => {
    const slots = getRangerSpellSlots(16);
    expect(slots.druid[0]).toBeGreaterThan(0);
    expect(slots.druid[1]).toBeGreaterThan(0);
    expect(slots.druid[2]).toBeGreaterThan(0);
  });
});

describe("CLASS-008: getPaladinSpellSlots", () => {
  it("paladin level 8 has no spells", () => {
    const slots = getPaladinSpellSlots(8);
    expect(slots.every((s) => s === 0)).toBe(true);
  });

  it("paladin level 9 has 1 priest spell level 1", () => {
    const slots = getPaladinSpellSlots(9);
    expect(slots[0]).toBe(1);
  });

  it("paladin level 20 has spells up to level 4", () => {
    const slots = getPaladinSpellSlots(20);
    expect(slots[0]).toBeGreaterThan(0);
    expect(slots[1]).toBeGreaterThan(0);
    expect(slots[2]).toBeGreaterThan(0);
    expect(slots[3]).toBeGreaterThan(0);
  });
});
