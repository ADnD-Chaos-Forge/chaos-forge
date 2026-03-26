"use client";

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
  const classGroup = state.classId ? getClassGroup(state.classId) : null;
  const thac0 = classGroup ? getThac0(classGroup, state.level) : 20;
  const saves = classGroup ? getSavingThrows(classGroup, state.level) : null;
  const dexMods = getDexterityModifiers(state.dex);
  const baseAC = 10 + dexMods.defensiveAdj;

  return (
    <div className="flex flex-col gap-6" data-testid="wizard-step-combat">
      <p className="text-sm text-muted-foreground">
        Die Kampfwerte werden automatisch berechnet. Trage nur die Trefferpunkte ein.
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hp-max">Maximale Trefferpunkte (HP)</Label>
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
          <div className="text-xs text-muted-foreground">ETW0 (THAC0)</div>
          <div className="font-heading text-2xl text-primary" data-testid="wizard-thac0">
            {thac0}
          </div>
        </div>
        <div className="rounded-md border border-border p-3 text-center">
          <div className="text-xs text-muted-foreground">R&uuml;stungsklasse (RK)</div>
          <div className="font-heading text-2xl text-primary" data-testid="wizard-ac">
            {baseAC}
          </div>
          <div className="text-xs text-muted-foreground">Basis (ohne R&uuml;stung)</div>
        </div>
        <div className="rounded-md border border-border p-3 text-center">
          <div className="text-xs text-muted-foreground">Trefferpunkte</div>
          <div className="font-heading text-2xl text-primary" data-testid="wizard-hp-display">
            {state.hpMax}
          </div>
        </div>
      </div>

      {saves && (
        <div>
          <h3 className="mb-2 font-heading text-lg">Rettungsw&uuml;rfe</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { label: "Gift/Tod", value: saves.paralyzation },
              { label: "Stab/Rute", value: saves.rod },
              { label: "Versteinerung", value: saves.petrification },
              { label: "Odemwaffe", value: saves.breath },
              { label: "Zauber", value: saves.spell },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-md border border-border p-2 text-center">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-mono text-lg" data-testid={`wizard-save-${label}`}>
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
