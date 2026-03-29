"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import type {
  SavingThrows,
  StrengthModifiers,
  DexterityModifiers,
  ConstitutionModifiers,
  IntelligenceModifiers,
  WisdomModifiers,
  CharismaModifiers,
} from "@/lib/rules/types";
import type { CharacterRow, CharacterNWPWithDetails } from "@/lib/supabase/types";
import { localized } from "@/lib/utils/localize";

interface PlayChecksPanelProps {
  saves: SavingThrows;
  character: CharacterRow;
  strMods: StrengthModifiers;
  dexMods: DexterityModifiers;
  conMods: ConstitutionModifiers;
  intMods: IntelligenceModifiers;
  wisMods: WisdomModifiers;
  chaMods: CharismaModifiers;
  showThiefSkills: boolean;
  nonweaponProficiencies: CharacterNWPWithDetails[];
}

export function PlayChecksPanel({
  saves,
  character,
  strMods,
  dexMods,
  conMods,
  intMods,
  wisMods,
  chaMods,
  showThiefSkills,
  nonweaponProficiencies,
}: PlayChecksPanelProps) {
  const t = useTranslations("playMode");
  const ts = useTranslations("sheet");
  const locale = useLocale();

  // Ability scores with names (using existing sheet i18n keys)
  const abilities = useMemo(
    () => [
      {
        name: "STR",
        score: character.str,
        subScores: [
          character.str_muscle != null ? { name: ts("muscle"), score: character.str_muscle } : null,
          character.str_stamina != null
            ? { name: ts("stamina"), score: character.str_stamina }
            : null,
        ].filter(Boolean),
      },
      {
        name: "DEX",
        score: character.dex,
        subScores: [
          character.dex_aim != null ? { name: ts("aim"), score: character.dex_aim } : null,
          character.dex_balance != null
            ? { name: ts("balance"), score: character.dex_balance }
            : null,
        ].filter(Boolean),
      },
      {
        name: "CON",
        score: character.con,
        subScores: [
          character.con_health != null ? { name: ts("health"), score: character.con_health } : null,
          character.con_fitness != null
            ? { name: ts("fitness"), score: character.con_fitness }
            : null,
        ].filter(Boolean),
      },
      {
        name: "INT",
        score: character.int,
        subScores: [
          character.int_knowledge != null
            ? { name: ts("knowledge"), score: character.int_knowledge }
            : null,
          character.int_reason != null ? { name: ts("reason"), score: character.int_reason } : null,
        ].filter(Boolean),
      },
      {
        name: "WIS",
        score: character.wis,
        subScores: [
          character.wis_intuition != null
            ? { name: ts("intuition"), score: character.wis_intuition }
            : null,
          character.wis_willpower != null
            ? { name: ts("willpower"), score: character.wis_willpower }
            : null,
        ].filter(Boolean),
      },
      {
        name: "CHA",
        score: character.cha,
        subScores: [
          character.cha_leadership != null
            ? { name: ts("leadership"), score: character.cha_leadership }
            : null,
          character.cha_appearance != null
            ? { name: ts("appearance"), score: character.cha_appearance }
            : null,
        ].filter(Boolean),
      },
    ],
    [character, ts]
  );

  // Thief skills (using existing sheet i18n keys)
  const thiefSkills = useMemo(() => {
    if (!showThiefSkills) return [];
    return [
      { name: ts("pickLocks"), value: character.thief_pick_locks },
      { name: ts("findTraps"), value: character.thief_find_traps },
      { name: ts("moveSilently"), value: character.thief_move_silently },
      { name: ts("hideInShadows"), value: character.thief_hide_shadows },
      { name: ts("climbWalls"), value: character.thief_climb_walls },
      { name: ts("detectNoise"), value: character.thief_detect_noise },
      { name: ts("readLanguages"), value: character.thief_read_languages },
    ];
  }, [showThiefSkills, character, ts]);

  // NWP checks with target numbers
  const nwpChecks = useMemo(() => {
    const abilityMap: Record<string, number> = {
      str: character.str,
      dex: character.dex,
      con: character.con,
      int: character.int,
      wis: character.wis,
      cha: character.cha,
    };
    return nonweaponProficiencies.map((nwp) => {
      const ability = nwp.proficiency.ability.toLowerCase();
      const baseScore = abilityMap[ability] ?? 10;
      const target = baseScore + nwp.proficiency.modifier;
      return {
        name: localized(nwp.proficiency.name, nwp.proficiency.name_en, locale),
        ability: nwp.proficiency.ability.toUpperCase(),
        baseScore,
        modifier: nwp.proficiency.modifier,
        target,
      };
    });
  }, [nonweaponProficiencies, character, locale]);

  return (
    <GlassCard hover={false} data-testid="play-checks-panel">
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {t("checks")}
      </h3>

      {/* Saving Throws */}
      <div className="mb-4" data-testid="play-saving-throws">
        <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{t("savingThrows")}</h4>
        <div className="grid grid-cols-5 gap-1 text-center">
          {[
            { key: "paralyzation", label: t("paralyzation"), value: saves.paralyzation },
            { key: "rod", label: t("rod"), value: saves.rod },
            { key: "petrification", label: t("petrification"), value: saves.petrification },
            { key: "breath", label: t("breath"), value: saves.breath },
            { key: "spell", label: t("spell"), value: saves.spell },
          ].map((save) => (
            <div
              key={save.key}
              className="rounded-md border border-border px-1 py-1.5"
              data-testid={`play-save-${save.key}`}
            >
              <div className="truncate text-[9px] text-muted-foreground">{save.label}</div>
              <div className="font-mono text-lg font-bold">{save.value}</div>
            </div>
          ))}
        </div>
        {wisMods.magicalDefenseAdj !== 0 && (
          <div className="mt-1 text-[10px] text-muted-foreground">
            {t("wisMagicalDefense")}: {wisMods.magicalDefenseAdj > 0 ? "+" : ""}
            {wisMods.magicalDefenseAdj}
          </div>
        )}
      </div>

      {/* Ability Checks */}
      <div className="mb-4" data-testid="play-ability-checks">
        <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{t("abilityChecks")}</h4>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {abilities.map((ab) => (
            <div key={ab.name} className="rounded-md border border-border px-2 py-1.5 text-center">
              <div className="text-[10px] font-medium text-muted-foreground">{ab.name}</div>
              <div className="font-mono text-lg font-bold">{ab.score}</div>
              {ab.subScores.length > 0 && (
                <div className="flex flex-col gap-0.5">
                  {ab.subScores.map(
                    (sub) =>
                      sub && (
                        <div key={sub.name} className="text-[9px] text-muted-foreground">
                          {sub.name}: {sub.score}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thief Skills */}
      {showThiefSkills && thiefSkills.length > 0 && (
        <div className="mb-4" data-testid="play-thief-skills">
          <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{t("thiefSkills")}</h4>
          <div className="grid grid-cols-2 gap-1">
            {thiefSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between rounded-md border border-border px-2 py-1"
              >
                <span className="text-xs">{skill.name}</span>
                <span className="font-mono text-sm font-bold">{skill.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NWP Checks */}
      {nwpChecks.length > 0 && (
        <div data-testid="play-nwp-checks">
          <h4 className="mb-1.5 text-xs font-medium text-muted-foreground">{t("nwpChecks")}</h4>
          <div className="space-y-1">
            {nwpChecks.map((nwp) => (
              <div
                key={nwp.name}
                className="flex items-center justify-between rounded-md border border-border px-2 py-1"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs">{nwp.name}</span>
                  <span className="ml-1 text-[10px] text-muted-foreground">
                    ({nwp.ability} {nwp.baseScore}
                    {nwp.modifier !== 0 ? ` ${nwp.modifier > 0 ? "+" : ""}${nwp.modifier}` : ""})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{t("target")}:</span>
                  <span className="font-mono text-sm font-bold">{nwp.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {nonweaponProficiencies.length === 0 && !showThiefSkills && (
        <p className="text-sm text-muted-foreground">{t("noProficiencies")}</p>
      )}
    </GlassCard>
  );
}
