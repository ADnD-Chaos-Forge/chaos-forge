import type { ClassId, MagicSchool, PriestSphere } from "./types";
import { CLASSES } from "./classes";
import { getOppositionSchools, hasSphereAccess } from "./magic";
import { getIntelligenceModifiers, getWisdomModifiers } from "./abilities";

// PHB Table 21: Wizard Spell Progression
// Index = spell level - 1, value = number of slots
const WIZARD_SLOTS: number[][] = [
  // L1:  1st
  [1, 0, 0, 0, 0, 0, 0, 0, 0],
  // L2
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  // L3
  [2, 1, 0, 0, 0, 0, 0, 0, 0],
  // L4
  [3, 2, 0, 0, 0, 0, 0, 0, 0],
  // L5
  [4, 2, 1, 0, 0, 0, 0, 0, 0],
  // L6
  [4, 2, 2, 0, 0, 0, 0, 0, 0],
  // L7
  [4, 3, 2, 1, 0, 0, 0, 0, 0],
  // L8
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  // L9
  [4, 3, 3, 2, 1, 0, 0, 0, 0],
  // L10
  [4, 4, 3, 2, 2, 0, 0, 0, 0],
  // L11
  [4, 4, 4, 3, 3, 0, 0, 0, 0],
  // L12
  [4, 4, 4, 4, 4, 1, 0, 0, 0],
  // L13
  [5, 5, 5, 4, 4, 2, 0, 0, 0],
  // L14
  [5, 5, 5, 4, 4, 2, 1, 0, 0],
  // L15
  [5, 5, 5, 5, 5, 2, 1, 0, 0],
  // L16
  [5, 5, 5, 5, 5, 3, 2, 1, 0],
  // L17
  [5, 5, 5, 5, 5, 3, 3, 2, 0],
  // L18
  [5, 5, 5, 5, 5, 3, 3, 2, 1],
  // L19
  [5, 5, 5, 5, 5, 3, 3, 3, 1],
  // L20
  [5, 5, 5, 5, 5, 4, 3, 3, 2],
];

// PHB Table 24: Priest Spell Progression (7 levels)
const PRIEST_SLOTS: number[][] = [
  // L1
  [1, 0, 0, 0, 0, 0, 0],
  // L2
  [2, 0, 0, 0, 0, 0, 0],
  // L3
  [2, 1, 0, 0, 0, 0, 0],
  // L4
  [3, 2, 0, 0, 0, 0, 0],
  // L5
  [3, 3, 1, 0, 0, 0, 0],
  // L6
  [3, 3, 2, 0, 0, 0, 0],
  // L7
  [3, 3, 2, 1, 0, 0, 0],
  // L8
  [3, 3, 3, 2, 0, 0, 0],
  // L9
  [4, 4, 3, 2, 1, 0, 0],
  // L10
  [4, 4, 3, 3, 2, 0, 0],
  // L11
  [5, 4, 4, 3, 2, 1, 0],
  // L12
  [6, 5, 5, 3, 2, 2, 0],
  // L13
  [6, 6, 6, 4, 2, 2, 0],
  // L14
  [6, 6, 6, 5, 3, 2, 1],
  // L15
  [7, 7, 7, 5, 4, 2, 1],
  // L16
  [7, 7, 7, 6, 5, 3, 1],
  // L17
  [8, 8, 8, 6, 5, 3, 1],
  // L18
  [8, 8, 8, 7, 6, 4, 2],
  // L19
  [9, 9, 8, 7, 6, 4, 2],
  // L20
  [9, 9, 9, 8, 7, 5, 2],
];

export function getWizardSpellSlots(level: number): number[] {
  const idx = Math.min(level, WIZARD_SLOTS.length) - 1;
  return [...WIZARD_SLOTS[Math.max(0, idx)]];
}

export function getPriestSpellSlots(level: number): number[] {
  const idx = Math.min(level, PRIEST_SLOTS.length) - 1;
  return [...PRIEST_SLOTS[Math.max(0, idx)]];
}

/**
 * Bonus priest spell slots from WIS.
 * Uses the bonusSpells array from getWisdomModifiers().
 */
export function getPriestBonusSlots(wisScore: number): number[] {
  const { bonusSpells } = getWisdomModifiers(wisScore);
  const result = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < bonusSpells.length && i < 7; i++) {
    result[i] = bonusSpells[i];
  }
  return result;
}

export interface SpellLearnResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if a character can learn a specific spell.
 */
// ─── PRIEST SPELL POINTS (Player's Option: Spells & Magic) ───────────────────
// Spell Points replace fixed slots — priests get a pool of points they can
// spend flexibly on any spell they know. Spell cost = spell level squared.

// Table 26: Priest Spell Point Progression
const PRIEST_SPELL_POINTS: number[] = [
  // L1-L20
  10, 15, 20, 28, 36, 45, 55, 65, 78, 92, 107, 123, 140, 158, 177, 197, 218, 240, 263, 287,
];

// Table 28: Spell Point Cost by Priest Spell Level
// Cost = level of the spell (1=1, 2=2, 3=4, 4=6, 5=8, 6=10, 7=12)
const PRIEST_SPELL_POINT_COST: number[] = [
  1,
  2,
  4,
  6,
  8,
  10,
  12, // spell levels 1-7
];

// Table 27: Bonus Spell Points from WIS
// WIS 13=+1, 14=+2, 15=+4, 16=+8, 17=+12, 18=+16
const PRIEST_BONUS_SPELL_POINTS: Record<number, number> = {
  13: 1,
  14: 2,
  15: 4,
  16: 8,
  17: 12,
  18: 16,
};

export function getPriestSpellPoints(level: number): number {
  const idx = Math.min(level, PRIEST_SPELL_POINTS.length) - 1;
  return PRIEST_SPELL_POINTS[Math.max(0, idx)];
}

export function getPriestBonusSpellPoints(wisScore: number): number {
  let bonus = 0;
  for (const [wis, points] of Object.entries(PRIEST_BONUS_SPELL_POINTS)) {
    if (wisScore >= parseInt(wis)) bonus = points;
  }
  return bonus;
}

export function getPriestSpellCost(spellLevel: number): number {
  if (spellLevel < 1 || spellLevel > 7) return 0;
  return PRIEST_SPELL_POINT_COST[spellLevel - 1];
}

export function canLearnSpell(
  classId: ClassId,
  spellSchool: MagicSchool | undefined,
  spellSphere: PriestSphere | undefined,
  spellLevel: number,
  intScore: number
): SpellLearnResult {
  const cls = CLASSES[classId];
  if (!cls) return { allowed: false, reason: "Ungültige Klasse." };

  // Non-casters can't learn spells
  if (cls.group !== "wizard" && cls.group !== "priest" && classId !== "bard") {
    return { allowed: false, reason: "Diese Klasse kann keine Zauber wirken." };
  }

  // Wizard spell checks
  if (cls.group === "wizard" && spellSchool) {
    // Check opposition schools for specialists
    const opposition = getOppositionSchools(classId);
    if (opposition.includes(spellSchool)) {
      return { allowed: false, reason: `Verbotene Schule für diese Spezialisierung.` };
    }

    // Check INT spell level limit
    const intMods = getIntelligenceModifiers(intScore);
    if (intMods.spellLevel !== null && spellLevel > intMods.spellLevel) {
      return {
        allowed: false,
        reason: `INT ${intScore} erlaubt maximal Zauberstufe ${intMods.spellLevel}.`,
      };
    }
  }

  // Priest spell checks
  if (cls.group === "priest" && spellSphere) {
    if (!hasSphereAccess(classId, spellSphere, "minor")) {
      return { allowed: false, reason: `Kein Zugang zur Sphäre "${spellSphere}".` };
    }

    // Minor sphere access: max level 3
    if (!hasSphereAccess(classId, spellSphere, "major") && spellLevel > 3) {
      return {
        allowed: false,
        reason: `Nebensphäre "${spellSphere}": maximal Zauberstufe 3.`,
      };
    }
  }

  return { allowed: true };
}
