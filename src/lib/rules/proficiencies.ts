import type { ClassGroup, ClassId } from "./types";

/**
 * Weapon proficiency slots by class group and level.
 * PHB Table 34.
 */
export function getWeaponProficiencySlots(classGroup: ClassGroup, level: number): number {
  switch (classGroup) {
    case "warrior":
      return 4 + Math.floor((level - 1) / 3);
    case "priest":
      return 2 + Math.floor((level - 1) / 4);
    case "rogue":
      return 2 + Math.floor((level - 1) / 4);
    case "wizard":
      return 1 + Math.floor((level - 1) / 6);
  }
}

/**
 * Non-weapon proficiency slots by class group and level.
 * PHB Table 34. Base slots + additional every 3 levels.
 */
export function getNonweaponProficiencySlots(
  classGroup: ClassGroup,
  level: number,
  intScore?: number
): number {
  const base = classGroup === "priest" || classGroup === "wizard" ? 4 : 3;
  return base + Math.floor((level - 1) / 3);
}

/**
 * Attack penalty when using a weapon the character is not proficient with.
 * PHB Table 34.
 */
export function getNonproficiencyPenalty(classGroup: ClassGroup): number {
  switch (classGroup) {
    case "warrior":
      return -2;
    case "priest":
      return -3;
    case "rogue":
      return -3;
    case "wizard":
      return -5;
  }
}

/**
 * Only single-class fighters can specialize (not rangers, not paladins).
 * PHB Chapter 5.
 */
export function canSpecialize(classId: ClassId): boolean {
  return classId === "fighter";
}
