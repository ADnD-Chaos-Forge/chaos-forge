import type { RaceId, ClassId, AbilityName } from "./types";

export interface RaceDefinition {
  id: RaceId;
  name: string;
  abilityAdjustments: Partial<Record<AbilityName, number>>;
  allowedClasses: ClassId[];
  levelLimits: Partial<Record<ClassId, number>>; // missing = unlimited (humans)
  multiclassOptions: ClassId[][]; // available multiclass combinations
  infravision: number; // in feet, 0 = none
  baseMovement: number; // base movement rate (e.g. 12 for humans)
  abilityMinimums?: Partial<Record<AbilityName, number>>;
  abilityMaximums?: Partial<Record<AbilityName, number>>;
  racialAbilities: string[];
  defaultLanguages: string[];
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
    baseMovement: 12,
    racialAbilities: [
      "Keine Klassen- oder Level-Beschränkungen",
      "Dualclass möglich (einzige Rasse)",
    ],
    defaultLanguages: ["Common"],
  },

  elf: {
    id: "elf",
    name: "Elf",
    abilityAdjustments: { dex: 1, con: -1 },
    allowedClasses: ["fighter", "ranger", "mage", ...MAGE_SPECIALISTS, "cleric", "thief"],
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
    baseMovement: 12,
    abilityMinimums: { int: 8, dex: 6 },
    abilityMaximums: { con: 17 },
    racialAbilities: [
      "Infravision 60 Fuß",
      "Resistenz gegen Schlaf- und Bezauberungszauber (90%)",
      "Geheimtüren entdecken (1-auf-6 passiv, 2-auf-6 aktiv)",
      "+1 Treffer mit Langschwertern und Bögen",
    ],
    defaultLanguages: ["Common", "Elfisch"],
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
    baseMovement: 12,
    abilityMinimums: { int: 4, con: 4 },
    racialAbilities: [
      "Infravision 30 Fuß",
      "Resistenz gegen Schlaf- und Bezauberungszauber (30%)",
      "Geheimtüren entdecken (1-auf-6 passiv, 2-auf-6 aktiv)",
    ],
    defaultLanguages: ["Common", "Elfisch"],
  },

  dwarf: {
    id: "dwarf",
    name: "Zwerg",
    abilityAdjustments: { con: 1, cha: -1 },
    allowedClasses: ["fighter", "cleric", "thief"],
    levelLimits: { fighter: 15, cleric: 10, thief: 12 },
    multiclassOptions: [
      ["fighter", "cleric"],
      ["fighter", "thief"],
    ],
    infravision: 60,
    baseMovement: 6,
    abilityMinimums: { str: 8, con: 11 },
    abilityMaximums: { cha: 16 },
    racialAbilities: [
      "Infravision 60 Fuß",
      "Rettungswurf-Bonus gegen Gift und Magie (+1 pro 3,5 CON)",
      "Steinbearbeitung erkennen (Neigung, neue Tunnel, Fallen)",
    ],
    defaultLanguages: ["Common", "Zwergisch"],
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
    baseMovement: 6,
    abilityMinimums: { int: 6, con: 8 },
    abilityMaximums: { str: 17, wis: 17 },
    racialAbilities: [
      "Infravision 60 Fuß",
      "Rettungswurf-Bonus gegen Magie (+1 pro 3,5 CON)",
      "+1 Treffer gegen Kobolde und Goblins",
      "Große Gegner (Oger, Trolle) haben -4 auf Angriffe",
    ],
    defaultLanguages: ["Common", "Gnomisch"],
  },

  halfling: {
    id: "halfling",
    name: "Halbling",
    abilityAdjustments: { dex: 1, str: -1 },
    allowedClasses: ["fighter", "cleric", "thief"],
    levelLimits: { fighter: 9, cleric: 8, thief: 15 },
    multiclassOptions: [["fighter", "thief"]],
    infravision: 30,
    baseMovement: 6,
    abilityMinimums: { dex: 7, con: 10, str: 7 },
    abilityMaximums: { str: 17, wis: 17 },
    racialAbilities: [
      "Infravision 30 Fuß",
      "Rettungswurf-Bonus gegen Gift und Magie (+1 pro 3,5 CON)",
      "+1 Treffer mit Schleudern und Wurfwaffen",
      "Überraschungsbonus: -4 auf feindliche Überraschungswürfe",
    ],
    defaultLanguages: ["Common", "Halblingisch"],
  },

  half_orc: {
    id: "half_orc",
    name: "Halb-Ork",
    abilityAdjustments: { str: 1, con: 1, cha: -2 },
    allowedClasses: ["fighter", "cleric", "thief"],
    levelLimits: { fighter: 12, cleric: 4, thief: 8 },
    multiclassOptions: [
      ["fighter", "cleric"],
      ["fighter", "thief"],
      ["cleric", "thief"],
    ],
    infravision: 60,
    baseMovement: 12,
    abilityMinimums: { str: 6, con: 13 },
    abilityMaximums: { int: 17, wis: 14, cha: 12 },
    racialAbilities: ["Infravision 60 Fuß"],
    defaultLanguages: ["Common", "Orkisch"],
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
