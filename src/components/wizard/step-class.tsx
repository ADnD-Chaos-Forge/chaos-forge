"use client";

import { getAllClasses, meetsAbilityRequirements } from "@/lib/rules/classes";
import { canPlayClass, getLevelLimit } from "@/lib/rules/races";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WizardState } from "./wizard-types";
import type { ClassId, AbilityName } from "@/lib/rules/types";

interface StepClassProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}

export function StepClass({ state, onChange }: StepClassProps) {
  const classes = getAllClasses();
  const abilities: Record<AbilityName, number> = {
    str: state.str,
    dex: state.dex,
    con: state.con,
    int: state.int,
    wis: state.wis,
    cha: state.cha,
  };

  function getDisabledReason(classId: ClassId): string | null {
    if (state.raceId && !canPlayClass(state.raceId, classId)) {
      return "Nicht verfügbar für diese Rasse";
    }
    if (!meetsAbilityRequirements(classId, abilities)) {
      return "Attribut-Anforderungen nicht erfüllt";
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-4" data-testid="wizard-step-class">
      <p className="text-sm text-muted-foreground">W&auml;hle die Klasse deines Charakters.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {classes.map((cls) => {
          const isSelected = state.classId === cls.id;
          const disabledReason = getDisabledReason(cls.id);
          const levelLimit = state.raceId ? getLevelLimit(state.raceId, cls.id) : null;

          return (
            <Card
              key={cls.id}
              className={`transition-colors ${
                disabledReason
                  ? "cursor-not-allowed opacity-40"
                  : isSelected
                    ? "cursor-pointer border-primary bg-primary/5"
                    : "cursor-pointer hover:border-primary/30"
              }`}
              onClick={() => !disabledReason && onChange({ classId: cls.id })}
              data-testid={`wizard-class-${cls.id}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{cls.group}</Badge>
                  <Badge variant="outline">d{cls.hitDie}</Badge>
                  {levelLimit && <Badge variant="secondary">Max. Stufe {levelLimit}</Badge>}
                </div>
                {disabledReason && (
                  <span className="text-xs text-destructive">{disabledReason}</span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
