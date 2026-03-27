import type { ClassId } from "./types";

export interface KitDefinition {
  id: string;
  name: string;
  name_en: string;
  classId: ClassId;
  hitDieOverride: number | null;
  maxArmorAC: number | null; // minimum AC value allowed (e.g., 5 for chain mail)
  abilities: { name: string; name_en: string; description: string; description_en: string }[];
}

export const KITS: Record<string, KitDefinition> = {
  // ── Fighter Kits ──────────────────────────────────────────────────────
  barbarian: {
    id: "barbarian",
    name: "Barbar",
    name_en: "Barbarian",
    classId: "fighter",
    hitDieOverride: 12,
    maxArmorAC: 5, // chain mail or lighter
    abilities: [
      {
        name: "d12 Trefferwürfel",
        name_en: "d12 Hit Die",
        description: "Der Barbar nutzt einen d12 statt d10 als Trefferwürfel.",
        description_en: "The barbarian uses a d12 instead of d10 as hit die.",
      },
      {
        name: "Mehrfache Spezialisierung",
        name_en: "Multiple Specialization",
        description: "Der Barbar kann sich auf mehrere Waffen spezialisieren.",
        description_en: "The barbarian can specialize in multiple weapons.",
      },
      {
        name: "Eingeschränkte Rüstung",
        name_en: "Limited Armor",
        description: "Der Barbar darf keine Rüstung schwerer als Kettenpanzer tragen.",
        description_en: "The barbarian may not wear armor heavier than chain mail.",
      },
    ],
  },
  cavalier: {
    id: "cavalier",
    name: "Kavalier",
    name_en: "Cavalier",
    classId: "fighter",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Berittener Kampfbonus",
        name_en: "Mounted Combat Bonus",
        description: "Der Kavalier erhält +1 auf Angriff und Schaden, wenn er beritten kämpft.",
        description_en: "The cavalier gains +1 to hit and damage while fighting mounted.",
      },
      {
        name: "Reitkunst",
        name_en: "Horsemanship",
        description: "Meisterhafte Reitfähigkeiten erlauben besondere Manöver im Sattel.",
        description_en: "Masterful riding skills allow special maneuvers while mounted.",
      },
      {
        name: "Ehrenkodex",
        name_en: "Code of Honor",
        description:
          "Der Kavalier folgt einem strengen Ehrenkodex, der sein Verhalten im Kampf und Alltag bestimmt.",
        description_en:
          "The cavalier follows a strict code of honor that governs conduct in battle and daily life.",
      },
    ],
  },
  swashbuckler: {
    id: "swashbuckler",
    name: "Musketier",
    name_en: "Swashbuckler",
    classId: "fighter",
    hitDieOverride: null,
    maxArmorAC: 5, // chain mail or lighter
    abilities: [
      {
        name: "Rüstungsklasse-Bonus",
        name_en: "AC Bonus",
        description: "Erhält +1 auf die Rüstungsklasse, wenn nur leichte Rüstung getragen wird.",
        description_en: "Gains +1 AC bonus when wearing light armor only.",
      },
      {
        name: "Akrobatik",
        name_en: "Tumbling",
        description: "Kann akrobatische Manöver im Kampf einsetzen, um Angriffen auszuweichen.",
        description_en: "Can use acrobatic maneuvers in combat to dodge attacks.",
      },
      {
        name: "Charme und Auftreten",
        name_en: "Charm/Panache",
        description:
          "Natürliches Charisma und elegantes Auftreten beeindrucken Verbündete und Gegner.",
        description_en: "Natural charisma and elegant demeanor impress allies and foes alike.",
      },
    ],
  },
  berserker: {
    id: "berserker",
    name: "Berserker",
    name_en: "Berserker",
    classId: "fighter",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Berserkergang",
        name_en: "Berserker Rage",
        description:
          "Im Kampfrausch erhält der Berserker +2 auf Angriff und Schaden, erleidet aber -2 auf die Rüstungsklasse.",
        description_en:
          "While raging, the berserker gains +2 to hit and damage but suffers -2 AC penalty.",
      },
      {
        name: "Furchtimmunität",
        name_en: "Immune to Fear in Rage",
        description: "Während des Berserkergangs ist der Berserker immun gegen Furcht-Effekte.",
        description_en: "While raging, the berserker is immune to all fear effects.",
      },
      {
        name: "Erschöpfung nach Raserei",
        name_en: "Rage Exhaustion",
        description:
          "Nach dem Berserkergang erleidet der Berserker Erschöpfung und Abzüge auf Angriffswürfe.",
        description_en:
          "After the rage ends, the berserker suffers exhaustion and attack roll penalties.",
      },
    ],
  },
  gladiator: {
    id: "gladiator",
    name: "Gladiator",
    name_en: "Gladiator",
    classId: "fighter",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Arenakampf",
        name_en: "Arena Combat",
        description: "Der Gladiator erhält +1 auf Angriffswürfe im Einzelkampf.",
        description_en: "The gladiator gains +1 to attack rolls in one-on-one combat.",
      },
      {
        name: "Waffenvorführung",
        name_en: "Weapon Display",
        description:
          "Kann eine einschüchternde Waffenvorführung durchführen, um Gegner zu demoralisieren.",
        description_en: "Can perform an intimidating weapon display to demoralize opponents.",
      },
      {
        name: "Publikumswirkung",
        name_en: "Crowd Appeal",
        description:
          "Beherrscht die Kunst, ein Publikum zu begeistern und deren Gunst zu gewinnen.",
        description_en: "Masters the art of thrilling an audience and winning their favor.",
      },
    ],
  },
  myrmidon: {
    id: "myrmidon",
    name: "Myrmidon",
    name_en: "Myrmidon",
    classId: "fighter",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Militärische Ausbildung",
        name_en: "Military Training",
        description:
          "Professionelle militärische Ausbildung verleiht Vorteile in Formation und Disziplin.",
        description_en:
          "Professional military training provides advantages in formation fighting and discipline.",
      },
      {
        name: "Gefolgsleute-Bonus",
        name_en: "Follower Bonus",
        description: "Zieht mehr Gefolgsleute an und kann diese effektiver befehligen.",
        description_en: "Attracts more followers and can command them more effectively.",
      },
      {
        name: "Taktische Disziplin",
        name_en: "Tactical Discipline",
        description:
          "Kann taktische Manöver koordinieren, die der gesamten Gruppe im Kampf zugutekommen.",
        description_en:
          "Can coordinate tactical maneuvers that benefit the entire party in combat.",
      },
    ],
  },

  // ── Thief Kits ────────────────────────────────────────────────────────
  assassin: {
    id: "assassin",
    name: "Meuchelmörder",
    name_en: "Assassin",
    classId: "thief",
    hitDieOverride: null,
    maxArmorAC: 8, // leather or lighter
    abilities: [
      {
        name: "Attentat",
        name_en: "Assassination Attempt",
        description:
          "Kann einen tödlichen Überraschungsangriff durchführen, der sofortigen Tod verursachen kann.",
        description_en: "Can perform a deadly surprise attack that may cause instant death.",
      },
      {
        name: "Giftgebrauch",
        name_en: "Poison Use",
        description: "Beherrscht den sicheren Umgang mit Giften, ohne sich selbst zu gefährden.",
        description_en:
          "Skilled in the safe handling and application of poisons without risk to self.",
      },
      {
        name: "Meisterhafte Verkleidung",
        name_en: "Disguise Mastery",
        description: "Kann überzeugende Verkleidungen anlegen, um unerkannt zu bleiben.",
        description_en: "Can create convincing disguises to remain undetected.",
      },
    ],
  },
  bounty_hunter: {
    id: "bounty_hunter",
    name: "Kopfgeldjäger",
    name_en: "Bounty Hunter",
    classId: "thief",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Spurenlesen",
        name_en: "Tracking Proficiency",
        description:
          "Beherrscht das Spurenlesen und kann Zielpersonen über weite Strecken verfolgen.",
        description_en: "Proficient in tracking and can follow targets over long distances.",
      },
      {
        name: "Fangbonus",
        name_en: "Capture Bonus",
        description: "Erhält Boni beim Versuch, Ziele lebend zu fangen statt zu töten.",
        description_en: "Gains bonuses when attempting to capture targets alive rather than kill.",
      },
      {
        name: "Informantennetzwerk",
        name_en: "Information Network",
        description:
          "Unterhält ein Netzwerk von Informanten, das bei der Suche nach Zielpersonen hilft.",
        description_en: "Maintains a network of informants that aids in locating targets.",
      },
    ],
  },
  acrobat: {
    id: "acrobat",
    name: "Akrobat",
    name_en: "Acrobat",
    classId: "thief",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Akrobatik",
        name_en: "Tumbling",
        description: "Akrobatische Fähigkeiten reduzieren Fallschaden um 1W6 Punkte.",
        description_en: "Acrobatic skills reduce falling damage by 1d6 points.",
      },
      {
        name: "Seiltanz",
        name_en: "Tightrope Walking",
        description: "Kann sicher über Seile, Simse und schmale Oberflächen balancieren.",
        description_en: "Can safely balance across ropes, ledges, and narrow surfaces.",
      },
      {
        name: "Ausweichbonus",
        name_en: "Evasion Bonus",
        description:
          "Erhält einen Bonus auf Rettungswürfe gegen Flächenangriffe durch geschicktes Ausweichen.",
        description_en: "Gains a saving throw bonus against area attacks through skillful evasion.",
      },
    ],
  },
  scout: {
    id: "scout",
    name: "Kundschafter",
    name_en: "Scout",
    classId: "thief",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Wildnistarnung",
        name_en: "Wilderness Stealth",
        description: "Kann sich in natürlicher Umgebung nahezu unsichtbar machen.",
        description_en: "Can become nearly invisible in natural environments.",
      },
      {
        name: "Überraschungsbonus",
        name_en: "Surprise Bonus",
        description: "Gegner erleiden -1 auf ihre Überraschungswürfe gegen den Kundschafter.",
        description_en: "Enemies suffer -1 on their surprise rolls against the scout.",
      },
      {
        name: "Wegzeichen",
        name_en: "Trail Signs",
        description:
          "Kann geheime Wegzeichen hinterlassen und lesen, um Verbündeten den Weg zu weisen.",
        description_en: "Can leave and read secret trail signs to guide allies.",
      },
    ],
  },
  burglar: {
    id: "burglar",
    name: "Einbrecher",
    name_en: "Burglar",
    classId: "thief",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Schloss-/Fallenbonus",
        name_en: "Lock/Trap Bonus",
        description: "Erhält +10% auf Schlösser öffnen und Fallen finden/entschärfen.",
        description_en: "Gains +10% bonus to Open Locks and Find/Remove Traps.",
      },
      {
        name: "Wertschätzung",
        name_en: "Appraise Value",
        description: "Kann den Wert von Schätzen und Gegenständen zuverlässig einschätzen.",
        description_en: "Can reliably appraise the value of treasures and items.",
      },
      {
        name: "Fluchtwege",
        name_en: "Escape Routes",
        description:
          "Plant stets Fluchtwege und kann sich schnell aus gefährlichen Situationen zurückziehen.",
        description_en:
          "Always plans escape routes and can quickly withdraw from dangerous situations.",
      },
    ],
  },
  spy: {
    id: "spy",
    name: "Spion",
    name_en: "Spy",
    classId: "thief",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Verkleidungsfertigkeit",
        name_en: "Disguise Proficiency",
        description:
          "Beherrscht die Kunst der Verkleidung und kann verschiedene Identitäten annehmen.",
        description_en: "Masters the art of disguise and can assume various identities.",
      },
      {
        name: "Lippenlesen",
        name_en: "Read Lips",
        description: "Kann Gespräche durch Lippenlesen auf Entfernung verfolgen.",
        description_en: "Can follow conversations at a distance by reading lips.",
      },
      {
        name: "Informationsbeschaffung",
        name_en: "Information Gathering",
        description:
          "Besonders geschickt darin, Informationen und Gerüchte in besiedelten Gebieten zu sammeln.",
        description_en: "Especially adept at gathering information and rumors in settled areas.",
      },
    ],
  },

  // ── Wizard Kits ───────────────────────────────────────────────────────
  witch: {
    id: "witch",
    name: "Hexe",
    name_en: "Witch",
    classId: "mage",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Tränke brauen",
        name_en: "Brew Potions",
        description: "Kann magische Tränke und Salben aus natürlichen Zutaten herstellen.",
        description_en: "Can brew magical potions and salves from natural ingredients.",
      },
      {
        name: "Verbesserter Vertrauter",
        name_en: "Familiar Enhancement",
        description:
          "Der Vertraute der Hexe erhält zusätzliche Fähigkeiten und ist widerstandsfähiger.",
        description_en: "The witch's familiar gains additional abilities and is more resilient.",
      },
      {
        name: "Verfluchung",
        name_en: "Curse Ability",
        description:
          "Kann mächtige Flüche aussprechen, die Feinde auf verschiedene Weise schwächen.",
        description_en: "Can bestow powerful curses that weaken enemies in various ways.",
      },
    ],
  },
  militant_wizard: {
    id: "militant_wizard",
    name: "Kampfmagier",
    name_en: "Militant Wizard",
    classId: "mage",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Zusätzliche Waffenfertigkeit",
        name_en: "Weapon Proficiency",
        description:
          "Erhält einen zusätzlichen Waffenfertigkeits-Slot bei der Charaktererstellung.",
        description_en: "Gains one additional weapon proficiency slot at character creation.",
      },
      {
        name: "Leichte Rüstung",
        name_en: "Light Armor Use",
        description:
          "Kann leichte Rüstung tragen und dabei weiterhin Zauber wirken, allerdings mit erhöhter Fehlschlagchance.",
        description_en:
          "Can wear light armor while still casting spells, albeit with an increased failure chance.",
      },
      {
        name: "Kampfzauberei",
        name_en: "Combat Casting",
        description: "Kann Zauber unter Beschuss wirken, ohne den Konzentrationswurf zu verlieren.",
        description_en: "Can cast spells under fire without losing the concentration check.",
      },
    ],
  },
  savage_wizard: {
    id: "savage_wizard",
    name: "Wildnismagier",
    name_en: "Savage Wizard",
    classId: "mage",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Naturfokus",
        name_en: "Nature Focus",
        description: "Spezialisiert auf naturbasierte Magie mit Boni auf entsprechende Zauber.",
        description_en: "Specializes in nature-based magic with bonuses to related spells.",
      },
      {
        name: "Eingeschränkte Zauberschulen",
        name_en: "Limited Spell Schools",
        description:
          "Hat nur Zugang zu bestimmten Zauberschulen, die mit der Natur verbunden sind.",
        description_en: "Has access only to certain spell schools connected to nature.",
      },
      {
        name: "Kräuterkunde",
        name_en: "Herbal Knowledge",
        description:
          "Besitzt umfangreiches Wissen über Kräuter und deren magische sowie heilende Eigenschaften.",
        description_en:
          "Possesses extensive knowledge of herbs and their magical and healing properties.",
      },
    ],
  },
  academician: {
    id: "academician",
    name: "Gelehrter",
    name_en: "Academician",
    classId: "mage",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Forschungsbonus",
        name_en: "Research Bonus",
        description: "Erhält +15% auf die Chance, neue Zauber zu erlernen.",
        description_en: "Gains +15% bonus to Learn Spell chance.",
      },
      {
        name: "Gelehrtenwissen",
        name_en: "Sage Knowledge",
        description: "Verfügt über breites Wissen in einem gewählten Fachgebiet wie ein Weiser.",
        description_en: "Possesses broad knowledge in a chosen field of study, similar to a sage.",
      },
      {
        name: "Bibliothekszugang",
        name_en: "Library Access",
        description:
          "Hat Zugang zu akademischen Bibliotheken, die das Erlernen und Erforschen von Zaubern erleichtern.",
        description_en:
          "Has access to academic libraries that facilitate learning and researching spells.",
      },
    ],
  },

  // ── Priest Kits ───────────────────────────────────────────────────────
  fighting_priest: {
    id: "fighting_priest",
    name: "Kriegspriester",
    name_en: "Fighting Priest",
    classId: "cleric",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Zusätzliche Waffenfertigkeit",
        name_en: "Extra Weapon Proficiency",
        description:
          "Erhält einen zusätzlichen Waffenfertigkeits-Slot und darf Klingenwaffen führen.",
        description_en: "Gains an extra weapon proficiency slot and may wield bladed weapons.",
      },
      {
        name: "Kampfsegen",
        name_en: "Combat Blessing",
        description: "Kann Verbündete vor dem Kampf segnen und ihnen kurzzeitige Boni verleihen.",
        description_en: "Can bless allies before combat, granting them short-term bonuses.",
      },
      {
        name: "Taktische Führung",
        name_en: "Tactical Leadership",
        description: "Kann Verbündete im Kampf koordinieren und taktische Anweisungen erteilen.",
        description_en: "Can coordinate allies in combat and issue tactical commands.",
      },
    ],
  },
  pacifist_priest: {
    id: "pacifist_priest",
    name: "Friedenspriester",
    name_en: "Pacifist Priest",
    classId: "cleric",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Verbesserte Heilung",
        name_en: "Enhanced Healing",
        description: "Heilzauber heilen +1 Trefferpunkt pro Würfel zusätzlich.",
        description_en: "Healing spells restore +1 hit point per die rolled.",
      },
      {
        name: "Schutzaura",
        name_en: "Sanctuary Aura",
        description:
          "Strahlt eine Aura des Friedens aus, die Gegner von Angriffen abhält, solange der Priester nicht angreift.",
        description_en:
          "Radiates an aura of peace that deters enemies from attacking as long as the priest does not attack.",
      },
      {
        name: "Keine Klingenwaffen",
        name_en: "No Edged Weapons",
        description:
          "Darf keine Klingenwaffen verwenden, erhält dafür aber verstärkte göttliche Heilkräfte.",
        description_en:
          "May not use edged weapons but receives enhanced divine healing powers in return.",
      },
    ],
  },

  // ── Ranger Kit ────────────────────────────────────────────────────────
  beastmaster: {
    id: "beastmaster",
    name: "Tiermeister",
    name_en: "Beastmaster",
    classId: "ranger",
    hitDieOverride: null,
    maxArmorAC: 8, // leather or lighter
    abilities: [
      {
        name: "Tiergefährte",
        name_en: "Animal Companion",
        description:
          "Erhält einen loyalen Tiergefährten, der im Kampf und bei der Erkundung hilft.",
        description_en: "Gains a loyal animal companion that aids in combat and exploration.",
      },
      {
        name: "Mit Tieren sprechen",
        name_en: "Speak with Animals",
        description:
          "Kann einmal pro Tag mit Tieren sprechen, als wäre der gleichnamige Zauber gewirkt worden.",
        description_en:
          "Can speak with animals once per day as if the spell of the same name were cast.",
      },
      {
        name: "Tierempathie-Bonus",
        name_en: "Animal Empathy Bonus",
        description:
          "Erhält einen Bonus auf Tierempathie-Würfe, um wilde Tiere zu beruhigen oder zu beeinflussen.",
        description_en: "Gains a bonus to animal empathy checks to calm or influence wild animals.",
      },
    ],
  },

  // ── Bard Kit ──────────────────────────────────────────────────────────
  blade: {
    id: "blade",
    name: "Klingentänzer",
    name_en: "Blade",
    classId: "bard",
    hitDieOverride: null,
    maxArmorAC: null,
    abilities: [
      {
        name: "Waffenperformance",
        name_en: "Weapon Performance",
        description:
          "Erhält +1 auf Angriffswürfe mit einer gewählten Waffe durch kunstvolles Kampftraining.",
        description_en:
          "Gains +1 to attack rolls with a chosen weapon through artistic combat training.",
      },
      {
        name: "Kampftanz",
        name_en: "Combat Dance",
        description:
          "Kann einen hypnotisierenden Kampftanz aufführen, der Gegner ablenkt und Verbündete inspiriert.",
        description_en:
          "Can perform a mesmerizing combat dance that distracts enemies and inspires allies.",
      },
      {
        name: "Klingenlied",
        name_en: "Blade Song",
        description:
          "Ein magisches Lied, das die Klinge mit Energie erfüllt und zusätzlichen Schaden verursacht.",
        description_en:
          "A magical song that infuses the blade with energy, dealing additional damage.",
      },
    ],
  },
};

/**
 * Get all kits available for a given class.
 */
export function getKitsForClass(classId: ClassId): KitDefinition[] {
  return Object.values(KITS).filter((kit) => kit.classId === classId);
}

/**
 * Get the effective hit die for a class, considering kit overrides.
 */
export function getEffectiveHitDie(baseHitDie: number, kit: string | null): number {
  if (!kit) return baseHitDie;
  const kitDef = KITS[kit];
  if (!kitDef || kitDef.hitDieOverride == null) return baseHitDie;
  return kitDef.hitDieOverride;
}

/**
 * Get kit definition by ID, or null if not found.
 */
export function getKit(kitId: string | null): KitDefinition | null {
  if (!kitId) return null;
  return KITS[kitId] ?? null;
}
