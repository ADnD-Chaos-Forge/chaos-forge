"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getThac0, getSavingThrows } from "@/lib/rules/combat";
import { getClassGroup } from "@/lib/rules/classes";
import { getDexterityModifiers } from "@/lib/rules/abilities";
import type { WizardState } from "./wizard-types";

interface StepCombatProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}

export function StepCombat({ state, onChange }: StepCombatProps) {
  const t = useTranslations("wizard");
  const ts = useTranslations("sheet");
  const classGroup = state.classId ? getClassGroup(state.classId) : null;
  const thac0 = classGroup ? getThac0(classGroup, state.level) : 20;
  const saves = classGroup ? getSavingThrows(classGroup, state.level) : null;
  const dexMods = getDexterityModifiers(state.dex);
  const baseAC = 10 + dexMods.defensiveAdj;

  return (
    <div className="flex flex-col gap-6" data-testid="wizard-step-combat">
      <p className="text-sm text-muted-foreground">{t("combatHint")}</p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hp-max">{t("hpLabel")}</Label>
        <Input
          id="hp-max"
          type="number"
          min={1}
          value={state.hpMax}
          onChange={(e) => onChange({ hpMax: Math.max(1, parseInt(e.target.value) || 1) })}
          data-testid="wizard-hp-max"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border p-3 text-center">
          <div className="text-xs text-muted-foreground">{t("thac0")}</div>
          <div className="font-heading text-2xl text-primary" data-testid="wizard-thac0">
            {thac0}
          </div>
        </div>
        <div className="rounded-md border border-border p-3 text-center">
          <div className="text-xs text-muted-foreground">{t("ac")}</div>
          <div className="font-heading text-2xl text-primary" data-testid="wizard-ac">
            {baseAC}
          </div>
          <div className="text-xs text-muted-foreground">{t("acBase")}</div>
        </div>
        <div className="rounded-md border border-border p-3 text-center">
          <div className="text-xs text-muted-foreground">{t("hp")}</div>
          <div className="font-heading text-2xl text-primary" data-testid="wizard-hp-display">
            {state.hpMax}
          </div>
        </div>
      </div>

      {saves && (
        <div>
          <h3 className="mb-2 font-heading text-lg">{t("savingThrows")}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { key: "saveParalyzation", value: saves.paralyzation },
              { key: "saveRod", value: saves.rod },
              { key: "savePetrification", value: saves.petrification },
              { key: "saveBreath", value: saves.breath },
              { key: "saveSpell", value: saves.spell },
            ].map(({ key, value }) => (
              <div key={key} className="rounded-md border border-border p-2 text-center">
                <div className="text-xs text-muted-foreground">{ts(key)}</div>
                <div className="font-mono text-lg" data-testid={`wizard-save-${key}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
