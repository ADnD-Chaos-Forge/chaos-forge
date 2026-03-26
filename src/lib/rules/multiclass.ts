import type { ClassId, ClassGroup, SavingThrows, RaceId } from "./types";
import { CLASSES } from "./classes";
import { RACES } from "./races";
import { getThac0, getSavingThrows } from "./combat";

/** A single class entry for a multiclass character */
export interface ClassEntry {
  classId: ClassId;
  level: number;
}

// ─── THAC0 ───────────────────────────────────────────────────────────────────
// Multiclass: Use the best (lowest) THAC0 from all active classes

export function getMulticlassThac0(classes: ClassEntry[]): number {
  if (classes.length === 0) return 20;
  return Math.min(...classes.map((c) => getThac0(CLASSES[c.classId].group, c.level)));
}

// ─── SAVING THROWS ───────────────────────────────────────────────────────────
// Multiclass: Use the best (lowest) value in each category

export function getMulticlassSaves(classes: ClassEntry[]): SavingThrows {
  if (classes.length === 0) {
    return { paralyzation: 20, rod: 20, petrification: 20, breath: 20, spell: 20 };
  }

  const allSaves = classes.map((c) => getSavingThrows(CLASSES[c.classId].group, c.level));

  return {
    paralyzation: Math.min(...allSaves.map((s) => s.paralyzation)),
    rod: Math.min(...allSaves.map((s) => s.rod)),
    petrification: Math.min(...allSaves.map((s) => s.petrification)),
    breath: Math.min(...allSaves.map((s) => s.breath)),
    spell: Math.min(...allSaves.map((s) => s.spell)),
  };
}

// ─── HP DIVISOR ──────────────────────────────────────────────────────────────
// Multiclass: HP divided by number of classes

export function getMulticlassHpDivisor(classCount: number): number {
  return Math.max(1, classCount);
}

// ─── RULE COMPLIANCE ─────────────────────────────────────────────────────────
// Only for warnings — NEVER used to block selections

export function isRuleCompliantMulticlass(raceId: RaceId, classIds: ClassId[]): boolean {
  if (classIds.length <= 1) return true;

  const race = RACES[raceId];
  if (!race) return false;

  // Check if this exact combination exists in the race's multiclass options
  const sorted = [...classIds].sort();
  return race.multiclassOptions.some((option) => {
    const optionSorted = [...option].sort();
    return (
      optionSorted.length === sorted.length && optionSorted.every((cls, i) => cls === sorted[i])
    );
  });
}

// ─── EXCEPTIONAL STRENGTH ────────────────────────────────────────────────────
// At least one warrior class → eligible for exceptional strength

export function multiclassHasExceptionalStr(classIds: ClassId[]): boolean {
  return classIds.some((id) => CLASSES[id].exceptionalStrength);
}

// ─── CLASS GROUPS ────────────────────────────────────────────────────────────
// Get unique class groups for the multiclass combination

export function getMulticlassGroups(classIds: ClassId[]): ClassGroup[] {
  const groups = new Set(classIds.map((id) => CLASSES[id].group));
  return [...groups];
}
