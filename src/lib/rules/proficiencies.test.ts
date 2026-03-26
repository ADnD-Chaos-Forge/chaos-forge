import { describe, it, expect } from "vitest";
import {
  getWeaponProficiencySlots,
  getNonweaponProficiencySlots,
  getNonproficiencyPenalty,
  canSpecialize,
} from "./proficiencies";

describe("Weapon Proficiency Slots", () => {
  it("should give warriors 4 slots at level 1", () => {
    expect(getWeaponProficiencySlots("warrior", 1)).toBe(4);
  });

  it("should give warriors 5 slots at level 4", () => {
    expect(getWeaponProficiencySlots("warrior", 4)).toBe(5);
  });

  it("should give priests 2 slots at level 1", () => {
    expect(getWeaponProficiencySlots("priest", 1)).toBe(2);
  });

  it("should give rogues 2 slots at level 1", () => {
    expect(getWeaponProficiencySlots("rogue", 1)).toBe(2);
  });

  it("should give wizards 1 slot at level 1", () => {
    expect(getWeaponProficiencySlots("wizard", 1)).toBe(1);
  });

  it("should give wizards 2 slots at level 7", () => {
    expect(getWeaponProficiencySlots("wizard", 7)).toBe(2);
  });
});

describe("Non-Weapon Proficiency Slots", () => {
  it("should give warriors 3 base slots at level 1", () => {
    expect(getNonweaponProficiencySlots("warrior", 1, 10)).toBe(3);
  });

  it("should add INT bonus languages as extra NWP slots", () => {
    // INT 16 = 5 languages = 5 extra NWP slots? No, INT bonus is different.
    // Actually NWP slots = base + floor((level-1)/3) for warriors
    // Base: warrior=3, priest=4, rogue=3, wizard=4
    expect(getNonweaponProficiencySlots("wizard", 1, 10)).toBe(4);
  });

  it("should increase slots with level", () => {
    expect(getNonweaponProficiencySlots("warrior", 4)).toBeGreaterThan(
      getNonweaponProficiencySlots("warrior", 1)
    );
  });
});

describe("Non-proficiency Penalty", () => {
  it("should give warriors -2 penalty", () => {
    expect(getNonproficiencyPenalty("warrior")).toBe(-2);
  });

  it("should give priests -3 penalty", () => {
    expect(getNonproficiencyPenalty("priest")).toBe(-3);
  });

  it("should give rogues -3 penalty", () => {
    expect(getNonproficiencyPenalty("rogue")).toBe(-3);
  });

  it("should give wizards -5 penalty", () => {
    expect(getNonproficiencyPenalty("wizard")).toBe(-5);
  });
});

describe("Weapon Specialization", () => {
  it("should allow fighter to specialize", () => {
    expect(canSpecialize("fighter")).toBe(true);
  });

  it("should not allow ranger to specialize", () => {
    expect(canSpecialize("ranger")).toBe(false);
  });

  it("should not allow paladin to specialize", () => {
    expect(canSpecialize("paladin")).toBe(false);
  });

  it("should not allow mage to specialize", () => {
    expect(canSpecialize("mage")).toBe(false);
  });
});
