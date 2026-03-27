import type { ClassId, ClassGroup, AbilityName, ClassAbility } from "./types";

export interface ClassDefinition {
  id: ClassId;
  name: string;
  group: ClassGroup;
  hitDie: number; // e.g. 10 for d10
  abilityRequirements: Partial<Record<AbilityName, number>>;
  primeRequisites: AbilityName[];
  exceptionalStrength: boolean; // only warrior group
  classAbilities: ClassAbility[];
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
      {
        name: "Waffenspezialisierung möglich",
        description:
          "Kämpfer können sich auf eine Waffe spezialisieren und erhalten +1 auf Treffer und +2 auf Schaden. Dies kostet einen zusätzlichen Waffenfertigkeits-Slot.",
      },
      {
        name: "Mehrfachangriffe ab Stufe 7",
        description:
          "Ab Stufe 7 erhält der Kämpfer 3/2 Angriffe pro Runde, ab Stufe 13 zwei Angriffe pro Runde mit Nahkampfwaffen.",
      },
      {
        name: "Ausnahmestärke bei STR 18",
        description:
          "Kämpfer mit Stärke 18 würfeln prozentuale Ausnahmestärke (18/01-18/00), die zusätzliche Boni auf Treffer, Schaden und Tragkraft gewährt.",
      },
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
      {
        name: "Spezialisierter Feind (+4 Treffer/Schaden)",
        description:
          "Der Waldläufer wählt bei der Erstellung eine Kreaturenart als Erzfeind. Gegen diese erhält er +4 auf Treffer und Schaden.",
      },
      {
        name: "Fährtensuche",
        description:
          "Waldläufer können Spuren in der Wildnis verfolgen. Die Erfolgschance steigt mit der Stufe und wird durch Gelände und Wetter modifiziert.",
      },
      {
        name: "Zwei-Waffen-Kampf ohne Malus",
        description:
          "Waldläufer können mit zwei Waffen gleichzeitig kämpfen, ohne den üblichen Malus auf Trefferwürfe zu erleiden, solange sie keine schwere Rüstung tragen.",
      },
      {
        name: "Begrenzte Druidenzauber ab Stufe 8",
        description:
          "Ab Stufe 8 erhält der Waldläufer Zugang zu einer begrenzten Anzahl von Priester-Zaubern aus den Sphären Pflanze, Tier und Elementar.",
      },
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
      {
        name: "Böses erkennen (60 Fuß)",
        description:
          "Der Paladin kann durch Konzentration die Anwesenheit und Richtung von Bösem im Umkreis von 60 Fuß erspüren. Diese Fähigkeit funktioniert ähnlich wie der Zauber 'Böses erkennen'.",
      },
      {
        name: "Handauflegen (2 HP/Stufe pro Tag)",
        description:
          "Einmal pro Tag kann der Paladin durch Handauflegen 2 Trefferpunkte pro Stufe heilen. Die gesamte Heilung muss an einer Person auf einmal erfolgen.",
      },
      {
        name: "Immun gegen Krankheiten",
        description:
          "Paladine sind vollständig immun gegen alle Formen von Krankheit, einschließlich magisch verursachter Seuchen. Sie können jedoch Krankheiten trotzdem als Überträger weitergeben.",
      },
      {
        name: "Untote vertreiben ab Stufe 3",
        description:
          "Ab Stufe 3 kann der Paladin Untote vertreiben wie ein Kleriker zwei Stufen niedriger. Diese Fähigkeit wirkt über die heilige Ausstrahlung des Paladins.",
      },
      {
        name: "Begrenzte Klerikerzauber ab Stufe 9",
        description:
          "Ab Stufe 9 erhält der Paladin Zugang zu einer begrenzten Anzahl von Priester-Zaubern aus der Kampf-, Erkenntnis-, Heil- und Schutzsphäre.",
      },
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
    classAbilities: [
      {
        name: "Zauber aus allen 8 Schulen",
        description:
          "Als Generalist kann der Magier Zauber aus allen acht Magieschulen erlernen und wirken. Er erhält jedoch keinen Bonus-Zauberplatz wie Spezialisten.",
      },
      {
        name: "Zauber ins Zauberbuch schreiben",
        description:
          "Magier notieren ihre Zauber in einem Zauberbuch und müssen neue Zauber aktiv erforschen oder von Schriftrollen kopieren. Die Chance auf Erfolg hängt von der Intelligenz ab.",
      },
    ],
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
      {
        name: "+1 Zauberplatz pro Stufe (Bannzauber)",
        description:
          "Der Bannzauberer erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Bannzauber verwendet werden muss. Sein Rettungswurf-Bonus gegen Bannzauber beträgt +1.",
      },
      {
        name: "Verbotene Schulen: Verwandlung, Illusion",
        description:
          "Bannzauberer können keine Zauber aus den Schulen der Verwandlung und Illusion erlernen oder wirken. Dies ist der Preis für ihre Spezialisierung.",
      },
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
      {
        name: "+1 Zauberplatz pro Stufe (Beschwörung)",
        description:
          "Der Beschwörer erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Beschwörungszauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schulen: Erkenntnis, Anrufung",
        description:
          "Beschwörer können keine Zauber aus den Schulen der Erkenntnis und Anrufung erlernen oder wirken. Dies ist der Preis für ihre Spezialisierung.",
      },
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
    classAbilities: [
      {
        name: "+1 Zauberplatz pro Stufe (Erkenntnis)",
        description:
          "Der Seher erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Erkenntniszauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schule: Beschwörung",
        description:
          "Seher können keine Zauber aus der Schule der Beschwörung erlernen oder wirken. Der Seher hat nur eine verbotene Schule statt zwei.",
      },
    ],
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
      {
        name: "+1 Zauberplatz pro Stufe (Verzauberung)",
        description:
          "Der Verzauberer erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Verzauberungszauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schulen: Anrufung, Nekromantie",
        description:
          "Verzauberer können keine Zauber aus den Schulen der Anrufung und Nekromantie erlernen oder wirken. Dies ist der Preis für ihre Spezialisierung.",
      },
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
      {
        name: "+1 Zauberplatz pro Stufe (Illusion)",
        description:
          "Der Illusionist erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Illusionszauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schulen: Nekromantie, Anrufung, Bannzauber",
        description:
          "Illusionisten können keine Zauber aus den Schulen der Nekromantie, Anrufung und Bannzauber erlernen oder wirken. Der Illusionist hat drei verbotene Schulen.",
      },
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
      {
        name: "+1 Zauberplatz pro Stufe (Anrufung)",
        description:
          "Der Anrufer erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Anrufungszauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schulen: Verzauberung, Beschwörung",
        description:
          "Anrufer können keine Zauber aus den Schulen der Verzauberung und Beschwörung erlernen oder wirken. Dies ist der Preis für ihre Spezialisierung.",
      },
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
      {
        name: "+1 Zauberplatz pro Stufe (Nekromantie)",
        description:
          "Der Nekromant erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Nekromantie-Zauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schulen: Illusion, Verzauberung",
        description:
          "Nekromanten können keine Zauber aus den Schulen der Illusion und Verzauberung erlernen oder wirken. Dies ist der Preis für ihre Spezialisierung.",
      },
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
      {
        name: "+1 Zauberplatz pro Stufe (Verwandlung)",
        description:
          "Der Verwandler erhält einen zusätzlichen Zauberplatz pro Zauberstufe, der ausschließlich für Verwandlungszauber verwendet werden muss.",
      },
      {
        name: "Verbotene Schulen: Bannzauber, Nekromantie",
        description:
          "Verwandler können keine Zauber aus den Schulen der Bannzauber und Nekromantie erlernen oder wirken. Dies ist der Preis für ihre Spezialisierung.",
      },
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
      {
        name: "Untote vertreiben",
        description:
          "Kleriker können Untote durch die Macht ihres Glaubens vertreiben oder vernichten. Die Erfolgschance und die betroffenen Untoten-Typen hängen von der Stufe des Klerikers ab.",
      },
      {
        name: "Alle Rüstungen und Schilde erlaubt",
        description:
          "Kleriker dürfen jede Art von Rüstung und Schild tragen. Sie sind jedoch auf stumpfe Waffen beschränkt (Streitkolben, Flegel, etc.).",
      },
      {
        name: "Zauber durch Gebet (keine Zauberbücher)",
        description:
          "Kleriker erhalten ihre Zauber durch Gebet und göttliche Gunst. Sie benötigen kein Zauberbuch und haben Zugang zu allen Zaubern ihrer Stufe aus den erlaubten Sphären.",
      },
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
      {
        name: "Gestaltwandel ab Stufe 7",
        description:
          "Ab Stufe 7 kann der Druide sich dreimal täglich in ein natürliches Tier verwandeln (Reptil, Vogel, Säugetier). Dabei heilt er 10-60% seines Schadens.",
      },
      {
        name: "Immunität gegen Feenverzauberung",
        description:
          "Ab Stufe 7 ist der Druide vollständig immun gegen Verzauberungszauber von Waldwesen wie Dryaden, Nixen und Sylphen.",
      },
      {
        name: "Druidensprache",
        description:
          "Alle Druiden lernen eine geheime Sprache, die nur unter Druiden weitergegeben wird. Es ist verboten, diese Sprache Nicht-Druiden beizubringen.",
      },
      {
        name: "Waldläufer-Fähigkeiten in der Wildnis",
        description:
          "Druiden können sich ungehindert durch natürliches Dickicht bewegen und hinterlassen keine Spuren. Sie können Tierarten, Pflanzen und reines Wasser sicher identifizieren.",
      },
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
      {
        name: "Schlösser öffnen",
        description:
          "Diebe können mechanische Schlösser mit Dietrichen knacken. Die Erfolgschance steigt mit der Stufe und wird durch DEX-Boni und Rassenboni modifiziert.",
      },
      {
        name: "Fallen finden/entschärfen",
        description:
          "Diebe können kleine mechanische Fallen (Giftnadeln, Klingen) an Schlössern und Truhen aufspüren und entschärfen. Magische Fallen sind ausgenommen.",
      },
      {
        name: "Taschen leeren",
        description:
          "Der Dieb kann versuchen, einem Ziel unbemerkt kleine Gegenstände aus Taschen oder Gürteln zu entwenden. Ein Fehlschlag bedeutet, dass der Diebstahl bemerkt wird.",
      },
      {
        name: "Lautlos bewegen",
        description:
          "Der Dieb kann sich geräuschlos fortbewegen und so Wachen umgehen oder sich unbemerkt nähern. Die Erfolgschance wird durch Rüstung und Untergrund beeinflusst.",
      },
      {
        name: "Im Schatten verbergen",
        description:
          "In Bereichen mit Schatten oder Dunkelheit kann sich der Dieb nahezu unsichtbar verbergen. Bewegung oder direkte Beobachtung beendet die Verbergung.",
      },
      {
        name: "Mauern erklimmen",
        description:
          "Diebe können glatte vertikale Oberflächen und Mauern erklettern, die für andere Klassen unüberwindbar wären. Keine Ausrüstung notwendig.",
      },
      {
        name: "Hinterhältiger Angriff (Backstab)",
        description:
          "Wenn der Dieb ein Ziel von hinten angreift und unentdeckt ist, vervielfacht sich der Schaden: x2 auf Stufe 1-4, x3 auf Stufe 5-8, x4 auf Stufe 9-12, x5 ab Stufe 13.",
      },
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
      {
        name: "Bardenwissen",
        description:
          "Der Barde hat eine prozentuale Chance, Informationen über magische Gegenstände, legendäre Orte und berühmte Persönlichkeiten zu kennen. Die Chance steigt mit der Stufe.",
      },
      {
        name: "Bezaubernde Musik",
        description:
          "Durch Musik und Gesang kann der Barde Zuhörer verzaubern, die Moral von Verbündeten stärken oder Gegner ablenken. Die Effekte variieren je nach Situation.",
      },
      {
        name: "Begrenzte Diebes-Fähigkeiten",
        description:
          "Barden beherrschen einige Diebes-Fähigkeiten auf reduziertem Niveau: Schlösser öffnen, Taschen leeren, Lautlos bewegen, Im Schatten verbergen, Mauern erklimmen und Geräusche hören.",
      },
      {
        name: "Begrenzte Magierfähigkeiten ab Stufe 2",
        description:
          "Ab Stufe 2 kann der Barde Magierzauber aus einem Zauberbuch wirken. Die verfügbaren Zauberstufen und -plätze sind jedoch deutlich geringer als bei einem echten Magier.",
      },
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
