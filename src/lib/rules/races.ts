import type { RaceId, ClassId, AbilityName } from "./types";

export interface RaceDefinition {
  id: RaceId;
  name: string;
  abilityAdjustments: Partial<Record<AbilityName, number>>;
  allowedClasses: ClassId[];
  levelLimits: Partial<Record<ClassId, number>>; // missing = unlimited (humans)
  multiclassOptions: ClassId[][]; // available multiclass combinations
  infravision: number; // in feet, 0 = none
  abilityMinimums?: Partial<Record<AbilityName, number>>;
  abilityMaximums?: Partial<Record<AbilityName, number>>;
}

const ALL_CLASSES: ClassId[] = [
  "fighter",
  "ranger",
  "paladin",
  "mage",
  "abjurer",
  "conjurer",
  "diviner",
  "enchanter",
  "illusionist",
  "invoker",
  "necromancer",
  "transmuter",
  "cleric",
  "druid",
  "thief",
  "bard",
];

const MAGE_SPECIALISTS: ClassId[] = [
  "abjurer",
  "conjurer",
  "diviner",
  "enchanter",
  "illusionist",
  "invoker",
  "necromancer",
  "transmuter",
];

export const RACES: Record<RaceId, RaceDefinition> = {
  human: {
    id: "human",
    name: "Mensch",
    abilityAdjustments: {},
    allowedClasses: ALL_CLASSES,
    levelLimits: {},
    multiclassOptions: [],
    infravision: 0,
  },

  elf: {
    id: "elf",
    name: "Elf",
    abilityAdjustments: { dex: 1, con: -1 },
    allowedClasses: [
      "fighter",
      "ranger",
      "mage",
      ...MAGE_SPECIALISTS,
      "cleric",
      "thief",
    ],
    levelLimits: {
      fighter: 12,
      ranger: 15,
      mage: 15,
      abjurer: 15,
      conjurer: 15,
      diviner: 15,
      enchanter: 15,
      illusionist: 15,
      invoker: 15,
      necromancer: 15,
      transmuter: 15,
      cleric: 12,
      thief: 12,
    },
    multiclassOptions: [
      ["fighter", "mage"],
      ["fighter", "thief"],
      ["mage", "thief"],
      ["fighter", "mage", "thief"],
    ],
    infravision: 60,
    abilityMinimums: { int: 8, dex: 6 },
    abilityMaximums: { con: 17 },
  },

  half_elf: {
    id: "half_elf",
    name: "Halbelf",
    abilityAdjustments: {},
    allowedClasses: [
      "fighter",
      "ranger",
      "mage",
      ...MAGE_SPECIALISTS,
      "cleric",
      "druid",
      "thief",
      "bard",
    ],
    levelLimits: {
      fighter: 14,
      ranger: 16,
      mage: 12,
      abjurer: 12,
      conjurer: 12,
      diviner: 12,
      enchanter: 12,
      illusionist: 12,
      invoker: 12,
      necromancer: 12,
      transmuter: 12,
      cleric: 14,
      druid: 9,
      thief: 12,
      bard: 12,
    },
    multiclassOptions: [
      ["fighter", "cleric"],
      ["fighter", "thief"],
      ["fighter", "mage"],
      ["cleric", "mage"],
      ["cleric", "thief"],
      ["thief", "mage"],
      ["fighter", "mage", "cleric"],
      ["fighter", "mage", "thief"],
    ],
    infravision: 30,
    abilityMinimums: { int: 4, con: 4 },
  },

  dwarf: {
    id: "dwarf",
    name: "Zwerg",
    abilityAdjustments: { con: 1, cha: -1 },
    allowedClasses: ["fighter", "cleric", "thief"],
    levelLimits: { fighter: 15, cleric: 10, thief: 12 },
    multiclassOptions: [["fighter", "cleric"], ["fighter", "thief"]],
    infravision: 60,
    abilityMinimums: { str: 8, con: 11 },
    abilityMaximums: { cha: 16 },
  },

  gnome: {
    id: "gnome",
    name: "Gnom",
    abilityAdjustments: { int: 1, wis: -1 },
    allowedClasses: ["fighter", "illusionist", "cleric", "thief"],
    levelLimits: { fighter: 11, illusionist: 15, cleric: 9, thief: 13 },
    multiclassOptions: [
      ["fighter", "cleric"],
      ["fighter", "thief"],
      ["cleric", "thief"],
      ["fighter", "illusionist"],
      ["illusionist", "thief"],
    ],
    infravision: 60,
    abilityMinimums: { int: 6, con: 8 },
    abilityMaximums: { str: 17, wis: 17 },
  },

  halfling: {
    id: "halfling",
    name: "Halbling",
    abilityAdjustments: { dex: 1, str: -1 },
    allowedClasses: ["fighter", "cleric", "thief"],
    levelLimits: { fighter: 9, cleric: 8, thief: 15 },
    multiclassOptions: [["fighter", "thief"]],
    infravision: 30,
    abilityMinimums: { dex: 7, con: 10, str: 7 },
    abilityMaximums: { str: 17, wis: 17 },
  },

  half_orc: {
    id: "half_orc",
    name: "Halb-Ork",
    abilityAdjustments: { str: 1, con: 1, cha: -2 },
    allowedClasses: ["fighter", "cleric", "thief"],
    levelLimits: { fighter: 12, cleric: 4, thief: 8 },
    multiclassOptions: [["fighter", "cleric"], ["fighter", "thief"], ["cleric", "thief"]],
    infravision: 60,
    abilityMinimums: { str: 6, con: 13 },
    abilityMaximums: { int: 17, wis: 14, cha: 12 },
  },
};

export function getRace(raceId: RaceId): RaceDefinition {
  return RACES[raceId];
}

export function getAllRaces(): RaceDefinition[] {
  return Object.values(RACES);
}

export function canPlayClass(raceId: RaceId, classId: ClassId): boolean {
  return RACES[raceId].allowedClasses.includes(classId);
}

export function getLevelLimit(raceId: RaceId, classId: ClassId): number | null {
  const limit = RACES[raceId].levelLimits[classId];
  return limit ?? null; // null = unlimited
}
