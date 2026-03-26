"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WizardState } from "./wizard-types";

interface StepBasicsProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}

export function StepBasics({ state, onChange }: StepBasicsProps) {
  return (
    <div className="flex flex-col gap-4" data-testid="wizard-step-basics">
      <div className="flex flex-col gap-2">
        <Label htmlFor="char-name">Name des Charakters</Label>
        <Input
          id="char-name"
          value={state.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="z.B. Thandril der Weise"
          data-testid="wizard-name-input"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="char-level">Stufe (Level)</Label>
        <Input
          id="char-level"
          type="number"
          min={1}
          max={20}
          value={state.level}
          onChange={(e) =>
            onChange({ level: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })
          }
          data-testid="wizard-level-input"
        />
        <p className="text-xs text-muted-foreground">
          Charaktere k&ouml;nnen auf jeder Stufe erstellt werden (1-20).
        </p>
      </div>
    </div>
  );
}
