"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RACES } from "@/lib/rules/races";
import { CLASSES, getClassGroup } from "@/lib/rules/classes";
import { getAlignmentLabel } from "@/lib/rules/alignment";
import { getXpForNextLevel, getXpThreshold } from "@/lib/rules/experience";
import type { ClassId } from "@/lib/rules/types";
import { getThac0, getSavingThrows } from "@/lib/rules/combat";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
} from "@/lib/rules/abilities";
import { AvatarUpload } from "@/components/avatar-upload";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Link from "next/link";
import type { CharacterRow } from "@/lib/supabase/types";
import { TabEquipment } from "./tab-equipment";
import { TabSpells } from "./tab-spells";
import { TabProficiencies } from "./tab-proficiencies";
import type {
  CharacterEquipmentWithDetails,
  CharacterSpellWithDetails,
  WeaponRow,
  ArmorRow,
  SpellRow,
  CharacterWeaponProficiencyRow,
  CharacterNWPWithDetails,
  NonweaponProficiencyRow,
  CharacterLanguageRow,
} from "@/lib/supabase/types";

interface CharacterSheetProps {
  character: CharacterRow;
  userId: string;
  equipment: CharacterEquipmentWithDetails[];
  spells: CharacterSpellWithDetails[];
  allWeapons: WeaponRow[];
  allArmor: ArmorRow[];
  allSpells: SpellRow[];
  weaponProficiencies: CharacterWeaponProficiencyRow[];
  nonweaponProficiencies: CharacterNWPWithDetails[];
  allNonweaponProficiencies: NonweaponProficiencyRow[];
  languages: CharacterLanguageRow[];
}

export function CharacterSheet({
  character: initial,
  userId,
  equipment,
  spells,
  allWeapons,
  allArmor,
  allSpells,
  weaponProficiencies,
  nonweaponProficiencies,
  allNonweaponProficiencies,
  languages,
}: CharacterSheetProps) {
  const router = useRouter();
  const t = useTranslations("sheet");
  const tc = useTranslations("characters");
  const tcom = useTranslations("common");
  const [character, setCharacter] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = character.user_id === userId;

  const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
  const cls = character.class_id ? CLASSES[character.class_id as keyof typeof CLASSES] : null;
  const classGroup = character.class_id
    ? getClassGroup(character.class_id as keyof typeof CLASSES)
    : null;
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
        alignment: character.alignment,
        xp_current: character.xp_current,
        gold_pp: character.gold_pp,
        gold_gp: character.gold_gp,
        gold_ep: character.gold_ep,
        gold_sp: character.gold_sp,
        gold_cp: character.gold_cp,
        notes: character.notes,
      })
      .eq("id", character.id);
    setSaving(false);
    setDirty(false);
    router.refresh();
  }

  async function handleDelete() {
    const supabase = createClient();
    await supabase.from("characters").delete().eq("id", character.id);
    router.push("/characters");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6" data-testid="character-sheet">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <AvatarUpload
            characterId={character.id}
            userId={userId}
            characterName={character.name}
            currentAvatarUrl={character.avatar_url}
          />
          <div>
            <h1 className="font-heading text-3xl text-primary" data-testid="sheet-name">
              {character.name}
            </h1>
            <div className="mt-1 flex flex-wrap gap-2">
              {race && <Badge>{race.name}</Badge>}
              {cls && <Badge>{cls.name}</Badge>}
              <Badge variant="outline">Stufe {character.level}</Badge>
              <Badge variant="outline">{getAlignmentLabel(character.alignment)}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/characters/${character.id}/print`}>
            <Button variant="outline" data-testid="sheet-print-button">
              {tc("printView")}
            </Button>
          </Link>
          {dirty && (
            <Button onClick={handleSave} disabled={saving} data-testid="sheet-save-button">
              {saving ? tcom("saving") : tcom("save")}
            </Button>
          )}
          {isOwner && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              data-testid="sheet-delete-button"
            >
              {tcom("delete")}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Charakter löschen"
        message={`Möchtest du "${character.name}" wirklich unwiderruflich löschen?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full justify-start" data-testid="sheet-tabs">
          <TabsTrigger value="stats">{t("stats")}</TabsTrigger>
          <TabsTrigger value="combat">{t("combat")}</TabsTrigger>
          <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
          <TabsTrigger value="equipment">{t("equipment")}</TabsTrigger>
          {(classGroup === "wizard" ||
            classGroup === "priest" ||
            character.class_id === "bard") && (
            <TabsTrigger value="spells">{t("spells")}</TabsTrigger>
          )}
          <TabsTrigger value="proficiencies">{t("proficiencies")}</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats" className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 font-heading text-lg">{t("attributes")}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                {
                  key: "str" as const,
                  label: "STR",
                  value: character.str,
                  mods: `Treffer ${strMods.hitAdj >= 0 ? "+" : ""}${strMods.hitAdj}, Schaden ${strMods.dmgAdj >= 0 ? "+" : ""}${strMods.dmgAdj}`,
                },
                {
                  key: "dex" as const,
                  label: "DEX",
                  value: character.dex,
                  mods: `RK ${dexMods.defensiveAdj >= 0 ? "+" : ""}${dexMods.defensiveAdj}`,
                },
                {
                  key: "con" as const,
                  label: "CON",
                  value: character.con,
                  mods: `HP ${conMods.hpAdj >= 0 ? "+" : ""}${conMods.hpAdj}/Stufe`,
                },
                {
                  key: "int" as const,
                  label: "INT",
                  value: character.int,
                  mods: `${intMods.numberOfLanguages} Sprachen`,
                },
                {
                  key: "wis" as const,
                  label: "WIS",
                  value: character.wis,
                  mods: `Mag.Abwehr ${wisMods.magicalDefenseAdj >= 0 ? "+" : ""}${wisMods.magicalDefenseAdj}`,
                },
                {
                  key: "cha" as const,
                  label: "CHA",
                  value: character.cha,
                  mods: `${chaMods.maxHenchmen} Gefolgsleute`,
                },
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
                    onChange={(e) =>
                      update(key, Math.max(3, Math.min(18, parseInt(e.target.value) || 3)))
                    }
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
            <h3 className="mb-3 font-heading text-lg">{t("hitPoints")}</h3>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="hp-current" className="text-xs text-muted-foreground">
                  {t("hpCurrent")}
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
                  {t("hpMax")}
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

          <Separator />

          <div>
            <h3 className="mb-3 font-heading text-lg">{t("xp")}</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="xp-current" className="text-xs text-muted-foreground">
                    {t("hpCurrent")}
                  </Label>
                  <Input
                    id="xp-current"
                    type="number"
                    min={0}
                    value={character.xp_current}
                    onChange={(e) =>
                      update("xp_current", Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-32 text-center font-mono"
                    data-testid="sheet-xp-current"
                  />
                </div>
                {character.class_id &&
                  (() => {
                    const nextLevelXp = getXpForNextLevel(
                      character.class_id as ClassId,
                      character.level
                    );
                    const currentThreshold = getXpThreshold(
                      character.class_id as ClassId,
                      character.level
                    );
                    if (!nextLevelXp)
                      return (
                        <span className="text-sm text-muted-foreground">Max. Stufe erreicht</span>
                      );
                    const progress = Math.min(
                      100,
                      Math.max(
                        0,
                        ((character.xp_current - currentThreshold) /
                          (nextLevelXp - currentThreshold)) *
                          100
                      )
                    );
                    return (
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="text-xs text-muted-foreground">
                          Nächste Stufe: {nextLevelXp.toLocaleString("de-DE")} XP
                        </div>
                        <div className="h-3 w-full rounded-full bg-muted">
                          <div
                            className="h-3 rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                            data-testid="sheet-xp-bar"
                          />
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 font-heading text-lg">{t("gold")}</h3>
            <div className="grid grid-cols-5 gap-2">
              {[
                { key: "gold_pp" as const, label: "PP" },
                { key: "gold_gp" as const, label: "GP" },
                { key: "gold_ep" as const, label: "EP" },
                { key: "gold_sp" as const, label: "SP" },
                { key: "gold_cp" as const, label: "CP" },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1">
                  <Label
                    htmlFor={`sheet-${key}`}
                    className="text-center text-xs text-muted-foreground"
                  >
                    {label}
                  </Label>
                  <Input
                    id={`sheet-${key}`}
                    type="number"
                    min={0}
                    value={character[key]}
                    onChange={(e) => update(key, Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-center font-mono"
                    data-testid={`sheet-${key}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            {race?.racialAbilities && race.racialAbilities.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 font-heading text-lg">{t("racialAbilities")}</h3>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {race.racialAbilities.map((ability, i) => (
                    <li key={i}>{ability}</li>
                  ))}
                </ul>
              </div>
            )}
            {cls?.classAbilities && cls.classAbilities.length > 0 && (
              <div>
                <h3 className="mb-2 font-heading text-lg">{t("classAbilities")}</h3>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {cls.classAbilities.map((ability, i) => (
                    <li key={i}>{ability}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Combat Tab */}
        <TabsContent value="combat" className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">{t("thac0")}</div>
              <div className="font-heading text-3xl text-primary" data-testid="sheet-thac0">
                {thac0}
              </div>
            </div>
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">{t("armorClass")}</div>
              <div className="font-heading text-3xl text-primary" data-testid="sheet-ac">
                {baseAC}
              </div>
              <div className="text-xs text-muted-foreground">{t("acBase")}</div>
            </div>
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">{t("hitDamage")}</div>
              <div className="font-heading text-2xl text-primary">
                {strMods.hitAdj >= 0 ? "+" : ""}
                {strMods.hitAdj} / {strMods.dmgAdj >= 0 ? "+" : ""}
                {strMods.dmgAdj}
              </div>
            </div>
          </div>

          {saves && (
            <div>
              <h3 className="mb-3 font-heading text-lg">{t("savingThrows")}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { label: t("savePoison"), value: saves.paralyzation },
                  { label: t("saveRod"), value: saves.rod },
                  { label: t("savePetrification"), value: saves.petrification },
                  { label: t("saveBreath"), value: saves.breath },
                  { label: t("saveSpell"), value: saves.spell },
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
            <Label htmlFor="notes">{t("notes")}</Label>
            <textarea
              id="notes"
              value={character.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="min-h-[200px] w-full rounded-md border border-input bg-input p-3 text-sm"
              placeholder={t("notesPlaceholder")}
              data-testid="sheet-notes"
            />
          </div>
        </TabsContent>

        <TabsContent value="equipment">
          <TabEquipment
            characterId={character.id}
            userId={userId}
            equipment={equipment}
            allWeapons={allWeapons}
            allArmor={allArmor}
            strWeightAllow={strMods.weightAllow}
            dexDefenseAdj={dexMods.defensiveAdj}
          />
        </TabsContent>

        {(classGroup === "wizard" || classGroup === "priest" || character.class_id === "bard") && (
          <TabsContent value="spells">
            <TabSpells
              characterId={character.id}
              userId={userId}
              classId={character.class_id ?? "fighter"}
              classGroup={classGroup ?? "warrior"}
              level={character.level}
              intScore={character.int}
              wisScore={character.wis}
              spells={spells}
              allSpells={allSpells}
            />
          </TabsContent>
        )}

        <TabsContent value="proficiencies">
          <TabProficiencies
            characterId={character.id}
            userId={userId}
            classId={character.class_id ?? "fighter"}
            classGroup={classGroup ?? "warrior"}
            raceId={character.race_id ?? "human"}
            level={character.level}
            intScore={character.int}
            weaponProficiencies={weaponProficiencies}
            nonweaponProficiencies={nonweaponProficiencies}
            allNonweaponProficiencies={allNonweaponProficiencies}
            languages={languages}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
