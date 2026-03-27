import { describe, it, expect } from "vitest";
import { getEffectiveHitDie, getKit, KITS } from "./kits";

describe("Kit System", () => {
  it("barbarian kit exists with correct properties", () => {
    const kit = KITS["barbarian"];
    expect(kit).toBeDefined();
    expect(kit.classId).toBe("fighter");
    expect(kit.hitDieOverride).toBe(12);
    expect(kit.maxArmorAC).toBe(5);
  });

  it("getEffectiveHitDie returns kit override for barbarian", () => {
    expect(getEffectiveHitDie(10, "barbarian")).toBe(12);
  });

  it("getEffectiveHitDie returns base when no kit", () => {
    expect(getEffectiveHitDie(10, null)).toBe(10);
  });

  it("getEffectiveHitDie returns base for unknown kit", () => {
    expect(getEffectiveHitDie(10, "unknown")).toBe(10);
  });

  it("getKit returns definition for known kit", () => {
    const kit = getKit("barbarian");
    expect(kit).not.toBeNull();
    expect(kit!.name).toBe("Barbar");
    expect(kit!.abilities).toHaveLength(3);
  });

  it("getKit returns null for unknown kit", () => {
    expect(getKit("cavalier")).toBeNull();
    expect(getKit(null)).toBeNull();
  });
});
