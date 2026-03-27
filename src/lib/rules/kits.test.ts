import { describe, it, expect } from "vitest";
import { getEffectiveHitDie, getKit, getKitsForClass, KITS } from "./kits";

describe("Kit System", () => {
  describe("KITS registry", () => {
    it("contains exactly 20 kits", () => {
      expect(Object.keys(KITS)).toHaveLength(20);
    });

    const expectedKits = [
      "barbarian",
      "cavalier",
      "swashbuckler",
      "berserker",
      "gladiator",
      "myrmidon",
      "assassin",
      "bounty_hunter",
      "acrobat",
      "scout",
      "burglar",
      "spy",
      "witch",
      "militant_wizard",
      "savage_wizard",
      "academician",
      "fighting_priest",
      "pacifist_priest",
      "beastmaster",
      "blade",
    ];

    it.each(expectedKits)("kit '%s' exists", (kitId) => {
      expect(KITS[kitId]).toBeDefined();
      expect(KITS[kitId].id).toBe(kitId);
      expect(KITS[kitId].abilities.length).toBeGreaterThanOrEqual(2);
    });

    it("barbarian kit has correct properties", () => {
      const kit = KITS["barbarian"];
      expect(kit.classId).toBe("fighter");
      expect(kit.hitDieOverride).toBe(12);
      expect(kit.maxArmorAC).toBe(5);
      expect(kit.abilities).toHaveLength(3);
    });
  });

  describe("getKitsForClass", () => {
    it("returns 6 fighter kits", () => {
      const kits = getKitsForClass("fighter");
      expect(kits).toHaveLength(6);
      expect(kits.map((k) => k.id)).toEqual(
        expect.arrayContaining([
          "barbarian",
          "cavalier",
          "swashbuckler",
          "berserker",
          "gladiator",
          "myrmidon",
        ])
      );
    });

    it("returns 6 thief kits", () => {
      const kits = getKitsForClass("thief");
      expect(kits).toHaveLength(6);
      expect(kits.map((k) => k.id)).toEqual(
        expect.arrayContaining(["assassin", "bounty_hunter", "acrobat", "scout", "burglar", "spy"])
      );
    });

    it("returns 4 mage kits", () => {
      const kits = getKitsForClass("mage");
      expect(kits).toHaveLength(4);
      expect(kits.map((k) => k.id)).toEqual(
        expect.arrayContaining(["witch", "militant_wizard", "savage_wizard", "academician"])
      );
    });

    it("returns 2 cleric kits", () => {
      const kits = getKitsForClass("cleric");
      expect(kits).toHaveLength(2);
      expect(kits.map((k) => k.id)).toEqual(
        expect.arrayContaining(["fighting_priest", "pacifist_priest"])
      );
    });

    it("returns 1 ranger kit", () => {
      const kits = getKitsForClass("ranger");
      expect(kits).toHaveLength(1);
      expect(kits[0].id).toBe("beastmaster");
    });

    it("returns 1 bard kit", () => {
      const kits = getKitsForClass("bard");
      expect(kits).toHaveLength(1);
      expect(kits[0].id).toBe("blade");
    });

    it("returns empty array for class with no kits", () => {
      expect(getKitsForClass("paladin")).toHaveLength(0);
    });
  });

  describe("getEffectiveHitDie", () => {
    it("returns kit override for barbarian", () => {
      expect(getEffectiveHitDie(10, "barbarian")).toBe(12);
    });

    it("returns base when kit has no override (cavalier)", () => {
      expect(getEffectiveHitDie(10, "cavalier")).toBe(10);
    });

    it("returns base when no kit", () => {
      expect(getEffectiveHitDie(10, null)).toBe(10);
    });

    it("returns base for unknown kit", () => {
      expect(getEffectiveHitDie(10, "unknown")).toBe(10);
    });
  });

  describe("getKit", () => {
    it("returns definition for known kit", () => {
      const kit = getKit("barbarian");
      expect(kit).not.toBeNull();
      expect(kit!.name).toBe("Barbar");
      expect(kit!.abilities).toHaveLength(3);
    });

    it("returns null for unknown kit", () => {
      expect(getKit("nonexistent")).toBeNull();
    });

    it("returns null for null input", () => {
      expect(getKit(null)).toBeNull();
    });
  });
});
