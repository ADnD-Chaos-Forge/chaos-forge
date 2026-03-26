import type { ClassId, ClassGroup, AbilityName } from "./types";

export interface ClassDefinition {
  id: ClassId;
  name: string;
  group: ClassGroup;
  hitDie: number; // e.g. 10 for d10
  abilityRequirements: Partial<Record<AbilityName, number>>;
  primeRequisites: AbilityName[];
  exceptionalStrength: boolean; // only warrior group
}

export const CLASSES: Record<ClassId, ClassDefinition> = {
  fighter: {
    id: "fighter",
    name: "Kämpfer",
    group: "warrior",
    hitDie: 10,
    abilityRequirements: { str: 9 },
    primeRequisites: ["str"],
    exceptionalStrength: true,
  },
  ranger: {
    id: "ranger",
    name: "Waldläufer",
    group: "warrior",
    hitDie: 10,
    abilityRequirements: { str: 13, dex: 13, con: 14, wis: 14 },
    primeRequisites: ["str", "dex", "wis"],
    exceptionalStrength: true,
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    group: "warrior",
    hitDie: 10,
    abilityRequirements: { str: 12, con: 9, wis: 13, cha: 17 },
    primeRequisites: ["str", "cha"],
    exceptionalStrength: true,
  },
  mage: {
    id: "mage",
    name: "Magier",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  abjurer: {
    id: "abjurer",
    name: "Bannzauberer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, wis: 15 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  conjurer: {
    id: "conjurer",
    name: "Beschwörer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, con: 15 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  diviner: {
    id: "diviner",
    name: "Seher",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, wis: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  enchanter: {
    id: "enchanter",
    name: "Verzauberer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, cha: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  illusionist: {
    id: "illusionist",
    name: "Illusionist",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, dex: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  invoker: {
    id: "invoker",
    name: "Anrufer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, con: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  necromancer: {
    id: "necromancer",
    name: "Nekromant",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, wis: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  transmuter: {
    id: "transmuter",
    name: "Verwandler",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, dex: 15 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
  },
  cleric: {
    id: "cleric",
    name: "Kleriker",
    group: "priest",
    hitDie: 8,
    abilityRequirements: { wis: 9 },
    primeRequisites: ["wis"],
    exceptionalStrength: false,
  },
  druid: {
    id: "druid",
    name: "Druide",
    group: "priest",
    hitDie: 8,
    abilityRequirements: { wis: 12, cha: 15 },
    primeRequisites: ["wis", "cha"],
    exceptionalStrength: false,
  },
  thief: {
    id: "thief",
    name: "Dieb",
    group: "rogue",
    hitDie: 6,
    abilityRequirements: { dex: 9 },
    primeRequisites: ["dex"],
    exceptionalStrength: false,
  },
  bard: {
    id: "bard",
    name: "Barde",
    group: "rogue",
    hitDie: 6,
    abilityRequirements: { dex: 12, int: 13, cha: 15 },
    primeRequisites: ["dex", "cha"],
    exceptionalStrength: false,
  },
};

export function getClass(classId: ClassId): ClassDefinition {
  return CLASSES[classId];
}

export function getAllClasses(): ClassDefinition[] {
  return Object.values(CLASSES);
}

export function getClassGroup(classId: ClassId): ClassGroup {
  return CLASSES[classId].group;
}

export function meetsAbilityRequirements(
  classId: ClassId,
  abilities: Record<AbilityName, number>
): boolean {
  const reqs = CLASSES[classId].abilityRequirements;
  return Object.entries(reqs).every(
    ([ability, min]) => abilities[ability as AbilityName] >= (min as number)
  );
}
