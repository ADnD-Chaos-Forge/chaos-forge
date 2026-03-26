import { describe, it, expect } from "vitest";
import { getXpForNextLevel, getXpThreshold } from "./experience";

describe("Experience Points", () => {
  it("should return 2000 XP for fighter level 2", () => {
    expect(getXpForNextLevel("fighter", 1)).toBe(2000);
  });

  it("should return 4000 XP for fighter level 3", () => {
    expect(getXpForNextLevel("fighter", 2)).toBe(4000);
  });

  it("should return 2500 XP for mage level 2", () => {
    expect(getXpForNextLevel("mage", 1)).toBe(2500);
  });

  it("should return 1500 XP for thief level 2", () => {
    expect(getXpForNextLevel("thief", 1)).toBe(1250);
  });

  it("should return 1500 XP for cleric level 2", () => {
    expect(getXpForNextLevel("cleric", 1)).toBe(1500);
  });

  it("should return 0 XP threshold for level 1", () => {
    expect(getXpThreshold("fighter", 1)).toBe(0);
  });

  it("should return correct threshold for ranger level 2", () => {
    expect(getXpForNextLevel("ranger", 1)).toBe(2250);
  });

  it("should return correct threshold for paladin level 2", () => {
    expect(getXpForNextLevel("paladin", 1)).toBe(2250);
  });

  it("should return null for max level", () => {
    expect(getXpForNextLevel("fighter", 20)).toBeNull();
  });
});
