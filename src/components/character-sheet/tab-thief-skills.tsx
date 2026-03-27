"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getBaseThiefSkills,
  getRacialThiefAdjustments,
  getBackstabMultiplier,
  type ThiefSkills,
} from "@/lib/rules/thief";
import type { RaceId } from "@/lib/rules/types";
import type { CharacterRow } from "@/lib/supabase/types";

interface TabThiefSkillsProps {
  character: CharacterRow;
  raceId: RaceId;
  level: number;
  onUpdate: (field: keyof CharacterRow, value: number) => void;
  readOnly?: boolean;
}

const SKILL_FIELDS: {
  key: keyof ThiefSkills;
  dbField: keyof CharacterRow;
  i18nKey: string;
}[] = [
  { key: "pickLocks", dbField: "thief_pick_locks", i18nKey: "pickLocks" },
  { key: "findTraps", dbField: "thief_find_traps", i18nKey: "findTraps" },
  { key: "moveSilently", dbField: "thief_move_silently", i18nKey: "moveSilently" },
  { key: "hideInShadows", dbField: "thief_hide_shadows", i18nKey: "hideInShadows" },
  { key: "climbWalls", dbField: "thief_climb_walls", i18nKey: "climbWalls" },
  { key: "detectNoise", dbField: "thief_detect_noise", i18nKey: "detectNoise" },
  { key: "readLanguages", dbField: "thief_read_languages", i18nKey: "readLanguages" },
];

export function TabThiefSkills({
  character,
  raceId,
  level,
  onUpdate,
  readOnly = false,
}: TabThiefSkillsProps) {
  const t = useTranslations("sheet");
  const baseSkills = getBaseThiefSkills(level);
  const racialAdj = getRacialThiefAdjustments(raceId);
  const backstab = getBackstabMultiplier(level);

  return (
    <div className="flex flex-col gap-6" data-testid="tab-thief-skills">
      <div className="grid gap-3 sm:grid-cols-2">
        {SKILL_FIELDS.map(({ key, dbField, i18nKey }) => {
          const base = baseSkills[key];
          const racial = racialAdj[key] ?? 0;
          const currentValue = (character[dbField] as number) ?? 0;

          return (
            <div
              key={key}
              className="rounded-md border border-border p-3"
              data-testid={`thief-skill-${key}`}
            >
              <Label htmlFor={`thief-${key}`} className="font-heading text-sm">
                {t(i18nKey)}
              </Label>
              <div className="mt-1 flex items-center gap-3">
                <Input
                  id={`thief-${key}`}
                  type="number"
                  min={0}
                  max={99}
                  value={currentValue}
                  onChange={(e) =>
                    onUpdate(dbField, Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))
                  }
                  disabled={readOnly}
                  className="w-20 text-center font-mono text-lg"
                  data-testid={`thief-input-${key}`}
                />
                <span className="text-sm text-muted-foreground">%</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {t("baseValue")}: {base}%
                  </Badge>
                  {racial !== 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${racial > 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {racial > 0 ? "+" : ""}
                      {racial}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Backstab Multiplier */}
      <div className="rounded-md border border-border p-4" data-testid="thief-backstab">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-muted-foreground">{t("backstabMultiplier")}</div>
            <div className="font-heading text-2xl text-primary">x{backstab}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
