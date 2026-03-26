import { describe, it, expect } from "vitest";
import {
  getWizardSpellSlots,
  getPriestSpellSlots,
  getPriestBonusSlots,
  canLearnSpell,
} from "./spellslots";

describe("Wizard Spell Slots", () => {
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

describe("Priest Spell Slots", () => {
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

describe("Priest Bonus Slots", () => {
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

describe("canLearnSpell", () => {
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
