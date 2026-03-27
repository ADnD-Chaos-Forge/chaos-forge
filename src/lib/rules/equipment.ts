export type EncumbranceLevel = "unencumbered" | "light" | "moderate" | "heavy" | "severe";

/**
 * Calculate AC in AD&D 2e.
 * Armor REPLACES base AC 10 (not subtractive). Shield gives -1. DEX adjustment applied.
 */
export function calculateAC(
  equippedArmorAC: number | null,
  shieldEquipped: boolean,
  dexDefenseAdj: number
): number {
  const baseAC = equippedArmorAC ?? 10;
  const shieldBonus = shieldEquipped ? -1 : 0;
  return baseAC + shieldBonus + dexDefenseAdj;
}

/**
 * Calculate encumbrance level based on carried weight vs STR weight allowance.
 * PHB Table 47 thresholds (simplified).
 */
export function calculateEncumbrance(
  totalWeight: number,
  strWeightAllow: number
): EncumbranceLevel {
  if (strWeightAllow <= 0) return "severe";
  const ratio = totalWeight / strWeightAllow;

  if (ratio <= 0.33) return "unencumbered";
  if (ratio <= 0.5) return "light";
  if (ratio <= 0.66) return "moderate";
  if (ratio <= 1.0) return "heavy";
  return "severe";
}

/**
 * Calculate movement rate based on armor and encumbrance.
 */
export function getMovementRate(baseMovement: number, encumbrance: EncumbranceLevel): number {
  switch (encumbrance) {
    case "unencumbered":
      return baseMovement;
    case "light":
      return Math.floor(baseMovement * 0.75);
    case "moderate":
      return Math.floor(baseMovement * 0.5);
    case "heavy":
      return Math.floor(baseMovement * 0.33);
    case "severe":
      return 1;
  }
}

const ENCUMBRANCE_LABELS: Record<EncumbranceLevel, string> = {
  unencumbered: "Unbelastet",
  light: "Leicht belastet",
  moderate: "Mäßig belastet",
  heavy: "Schwer belastet",
  severe: "Überbelastet",
};

export function getEncumbranceLabel(level: EncumbranceLevel): string {
  return ENCUMBRANCE_LABELS[level];
}

// ─── STARTING GOLD (PHB Table 44) ───────────────────────────────────────────

import type { ClassId } from "./types";
import { getClassGroup } from "./classes";

export interface StartingGold {
  diceCount: number;
  diceSides: number;
  bonus: number;
  multiplier: number;
}

const STARTING_GOLD: Record<string, StartingGold> = {
  warrior: { diceCount: 5, diceSides: 4, bonus: 0, multiplier: 10 },
  wizard: { diceCount: 1, diceSides: 4, bonus: 1, multiplier: 10 },
  priest: { diceCount: 3, diceSides: 6, bonus: 0, multiplier: 10 },
  rogue: { diceCount: 2, diceSides: 6, bonus: 0, multiplier: 10 },
};

export function getStartingGold(classId: ClassId): StartingGold {
  const group = getClassGroup(classId);
  return STARTING_GOLD[group];
}
