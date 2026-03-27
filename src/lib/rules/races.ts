import type { RaceId, ClassId, AbilityName, ClassAbility } from "./types";

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
  racialAbilities: ClassAbility[];
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
      {
        name: "Keine Klassen- oder Level-Beschränkungen",
        description:
          "Menschen können jede Klasse wählen und haben keine Stufenbegrenzung. Sie sind die vielseitigste Rasse in AD&D 2e.",
      },
      {
        name: "Dualclass möglich (einzige Rasse)",
        description:
          "Nur Menschen können Dualclass werden: Sie geben ihre alte Klasse auf und beginnen in einer neuen bei Stufe 1. Die Fähigkeiten der alten Klasse werden erst wieder verfügbar, wenn die neue Klasse eine höhere Stufe erreicht.",
      },
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
      {
        name: "Infravision 60 Fuß",
        description:
          "Elfen können im Dunkeln bis zu 60 Fuß weit sehen, indem sie Wärmestrahlung wahrnehmen. Infravision funktioniert nicht bei Tageslicht oder in der Nähe starker Lichtquellen.",
      },
      {
        name: "Resistenz gegen Schlaf- und Bezauberungszauber (90%)",
        description:
          "Elfen sind zu 90% resistent gegen Schlaf- und Bezauberungszauber (charm). Dies gilt für alle magischen Schlafeffekte und geistbeeinflussende Verzauberungen.",
      },
      {
        name: "Geheimtüren entdecken (1-auf-6 passiv, 2-auf-6 aktiv)",
        description:
          "Elfen entdecken versteckte und geheime Türen mit erhöhter Wahrscheinlichkeit. Beim bloßen Vorbeigehen spüren sie Verborgenes mit 1-auf-6, bei aktiver Suche mit 2-auf-6.",
      },
      {
        name: "+1 Treffer mit Langschwertern und Bögen",
        description:
          "Elfen erhalten aufgrund ihrer langen Übungstradition +1 auf Trefferwürfe mit Langschwertern, Kurzschwertern und allen Bogentypen (außer Armbrüsten).",
      },
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
      {
        name: "Infravision 30 Fuß",
        description:
          "Halbelfen können im Dunkeln bis zu 30 Fuß weit sehen, indem sie Wärmestrahlung wahrnehmen. Die Reichweite ist geringer als bei reinen Elfen.",
      },
      {
        name: "Resistenz gegen Schlaf- und Bezauberungszauber (30%)",
        description:
          "Halbelfen sind zu 30% resistent gegen Schlaf- und Bezauberungszauber. Diese geringere Resistenz spiegelt ihr gemischtes Erbe wider.",
      },
      {
        name: "Geheimtüren entdecken (1-auf-6 passiv, 2-auf-6 aktiv)",
        description:
          "Halbelfen haben die elfische Fähigkeit, verborgene Türen zu entdecken. Beim Vorbeigehen mit 1-auf-6, bei aktiver Suche mit 2-auf-6.",
      },
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
      {
        name: "Infravision 60 Fuß",
        description:
          "Zwerge können im Dunkeln bis zu 60 Fuß weit sehen, indem sie Wärmestrahlung wahrnehmen. Diese Fähigkeit stammt von ihrem Leben unter der Erde.",
      },
      {
        name: "Rettungswurf-Bonus gegen Gift und Magie (+1 pro 3,5 CON)",
        description:
          "Zwerge erhalten einen Bonus auf Rettungswürfe gegen Gift, Stäbe, Ruten, Zepter, Zauberstäbe und Zauber. Der Bonus beträgt +1 pro 3,5 Punkte Konstitution.",
      },
      {
        name: "Steinbearbeitung erkennen (Neigung, neue Tunnel, Fallen)",
        description:
          "Zwerge können unterirdisch Neigungen, neue Tunnel, gleitende Wände und Steinmechanismen auf einer 1-5 auf W6 erkennen. Diese Fähigkeit erfordert Konzentration.",
      },
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
      {
        name: "Infravision 60 Fuß",
        description:
          "Gnome können im Dunkeln bis zu 60 Fuß weit sehen, indem sie Wärmestrahlung wahrnehmen. Diese Fähigkeit stammt von ihrem unterirdischen Erbe.",
      },
      {
        name: "Rettungswurf-Bonus gegen Magie (+1 pro 3,5 CON)",
        description:
          "Gnome erhalten einen Bonus auf Rettungswürfe gegen Stäbe, Ruten, Zepter, Zauberstäbe und Zauber. Der Bonus beträgt +1 pro 3,5 Punkte Konstitution.",
      },
      {
        name: "+1 Treffer gegen Kobolde und Goblins",
        description:
          "Gnome erhalten +1 auf Trefferwürfe gegen Kobolde und Goblins aufgrund ihrer langen Feindschaft und speziellen Kampfausbildung gegen diese Kreaturen.",
      },
      {
        name: "Große Gegner (Oger, Trolle) haben -4 auf Angriffe",
        description:
          "Gnome sind kleine Ziele. Große humanoide Gegner wie Oger, Trolle, Oger-Magier und Riesen erleiden -4 auf ihre Trefferwürfe gegen Gnome.",
      },
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
      {
        name: "Infravision 30 Fuß",
        description:
          "Halblinge können im Dunkeln bis zu 30 Fuß weit sehen, indem sie Wärmestrahlung wahrnehmen.",
      },
      {
        name: "Rettungswurf-Bonus gegen Gift und Magie (+1 pro 3,5 CON)",
        description:
          "Halblinge erhalten einen Bonus auf Rettungswürfe gegen Gift, Stäbe, Ruten, Zepter, Zauberstäbe und Zauber. Der Bonus beträgt +1 pro 3,5 Punkte Konstitution.",
      },
      {
        name: "+1 Treffer mit Schleudern und Wurfwaffen",
        description:
          "Halblinge sind natürliche Schützen und erhalten +1 auf Trefferwürfe mit Schleudern und allen Wurfwaffen. Diese Fähigkeit ist angeboren und stapelt mit anderen Boni.",
      },
      {
        name: "Überraschungsbonus: -4 auf feindliche Überraschungswürfe",
        description:
          "Halblinge sind so leise und unauffällig, dass Gegner -4 auf ihre Überraschungswürfe erleiden, wenn der Halbling allein oder nur mit anderen Halblingen/Elfen unterwegs ist.",
      },
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
    racialAbilities: [
      {
        name: "Infravision 60 Fuß",
        description:
          "Halb-Orks können im Dunkeln bis zu 60 Fuß weit sehen, indem sie Wärmestrahlung wahrnehmen. Dieses Erbe stammt von ihrem orkischen Elternteil.",
      },
    ],
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
