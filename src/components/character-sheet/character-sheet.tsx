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
import { CLASSES } from "@/lib/rules/classes";
import { getAlignmentLabel } from "@/lib/rules/alignment";
import { getXpForNextLevel, getXpThreshold } from "@/lib/rules/experience";
import type { ClassId, RaceId } from "@/lib/rules/types";
import {
  getMulticlassThac0,
  getMulticlassSaves,
  multiclassHasExceptionalStr,
  getMulticlassGroups,
} from "@/lib/rules/multiclass";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
} from "@/lib/rules/abilities";
import { getAttacksPerRound } from "@/lib/rules/combat";
import { hasThiefSkills, getBackstabMultiplier } from "@/lib/rules/thief";
import { Spinner } from "@/components/ui/spinner";
import { AvatarUpload } from "@/components/avatar-upload";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Link from "next/link";
import type { CharacterRow, CharacterClassRow } from "@/lib/supabase/types";
import { TabEquipment } from "./tab-equipment";
import { TabSpells } from "./tab-spells";
import { TabThiefSkills } from "./tab-thief-skills";
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
  CharacterInventoryWithDetails,
  GeneralItemRow,
} from "@/lib/supabase/types";

interface CharacterSheetProps {
  character: CharacterRow;
  characterClasses: CharacterClassRow[];
  userId: string;
  equipment: CharacterEquipmentWithDetails[];
  spells: CharacterSpellWithDetails[];
  allWeapons: WeaponRow[];
  allArmor: ArmorRow[];
  allSpells: SpellRow[];
  weaponProficiencies: CharacterWeaponProficiencyRow[];
  nonweaponProficiencies: CharacterNWPWithDetails[];
  inventory: CharacterInventoryWithDetails[];
  allGeneralItems: GeneralItemRow[];
  allNonweaponProficiencies: NonweaponProficiencyRow[];
  languages: CharacterLanguageRow[];
}

export function CharacterSheet({
  character: initial,
  characterClasses: initialClasses,
  userId,
  equipment,
  spells,
  allWeapons,
  allArmor,
  allSpells,
  weaponProficiencies,
  nonweaponProficiencies,
  allNonweaponProficiencies,
  inventory,
  allGeneralItems,
  languages,
}: CharacterSheetProps) {
  const router = useRouter();
  const t = useTranslations("sheet");
  const tc = useTranslations("characters");
  const tcom = useTranslations("common");
  const [character, setCharacter] = useState(initial);
  const [charClasses, setCharClasses] = useState(initialClasses);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = character.user_id === userId;

  // Derive multiclass data
  const activeClasses = charClasses.filter((cc) => cc.is_active);
  const classIds = activeClasses.map((cc) => cc.class_id as ClassId);
  const classEntries = activeClasses.map((cc) => ({
    classId: cc.class_id as ClassId,
    level: cc.level,
  }));

  const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
  const classNames = classIds.map((id) => CLASSES[id]?.name ?? id).join(" / ");
  const levelDisplay =
    activeClasses.length > 1
      ? activeClasses.map((cc) => cc.level).join("/")
      : String(activeClasses[0]?.level ?? character.level);

  // Use multiclass-aware calculations
  const thac0 = classEntries.length > 0 ? getMulticlassThac0(classEntries) : 20;
  const saves = classEntries.length > 0 ? getMulticlassSaves(classEntries) : null;
  const classGroups = getMulticlassGroups(classIds);
  const hasExceptionalStr = multiclassHasExceptionalStr(classIds);

  // For spells tab: show if any class group is wizard/priest, or bard
  const showSpells =
    classGroups.includes("wizard") || classGroups.includes("priest") || classIds.includes("bard");
  const showThiefSkills = hasThiefSkills(classIds);

  // For spells/proficiencies: use primary (first) class
  const primaryClassId: ClassId | null = classIds[0] ?? ((character.class_id as ClassId) || null);
  const primaryClassGroup = classGroups[0] ?? "warrior";
  const primaryLevel = activeClasses[0]?.level ?? character.level;

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

  function updateClassField(classId: string, field: "level" | "xp_current", value: number) {
    setCharClasses((prev) =>
      prev.map((cc) => (cc.class_id === classId ? { ...cc, [field]: value } : cc))
    );
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    // Save character fields
    const { error: charError } = await supabase
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
        gold_pp: character.gold_pp,
        gold_gp: character.gold_gp,
        gold_ep: character.gold_ep,
        gold_sp: character.gold_sp,
        gold_cp: character.gold_cp,
        notes: character.notes,
        player_name: character.player_name,
        age: character.age,
        height_cm: character.height_cm,
        weight_kg: character.weight_kg,
        gender: character.gender,
        hair_color: character.hair_color,
        eye_color: character.eye_color,
        str_stamina: character.str_stamina,
        str_muscle: character.str_muscle,
        dex_aim: character.dex_aim,
        dex_balance: character.dex_balance,
        con_health: character.con_health,
        con_fitness: character.con_fitness,
        int_reason: character.int_reason,
        int_knowledge: character.int_knowledge,
        wis_intuition: character.wis_intuition,
        wis_willpower: character.wis_willpower,
        cha_leadership: character.cha_leadership,
        cha_appearance: character.cha_appearance,
        thief_pick_locks: character.thief_pick_locks,
        thief_find_traps: character.thief_find_traps,
        thief_move_silently: character.thief_move_silently,
        thief_hide_shadows: character.thief_hide_shadows,
        thief_climb_walls: character.thief_climb_walls,
        thief_detect_noise: character.thief_detect_noise,
        thief_read_languages: character.thief_read_languages,
      })
      .eq("id", character.id);

    if (charError) {
      setSaving(false);
      return;
    }

    // Save character_classes (level + xp per class) in parallel
    const classUpdates = charClasses.map((cc) =>
      supabase
        .from("character_classes")
        .update({ level: cc.level, xp_current: cc.xp_current })
        .eq("id", cc.id)
    );
    await Promise.all(classUpdates);

    setSaving(false);
    setDirty(false);
    router.refresh();
  }

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("characters").delete().eq("id", character.id);
    if (error) return;
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
              {classNames && <Badge data-testid="sheet-class-badge">{classNames}</Badge>}
              <Badge variant="outline" data-testid="sheet-level-badge">
                {t("levelPerClass")}: {levelDisplay}
              </Badge>
              <Badge variant="outline">{getAlignmentLabel(character.alignment)}</Badge>
              {activeClasses.length > 1 && (
                <Badge variant="secondary" data-testid="sheet-multiclass-badge">
                  {t("multiclass")}
                </Badge>
              )}
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
              {saving ? (
                <>
                  <Spinner className="mr-2" />
                  {tcom("saving")}
                </>
              ) : (
                tcom("save")
              )}
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
          {showSpells && <TabsTrigger value="spells">{t("spells")}</TabsTrigger>}
          {showThiefSkills && <TabsTrigger value="thief-skills">{t("thiefSkills")}</TabsTrigger>}
          <TabsTrigger value="proficiencies">{t("proficiencies")}</TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats" className="flex flex-col gap-6">
          {/* Personal Details */}
          <details data-testid="personal-details-section">
            <summary className="cursor-pointer font-heading text-lg">
              {t("personalDetails")}
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="player-name" className="text-xs text-muted-foreground">
                  {t("playerName")}
                </Label>
                <Input
                  id="player-name"
                  type="text"
                  value={character.player_name ?? ""}
                  onChange={(e) => update("player_name", e.target.value)}
                  data-testid="sheet-player-name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="age" className="text-xs text-muted-foreground">
                  {t("age")}
                </Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  value={character.age ?? ""}
                  onChange={(e) =>
                    update(
                      "age",
                      e.target.value ? Math.max(0, parseInt(e.target.value) || 0) : null
                    )
                  }
                  data-testid="sheet-age"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="height-cm" className="text-xs text-muted-foreground">
                  {t("heightCm")}
                </Label>
                <Input
                  id="height-cm"
                  type="number"
                  min={0}
                  value={character.height_cm ?? ""}
                  onChange={(e) =>
                    update(
                      "height_cm",
                      e.target.value ? Math.max(0, parseInt(e.target.value) || 0) : null
                    )
                  }
                  data-testid="sheet-height-cm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="weight-kg" className="text-xs text-muted-foreground">
                  {t("weightKg")}
                </Label>
                <Input
                  id="weight-kg"
                  type="number"
                  min={0}
                  value={character.weight_kg ?? ""}
                  onChange={(e) =>
                    update(
                      "weight_kg",
                      e.target.value ? Math.max(0, parseInt(e.target.value) || 0) : null
                    )
                  }
                  data-testid="sheet-weight-kg"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="gender" className="text-xs text-muted-foreground">
                  {t("gender")}
                </Label>
                <Input
                  id="gender"
                  type="text"
                  value={character.gender ?? ""}
                  onChange={(e) => update("gender", e.target.value)}
                  data-testid="sheet-gender"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="hair-color" className="text-xs text-muted-foreground">
                  {t("hairColor")}
                </Label>
                <Input
                  id="hair-color"
                  type="text"
                  value={character.hair_color ?? ""}
                  onChange={(e) => update("hair_color", e.target.value)}
                  data-testid="sheet-hair-color"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="eye-color" className="text-xs text-muted-foreground">
                  {t("eyeColor")}
                </Label>
                <Input
                  id="eye-color"
                  type="text"
                  value={character.eye_color ?? ""}
                  onChange={(e) => update("eye_color", e.target.value)}
                  data-testid="sheet-eye-color"
                />
              </div>
            </div>
          </details>

          <Separator />

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
              ].map(({ key, label, value, mods }) => {
                const subScoreMap: Record<
                  string,
                  {
                    key1: keyof CharacterRow;
                    label1: string;
                    key2: keyof CharacterRow;
                    label2: string;
                  }
                > = {
                  str: {
                    key1: "str_stamina",
                    label1: t("stamina"),
                    key2: "str_muscle",
                    label2: t("muscle"),
                  },
                  dex: {
                    key1: "dex_aim",
                    label1: t("aim"),
                    key2: "dex_balance",
                    label2: t("balance"),
                  },
                  con: {
                    key1: "con_health",
                    label1: t("health"),
                    key2: "con_fitness",
                    label2: t("fitness"),
                  },
                  int: {
                    key1: "int_reason",
                    label1: t("reason"),
                    key2: "int_knowledge",
                    label2: t("knowledge"),
                  },
                  wis: {
                    key1: "wis_intuition",
                    label1: t("intuition"),
                    key2: "wis_willpower",
                    label2: t("willpower"),
                  },
                  cha: {
                    key1: "cha_leadership",
                    label1: t("leadership"),
                    key2: "cha_appearance",
                    label2: t("appearance"),
                  },
                };
                const sub = subScoreMap[key];
                return (
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
                    {key === "str" && character.str === 18 && hasExceptionalStr && (
                      <div className="mt-2 flex flex-col gap-1">
                        <Label
                          htmlFor="sheet-str-exceptional"
                          className="text-xs text-muted-foreground"
                        >
                          {t("exceptionalStr")}
                        </Label>
                        <Input
                          id="sheet-str-exceptional"
                          type="number"
                          min={1}
                          max={100}
                          value={character.str_exceptional ?? ""}
                          onChange={(e) =>
                            update(
                              "str_exceptional",
                              e.target.value
                                ? Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                                : null
                            )
                          }
                          className="w-20 text-center font-mono text-sm"
                          data-testid="sheet-str-exceptional"
                        />
                      </div>
                    )}
                    {sub && (
                      <details className="mt-2" data-testid={`sheet-subscores-${key}`}>
                        <summary className="cursor-pointer text-xs text-muted-foreground">
                          {t("subScores")}
                        </summary>
                        <div className="mt-1 flex gap-2">
                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`sheet-${sub.key1}`}
                              className="text-xs text-muted-foreground"
                            >
                              {sub.label1}
                            </Label>
                            <Input
                              id={`sheet-${sub.key1}`}
                              type="number"
                              min={3}
                              max={18}
                              value={character[sub.key1] ?? ""}
                              onChange={(e) =>
                                update(
                                  sub.key1,
                                  e.target.value
                                    ? Math.max(3, Math.min(18, parseInt(e.target.value) || 3))
                                    : null
                                )
                              }
                              className="w-16 text-center font-mono text-sm"
                              data-testid={`sheet-${sub.key1}`}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Label
                              htmlFor={`sheet-${sub.key2}`}
                              className="text-xs text-muted-foreground"
                            >
                              {sub.label2}
                            </Label>
                            <Input
                              id={`sheet-${sub.key2}`}
                              type="number"
                              min={3}
                              max={18}
                              value={character[sub.key2] ?? ""}
                              onChange={(e) =>
                                update(
                                  sub.key2,
                                  e.target.value
                                    ? Math.max(3, Math.min(18, parseInt(e.target.value) || 3))
                                    : null
                                )
                              }
                              className="w-16 text-center font-mono text-sm"
                              data-testid={`sheet-${sub.key2}`}
                            />
                          </div>
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
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

          {/* XP per Class */}
          <div>
            <h3 className="mb-3 font-heading text-lg">{t("xp")}</h3>
            <div className="flex flex-col gap-4">
              {activeClasses.map((cc) => {
                const clsDef = CLASSES[cc.class_id as ClassId];
                const nextLevelXp = getXpForNextLevel(cc.class_id as ClassId, cc.level);
                const currentThreshold = getXpThreshold(cc.class_id as ClassId, cc.level);
                const progress = nextLevelXp
                  ? Math.min(
                      100,
                      Math.max(
                        0,
                        ((cc.xp_current - currentThreshold) / (nextLevelXp - currentThreshold)) *
                          100
                      )
                    )
                  : 100;

                return (
                  <div
                    key={cc.class_id}
                    className="rounded-md border border-border p-3"
                    data-testid={`sheet-xp-${cc.class_id}`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-heading text-sm">{clsDef?.name ?? cc.class_id}</span>
                      <div className="flex items-center gap-1">
                        <Label className="text-xs text-muted-foreground">Stufe</Label>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={cc.level}
                          onChange={(e) =>
                            updateClassField(
                              cc.class_id,
                              "level",
                              Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                            )
                          }
                          className="w-16 text-center font-mono text-sm"
                          data-testid={`sheet-level-${cc.class_id}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={0}
                        value={cc.xp_current}
                        onChange={(e) =>
                          updateClassField(
                            cc.class_id,
                            "xp_current",
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        className="w-32 text-center font-mono text-sm"
                        data-testid={`sheet-xp-input-${cc.class_id}`}
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="text-xs text-muted-foreground">
                          {nextLevelXp
                            ? t("xpNextLevel", { xp: nextLevelXp.toLocaleString("de-DE") })
                            : t("xpMax")}
                        </div>
                        <div className="h-3 w-full rounded-full bg-muted">
                          <div
                            className="h-3 rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
            {/* Show class abilities for ALL classes */}
            {classIds.map((clsId) => {
              const clsDef = CLASSES[clsId];
              if (!clsDef?.classAbilities?.length) return null;
              return (
                <div key={clsId} className="mb-4">
                  <h3 className="mb-2 font-heading text-lg">
                    {t("classAbilities")} — {clsDef.name}
                  </h3>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {clsDef.classAbilities.map((ability, i) => (
                      <li key={i}>{ability}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">{t("attacksPerRound")}</div>
              <div className="font-heading text-2xl text-primary" data-testid="sheet-attacks">
                {classEntries.length > 0
                  ? classEntries
                      .map((ce) =>
                        getAttacksPerRound(CLASSES[ce.classId]?.group ?? "warrior", ce.level)
                      )
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .join(" / ")
                  : "1"}
              </div>
            </div>
            <div className="rounded-md border border-border p-4 text-center">
              <div className="text-xs text-muted-foreground">{t("initiative")}</div>
              <div className="font-heading text-2xl text-primary" data-testid="sheet-initiative">
                {dexMods.reactionAdj >= 0 ? "+" : ""}
                {dexMods.reactionAdj}
              </div>
            </div>
            {showThiefSkills && (
              <div className="rounded-md border border-border p-4 text-center">
                <div className="text-xs text-muted-foreground">{t("backstabMultiplier")}</div>
                <div className="font-heading text-2xl text-primary" data-testid="sheet-backstab">
                  x{getBackstabMultiplier(primaryLevel)}
                </div>
              </div>
            )}
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
            inventory={inventory}
            allGeneralItems={allGeneralItems}
            baseMovement={race?.baseMovement ?? 12}
          />
        </TabsContent>

        {showSpells && primaryClassId && (
          <TabsContent value="spells">
            <TabSpells
              characterId={character.id}
              userId={userId}
              classId={primaryClassId}
              classGroup={primaryClassGroup}
              level={primaryLevel}
              intScore={character.int}
              wisScore={character.wis}
              spells={spells}
              allSpells={allSpells}
            />
          </TabsContent>
        )}

        {showThiefSkills && (
          <TabsContent value="thief-skills">
            <TabThiefSkills
              character={character}
              raceId={(character.race_id as RaceId) ?? "human"}
              level={primaryLevel}
              onUpdate={update}
            />
          </TabsContent>
        )}

        <TabsContent value="proficiencies">
          <TabProficiencies
            characterId={character.id}
            userId={userId}
            classId={primaryClassId ?? "fighter"}
            classGroup={primaryClassGroup}
            raceId={character.race_id ?? "human"}
            level={primaryLevel}
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
