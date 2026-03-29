"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  getAdjustedWeaponThac0,
  formatDamageWithBonus,
  getAttacksPerRound,
} from "@/lib/rules/combat";
import { getClassGroup } from "@/lib/rules/classes";
import type { ClassId } from "@/lib/rules/types";
import { getNonproficiencyPenalty } from "@/lib/rules/proficiencies";
import { getEncumbranceLabel } from "@/lib/rules/equipment";
import type { EncumbranceLevel } from "@/lib/rules/equipment";
import type { ClassGroup, StrengthModifiers, DexterityModifiers } from "@/lib/rules/types";
import type {
  CharacterEquipmentWithDetails,
  CharacterWeaponProficiencyRow,
} from "@/lib/supabase/types";
import { localized } from "@/lib/utils/localize";
import { lbsToKg } from "@/lib/utils/units";

interface PlayCombatPanelProps {
  equipment: CharacterEquipmentWithDetails[];
  weaponProficiencies: CharacterWeaponProficiencyRow[];
  thac0: number;
  strMods: StrengthModifiers;
  dexMods: DexterityModifiers;
  classGroups: ClassGroup[];
  classEntries: { classId: string; level: number }[];
  equippedArmor: CharacterEquipmentWithDetails | null;
  equippedShield: boolean;
  dexDefenseAdj: number;
  ac: number;
  encumbrance: EncumbranceLevel;
  movementRate: number;
  backstabMultiplier: number | null;
  ignoreEncumbrance: boolean;
}

export function PlayCombatPanel({
  equipment,
  weaponProficiencies,
  thac0,
  strMods,
  dexMods,
  classGroups,
  classEntries,
  equippedArmor,
  equippedShield,
  dexDefenseAdj,
  ac,
  encumbrance,
  movementRate,
  backstabMultiplier,
  ignoreEncumbrance,
}: PlayCombatPanelProps) {
  const t = useTranslations("playMode");
  const locale = useLocale();

  const equippedWeapons = useMemo(
    () => equipment.filter((e) => e.equipped && e.weapon),
    [equipment]
  );

  const profMap = useMemo(() => {
    const map = new Map<string, { proficient: boolean; specialized: boolean }>();
    for (const wp of weaponProficiencies) {
      map.set(wp.weapon_name.toLowerCase(), {
        proficient: true,
        specialized: wp.specialization,
      });
    }
    return map;
  }, [weaponProficiencies]);

  // AC Breakdown
  const acBreakdown = useMemo(() => {
    const parts: { label: string; value: number }[] = [];
    if (equippedArmor?.armor) {
      parts.push({
        label: localized(equippedArmor.armor.name, equippedArmor.armor.name_en, locale),
        value: equippedArmor.armor.ac,
      });
    } else {
      parts.push({ label: t("baseAC"), value: 10 });
    }
    if (equippedShield) {
      parts.push({ label: t("shield"), value: -1 });
    }
    if (dexDefenseAdj !== 0) {
      parts.push({ label: t("dexBonus"), value: dexDefenseAdj });
    }
    // Check for unarmored bonus
    if (!equippedArmor?.armor) {
      const hasWarriorOrRogue = classGroups.some((g) => g === "warrior" || g === "rogue");
      const isUnencumbered = ignoreEncumbrance || encumbrance === "unencumbered";
      if (hasWarriorOrRogue && isUnencumbered) {
        parts.push({ label: t("unarmoredBonus"), value: -2 });
      }
    }
    return parts;
  }, [
    equippedArmor,
    equippedShield,
    dexDefenseAdj,
    classGroups,
    encumbrance,
    ignoreEncumbrance,
    t,
    locale,
  ]);

  return (
    <GlassCard hover={false} data-testid="play-combat-panel">
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("combat")}
      </h3>

      {/* AC Breakdown */}
      <div
        className="mb-3 rounded-lg bg-black/10 p-2 dark:bg-white/5"
        data-testid="play-ac-breakdown"
      >
        <div className="mb-1 text-xs text-muted-foreground">{t("acBreakdown")}</div>
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <span className="font-heading text-lg font-bold">AC {ac}</span>
          <span className="text-muted-foreground">=</span>
          {acBreakdown.map((part, i) => (
            <span key={i} className="flex items-center gap-0.5">
              {i > 0 && <span className="text-muted-foreground">{part.value < 0 ? "−" : "+"}</span>}
              {i === 0 ? (
                <span>
                  {part.label} ({part.value})
                </span>
              ) : (
                <span>
                  {part.label} ({Math.abs(part.value)})
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Movement + Encumbrance + Backstab */}
      <div className="mb-3 flex flex-wrap gap-3 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">{t("movementRate")}: </span>
          <span className="font-mono font-medium">{movementRate}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">{t("encumbrance")}: </span>
          <Badge variant="outline" className="text-xs">
            {getEncumbranceLabel(encumbrance)}
          </Badge>
        </div>
        {backstabMultiplier && (
          <div data-testid="play-backstab">
            <span className="text-xs text-muted-foreground">{t("backstabMultiplier")}: </span>
            <span className="font-mono font-bold text-primary">x{backstabMultiplier}</span>
          </div>
        )}
      </div>

      {/* Weapon cards */}
      {equippedWeapons.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noWeapons")}</p>
      ) : (
        <div className="space-y-2">
          {equippedWeapons.map((eq) => {
            const weapon = eq.weapon!;
            const weaponName = localized(weapon.name, weapon.name_en, locale);
            const prof = profMap.get(weapon.name.toLowerCase());
            const isProficient = prof?.proficient ?? false;
            const isSpecialized = prof?.specialized ?? false;

            // Calculate proficiency penalty
            const firstGroup = classGroups[0] ?? "warrior";
            const profPenalty = isProficient ? 0 : getNonproficiencyPenalty(firstGroup);

            const adjusted = getAdjustedWeaponThac0(
              thac0,
              strMods.hitAdj,
              dexMods.missileAdj,
              weapon.weapon_type,
              profPenalty,
              eq.hit_bonus
            );

            const damageSM = formatDamageWithBonus(
              weapon.damage_sm,
              strMods.dmgAdj,
              eq.damage_bonus
            );
            const damageL = formatDamageWithBonus(weapon.damage_l, strMods.dmgAdj, eq.damage_bonus);

            // Attacks per round from first warrior class
            const warriorEntry = classEntries.find(
              (ce) => getClassGroup(ce.classId as ClassId) === "warrior"
            );
            const apr = warriorEntry
              ? getAttacksPerRound("warrior", warriorEntry.level, isSpecialized)
              : "1";

            return (
              <div
                key={eq.id}
                className="rounded-lg border border-border bg-card/50 p-3"
                data-testid={`play-weapon-${eq.id}`}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-medium">{weaponName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {weapon.weapon_type === "melee"
                      ? t("melee")
                      : weapon.weapon_type === "ranged"
                        ? t("ranged")
                        : `${t("melee")}/${t("ranged")}`}
                  </Badge>
                  {isSpecialized && (
                    <Badge className="bg-primary/20 text-primary text-[10px]">★</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
                  <div>
                    <span className="text-xs text-muted-foreground">THAC0: </span>
                    <span className="font-mono font-bold">{adjusted.melee}</span>
                    {adjusted.ranged !== null && (
                      <span className="text-muted-foreground"> / {adjusted.ranged}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{t("damage")}: </span>
                    <span className="font-mono">{damageSM}</span>
                    <span className="text-muted-foreground"> / {damageL}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{t("weaponSpeed")}: </span>
                    <span className="font-mono">{weapon.speed}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">{t("attacksPerRound")}: </span>
                    <span className="font-mono">{apr}</span>
                  </div>
                </div>
                {eq.hit_bonus > 0 && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    +{eq.hit_bonus} {t("magicBonus")}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
