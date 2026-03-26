import { describe, it, expect } from "vitest";
import { calculateAC, calculateEncumbrance, getMovementRate } from "./equipment";

describe("AC Calculation", () => {
  it("should return base AC 10 with no armor and DEX 10 (adj 0)", () => {
    expect(calculateAC(null, false, 0)).toBe(10);
  });

  it("should return armor AC with no DEX modifier", () => {
    expect(calculateAC(5, false, 0)).toBe(5); // Chainmail
  });

  it("should apply DEX defensive adjustment to armor AC", () => {
    expect(calculateAC(5, false, -2)).toBe(3); // Chainmail + DEX 16
  });

  it("should subtract 1 for shield", () => {
    expect(calculateAC(5, true, 0)).toBe(4); // Chainmail + Shield
  });

  it("should apply both shield and DEX", () => {
    expect(calculateAC(5, true, -2)).toBe(2); // Chainmail + Shield + DEX 16
  });

  it("should handle no armor with shield", () => {
    expect(calculateAC(null, true, 0)).toBe(9); // No armor + Shield
  });

  it("should handle full plate", () => {
    expect(calculateAC(1, true, -4)).toBe(-4); // Full plate + Shield + DEX 18
  });
});

describe("Encumbrance", () => {
  it("should return unencumbered when weight is under 1/3 of allowance", () => {
    expect(calculateEncumbrance(30, 110)).toBe("unencumbered"); // ~27%
  });

  it("should return light when weight is 1/3 to 1/2 of allowance", () => {
    expect(calculateEncumbrance(45, 110)).toBe("light"); // ~41%
  });

  it("should return moderate when weight is 1/2 to 2/3 of allowance", () => {
    expect(calculateEncumbrance(65, 110)).toBe("moderate"); // ~59%
  });

  it("should return heavy when weight is 2/3 to full allowance", () => {
    expect(calculateEncumbrance(90, 110)).toBe("heavy"); // ~82%
  });

  it("should return severe when over allowance", () => {
    expect(calculateEncumbrance(120, 110)).toBe("severe");
  });
});

describe("Movement Rate", () => {
  it("should return full movement when unencumbered", () => {
    expect(getMovementRate(12, "unencumbered")).toBe(12);
  });

  it("should reduce by 1/3 when light encumbered", () => {
    expect(getMovementRate(12, "light")).toBe(9);
  });

  it("should reduce by 1/2 when moderate encumbered", () => {
    expect(getMovementRate(12, "moderate")).toBe(6);
  });

  it("should reduce by 2/3 when heavy encumbered", () => {
    expect(getMovementRate(12, "heavy")).toBe(3); // floor(12 * 0.33)
  });

  it("should reduce to 1 when severe encumbered", () => {
    expect(getMovementRate(12, "severe")).toBe(1);
  });
});
