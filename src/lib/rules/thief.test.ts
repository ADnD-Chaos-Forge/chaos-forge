import { describe, it, expect } from "vitest";
import {
  getBaseThiefSkills,
  getRacialThiefAdjustments,
  getBackstabMultiplier,
  hasThiefSkills,
} from "./thief";

describe("getBaseThiefSkills", () => {
  it("returns base percentages at level 1", () => {
    const skills = getBaseThiefSkills(1);
    expect(skills.pickLocks).toBe(15);
    expect(skills.findTraps).toBe(5);
    expect(skills.moveSilently).toBe(10);
    expect(skills.hideInShadows).toBe(5);
    expect(skills.climbWalls).toBe(60);
    expect(skills.detectNoise).toBe(15);
    expect(skills.readLanguages).toBe(0);
  });

  it("returns same base at higher levels (allocation is player-driven)", () => {
    const skills = getBaseThiefSkills(10);
    expect(skills.pickLocks).toBe(15);
    expect(skills.climbWalls).toBe(60);
  });
});

describe("getRacialThiefAdjustments", () => {
  it("returns dwarven bonuses", () => {
    const adj = getRacialThiefAdjustments("dwarf");
    expect(adj.pickLocks).toBe(10);
    expect(adj.findTraps).toBe(15);
    expect(adj.climbWalls).toBe(-10);
  });

  it("returns elven bonuses", () => {
    const adj = getRacialThiefAdjustments("elf");
    expect(adj.hideInShadows).toBe(10);
    expect(adj.moveSilently).toBe(5);
    expect(adj.detectNoise).toBe(5);
  });

  it("returns halfling bonuses", () => {
    const adj = getRacialThiefAdjustments("halfling");
    expect(adj.moveSilently).toBe(15);
    expect(adj.hideInShadows).toBe(15);
    expect(adj.climbWalls).toBe(-15);
  });

  it("returns empty object for human", () => {
    const adj = getRacialThiefAdjustments("human");
    expect(Object.keys(adj).length).toBe(0);
  });

  it("returns gnome bonuses", () => {
    const adj = getRacialThiefAdjustments("gnome");
    expect(adj.findTraps).toBe(10);
    expect(adj.detectNoise).toBe(10);
  });
});

describe("getBackstabMultiplier", () => {
  it("returns x2 at level 1-4", () => {
    expect(getBackstabMultiplier(1)).toBe(2);
    expect(getBackstabMultiplier(4)).toBe(2);
  });

  it("returns x3 at level 5-8", () => {
    expect(getBackstabMultiplier(5)).toBe(3);
    expect(getBackstabMultiplier(8)).toBe(3);
  });

  it("returns x4 at level 9-12", () => {
    expect(getBackstabMultiplier(9)).toBe(4);
    expect(getBackstabMultiplier(12)).toBe(4);
  });

  it("returns x5 at level 13+", () => {
    expect(getBackstabMultiplier(13)).toBe(5);
    expect(getBackstabMultiplier(20)).toBe(5);
  });
});

describe("hasThiefSkills", () => {
  it("returns true for thief", () => {
    expect(hasThiefSkills(["thief"])).toBe(true);
  });

  it("returns true for bard", () => {
    expect(hasThiefSkills(["bard"])).toBe(true);
  });

  it("returns true for fighter/thief multiclass", () => {
    expect(hasThiefSkills(["fighter", "thief"])).toBe(true);
  });

  it("returns false for fighter", () => {
    expect(hasThiefSkills(["fighter"])).toBe(false);
  });

  it("returns false for cleric/mage", () => {
    expect(hasThiefSkills(["cleric", "mage"])).toBe(false);
  });
});
