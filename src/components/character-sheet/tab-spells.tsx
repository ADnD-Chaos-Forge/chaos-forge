"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getWizardSpellSlots,
  getPriestSpellSlots,
  getPriestBonusSlots,
  canLearnSpell,
} from "@/lib/rules/spellslots";
import type { ClassId, MagicSchool, PriestSphere } from "@/lib/rules/types";
import type { CharacterSpellWithDetails, SpellRow } from "@/lib/supabase/types";

const WIZARD_SCHOOLS = [
  "abjuration",
  "alteration",
  "conjuration",
  "divination",
  "enchantment",
  "illusion",
  "invocation",
  "necromancy",
] as const;

const PRIEST_SPHERES = [
  "all",
  "animal",
  "astral",
  "charm",
  "combat",
  "creation",
  "divination",
  "elemental",
  "guardian",
  "healing",
  "necromantic",
  "plant",
  "protection",
  "summoning",
  "sun",
  "weather",
] as const;

interface CustomSpellForm {
  name: string;
  level: number;
  schoolOrSphere: string;
  range: string;
  duration: string;
  area_of_effect: string;
  components: { V: boolean; S: boolean; M: boolean };
  description: string;
}

const emptyCustomSpellForm: CustomSpellForm = {
  name: "",
  level: 1,
  schoolOrSphere: "",
  range: "",
  duration: "",
  area_of_effect: "",
  components: { V: false, S: false, M: false },
  description: "",
};

interface TabSpellsProps {
  characterId: string;
  userId: string;
  classId: string;
  classGroup: string;
  level: number;
  intScore: number;
  wisScore: number;
  spells: CharacterSpellWithDetails[];
  allSpells: SpellRow[];
}

export function TabSpells({
  characterId,
  userId,
  classId,
  classGroup,
  level,
  intScore,
  wisScore,
  spells,
  allSpells,
}: TabSpellsProps) {
  const router = useRouter();
  const t = useTranslations("spells");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const spellName = useCallback(
    (spell: SpellRow) => (locale === "en" && spell.name_en ? spell.name_en : spell.name),
    [locale]
  );
  const spellDesc = useCallback(
    (spell: SpellRow) =>
      locale === "en" && spell.description_en ? spell.description_en : spell.description,
    [locale]
  );
  const [learnDialogOpen, setLearnDialogOpen] = useState(false);
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);
  const [learnSearchQuery, setLearnSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [schoolSphereFilter, setSchoolSphereFilter] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSpell, setCustomSpell] = useState<CustomSpellForm>(emptyCustomSpellForm);

  const isWizard = classGroup === "wizard";
  const isPriest = classGroup === "priest";
  const maxSpellLevel = isWizard ? 9 : 7;

  // Calculate spell slots
  const baseSlots = useMemo(() => {
    if (isWizard) return getWizardSpellSlots(level);
    if (isPriest) return getPriestSpellSlots(level);
    return [];
  }, [isWizard, isPriest, level]);

  const bonusSlots = useMemo(() => {
    if (isPriest) return getPriestBonusSlots(wisScore);
    return new Array(maxSpellLevel).fill(0);
  }, [isPriest, wisScore, maxSpellLevel]);

  const totalSlots = useMemo(
    () => baseSlots.map((base, i) => base + (bonusSlots[i] ?? 0)),
    [baseSlots, bonusSlots]
  );

  // Group spells by level
  const spellsByLevel = useMemo(() => {
    const grouped: Record<number, CharacterSpellWithDetails[]> = {};
    for (let l = 1; l <= maxSpellLevel; l++) {
      grouped[l] = [];
    }
    for (const s of spells) {
      const lvl = s.spell.level;
      if (grouped[lvl]) {
        grouped[lvl].push(s);
      }
    }
    return grouped;
  }, [spells, maxSpellLevel]);

  // Count prepared spells per level
  const preparedCountByLevel = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let l = 1; l <= maxSpellLevel; l++) {
      counts[l] = (spellsByLevel[l] ?? []).filter((s) => s.prepared).length;
    }
    return counts;
  }, [spellsByLevel, maxSpellLevel]);

  // Learnable spells filtered by canLearnSpell
  const learnableSpells = useMemo(() => {
    const knownIds = new Set(spells.map((s) => s.spell_id));
    return allSpells.filter((spell) => {
      if (knownIds.has(spell.id)) return false;
      // Filter by spell type matching class group
      if (isWizard && spell.spell_type !== "wizard") return false;
      if (isPriest && spell.spell_type !== "priest") return false;
      const result = canLearnSpell(
        classId as ClassId,
        (spell.school as MagicSchool) ?? undefined,
        (spell.sphere as PriestSphere) ?? undefined,
        spell.level,
        intScore
      );
      return result.allowed;
    });
  }, [allSpells, spells, classId, isWizard, isPriest, intScore]);

  // Filtered learnable spells by search, level, and school/sphere
  const filteredLearnableSpells = useMemo(() => {
    return learnableSpells.filter((s) => {
      // Level filter
      if (levelFilter !== null && s.level !== levelFilter) return false;
      // School/sphere filter
      if (schoolSphereFilter !== null) {
        const value = isWizard ? s.school : s.sphere;
        if (value !== schoolSphereFilter) return false;
      }
      // Text search
      if (learnSearchQuery.trim()) {
        const q = learnSearchQuery.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !(s.school && s.school.toLowerCase().includes(q)) &&
          !(s.sphere && s.sphere.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [learnableSpells, learnSearchQuery, levelFilter, schoolSphereFilter, isWizard]);

  async function handleCreateCustomSpell() {
    if (!customSpell.name.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const components: string[] = [];
    if (customSpell.components.V) components.push("V");
    if (customSpell.components.S) components.push("S");
    if (customSpell.components.M) components.push("M");

    const { data: newSpell, error } = await supabase
      .from("spells")
      .insert({
        name: customSpell.name,
        level: customSpell.level,
        spell_type: isWizard ? "wizard" : "priest",
        school: isWizard ? customSpell.schoolOrSphere : null,
        sphere: isPriest ? customSpell.schoolOrSphere : null,
        range: customSpell.range,
        duration: customSpell.duration,
        area_of_effect: customSpell.area_of_effect,
        components,
        description: customSpell.description,
        is_custom: true,
        created_by: userId,
      })
      .select("id")
      .single();

    if (!error && newSpell) {
      await supabase.from("character_spells").insert({
        character_id: characterId,
        spell_id: newSpell.id,
        prepared: false,
      });
    }

    setLoading(false);
    setShowCustomForm(false);
    setCustomSpell(emptyCustomSpellForm);
    setLearnDialogOpen(false);
    setLearnSearchQuery("");
    setLevelFilter(null);
    setSchoolSphereFilter(null);
    router.refresh();
  }

  async function handleTogglePrepared(spellId: string, currentlyPrepared: boolean) {
    const spell = spells.find((s) => s.spell_id === spellId);
    if (!spell) return;

    // If trying to prepare, check slot availability
    if (!currentlyPrepared) {
      const spellLevel = spell.spell.level;
      const available = totalSlots[spellLevel - 1] ?? 0;
      const used = preparedCountByLevel[spellLevel] ?? 0;
      if (used >= available) return;
    }

    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("character_spells")
      .update({ prepared: !currentlyPrepared })
      .eq("character_id", characterId)
      .eq("spell_id", spellId);
    setLoading(false);
    router.refresh();
  }

  async function handleLearnSpell(spellId: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_spells").insert({
      character_id: characterId,
      spell_id: spellId,
      prepared: false,
    });
    setLoading(false);
    setLearnDialogOpen(false);
    setLearnSearchQuery("");
    setLevelFilter(null);
    setSchoolSphereFilter(null);
    setShowCustomForm(false);
    setCustomSpell(emptyCustomSpellForm);
    router.refresh();
  }

  async function handleRemoveSpell(spellId: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("character_spells")
      .delete()
      .eq("character_id", characterId)
      .eq("spell_id", spellId);
    setLoading(false);
    router.refresh();
  }

  if (!isWizard && !isPriest) {
    return (
      <div className="py-8 text-center text-muted-foreground" data-testid="spells-no-magic">
        Diese Klasse kann keine Zauber wirken.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-testid="tab-spells">
      {/* Spell Slots Overview */}
      <div>
        <h3 className="mb-3 font-heading text-lg">Zauberpl&auml;tze</h3>
        <div
          className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7"
          data-testid="spell-slots-grid"
        >
          {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((spellLevel) => {
            const available = totalSlots[spellLevel - 1] ?? 0;
            const prepared = preparedCountByLevel[spellLevel] ?? 0;
            if (available === 0 && (spellsByLevel[spellLevel] ?? []).length === 0) return null;
            return (
              <div
                key={spellLevel}
                className="rounded-md border border-border p-3 text-center"
                data-testid={`spell-slot-level-${spellLevel}`}
              >
                <div className="text-xs text-muted-foreground">Stufe {spellLevel}</div>
                <div className="font-mono text-xl">
                  <span
                    className={prepared >= available ? "text-destructive" : "text-primary"}
                    data-testid={`spell-slot-prepared-${spellLevel}`}
                  >
                    {prepared}
                  </span>
                  <span className="text-muted-foreground"> / </span>
                  <span data-testid={`spell-slot-available-${spellLevel}`}>{available}</span>
                </div>
                {isPriest && bonusSlots[spellLevel - 1] > 0 && (
                  <div className="text-xs text-muted-foreground">
                    (+{bonusSlots[spellLevel - 1]} WIS)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learn Spell Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setLearnDialogOpen(true)}
          disabled={loading}
          data-testid="learn-spell-button"
        >
          Zauber erlernen
        </Button>
      </div>

      {/* Spells grouped by level */}
      {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((spellLevel) => {
        const levelSpells = spellsByLevel[spellLevel] ?? [];
        if (levelSpells.length === 0) return null;
        const available = totalSlots[spellLevel - 1] ?? 0;
        const prepared = preparedCountByLevel[spellLevel] ?? 0;

        return (
          <div key={spellLevel} data-testid={`spell-group-level-${spellLevel}`}>
            <h3 className="mb-2 font-heading text-lg">
              Zauber Stufe {spellLevel}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({prepared}/{available} vorbereitet)
              </span>
            </h3>
            <div className="flex flex-col gap-2">
              {levelSpells.map((charSpell) => {
                const spell = charSpell.spell;
                const isExpanded = expandedSpellId === spell.id;
                const canPrepare = !charSpell.prepared && prepared < available;

                return (
                  <Card key={spell.id} size="sm" data-testid={`spell-card-${spell.id}`}>
                    <CardHeader className="flex-row items-center justify-between border-b pb-2">
                      <div
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => setExpandedSpellId(isExpanded ? null : spell.id)}
                        data-testid={`spell-toggle-details-${spell.id}`}
                      >
                        <CardTitle className="text-sm">{spellName(spell)}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {spell.school ?? spell.sphere}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={charSpell.prepared ? "default" : "outline"}
                          size="sm"
                          disabled={loading || (!charSpell.prepared && !canPrepare)}
                          onClick={() => handleTogglePrepared(spell.id, charSpell.prepared)}
                          data-testid={`spell-prepare-toggle-${spell.id}`}
                        >
                          {charSpell.prepared ? t("unprepareSpell") : t("prepareSpell")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={loading}
                          onClick={() => handleRemoveSpell(spell.id)}
                          className="text-destructive hover:text-destructive"
                          data-testid={`spell-remove-${spell.id}`}
                        >
                          {t("removeSpell")}
                        </Button>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent data-testid={`spell-details-${spell.id}`}>
                        <div className="mb-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>
                            {t("range")}: {spell.range}
                          </span>
                          <span>
                            {t("duration")}: {spell.duration}
                          </span>
                          <span>
                            {t("areaOfEffect")}: {spell.area_of_effect}
                          </span>
                          {spell.casting_time && (
                            <span>
                              {t("castingTime")}: {spell.casting_time}
                            </span>
                          )}
                          {spell.saving_throw && spell.saving_throw !== "None" && (
                            <span>
                              {t("savingThrow")}: {spell.saving_throw}
                            </span>
                          )}
                          {spell.components.length > 0 && (
                            <span>
                              {t("components")}: {spell.components.join(", ")}
                            </span>
                          )}
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{spellDesc(spell)}</ReactMarkdown>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {spells.length === 0 && (
        <div className="py-8 text-center text-muted-foreground" data-testid="spells-empty">
          Noch keine Zauber erlernt.
        </div>
      )}

      {/* Learn Spell Dialog (modal overlay) */}
      {learnDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          data-testid="learn-spell-dialog"
        >
          <div className="mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-card ring-1 ring-foreground/10">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-heading text-lg">Zauber erlernen</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLearnDialogOpen(false);
                  setLearnSearchQuery("");
                  setLevelFilter(null);
                  setSchoolSphereFilter(null);
                  setShowCustomForm(false);
                  setCustomSpell(emptyCustomSpellForm);
                }}
                data-testid="learn-spell-dialog-close"
              >
                Schlie&szlig;en
              </Button>
            </div>
            <div className="border-b p-4">
              <input
                type="text"
                placeholder="Zauber suchen..."
                value={learnSearchQuery}
                onChange={(e) => setLearnSearchQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-input p-2 text-sm"
                data-testid="learn-spell-search"
              />

              {/* Level filter buttons */}
              <div className="mt-3 flex flex-wrap gap-1" data-testid="spell-level-filters">
                <Button
                  variant={levelFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLevelFilter(null)}
                  data-testid="spell-level-filter-all"
                  className="h-7 px-2 text-xs"
                >
                  Alle
                </Button>
                {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    variant={levelFilter === n ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLevelFilter(levelFilter === n ? null : n)}
                    data-testid={`spell-level-filter-${n}`}
                    className="h-7 w-7 px-0 text-xs"
                  >
                    {n}
                  </Button>
                ))}
              </div>

              {/* School / Sphere filter badges */}
              <div className="mt-2 flex flex-wrap gap-1" data-testid="spell-school-filters">
                <Badge
                  variant={schoolSphereFilter === null ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setSchoolSphereFilter(null)}
                  data-testid="spell-school-filter-all"
                >
                  Alle
                </Badge>
                {(isWizard ? WIZARD_SCHOOLS : PRIEST_SPHERES).map((s) => (
                  <Badge
                    key={s}
                    variant={schoolSphereFilter === s ? "default" : "outline"}
                    className="cursor-pointer text-xs capitalize"
                    onClick={() => setSchoolSphereFilter(schoolSphereFilter === s ? null : s)}
                    data-testid={`spell-school-filter-${s}`}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {filteredLearnableSpells.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Keine erlernbaren Zauber gefunden.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredLearnableSpells.map((spell) => (
                    <div
                      key={spell.id}
                      className="flex items-start justify-between rounded-md border border-border p-3"
                      data-testid={`learnable-spell-${spell.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{spellName(spell)}</span>
                          <Badge variant="outline" className="text-xs">
                            {t("level")} {spell.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {spell.school ?? spell.sphere}
                          </Badge>
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          <ReactMarkdown>{spellDesc(spell)}</ReactMarkdown>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={loading}
                        onClick={() => handleLearnSpell(spell.id)}
                        className="ml-2 shrink-0"
                        data-testid={`learn-spell-${spell.id}`}
                      >
                        Erlernen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom spell creation */}
            <div className="border-t p-4">
              {!showCustomForm ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCustomForm(true)}
                  data-testid="create-custom-spell-button"
                >
                  Eigenen Zauber erstellen
                </Button>
              ) : (
                <div className="flex flex-col gap-3" data-testid="custom-spell-form">
                  <h3 className="font-heading text-sm">Eigenen Zauber erstellen</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs text-muted-foreground">Name</label>
                      <input
                        type="text"
                        value={customSpell.name}
                        onChange={(e) => setCustomSpell({ ...customSpell, name: e.target.value })}
                        className="w-full rounded-md border border-input bg-input p-2 text-sm"
                        data-testid="custom-spell-name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Stufe</label>
                      <select
                        value={customSpell.level}
                        onChange={(e) =>
                          setCustomSpell({ ...customSpell, level: Number(e.target.value) })
                        }
                        className="w-full rounded-md border border-input bg-input p-2 text-sm"
                        data-testid="custom-spell-level"
                      >
                        {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        {isWizard ? "Schule" : "Sph\u00e4re"}
                      </label>
                      <select
                        value={customSpell.schoolOrSphere}
                        onChange={(e) =>
                          setCustomSpell({ ...customSpell, schoolOrSphere: e.target.value })
                        }
                        className="w-full rounded-md border border-input bg-input p-2 text-sm capitalize"
                        data-testid="custom-spell-school-sphere"
                      >
                        <option value="">-- W&auml;hlen --</option>
                        {(isWizard ? WIZARD_SCHOOLS : PRIEST_SPHERES).map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Reichweite</label>
                      <input
                        type="text"
                        value={customSpell.range}
                        onChange={(e) => setCustomSpell({ ...customSpell, range: e.target.value })}
                        className="w-full rounded-md border border-input bg-input p-2 text-sm"
                        data-testid="custom-spell-range"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">Dauer</label>
                      <input
                        type="text"
                        value={customSpell.duration}
                        onChange={(e) =>
                          setCustomSpell({ ...customSpell, duration: e.target.value })
                        }
                        className="w-full rounded-md border border-input bg-input p-2 text-sm"
                        data-testid="custom-spell-duration"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Wirkungsbereich
                      </label>
                      <input
                        type="text"
                        value={customSpell.area_of_effect}
                        onChange={(e) =>
                          setCustomSpell({ ...customSpell, area_of_effect: e.target.value })
                        }
                        className="w-full rounded-md border border-input bg-input p-2 text-sm"
                        data-testid="custom-spell-area"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Komponenten
                      </label>
                      <div className="flex gap-4">
                        {(["V", "S", "M"] as const).map((comp) => (
                          <label key={comp} className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={customSpell.components[comp]}
                              onChange={(e) =>
                                setCustomSpell({
                                  ...customSpell,
                                  components: {
                                    ...customSpell.components,
                                    [comp]: e.target.checked,
                                  },
                                })
                              }
                              data-testid={`custom-spell-component-${comp}`}
                            />
                            {comp}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Beschreibung
                      </label>
                      <textarea
                        value={customSpell.description}
                        onChange={(e) =>
                          setCustomSpell({ ...customSpell, description: e.target.value })
                        }
                        rows={3}
                        className="w-full rounded-md border border-input bg-input p-2 text-sm"
                        data-testid="custom-spell-description"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCustomForm(false);
                        setCustomSpell(emptyCustomSpellForm);
                      }}
                      data-testid="custom-spell-cancel"
                    >
                      Abbrechen
                    </Button>
                    <Button
                      size="sm"
                      disabled={loading || !customSpell.name.trim()}
                      onClick={handleCreateCustomSpell}
                      data-testid="custom-spell-submit"
                    >
                      Erstellen &amp; Erlernen
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
