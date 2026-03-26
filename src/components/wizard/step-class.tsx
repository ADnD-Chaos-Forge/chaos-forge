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

  function getWarning(classId: ClassId): string | null {
    const warnings: string[] = [];
    if (state.raceId && !canPlayClass(state.raceId, classId)) {
      warnings.push("Nicht regelkonform für diese Rasse");
    }
    if (!meetsAbilityRequirements(classId, abilities)) {
      warnings.push("Attribut-Anforderungen nicht erfüllt");
    }
    return warnings.length > 0 ? warnings.join(". ") : null;
  }

  return (
    <div className="flex flex-col gap-4" data-testid="wizard-step-class">
      <p className="text-sm text-muted-foreground">W&auml;hle die Klasse deines Charakters.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {classes.map((cls) => {
          const isSelected = state.classId === cls.id;
          const warning = getWarning(cls.id);
          const levelLimit = state.raceId ? getLevelLimit(state.raceId, cls.id) : null;

          return (
            <Card
              key={cls.id}
              className={`cursor-pointer transition-colors ${
                isSelected ? "border-primary bg-primary/5" : "hover:border-primary/30"
              }`}
              onClick={() => onChange({ classId: cls.id })}
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
                {warning && (
                  <div className="mt-1 flex items-center gap-1">
                    <Badge className="bg-yellow-800/50 text-yellow-200" variant="secondary">
                      Warnung
                    </Badge>
                    <span className="text-xs text-yellow-400">{warning}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
