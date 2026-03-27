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
};

/**
 * Get the effective hit die for a class, considering kit overrides.
 */
export function getEffectiveHitDie(baseHitDie: number, kit: string | null): number {
  if (!kit) return baseHitDie;
  const kitDef = KITS[kit];
  if (!kitDef || !kitDef.hitDieOverride) return baseHitDie;
  return kitDef.hitDieOverride;
}

/**
 * Get kit definition by ID, or null if not found.
 */
export function getKit(kitId: string | null): KitDefinition | null {
  if (!kitId) return null;
  return KITS[kitId] ?? null;
}
