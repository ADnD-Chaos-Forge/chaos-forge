import { describe, it, expect } from "vitest";
import {
  calculateAC,
  calculateEncumbrance,
  getMovementRate,
  getStartingGold,
  calculatePayment,
  purseTotalInCP,
} from "./equipment";

describe("EQUIP-001: AC Calculation", () => {
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

describe("EQUIP-002: Encumbrance", () => {
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

describe("EQUIP-003: Movement Rate", () => {
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

describe("EQUIP-004: getStartingGold", () => {
  it("fighter: 5d4 × 10 = range 50-200", () => {
    const g = getStartingGold("fighter");
    expect(g.diceCount).toBe(5);
    expect(g.diceSides).toBe(4);
    expect(g.multiplier).toBe(10);
  });

  it("mage: (1d4+1) × 10 = range 20-50", () => {
    const g = getStartingGold("mage");
    expect(g.diceCount).toBe(1);
    expect(g.diceSides).toBe(4);
    expect(g.bonus).toBe(1);
    expect(g.multiplier).toBe(10);
  });

  it("thief: 2d6 × 10 = range 20-120", () => {
    const g = getStartingGold("thief");
    expect(g.diceCount).toBe(2);
    expect(g.diceSides).toBe(6);
    expect(g.multiplier).toBe(10);
  });

  it("cleric: 3d6 × 10 = range 30-180", () => {
    const g = getStartingGold("cleric");
    expect(g.diceCount).toBe(3);
    expect(g.diceSides).toBe(6);
    expect(g.multiplier).toBe(10);
  });
});

describe("Payment System", () => {
  it("purseTotalInCP converts correctly", () => {
    expect(purseTotalInCP({ pp: 1, gp: 1, ep: 1, sp: 1, cp: 1 })).toBe(661);
  });

  it("exact GP payment", () => {
    const purse = { pp: 0, gp: 10, ep: 0, sp: 0, cp: 0 };
    const result = calculatePayment(purse, 500); // 5 GP
    expect(result.success).toBe(true);
    expect(result.remaining.gp).toBe(5);
  });

  it("payment with PP when no GP", () => {
    const purse = { pp: 2, gp: 0, ep: 0, sp: 0, cp: 0 };
    const result = calculatePayment(purse, 300); // 3 GP
    expect(result.success).toBe(true);
    expect(result.remaining.pp).toBe(1);
    // 1 PP broken = 5 GP, spent 3 GP worth, change = 2 GP
    expect(result.remaining.gp).toBe(2);
  });

  it("insufficient funds", () => {
    const purse = { pp: 0, gp: 1, ep: 0, sp: 0, cp: 0 };
    const result = calculatePayment(purse, 500); // 5 GP
    expect(result.success).toBe(false);
    expect(result.shortfall).toBe(400);
  });

  it("mixed coins payment", () => {
    const purse = { pp: 0, gp: 2, ep: 3, sp: 5, cp: 10 };
    const result = calculatePayment(purse, 100); // 1 GP
    expect(result.success).toBe(true);
    expect(result.remaining.gp).toBe(1); // spent 1 GP
  });

  it("zero cost returns purse unchanged", () => {
    const purse = { pp: 1, gp: 2, ep: 0, sp: 0, cp: 0 };
    const result = calculatePayment(purse, 0);
    expect(result.success).toBe(true);
    expect(result.remaining).toEqual(purse);
  });

  it("making change from SP", () => {
    const purse = { pp: 0, gp: 0, ep: 0, sp: 3, cp: 0 };
    const result = calculatePayment(purse, 5); // 0.5 SP = 5 CP
    expect(result.success).toBe(true);
    expect(result.remaining.sp).toBe(2);
    expect(result.remaining.cp).toBe(5);
  });
});
