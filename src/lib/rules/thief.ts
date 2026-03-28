import type { ClassId, RaceId } from "./types";

/** Thief skill percentages */
export interface ThiefSkills {
  pickLocks: number;
  findTraps: number;
  moveSilently: number;
  hideInShadows: number;
  climbWalls: number;
  detectNoise: number;
  readLanguages: number;
}

// ─── BASE THIEF SKILLS (PHB Table 19) ────────────────────────────────────────
// Base percentages at level 1, with 30 discretionary points to distribute.
// We show the starting base values (before distribution).

const BASE_SKILLS: ThiefSkills = {
  pickLocks: 15,
  findTraps: 5,
  moveSilently: 10,
  hideInShadows: 5,
  climbWalls: 60,
  detectNoise: 15,
  readLanguages: 0,
};

export function getBaseThiefSkills(level: number): ThiefSkills {
  if (level < 1) return { ...BASE_SKILLS };

  // Each level after 1st, thieves get 30 points to distribute.
  // We return the base; actual allocation is player-driven (stored in DB).
  return { ...BASE_SKILLS };
}

// ─── RACIAL ADJUSTMENTS (PHB Table 27) ───────────────────────────────────────

const RACIAL_ADJUSTMENTS: Partial<Record<RaceId, Partial<ThiefSkills>>> = {
  dwarf: {
    pickLocks: 10,
    findTraps: 15,
    moveSilently: 0,
    hideInShadows: 0,
    climbWalls: -10,
    detectNoise: 0,
    readLanguages: -5,
  },
  elf: {
    pickLocks: -5,
    findTraps: 0,
    moveSilently: 5,
    hideInShadows: 10,
    climbWalls: 0,
    detectNoise: 5,
    readLanguages: 0,
  },
  gnome: {
    pickLocks: 5,
    findTraps: 10,
    moveSilently: 5,
    hideInShadows: 5,
    climbWalls: -15,
    detectNoise: 10,
    readLanguages: 0,
  },
  half_elf: {
    pickLocks: 10,
    findTraps: 5,
    moveSilently: 0,
    hideInShadows: 5,
    climbWalls: 0,
    detectNoise: 0,
    readLanguages: 0,
  },
  halfling: {
    pickLocks: 5,
    findTraps: 5,
    moveSilently: 15,
    hideInShadows: 15,
    climbWalls: -15,
    detectNoise: 5,
    readLanguages: -5,
  },
  half_orc: {
    pickLocks: 5,
    findTraps: 5,
    moveSilently: 0,
    hideInShadows: 0,
    climbWalls: 5,
    detectNoise: 0,
    readLanguages: 0,
  },
  human: {},
  kobold: {
    pickLocks: 5,
    findTraps: 5,
    moveSilently: 10,
    hideInShadows: 10,
    climbWalls: -10,
    detectNoise: 5,
    readLanguages: -10,
  },
};

export function getRacialThiefAdjustments(raceId: RaceId): Partial<ThiefSkills> {
  return RACIAL_ADJUSTMENTS[raceId] ?? {};
}

// ─── BACKSTAB MULTIPLIER ─────────────────────────────────────────────────────
// PHB: Thieves deal extra damage when attacking from behind

export function getBackstabMultiplier(level: number): number {
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

// ─── CLASS CHECKS ────────────────────────────────────────────────────────────

export function hasThiefSkills(classIds: ClassId[]): boolean {
  return classIds.includes("thief") || classIds.includes("bard");
}
