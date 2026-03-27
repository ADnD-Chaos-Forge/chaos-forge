import type {
  StrengthModifiers,
  DexterityModifiers,
  ConstitutionModifiers,
  IntelligenceModifiers,
  WisdomModifiers,
  CharismaModifiers,
} from "./types";

// ─── STRENGTH ──────────────────────────────────────────────────────────────────
// PHB Table 1: Strength
// Index 0 = STR 3, Index 15 = STR 18

const STR_TABLE: StrengthModifiers[] = [
  // STR 3
  { hitAdj: -3, dmgAdj: -1, weightAllow: 5, maxPress: 10, openDoors: 2, bendBars: 0 },
  // STR 4
  { hitAdj: -2, dmgAdj: -1, weightAllow: 10, maxPress: 25, openDoors: 3, bendBars: 0 },
  // STR 5
  { hitAdj: -2, dmgAdj: -1, weightAllow: 10, maxPress: 25, openDoors: 3, bendBars: 0 },
  // STR 6
  { hitAdj: -1, dmgAdj: 0, weightAllow: 20, maxPress: 55, openDoors: 4, bendBars: 0 },
  // STR 7
  { hitAdj: -1, dmgAdj: 0, weightAllow: 20, maxPress: 55, openDoors: 4, bendBars: 0 },
  // STR 8
  { hitAdj: 0, dmgAdj: 0, weightAllow: 35, maxPress: 90, openDoors: 5, bendBars: 1 },
  // STR 9
  { hitAdj: 0, dmgAdj: 0, weightAllow: 35, maxPress: 90, openDoors: 5, bendBars: 1 },
  // STR 10
  { hitAdj: 0, dmgAdj: 0, weightAllow: 40, maxPress: 115, openDoors: 6, bendBars: 2 },
  // STR 11
  { hitAdj: 0, dmgAdj: 0, weightAllow: 40, maxPress: 115, openDoors: 6, bendBars: 2 },
  // STR 12
  { hitAdj: 0, dmgAdj: 0, weightAllow: 45, maxPress: 140, openDoors: 7, bendBars: 4 },
  // STR 13
  { hitAdj: 0, dmgAdj: 0, weightAllow: 45, maxPress: 140, openDoors: 7, bendBars: 4 },
  // STR 14
  { hitAdj: 0, dmgAdj: 0, weightAllow: 55, maxPress: 170, openDoors: 8, bendBars: 7 },
  // STR 15
  { hitAdj: 0, dmgAdj: 0, weightAllow: 55, maxPress: 170, openDoors: 8, bendBars: 7 },
  // STR 16
  { hitAdj: 0, dmgAdj: 1, weightAllow: 70, maxPress: 195, openDoors: 9, bendBars: 10 },
  // STR 17
  { hitAdj: 1, dmgAdj: 1, weightAllow: 85, maxPress: 220, openDoors: 10, bendBars: 13 },
  // STR 18
  { hitAdj: 1, dmgAdj: 2, weightAllow: 110, maxPress: 255, openDoors: 11, bendBars: 16 },
];

// PHB Table 1 continued: Exceptional Strength (18/01 - 18/00)
// Ranges: 01-50, 51-75, 76-90, 91-99, 00(=100)
const EXCEPTIONAL_STR_TABLE: { max: number; mods: StrengthModifiers }[] = [
  {
    max: 50,
    mods: { hitAdj: 1, dmgAdj: 3, weightAllow: 135, maxPress: 280, openDoors: 12, bendBars: 20 },
  },
  {
    max: 75,
    mods: { hitAdj: 2, dmgAdj: 3, weightAllow: 160, maxPress: 305, openDoors: 13, bendBars: 25 },
  },
  {
    max: 90,
    mods: { hitAdj: 2, dmgAdj: 4, weightAllow: 185, maxPress: 330, openDoors: 14, bendBars: 30 },
  },
  {
    max: 99,
    mods: { hitAdj: 2, dmgAdj: 5, weightAllow: 235, maxPress: 380, openDoors: 15, bendBars: 35 },
  },
  {
    max: 100,
    mods: { hitAdj: 3, dmgAdj: 6, weightAllow: 335, maxPress: 480, openDoors: 16, bendBars: 40 },
  },
];

export function getStrengthModifiers(str: number, exceptional?: number): StrengthModifiers {
  if (str === 18 && exceptional !== undefined && exceptional >= 1) {
    const entry = EXCEPTIONAL_STR_TABLE.find((e) => exceptional <= e.max);
    if (entry) return { ...entry.mods };
  }
  return { ...STR_TABLE[str - 3] };
}

// ─── DEXTERITY ─────────────────────────────────────────────────────────────────
// PHB Table 2: Dexterity

const DEX_TABLE: DexterityModifiers[] = [
  // DEX 3
  { reactionAdj: -3, missileAdj: -3, defensiveAdj: 4 },
  // DEX 4
  { reactionAdj: -2, missileAdj: -2, defensiveAdj: 3 },
  // DEX 5
  { reactionAdj: -1, missileAdj: -1, defensiveAdj: 2 },
  // DEX 6
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 1 },
  // DEX 7
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 8
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 9
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 10
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 11
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 12
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 13
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 14
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: 0 },
  // DEX 15
  { reactionAdj: 0, missileAdj: 0, defensiveAdj: -1 },
  // DEX 16
  { reactionAdj: 1, missileAdj: 1, defensiveAdj: -2 },
  // DEX 17
  { reactionAdj: 2, missileAdj: 2, defensiveAdj: -3 },
  // DEX 18
  { reactionAdj: 2, missileAdj: 2, defensiveAdj: -4 },
];

export function getDexterityModifiers(dex: number): DexterityModifiers {
  return { ...DEX_TABLE[dex - 3] };
}

// ─── CONSTITUTION ──────────────────────────────────────────────────────────────
// PHB Table 3: Constitution

const CON_TABLE: ConstitutionModifiers[] = [
  // CON 3
  { hpAdj: -2, systemShock: 35, resurrectionSurvival: 40, poisonSave: 0, regeneration: null },
  // CON 4
  { hpAdj: -1, systemShock: 40, resurrectionSurvival: 45, poisonSave: 0, regeneration: null },
  // CON 5
  { hpAdj: -1, systemShock: 45, resurrectionSurvival: 50, poisonSave: 0, regeneration: null },
  // CON 6
  { hpAdj: -1, systemShock: 50, resurrectionSurvival: 55, poisonSave: 0, regeneration: null },
  // CON 7
  { hpAdj: 0, systemShock: 55, resurrectionSurvival: 60, poisonSave: 0, regeneration: null },
  // CON 8
  { hpAdj: 0, systemShock: 60, resurrectionSurvival: 65, poisonSave: 0, regeneration: null },
  // CON 9
  { hpAdj: 0, systemShock: 65, resurrectionSurvival: 70, poisonSave: 0, regeneration: null },
  // CON 10
  { hpAdj: 0, systemShock: 70, resurrectionSurvival: 75, poisonSave: 0, regeneration: null },
  // CON 11
  { hpAdj: 0, systemShock: 75, resurrectionSurvival: 80, poisonSave: 0, regeneration: null },
  // CON 12
  { hpAdj: 0, systemShock: 80, resurrectionSurvival: 85, poisonSave: 0, regeneration: null },
  // CON 13
  { hpAdj: 0, systemShock: 85, resurrectionSurvival: 90, poisonSave: 0, regeneration: null },
  // CON 14
  { hpAdj: 0, systemShock: 88, resurrectionSurvival: 92, poisonSave: 0, regeneration: null },
  // CON 15
  { hpAdj: 1, systemShock: 90, resurrectionSurvival: 94, poisonSave: 0, regeneration: null },
  // CON 16
  { hpAdj: 2, systemShock: 95, resurrectionSurvival: 96, poisonSave: 0, regeneration: null },
  // CON 17
  { hpAdj: 3, systemShock: 97, resurrectionSurvival: 98, poisonSave: 0, regeneration: null },
  // CON 18
  { hpAdj: 4, systemShock: 99, resurrectionSurvival: 100, poisonSave: 0, regeneration: null },
];

export function getConstitutionModifiers(con: number): ConstitutionModifiers {
  return { ...CON_TABLE[con - 3] };
}

// ─── INTELLIGENCE ──────────────────────────────────────────────────────────────
// PHB Table 4: Intelligence

const INT_TABLE: IntelligenceModifiers[] = [
  // INT 3
  {
    numberOfLanguages: 1,
    spellLevel: null,
    chanceToLearn: 0,
    maxSpellsPerLevel: 0,
    spellImmunity: null,
  },
  // INT 4
  {
    numberOfLanguages: 1,
    spellLevel: null,
    chanceToLearn: 0,
    maxSpellsPerLevel: 0,
    spellImmunity: null,
  },
  // INT 5
  {
    numberOfLanguages: 1,
    spellLevel: null,
    chanceToLearn: 0,
    maxSpellsPerLevel: 0,
    spellImmunity: null,
  },
  // INT 6
  {
    numberOfLanguages: 1,
    spellLevel: null,
    chanceToLearn: 0,
    maxSpellsPerLevel: 0,
    spellImmunity: null,
  },
  // INT 7
  {
    numberOfLanguages: 1,
    spellLevel: null,
    chanceToLearn: 0,
    maxSpellsPerLevel: 0,
    spellImmunity: null,
  },
  // INT 8
  {
    numberOfLanguages: 1,
    spellLevel: null,
    chanceToLearn: 0,
    maxSpellsPerLevel: 0,
    spellImmunity: null,
  },
  // INT 9
  {
    numberOfLanguages: 2,
    spellLevel: 4,
    chanceToLearn: 35,
    maxSpellsPerLevel: 6,
    spellImmunity: null,
  },
  // INT 10
  {
    numberOfLanguages: 2,
    spellLevel: 5,
    chanceToLearn: 40,
    maxSpellsPerLevel: 7,
    spellImmunity: null,
  },
  // INT 11
  {
    numberOfLanguages: 2,
    spellLevel: 5,
    chanceToLearn: 45,
    maxSpellsPerLevel: 7,
    spellImmunity: null,
  },
  // INT 12
  {
    numberOfLanguages: 3,
    spellLevel: 6,
    chanceToLearn: 50,
    maxSpellsPerLevel: 7,
    spellImmunity: null,
  },
  // INT 13
  {
    numberOfLanguages: 3,
    spellLevel: 6,
    chanceToLearn: 55,
    maxSpellsPerLevel: 9,
    spellImmunity: null,
  },
  // INT 14
  {
    numberOfLanguages: 4,
    spellLevel: 7,
    chanceToLearn: 60,
    maxSpellsPerLevel: 9,
    spellImmunity: null,
  },
  // INT 15
  {
    numberOfLanguages: 4,
    spellLevel: 7,
    chanceToLearn: 65,
    maxSpellsPerLevel: 11,
    spellImmunity: null,
  },
  // INT 16
  {
    numberOfLanguages: 5,
    spellLevel: 8,
    chanceToLearn: 70,
    maxSpellsPerLevel: 11,
    spellImmunity: null,
  },
  // INT 17
  {
    numberOfLanguages: 6,
    spellLevel: 8,
    chanceToLearn: 75,
    maxSpellsPerLevel: 14,
    spellImmunity: null,
  },
  // INT 18
  {
    numberOfLanguages: 7,
    spellLevel: 9,
    chanceToLearn: 85,
    maxSpellsPerLevel: 18,
    spellImmunity: null,
  },
];

export function getIntelligenceModifiers(int: number): IntelligenceModifiers {
  return { ...INT_TABLE[int - 3] };
}

// ─── WISDOM ────────────────────────────────────────────────────────────────────
// PHB Table 5: Wisdom

const WIS_TABLE: WisdomModifiers[] = [
  // WIS 3
  { magicalDefenseAdj: -3, bonusSpells: [], spellFailure: 30 },
  // WIS 4
  { magicalDefenseAdj: -2, bonusSpells: [], spellFailure: 25 },
  // WIS 5
  { magicalDefenseAdj: -1, bonusSpells: [], spellFailure: 20 },
  // WIS 6
  { magicalDefenseAdj: -1, bonusSpells: [], spellFailure: 15 },
  // WIS 7
  { magicalDefenseAdj: -1, bonusSpells: [], spellFailure: 15 },
  // WIS 8
  { magicalDefenseAdj: 0, bonusSpells: [], spellFailure: 10 },
  // WIS 9
  { magicalDefenseAdj: 0, bonusSpells: [], spellFailure: 5 },
  // WIS 10
  { magicalDefenseAdj: 0, bonusSpells: [], spellFailure: 0 },
  // WIS 11
  { magicalDefenseAdj: 0, bonusSpells: [], spellFailure: 0 },
  // WIS 12
  { magicalDefenseAdj: 0, bonusSpells: [], spellFailure: 0 },
  // WIS 13
  { magicalDefenseAdj: 0, bonusSpells: [1], spellFailure: 0 },
  // WIS 14
  { magicalDefenseAdj: 0, bonusSpells: [1], spellFailure: 0 },
  // WIS 15
  { magicalDefenseAdj: 1, bonusSpells: [2], spellFailure: 0 },
  // WIS 16
  { magicalDefenseAdj: 2, bonusSpells: [2, 2], spellFailure: 0 },
  // WIS 17
  { magicalDefenseAdj: 3, bonusSpells: [2, 2, 1], spellFailure: 0 },
  // WIS 18
  { magicalDefenseAdj: 4, bonusSpells: [2, 2, 1, 1], spellFailure: 0 },
];

export function getWisdomModifiers(wis: number): WisdomModifiers {
  const entry = WIS_TABLE[wis - 3];
  return { ...entry, bonusSpells: [...entry.bonusSpells] };
}

// ─── CHARISMA ──────────────────────────────────────────────────────────────────
// PHB Table 6: Charisma

const CHA_TABLE: CharismaModifiers[] = [
  // CHA 3
  { maxHenchmen: 1, loyaltyBase: -5, reactionAdj: -5 },
  // CHA 4
  { maxHenchmen: 1, loyaltyBase: -4, reactionAdj: -4 },
  // CHA 5
  { maxHenchmen: 2, loyaltyBase: -3, reactionAdj: -3 },
  // CHA 6
  { maxHenchmen: 2, loyaltyBase: -2, reactionAdj: -2 },
  // CHA 7
  { maxHenchmen: 3, loyaltyBase: -1, reactionAdj: -1 },
  // CHA 8
  { maxHenchmen: 3, loyaltyBase: 0, reactionAdj: 0 },
  // CHA 9
  { maxHenchmen: 4, loyaltyBase: 0, reactionAdj: 0 },
  // CHA 10
  { maxHenchmen: 4, loyaltyBase: 0, reactionAdj: 0 },
  // CHA 11
  { maxHenchmen: 4, loyaltyBase: 0, reactionAdj: 0 },
  // CHA 12
  { maxHenchmen: 5, loyaltyBase: 0, reactionAdj: 0 },
  // CHA 13
  { maxHenchmen: 5, loyaltyBase: 0, reactionAdj: 1 },
  // CHA 14
  { maxHenchmen: 6, loyaltyBase: 1, reactionAdj: 2 },
  // CHA 15
  { maxHenchmen: 7, loyaltyBase: 3, reactionAdj: 3 },
  // CHA 16
  { maxHenchmen: 8, loyaltyBase: 4, reactionAdj: 5 },
  // CHA 17
  { maxHenchmen: 10, loyaltyBase: 6, reactionAdj: 6 },
  // CHA 18
  { maxHenchmen: 15, loyaltyBase: 8, reactionAdj: 7 },
];

export function getCharismaModifiers(cha: number): CharismaModifiers {
  return { ...CHA_TABLE[cha - 3] };
}

// ─── ABILITY SCORE GENERATION METHODS ────────────────────────────────────────

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function roll3d6(): number {
  return rollDie(6) + rollDie(6) + rollDie(6);
}

function roll4d6DropLowest(): number {
  const dice = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)];
  dice.sort((a, b) => a - b);
  return dice[1] + dice[2] + dice[3];
}

/** Method I: 3d6 in order for STR, DEX, CON, INT, WIS, CHA */
export function rollAbilityScoresMethodI(): number[] {
  return [roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6()];
}

/** Method II: 3d6 twice per ability, keep the higher */
export function rollAbilityScoresMethodII(): number[] {
  return Array.from({ length: 6 }, () => Math.max(roll3d6(), roll3d6()));
}

/** Method III: 3d6 six times, player arranges freely */
export function rollAbilityScoresMethodIII(): number[] {
  return [roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6(), roll3d6()];
}

/** Method IV: 3d6 twelve times, pick best 6 (returned sorted descending) */
export function rollAbilityScoresMethodIV(): number[] {
  const rolls = Array.from({ length: 12 }, () => roll3d6());
  rolls.sort((a, b) => b - a);
  return rolls.slice(0, 6);
}

/** Method V: 4d6 drop lowest, six times, player arranges freely */
export function rollAbilityScoresMethodV(): number[] {
  return Array.from({ length: 6 }, () => roll4d6DropLowest());
}
