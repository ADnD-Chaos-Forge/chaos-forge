"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RACES } from "@/lib/rules/races";
import { CLASSES, getClassGroup } from "@/lib/rules/classes";
import { getThac0, getSavingThrows } from "@/lib/rules/combat";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
} from "@/lib/rules/abilities";
import type { CharacterRow } from "@/lib/supabase/types";

interface CharacterSheetProps {
  character: CharacterRow;
}

export function CharacterSheet({ character: initial }: CharacterSheetProps) {
  const router = useRouter();
  const [character, setCharacter] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
  const cls = character.class_id ? CLASSES[character.class_id as keyof typeof CLASSES] : null;
  const classGroup = character.class_id ? getClassGroup(character.class_id as keyof typeof CLASSES) : null;
  const thac0 = classGroup ? getThac0(classGroup, character.level) : 20;
  const saves = classGroup ? getSavingThrows(classGroup, character.level) : null;
  const strMods = getStrengthModifiers(character.str, character.str_exceptional ?? undefined);
  const dexMods = getDexterityModifiers(character.dex);
  const conMods = getConstitutionModifiers(character.con);
  const intMods = getIntelligenceModifiers(character.int);
  const wisMods = getWisdomModifiers(character.wis);
  const chaMods = getCharismaModifiers(character.cha);
  const baseAC = 10 + dexMods.defensiveAdj;

  function update(field: keyof CharacterRow, value: string | number | null) {
    setCharacter((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("characters")
      .update({
        str: character.str,
        str_exceptional: character.str_exceptional,
        dex: character.dex,
        con: character.con,
        int: character.int,
        wis: character.wis,
        cha: character.cha,
        hp_current: character.hp_current,
        hp_max: character.hp_max,
        notes: character.notes,
      })
      .eq("id", character.id);
    setSaving(false);
    setDirty(false);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6" data-testid="character-sheet">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl text-primary" data-testid="sheet-name">
            {character.name}
          </h1>
          <div className="mt-1 flex flex-wrap gap-2">
            {race && <Badge>{race.name}</Badge>}
            {cls && <Badge>{cls.name}</Badge>}
            <Badge variant="outline">Stufe {character.level}</Badge>
          </div>
        </div>
        {dirty && (
          <Button onClick={handleSave} disabled={saving} data-testid="sheet-save-button">
            {saving ? "Speichere..." : "Speichern"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full justify-start" data-testid="sheet-tabs">
          <TabsTrigger value="stats">Werte</TabsTrigger>
          <TabsTrigger value="combat">Kampf</TabsTrigger>
          <TabsTrigger value="notes">Notizen</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats" className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 font-heading text-lg">Attribute</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { key: "str" as const, label: "STR", value: character.str, mods: `Treffer ${strMods.hitAdj >= 0 ? "+" : ""}${strMods.hitAdj}, Schaden ${strMods.dmgAdj >= 0 ? "+" : ""}${strMods.dmgAdj}` },
                { key: "dex" as const, label: "DEX", value: character.dex, mods: `RK ${dexMods.defensiveAdj >= 0 ? "+" : ""}${dexMods.defensiveAdj}` },
                { key: "con" as const, label: "CON", value: character.con, mods: `HP ${conMods.hpAdj >= 0 ? "+" : ""}${conMods.hpAdj}/Stufe` },
                { key: "int" as const, label: "INT", value: character.int, mods: `${intMods.numberOfLanguages} Sprachen` },
                { key: "wis" as const, label: "WIS", value: character.wis, mods: `Mag.Abwehr ${wisMods.magicalDefenseAdj >= 0 ? "+" : ""}${wisMods.magicalDefenseAdj}` },
                { key: "cha" as const, label: "CHA", value: character.cha, mods: `${chaMods.maxHenchmen} Gefolgsleute` },
              ].map(({ key, label, value, mods }) => (
                <div key={key} className="rounded-md border border-border p-3">
                  <Label htmlFor={`sheet-${key}`} className="text-xs text-muted-foreground">
                    {label}
                  </Label>
                  <Input
                    id={`sheet-${key}`}
                    type="number"
                    min={3}
                    max={18}
                    value={value}
                    onChange={(e) => update(key, Math.max(3, Math.min(18, parseInt(e.target.value) || 3)))}
                    className="mt-1 text-center font-mono text-lg"
                    data-testid={`sheet-ability-${key}`}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">{mods}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 font-heading text-lg">Trefferpunkte</h3>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="hp-current" className="text-xs text-muted-foreground">
                  Aktuell
                </Label>
                <Input
                  id="hp-current"
                  type="number"
                  min={0}
                  value={character.hp_current}
                  onChange={(e) => update("hp_current", Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 text-center font-mono text-lg"
                  data-testid="sheet-hp-current"
                />
              </div>
              <div className="flex items-end pb-2 text-lg text-muted-foreground">/</div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="hp-max" className="text-xs text-muted-foreground">
                  Maximum
                </Label>
                <Input
                  id="hp-max"
                  type="number"
                  min={1}
                  value={character.hp_max}
                  onChange={(e) => update("hp_max", Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center font-mono text-lg"
                  data-testid="sheet-hp-max"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Combat Tab */}
        <TabsContent value="combat" className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">ETW0 (THAC0)</div>
              <div className="font-heading text-3xl text-primary" data-testid="sheet-thac0">{thac0}</div>
            </div>
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">R&uuml;stungsklasse</div>
              <div className="font-heading text-3xl text-primary" data-testid="sheet-ac">{baseAC}</div>
              <div className="text-xs text-muted-foreground">Basis (ohne R&uuml;stung)</div>
            </div>
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">Treffer / Schaden</div>
              <div className="font-heading text-2xl text-primary">
                {strMods.hitAdj >= 0 ? "+" : ""}{strMods.hitAdj} / {strMods.dmgAdj >= 0 ? "+" : ""}{strMods.dmgAdj}
              </div>
            </div>
          </div>

          {saves && (
            <div>
              <h3 className="mb-3 font-heading text-lg">Rettungsw&uuml;rfe</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { label: "Gift/Tod", value: saves.paralyzation },
                  { label: "Stab/Rute", value: saves.rod },
                  { label: "Versteinerung", value: saves.petrification },
                  { label: "Odemwaffe", value: saves.breath },
                  { label: "Zauber", value: saves.spell },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-md border border-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-mono text-xl">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notizen</Label>
            <textarea
              id="notes"
              value={character.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="min-h-[200px] w-full rounded-md border border-input bg-input p-3 text-sm"
              placeholder="Hintergrundgeschichte, wichtige Items, Quests..."
              data-testid="sheet-notes"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
