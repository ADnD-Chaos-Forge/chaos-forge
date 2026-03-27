import { describe, it, expect } from "vitest";
import { getSpecialist, getOppositionSchools, getPriestSpheres, hasSphereAccess } from "./magic";

describe("MAGIC-001 MAGIC-002: Wizard Specialists", () => {
  it("should return null for a generic mage", () => {
    expect(getSpecialist("mage")).toBeNull();
  });

  it("should identify necromancer's school as necromancy", () => {
    const spec = getSpecialist("necromancer");
    expect(spec).not.toBeNull();
    expect(spec!.school).toBe("necromancy");
  });

  it("should return illusion and enchantment as opposition schools for necromancer", () => {
    const schools = getOppositionSchools("necromancer");
    expect(schools).toContain("illusion");
    expect(schools).toContain("enchantment");
    expect(schools).toHaveLength(2);
  });

  it("should return no opposition schools for generic mage", () => {
    expect(getOppositionSchools("mage")).toEqual([]);
  });

  it("should return diviner with only one opposition school (conjuration)", () => {
    const spec = getSpecialist("diviner");
    expect(spec!.oppositionSchools).toEqual(["conjuration"]);
  });

  it("should return illusionist with three opposition schools", () => {
    const schools = getOppositionSchools("illusionist");
    expect(schools).toHaveLength(3);
    expect(schools).toContain("necromancy");
    expect(schools).toContain("invocation");
    expect(schools).toContain("abjuration");
  });
});

describe("MAGIC-003 MAGIC-004: Priest Sphere Access", () => {
  it("should give clerics major access to healing", () => {
    expect(hasSphereAccess("cleric", "healing", "major")).toBe(true);
  });

  it("should give clerics minor access to elemental", () => {
    expect(hasSphereAccess("cleric", "elemental", "minor")).toBe(true);
    expect(hasSphereAccess("cleric", "elemental", "major")).toBe(false);
  });

  it("should not give clerics access to animal sphere", () => {
    expect(hasSphereAccess("cleric", "animal", "minor")).toBe(false);
  });

  it("should give druids major access to animal and plant", () => {
    expect(hasSphereAccess("druid", "animal", "major")).toBe(true);
    expect(hasSphereAccess("druid", "plant", "major")).toBe(true);
  });

  it("should give druids minor access to divination", () => {
    expect(hasSphereAccess("druid", "divination", "minor")).toBe(true);
    expect(hasSphereAccess("druid", "divination", "major")).toBe(false);
  });

  it("should return empty spheres for non-priest classes", () => {
    expect(getPriestSpheres("fighter")).toEqual({});
    expect(hasSphereAccess("fighter", "healing", "minor")).toBe(false);
  });
});
