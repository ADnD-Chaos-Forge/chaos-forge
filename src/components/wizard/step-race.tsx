"use client";

import { getAllRaces, canPlayClass } from "@/lib/rules/races";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WizardState } from "./wizard-types";
import type { RaceId } from "@/lib/rules/types";

interface StepRaceProps {
  state: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
}

export function StepRace({ state, onChange }: StepRaceProps) {
  const races = getAllRaces();

  function handleSelect(raceId: RaceId) {
    // Reset class if the new race doesn't allow it
    const newClassId = state.classId && canPlayClass(raceId, state.classId) ? state.classId : null;
    onChange({ raceId, classId: newClassId });
  }

  return (
    <div className="flex flex-col gap-4" data-testid="wizard-step-race">
      <p className="text-sm text-muted-foreground">W&auml;hle die Rasse deines Charakters.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {races.map((race) => {
          const isSelected = state.raceId === race.id;
          const adjustments = Object.entries(race.abilityAdjustments);

          return (
            <Card
              key={race.id}
              className={`cursor-pointer transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
              onClick={() => handleSelect(race.id)}
              data-testid={`wizard-race-${race.id}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{race.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {adjustments.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {adjustments.map(([ability, mod]) => (
                      <Badge key={ability} variant={mod > 0 ? "default" : "destructive"}>
                        {ability.toUpperCase()} {mod > 0 ? `+${mod}` : mod}
                      </Badge>
                    ))}
                  </div>
                )}
                {race.infravision > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Infravision: {race.infravision} Fu&szlig;
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
