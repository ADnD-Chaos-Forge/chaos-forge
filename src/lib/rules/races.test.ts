import { describe, it, expect } from "vitest";
import { getRace, getAllRaces, canPlayClass, getLevelLimit } from "./races";

describe("Races", () => {
  it("should define all 7 PHB core races", () => {
    expect(getAllRaces()).toHaveLength(7);
  });

  it("should allow humans to play all classes", () => {
    const human = getRace("human");
    expect(human.allowedClasses).toHaveLength(16);
    expect(human.levelLimits).toEqual({});
  });

  it("should give elves +1 DEX, -1 CON", () => {
    const elf = getRace("elf");
    expect(elf.abilityAdjustments).toEqual({ dex: 1, con: -1 });
  });

  it("should not allow dwarves to be mages", () => {
    expect(canPlayClass("dwarf", "mage")).toBe(false);
    expect(canPlayClass("dwarf", "fighter")).toBe(true);
  });

  it("should return correct level limits for elves", () => {
    expect(getLevelLimit("elf", "fighter")).toBe(12);
    expect(getLevelLimit("elf", "mage")).toBe(15);
  });

  it("should return null for unlimited level (humans)", () => {
    expect(getLevelLimit("human", "fighter")).toBeNull();
    expect(getLevelLimit("human", "mage")).toBeNull();
  });

  it("should define multiclass options for elves", () => {
    const elf = getRace("elf");
    expect(elf.multiclassOptions).toContainEqual(["fighter", "mage"]);
    expect(elf.multiclassOptions).toContainEqual(["fighter", "mage", "thief"]);
  });

  it("should not allow humans to multiclass", () => {
    const human = getRace("human");
    expect(human.multiclassOptions).toHaveLength(0);
  });

  it("should give half-orcs +1 STR, +1 CON, -2 CHA", () => {
    const halfOrc = getRace("half_orc");
    expect(halfOrc.abilityAdjustments).toEqual({ str: 1, con: 1, cha: -2 });
  });

  it("should give dwarves and elves 60ft infravision", () => {
    expect(getRace("dwarf").infravision).toBe(60);
    expect(getRace("elf").infravision).toBe(60);
    expect(getRace("human").infravision).toBe(0);
  });
});
