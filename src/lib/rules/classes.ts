import type { ClassId, ClassGroup, AbilityName } from "./types";

export interface ClassDefinition {
  id: ClassId;
  name: string;
  group: ClassGroup;
  hitDie: number; // e.g. 10 for d10
  abilityRequirements: Partial<Record<AbilityName, number>>;
  primeRequisites: AbilityName[];
  exceptionalStrength: boolean; // only warrior group
  classAbilities: string[];
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
    classAbilities: [
      "Waffenspezialisierung möglich",
      "Mehrfachangriffe ab Stufe 7",
      "Ausnahmestärke bei STR 18",
    ],
  },
  ranger: {
    id: "ranger",
    name: "Waldläufer",
    group: "warrior",
    hitDie: 10,
    abilityRequirements: { str: 13, dex: 13, con: 14, wis: 14 },
    primeRequisites: ["str", "dex", "wis"],
    exceptionalStrength: true,
    classAbilities: [
      "Spezialisierter Feind (+4 Treffer/Schaden)",
      "Fährtensuche",
      "Zwei-Waffen-Kampf ohne Malus",
      "Begrenzte Druidenzauber ab Stufe 8",
    ],
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    group: "warrior",
    hitDie: 10,
    abilityRequirements: { str: 12, con: 9, wis: 13, cha: 17 },
    primeRequisites: ["str", "cha"],
    exceptionalStrength: true,
    classAbilities: [
      "Böses erkennen (60 Fuß)",
      "Handauflegen (2 HP/Stufe pro Tag)",
      "Immun gegen Krankheiten",
      "Untote vertreiben ab Stufe 3",
      "Begrenzte Klerikerzauber ab Stufe 9",
    ],
  },
  mage: {
    id: "mage",
    name: "Magier",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: ["Zauber aus allen 8 Schulen", "Zauber ins Zauberbuch schreiben"],
  },
  abjurer: {
    id: "abjurer",
    name: "Bannzauberer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, wis: 15 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Bannzauber)",
      "Verbotene Schulen: Verwandlung, Illusion",
    ],
  },
  conjurer: {
    id: "conjurer",
    name: "Beschwörer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, con: 15 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Beschwörung)",
      "Verbotene Schulen: Erkenntnis, Anrufung",
    ],
  },
  diviner: {
    id: "diviner",
    name: "Seher",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, wis: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: ["+1 Zauberplatz pro Stufe (Erkenntnis)", "Verbotene Schule: Beschwörung"],
  },
  enchanter: {
    id: "enchanter",
    name: "Verzauberer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, cha: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Verzauberung)",
      "Verbotene Schulen: Anrufung, Nekromantie",
    ],
  },
  illusionist: {
    id: "illusionist",
    name: "Illusionist",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, dex: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Illusion)",
      "Verbotene Schulen: Nekromantie, Anrufung, Bannzauber",
    ],
  },
  invoker: {
    id: "invoker",
    name: "Anrufer",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, con: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Anrufung)",
      "Verbotene Schulen: Verzauberung, Beschwörung",
    ],
  },
  necromancer: {
    id: "necromancer",
    name: "Nekromant",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, wis: 16 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Nekromantie)",
      "Verbotene Schulen: Illusion, Verzauberung",
    ],
  },
  transmuter: {
    id: "transmuter",
    name: "Verwandler",
    group: "wizard",
    hitDie: 4,
    abilityRequirements: { int: 9, dex: 15 },
    primeRequisites: ["int"],
    exceptionalStrength: false,
    classAbilities: [
      "+1 Zauberplatz pro Stufe (Verwandlung)",
      "Verbotene Schulen: Bannzauber, Nekromantie",
    ],
  },
  cleric: {
    id: "cleric",
    name: "Kleriker",
    group: "priest",
    hitDie: 8,
    abilityRequirements: { wis: 9 },
    primeRequisites: ["wis"],
    exceptionalStrength: false,
    classAbilities: [
      "Untote vertreiben",
      "Alle Rüstungen und Schilde erlaubt",
      "Zauber durch Gebet (keine Zauberbücher)",
    ],
  },
  druid: {
    id: "druid",
    name: "Druide",
    group: "priest",
    hitDie: 8,
    abilityRequirements: { wis: 12, cha: 15 },
    primeRequisites: ["wis", "cha"],
    exceptionalStrength: false,
    classAbilities: [
      "Gestaltwandel ab Stufe 7",
      "Immunität gegen Feenverzauberung",
      "Druidensprache",
      "Waldläufer-Fähigkeiten in der Wildnis",
    ],
  },
  thief: {
    id: "thief",
    name: "Dieb",
    group: "rogue",
    hitDie: 6,
    abilityRequirements: { dex: 9 },
    primeRequisites: ["dex"],
    exceptionalStrength: false,
    classAbilities: [
      "Schlösser öffnen",
      "Fallen finden/entschärfen",
      "Taschen leeren",
      "Lautlos bewegen",
      "Im Schatten verbergen",
      "Mauern erklimmen",
      "Hinterhältiger Angriff (Backstab)",
    ],
  },
  bard: {
    id: "bard",
    name: "Barde",
    group: "rogue",
    hitDie: 6,
    abilityRequirements: { dex: 12, int: 13, cha: 15 },
    primeRequisites: ["dex", "cha"],
    exceptionalStrength: false,
    classAbilities: [
      "Bardenwissen",
      "Bezaubernde Musik",
      "Begrenzte Diebes-Fähigkeiten",
      "Begrenzte Magierfähigkeiten ab Stufe 2",
    ],
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
