import { describe, it, expect } from "vitest";
import { getClass, getAllClasses, getClassGroup, meetsAbilityRequirements } from "./classes";

describe("Classes", () => {
  it("should define 16 classes total", () => {
    expect(getAllClasses()).toHaveLength(16);
  });

  it("should categorize fighter as warrior group", () => {
    expect(getClassGroup("fighter")).toBe("warrior");
  });

  it("should categorize mage as wizard group", () => {
    expect(getClassGroup("mage")).toBe("wizard");
  });

  it("should categorize cleric as priest group", () => {
    expect(getClassGroup("cleric")).toBe("priest");
  });

  it("should categorize thief as rogue group", () => {
    expect(getClassGroup("thief")).toBe("rogue");
  });

  it("should give warriors d10 hit dice", () => {
    expect(getClass("fighter").hitDie).toBe(10);
    expect(getClass("ranger").hitDie).toBe(10);
    expect(getClass("paladin").hitDie).toBe(10);
  });

  it("should give wizards d4 hit dice", () => {
    expect(getClass("mage").hitDie).toBe(4);
    expect(getClass("illusionist").hitDie).toBe(4);
  });

  it("should allow exceptional strength only for warrior group", () => {
    expect(getClass("fighter").exceptionalStrength).toBe(true);
    expect(getClass("ranger").exceptionalStrength).toBe(true);
    expect(getClass("mage").exceptionalStrength).toBe(false);
    expect(getClass("thief").exceptionalStrength).toBe(false);
  });

  it("should check ability requirements correctly", () => {
    const abilities = { str: 16, dex: 14, con: 15, int: 10, wis: 14, cha: 17 };
    expect(meetsAbilityRequirements("paladin", abilities)).toBe(true);
  });

  it("should reject characters not meeting ability requirements", () => {
    const abilities = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    expect(meetsAbilityRequirements("paladin", abilities)).toBe(false);
    expect(meetsAbilityRequirements("fighter", abilities)).toBe(true);
  });
});
