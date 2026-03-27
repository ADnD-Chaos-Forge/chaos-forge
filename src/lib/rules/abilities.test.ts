import { describe, it, expect } from "vitest";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
  rollAbilityScoresMethodI,
  rollAbilityScoresMethodII,
  rollAbilityScoresMethodIII,
  rollAbilityScoresMethodIV,
  rollAbilityScoresMethodV,
} from "./abilities";

describe("ABILITY-001 ABILITY-002: Strength Modifiers", () => {
  it("should return correct modifiers for STR 3", () => {
    const mods = getStrengthModifiers(3);
    expect(mods.hitAdj).toBe(-3);
    expect(mods.dmgAdj).toBe(-1);
    expect(mods.weightAllow).toBe(5);
    expect(mods.maxPress).toBe(10);
    expect(mods.openDoors).toBe(2);
    expect(mods.bendBars).toBe(0);
  });

  it("should return correct modifiers for STR 10 (average)", () => {
    const mods = getStrengthModifiers(10);
    expect(mods.hitAdj).toBe(0);
    expect(mods.dmgAdj).toBe(0);
    expect(mods.weightAllow).toBe(40);
    expect(mods.maxPress).toBe(115);
    expect(mods.openDoors).toBe(6);
    expect(mods.bendBars).toBe(2);
  });

  it("should return correct modifiers for STR 18 (no exceptional)", () => {
    const mods = getStrengthModifiers(18);
    expect(mods.hitAdj).toBe(1);
    expect(mods.dmgAdj).toBe(2);
    expect(mods.weightAllow).toBe(110);
    expect(mods.maxPress).toBe(255);
    expect(mods.openDoors).toBe(11);
    expect(mods.bendBars).toBe(16);
  });

  it("should return correct modifiers for STR 18/50 (exceptional)", () => {
    const mods = getStrengthModifiers(18, 50);
    expect(mods.hitAdj).toBe(1);
    expect(mods.dmgAdj).toBe(3);
    expect(mods.weightAllow).toBe(135);
    expect(mods.maxPress).toBe(280);
    expect(mods.openDoors).toBe(12);
    expect(mods.bendBars).toBe(20);
  });

  it("should return correct modifiers for STR 18/00 (=100, maximum)", () => {
    const mods = getStrengthModifiers(18, 100);
    expect(mods.hitAdj).toBe(3);
    expect(mods.dmgAdj).toBe(6);
    expect(mods.weightAllow).toBe(335);
    expect(mods.maxPress).toBe(480);
    expect(mods.openDoors).toBe(16);
    expect(mods.bendBars).toBe(40);
  });

  it("should ignore exceptional strength for non-18 STR", () => {
    const mods = getStrengthModifiers(16, 50);
    expect(mods.hitAdj).toBe(0);
    expect(mods.dmgAdj).toBe(1);
  });
});

describe("ABILITY-003: Dexterity Modifiers", () => {
  it("should return correct modifiers for DEX 3", () => {
    const mods = getDexterityModifiers(3);
    expect(mods.reactionAdj).toBe(-3);
    expect(mods.missileAdj).toBe(-3);
    expect(mods.defensiveAdj).toBe(4);
  });

  it("should return correct modifiers for DEX 10", () => {
    const mods = getDexterityModifiers(10);
    expect(mods.reactionAdj).toBe(0);
    expect(mods.missileAdj).toBe(0);
    expect(mods.defensiveAdj).toBe(0);
  });

  it("should return correct modifiers for DEX 18", () => {
    const mods = getDexterityModifiers(18);
    expect(mods.reactionAdj).toBe(2);
    expect(mods.missileAdj).toBe(2);
    expect(mods.defensiveAdj).toBe(-4);
  });
});

describe("ABILITY-004: Constitution Modifiers", () => {
  it("should return correct modifiers for CON 3", () => {
    const mods = getConstitutionModifiers(3);
    expect(mods.hpAdj).toBe(-2);
    expect(mods.systemShock).toBe(35);
    expect(mods.resurrectionSurvival).toBe(40);
    expect(mods.poisonSave).toBe(0);
    expect(mods.regeneration).toBeNull();
  });

  it("should return correct modifiers for CON 15", () => {
    const mods = getConstitutionModifiers(15);
    expect(mods.hpAdj).toBe(1);
    expect(mods.systemShock).toBe(90);
    expect(mods.resurrectionSurvival).toBe(94);
  });

  it("should return correct modifiers for CON 18", () => {
    const mods = getConstitutionModifiers(18);
    expect(mods.hpAdj).toBe(4);
    expect(mods.systemShock).toBe(99);
    expect(mods.resurrectionSurvival).toBe(100);
  });
});

describe("ABILITY-005 MAGIC-012: Intelligence Modifiers", () => {
  it("should return correct modifiers for INT 3", () => {
    const mods = getIntelligenceModifiers(3);
    expect(mods.numberOfLanguages).toBe(1);
    expect(mods.spellLevel).toBeNull();
    expect(mods.chanceToLearn).toBe(0);
    expect(mods.maxSpellsPerLevel).toBe(0);
  });

  it("should return correct modifiers for INT 9", () => {
    const mods = getIntelligenceModifiers(9);
    expect(mods.numberOfLanguages).toBe(2);
    expect(mods.spellLevel).toBe(4);
    expect(mods.chanceToLearn).toBe(35);
    expect(mods.maxSpellsPerLevel).toBe(6);
  });

  it("should return correct modifiers for INT 18", () => {
    const mods = getIntelligenceModifiers(18);
    expect(mods.numberOfLanguages).toBe(7);
    expect(mods.spellLevel).toBe(9);
    expect(mods.chanceToLearn).toBe(85);
    expect(mods.maxSpellsPerLevel).toBe(18);
    expect(mods.spellImmunity).toBeNull();
  });
});

describe("ABILITY-006: Wisdom Modifiers", () => {
  it("should return correct modifiers for WIS 3", () => {
    const mods = getWisdomModifiers(3);
    expect(mods.magicalDefenseAdj).toBe(-3);
    expect(mods.bonusSpells).toEqual([]);
    expect(mods.spellFailure).toBe(30);
  });

  it("should return correct modifiers for WIS 13", () => {
    const mods = getWisdomModifiers(13);
    expect(mods.magicalDefenseAdj).toBe(0);
    expect(mods.bonusSpells).toEqual([1]);
    expect(mods.spellFailure).toBe(0);
  });

  it("should return correct modifiers for WIS 18", () => {
    const mods = getWisdomModifiers(18);
    expect(mods.magicalDefenseAdj).toBe(4);
    expect(mods.bonusSpells).toEqual([2, 2, 1, 1]);
    expect(mods.spellFailure).toBe(0);
  });
});

describe("ABILITY-007: Charisma Modifiers", () => {
  it("should return correct modifiers for CHA 3", () => {
    const mods = getCharismaModifiers(3);
    expect(mods.maxHenchmen).toBe(1);
    expect(mods.loyaltyBase).toBe(-5);
    expect(mods.reactionAdj).toBe(-5);
  });

  it("should return correct modifiers for CHA 10", () => {
    const mods = getCharismaModifiers(10);
    expect(mods.maxHenchmen).toBe(4);
    expect(mods.loyaltyBase).toBe(0);
    expect(mods.reactionAdj).toBe(0);
  });

  it("should return correct modifiers for CHA 18", () => {
    const mods = getCharismaModifiers(18);
    expect(mods.maxHenchmen).toBe(15);
    expect(mods.loyaltyBase).toBe(8);
    expect(mods.reactionAdj).toBe(7);
  });
});

describe("ABILITY-009: rollAbilityScoresMethodI — 3d6 in order", () => {
  it("returns 6 scores between 3 and 18", () => {
    const scores = rollAbilityScoresMethodI();
    expect(scores).toHaveLength(6);
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(3);
      expect(s).toBeLessThanOrEqual(18);
    }
  });

  it("returns different results on repeated calls (statistical)", () => {
    const results = new Set<string>();
    for (let i = 0; i < 20; i++) {
      results.add(rollAbilityScoresMethodI().join(","));
    }
    expect(results.size).toBeGreaterThan(1);
  });
});

describe("ABILITY-010: rollAbilityScoresMethodII — 3d6 twice, best of each", () => {
  it("returns 6 scores between 3 and 18", () => {
    const scores = rollAbilityScoresMethodII();
    expect(scores).toHaveLength(6);
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(3);
      expect(s).toBeLessThanOrEqual(18);
    }
  });
});

describe("ABILITY-011: rollAbilityScoresMethodIII — 3d6 ×6, arrange freely", () => {
  it("returns 6 scores between 3 and 18", () => {
    const scores = rollAbilityScoresMethodIII();
    expect(scores).toHaveLength(6);
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(3);
      expect(s).toBeLessThanOrEqual(18);
    }
  });
});

describe("ABILITY-012: rollAbilityScoresMethodIV — 3d6 ×12, pick best 6", () => {
  it("returns 6 scores between 3 and 18, sorted descending", () => {
    const scores = rollAbilityScoresMethodIV();
    expect(scores).toHaveLength(6);
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(3);
      expect(s).toBeLessThanOrEqual(18);
    }
    // Should be sorted descending (best first)
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });
});

describe("ABILITY-013: rollAbilityScoresMethodV — 4d6 drop lowest, arrange freely", () => {
  it("returns 6 scores between 3 and 18", () => {
    const scores = rollAbilityScoresMethodV();
    expect(scores).toHaveLength(6);
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(3);
      expect(s).toBeLessThanOrEqual(18);
    }
  });

  it("statistically produces higher averages than method I", () => {
    let sumI = 0;
    let sumV = 0;
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      sumI += rollAbilityScoresMethodI().reduce((a, b) => a + b, 0);
      sumV += rollAbilityScoresMethodV().reduce((a, b) => a + b, 0);
    }
    expect(sumV / iterations).toBeGreaterThan(sumI / iterations);
  });
});
