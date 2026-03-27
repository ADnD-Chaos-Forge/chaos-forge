import type { ClassGroup } from "./types";

/**
 * Calculate HP at level 1: hit die maximum + CON modifier (minimum 1)
 */
export function calculateHitPointsLevel1(
  classGroup: ClassGroup,
  hitDieMax: number,
  conHpAdj: number
): number {
  const cappedAdj = Math.min(conHpAdj, getConBonusCap(classGroup));
  return Math.max(1, hitDieMax + cappedAdj);
}

/**
 * CON HP bonus cap by class group.
 * Warriors can benefit from the full +3/+4 at CON 17/18.
 * All others are capped at +2.
 */
export function getConBonusCap(classGroup: ClassGroup): number {
  return classGroup === "warrior" ? 4 : 2;
}
