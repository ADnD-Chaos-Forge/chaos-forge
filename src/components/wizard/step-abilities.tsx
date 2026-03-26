"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WizardState } from "./wizard-types";

interface StepAbilitiesProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
  showExceptionalStr: boolean;
}

const ABILITIES = [
  { key: "str" as const, label: "Stärke (STR)", min: 3, max: 18 },
  { key: "dex" as const, label: "Geschicklichkeit (DEX)", min: 3, max: 18 },
  { key: "con" as const, label: "Konstitution (CON)", min: 3, max: 18 },
  { key: "int" as const, label: "Intelligenz (INT)", min: 3, max: 18 },
  { key: "wis" as const, label: "Weisheit (WIS)", min: 3, max: 18 },
  { key: "cha" as const, label: "Charisma (CHA)", min: 3, max: 18 },
];

export function StepAbilities({ state, onChange, showExceptionalStr }: StepAbilitiesProps) {
  return (
    <div className="flex flex-col gap-4" data-testid="wizard-step-abilities">
      <p className="text-sm text-muted-foreground">
        Trage die Attributwerte deines Charakters ein (3-18).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {ABILITIES.map(({ key, label, min, max }) => (
          <div key={key} className="flex flex-col gap-1">
            <Label htmlFor={`ability-${key}`}>{label}</Label>
            <Input
              id={`ability-${key}`}
              type="number"
              min={min}
              max={max}
              value={state[key]}
              onChange={(e) => {
                const val = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
                onChange({ [key]: val });
              }}
              data-testid={`wizard-ability-${key}`}
            />
          </div>
        ))}
      </div>

      {showExceptionalStr && state.str === 18 && (
        <div className="flex flex-col gap-1 rounded-md border border-primary/30 bg-primary/5 p-3">
          <Label htmlFor="str-exceptional">Ausnahmest&auml;rke (18/xx)</Label>
          <Input
            id="str-exceptional"
            type="number"
            min={1}
            max={100}
            value={state.strExceptional ?? ""}
            onChange={(e) => {
              const val = e.target.value ? Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) : null;
              onChange({ strExceptional: val });
            }}
            placeholder="01-00 (100)"
            data-testid="wizard-ability-str-exceptional"
          />
          <p className="text-xs text-muted-foreground">
            Nur f&uuml;r Krieger-Klassen mit STR 18. Wert 1-100 (100 = &quot;18/00&quot;).
          </p>
        </div>
      )}
    </div>
  );
}
