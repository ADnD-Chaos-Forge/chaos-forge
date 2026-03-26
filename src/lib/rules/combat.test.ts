import { describe, it, expect } from "vitest";
import { getThac0, getAttackRoll, getSavingThrows } from "./combat";

describe("THAC0", () => {
  it("should return 20 for a level 1 warrior", () => {
    expect(getThac0("warrior", 1)).toBe(20);
  });

  it("should return 10 for a level 11 warrior (warriors improve every level)", () => {
    expect(getThac0("warrior", 11)).toBe(10);
  });

  it("should return 20 for a level 1 priest", () => {
    expect(getThac0("priest", 1)).toBe(20);
  });

  it("should return 18 for a level 4 priest (priests improve every 3 levels)", () => {
    expect(getThac0("priest", 4)).toBe(18);
  });

  it("should return 20 for a level 1 rogue", () => {
    expect(getThac0("rogue", 1)).toBe(20);
  });

  it("should return 18 for a level 5 rogue (rogues improve every 2 levels)", () => {
    expect(getThac0("rogue", 5)).toBe(18);
  });

  it("should return 20 for a level 1 wizard", () => {
    expect(getThac0("wizard", 1)).toBe(20);
  });

  it("should return 18 for a level 7 wizard (wizards improve every 3 levels)", () => {
    expect(getThac0("wizard", 7)).toBe(18);
  });

  it("should cap at minimum THAC0 of 1", () => {
    expect(getThac0("warrior", 20)).toBe(1);
  });
});

describe("Attack Roll Calculation", () => {
  it("should need 20 to hit AC 0 with THAC0 20", () => {
    expect(getAttackRoll(20, 0)).toBe(20);
  });

  it("should need 15 to hit AC 5 with THAC0 20", () => {
    expect(getAttackRoll(20, 5)).toBe(15);
  });

  it("should need 10 to hit AC 0 with THAC0 10", () => {
    expect(getAttackRoll(10, 0)).toBe(10);
  });

  it("should handle negative AC (e.g. AC -3)", () => {
    expect(getAttackRoll(20, -3)).toBe(23);
  });
});

describe("Saving Throws", () => {
  it("should return correct saves for a level 1 warrior", () => {
    const saves = getSavingThrows("warrior", 1);
    expect(saves.paralyzation).toBe(14);
    expect(saves.rod).toBe(16);
    expect(saves.petrification).toBe(15);
    expect(saves.breath).toBe(17);
    expect(saves.spell).toBe(17);
  });

  it("should return improved saves for a level 3 warrior", () => {
    const saves = getSavingThrows("warrior", 3);
    expect(saves.paralyzation).toBe(13);
    expect(saves.rod).toBe(15);
    expect(saves.petrification).toBe(14);
    expect(saves.breath).toBe(16);
    expect(saves.spell).toBe(16);
  });

  it("should return correct saves for a level 1 wizard", () => {
    const saves = getSavingThrows("wizard", 1);
    expect(saves.paralyzation).toBe(14);
    expect(saves.rod).toBe(11);
    expect(saves.petrification).toBe(13);
    expect(saves.breath).toBe(15);
    expect(saves.spell).toBe(12);
  });

  it("should return correct saves for a level 1 priest", () => {
    const saves = getSavingThrows("priest", 1);
    expect(saves.paralyzation).toBe(10);
    expect(saves.rod).toBe(14);
    expect(saves.petrification).toBe(13);
    expect(saves.breath).toBe(16);
    expect(saves.spell).toBe(15);
  });

  it("should return correct saves for a level 1 rogue", () => {
    const saves = getSavingThrows("rogue", 1);
    expect(saves.paralyzation).toBe(13);
    expect(saves.rod).toBe(14);
    expect(saves.petrification).toBe(12);
    expect(saves.breath).toBe(16);
    expect(saves.spell).toBe(15);
  });
});
