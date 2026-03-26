import type { ClassId, MagicSchool, PriestSphere, SphereAccess } from "./types";

// ─── WIZARD SPECIALIST SCHOOLS ─────────────────────────────────────────────────
// PHB Table 22: Specialist Wizards

export interface SpecialistDefinition {
  classId: ClassId;
  school: MagicSchool;
  oppositionSchools: MagicSchool[];
}

export const SPECIALISTS: SpecialistDefinition[] = [
  { classId: "abjurer", school: "abjuration", oppositionSchools: ["alteration", "illusion"] },
  {
    classId: "conjurer",
    school: "conjuration",
    oppositionSchools: ["divination", "invocation"],
  },
  { classId: "diviner", school: "divination", oppositionSchools: ["conjuration"] },
  {
    classId: "enchanter",
    school: "enchantment",
    oppositionSchools: ["invocation", "necromancy"],
  },
  {
    classId: "illusionist",
    school: "illusion",
    oppositionSchools: ["necromancy", "invocation", "abjuration"],
  },
  {
    classId: "invoker",
    school: "invocation",
    oppositionSchools: ["enchantment", "conjuration"],
  },
  {
    classId: "necromancer",
    school: "necromancy",
    oppositionSchools: ["illusion", "enchantment"],
  },
  {
    classId: "transmuter",
    school: "alteration",
    oppositionSchools: ["abjuration", "necromancy"],
  },
];

export function getSpecialist(classId: ClassId): SpecialistDefinition | null {
  return SPECIALISTS.find((s) => s.classId === classId) ?? null;
}

export function getOppositionSchools(classId: ClassId): MagicSchool[] {
  const spec = getSpecialist(classId);
  return spec ? spec.oppositionSchools : [];
}

// ─── PRIEST SPHERE ACCESS ──────────────────────────────────────────────────────
// PHB: Cleric and Druid sphere access

export type SphereMap = Partial<Record<PriestSphere, SphereAccess>>;

export const CLERIC_SPHERES: SphereMap = {
  all: "major",
  astral: "major",
  charm: "major",
  combat: "major",
  creation: "major",
  divination: "major",
  guardian: "major",
  healing: "major",
  necromantic: "major",
  protection: "major",
  summoning: "major",
  sun: "major",
  elemental: "minor",
  weather: "minor",
};

export const DRUID_SPHERES: SphereMap = {
  all: "major",
  animal: "major",
  elemental: "major",
  healing: "major",
  plant: "major",
  weather: "major",
  divination: "minor",
};

export function getPriestSpheres(classId: ClassId): SphereMap {
  switch (classId) {
    case "cleric":
      return { ...CLERIC_SPHERES };
    case "druid":
      return { ...DRUID_SPHERES };
    default:
      return {};
  }
}

export function hasSphereAccess(
  classId: ClassId,
  sphere: PriestSphere,
  accessLevel: SphereAccess
): boolean {
  const spheres = getPriestSpheres(classId);
  const access = spheres[sphere];
  if (!access) return false;
  if (accessLevel === "minor") return true; // major includes minor access
  return access === "major";
}

// ─── SPELL DATA STRUCTURE ──────────────────────────────────────────────────────

export interface SpellDefinition {
  name: string;
  level: number;
  type: "wizard" | "priest";
  school?: MagicSchool; // for wizard spells
  sphere?: PriestSphere; // for priest spells
  range: string;
  duration: string;
  areaOfEffect: string;
  components: ("V" | "S" | "M")[];
  description: string;
}
