import type { ClassGroup, SavingThrows } from "./types";

// ─── THAC0 ─────────────────────────────────────────────────────────────────────
// PHB Chapter 9: THAC0 progression by class group
//
// Warriors:  improve by 1 every level (20 at L1, 19 at L2, ...)
// Priests:   improve by 2 every 3 levels (20 at L1-3, 18 at L4-6, ...)
// Rogues:    improve by 1 every 2 levels (20 at L1-2, 19 at L3-4, ...)
// Wizards:   improve by 1 every 3 levels (20 at L1-3, 19 at L4-6, ...)

export function getThac0(classGroup: ClassGroup, level: number): number {
  let thac0: number;

  switch (classGroup) {
    case "warrior":
      thac0 = 21 - level;
      break;
    case "priest":
      thac0 = 20 - Math.floor((level - 1) / 3) * 2;
      break;
    case "rogue":
      thac0 = 20 - Math.floor((level - 1) / 2);
      break;
    case "wizard":
      thac0 = 20 - Math.floor((level - 1) / 3);
      break;
  }

  return Math.max(1, thac0);
}

// ─── ATTACK ROLL ───────────────────────────────────────────────────────────────
// To hit a target: need to roll (THAC0 - target AC) or higher on d20

export function getAttackRoll(thac0: number, targetAC: number): number {
  return thac0 - targetAC;
}

// ─── SAVING THROWS ─────────────────────────────────────────────────────────────
// PHB Table 60-63: Saving Throws by class group and level
// Format: [paralyzation, rod, petrification, breath, spell]

type SaveRow = [number, number, number, number, number];

const WARRIOR_SAVES: { maxLevel: number; saves: SaveRow }[] = [
  { maxLevel: 2, saves: [14, 16, 15, 17, 17] },
  { maxLevel: 4, saves: [13, 15, 14, 16, 16] },
  { maxLevel: 6, saves: [11, 13, 12, 13, 14] },
  { maxLevel: 8, saves: [10, 12, 11, 12, 13] },
  { maxLevel: 10, saves: [8, 10, 9, 9, 11] },
  { maxLevel: 12, saves: [7, 9, 8, 8, 10] },
  { maxLevel: 14, saves: [5, 7, 6, 5, 8] },
  { maxLevel: 16, saves: [4, 6, 5, 4, 7] },
  { maxLevel: 99, saves: [3, 5, 4, 4, 6] },
];

const PRIEST_SAVES: { maxLevel: number; saves: SaveRow }[] = [
  { maxLevel: 3, saves: [10, 14, 13, 16, 15] },
  { maxLevel: 6, saves: [9, 13, 12, 15, 14] },
  { maxLevel: 9, saves: [7, 11, 10, 13, 12] },
  { maxLevel: 12, saves: [6, 10, 9, 12, 11] },
  { maxLevel: 15, saves: [5, 9, 8, 11, 10] },
  { maxLevel: 18, saves: [4, 8, 7, 10, 9] },
  { maxLevel: 99, saves: [2, 6, 5, 8, 7] },
];

const ROGUE_SAVES: { maxLevel: number; saves: SaveRow }[] = [
  { maxLevel: 4, saves: [13, 14, 12, 16, 15] },
  { maxLevel: 8, saves: [12, 12, 11, 15, 13] },
  { maxLevel: 12, saves: [11, 10, 10, 14, 11] },
  { maxLevel: 16, saves: [10, 8, 9, 13, 9] },
  { maxLevel: 20, saves: [9, 6, 8, 12, 7] },
  { maxLevel: 99, saves: [8, 4, 7, 11, 5] },
];

const WIZARD_SAVES: { maxLevel: number; saves: SaveRow }[] = [
  { maxLevel: 5, saves: [14, 11, 13, 15, 12] },
  { maxLevel: 10, saves: [13, 9, 11, 13, 10] },
  { maxLevel: 15, saves: [11, 7, 9, 11, 8] },
  { maxLevel: 20, saves: [10, 5, 7, 9, 6] },
  { maxLevel: 99, saves: [8, 3, 5, 7, 4] },
];

const SAVE_TABLES: Record<ClassGroup, { maxLevel: number; saves: SaveRow }[]> = {
  warrior: WARRIOR_SAVES,
  priest: PRIEST_SAVES,
  rogue: ROGUE_SAVES,
  wizard: WIZARD_SAVES,
};

export function getSavingThrows(classGroup: ClassGroup, level: number): SavingThrows {
  const table = SAVE_TABLES[classGroup];
  const row = table.find((entry) => level <= entry.maxLevel);
  const saves = row ? row.saves : table[table.length - 1].saves;

  return {
    paralyzation: saves[0],
    rod: saves[1],
    petrification: saves[2],
    breath: saves[3],
    spell: saves[4],
  };
}

// ─── ATTACKS PER ROUND ───────────────────────────────────────────────────────
// PHB: Warriors gain extra attacks at higher levels
// Warriors: 1/1 at L1-6, 3/2 at L7-12, 2/1 at L13+
// All others: 1/1

export function getAttacksPerRound(classGroup: ClassGroup, level: number): string {
  if (classGroup !== "warrior") return "1";
  if (level >= 13) return "2";
  if (level >= 7) return "3/2";
  return "1";
}
