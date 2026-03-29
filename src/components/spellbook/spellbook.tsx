"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getWizardSpellSlots,
  getSpecialistBonusSlots,
  getPriestSpellSlots,
  getPriestBonusSlots,
  canLearnSpell,
} from "@/lib/rules/spellslots";
import { getClassGroup } from "@/lib/rules/classes";
import type { ClassId } from "@/lib/rules/types";
import type {
  CharacterRow,
  CharacterClassRow,
  CharacterSpellWithDetails,
  SpellRow,
} from "@/lib/supabase/types";
import { ResourceTracker } from "./resource-tracker";
import { SpellCard } from "./spell-card";

interface SpellbookProps {
  character: CharacterRow;
  characterClasses: CharacterClassRow[];
  userId: string;
  spells: CharacterSpellWithDetails[];
  allSpells: SpellRow[];
}

export function Spellbook({
  character,
  characterClasses,
  userId,
  spells,
  allSpells,
}: SpellbookProps) {
  const router = useRouter();
  const t = useTranslations("spellbook");
  const tSpells = useTranslations("spells");
  const locale = useLocale();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [learnDialogOpen, setLearnDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [preparedFilter, setPreparedFilter] = useState(false);
  const [learnSearchQuery, setLearnSearchQuery] = useState("");
  const [learnLevelFilter, setLearnLevelFilter] = useState<number | null>(null);

  const readOnly = character.user_id !== userId;

  // Determine caster class from characterClasses
  // Bard (classGroup "rogue") casts wizard spells from level 2
  const casterClass = useMemo(() => {
    for (const cc of characterClasses) {
      const group = getClassGroup(cc.class_id as ClassId);
      if (group === "wizard" || group === "priest") {
        return { classId: cc.class_id, classGroup: group, level: cc.level };
      }
      if (cc.class_id === "bard") {
        return { classId: cc.class_id, classGroup: "wizard" as const, level: cc.level };
      }
    }
    // Fallback to character.class_id
    if (character.class_id) {
      const group = getClassGroup(character.class_id as ClassId);
      if (group === "wizard" || group === "priest") {
        return { classId: character.class_id, classGroup: group, level: character.level };
      }
      if (character.class_id === "bard") {
        return {
          classId: character.class_id,
          classGroup: "wizard" as const,
          level: character.level,
        };
      }
    }
    return null;
  }, [characterClasses, character.class_id, character.level]);

  const isWizard = casterClass?.classGroup === "wizard";
  const isPriest = casterClass?.classGroup === "priest";
  const casterLevel = casterClass?.level ?? character.level;
  const classId = casterClass?.classId ?? character.class_id ?? "";
  const maxSpellLevel = isWizard ? 9 : 7;

  const spellName = useCallback(
    (spell: SpellRow) => (locale === "en" && spell.name_en ? spell.name_en : spell.name),
    [locale]
  );
  const spellDesc = useCallback(
    (spell: SpellRow) =>
      locale === "en" && spell.description_en ? spell.description_en : spell.description,
    [locale]
  );

  // Calculate total slots for prepare validation
  const baseSlots = useMemo(() => {
    if (isWizard) return getWizardSpellSlots(casterLevel);
    if (isPriest) return getPriestSpellSlots(casterLevel);
    return [];
  }, [isWizard, isPriest, casterLevel]);

  const bonusSlots = useMemo(() => {
    if (isPriest) return getPriestBonusSlots(character.wis);
    return new Array(maxSpellLevel).fill(0);
  }, [isPriest, character.wis, maxSpellLevel]);

  const specialistBonus = useMemo(() => {
    if (isWizard) return getSpecialistBonusSlots(classId as ClassId, casterLevel);
    return new Array(maxSpellLevel).fill(0);
  }, [isWizard, classId, casterLevel, maxSpellLevel]);

  const slotsAdj = (character.spell_slots_adj ?? {}) as Record<string, number>;
  const totalSlots = useMemo(
    () =>
      baseSlots.map(
        (base, i) =>
          base + (bonusSlots[i] ?? 0) + (specialistBonus[i] ?? 0) + (slotsAdj[String(i + 1)] ?? 0)
      ),
    [baseSlots, bonusSlots, specialistBonus, slotsAdj]
  );

  const preparedCountByLevel = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let l = 1; l <= maxSpellLevel; l++) {
      counts[l] = spells.filter((s) => s.prepared && s.spell.level === l).length;
    }
    return counts;
  }, [spells, maxSpellLevel]);

  // Filtered spells for the main list
  const filteredSpells = useMemo(() => {
    return spells.filter((s) => {
      if (levelFilter !== null && s.spell.level !== levelFilter) return false;
      if (preparedFilter && !s.prepared) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = spellName(s.spell).toLowerCase();
        const school = s.spell.school?.toLowerCase() ?? "";
        const sphere = s.spell.sphere?.toLowerCase() ?? "";
        if (!name.includes(q) && !school.includes(q) && !sphere.includes(q)) return false;
      }
      return true;
    });
  }, [spells, levelFilter, preparedFilter, searchQuery, spellName]);

  // Learnable spells — show all, never block (house rule: only warn)
  const learnableSpells = useMemo(() => {
    const knownIds = new Set(spells.map((s) => s.spell_id));
    return allSpells.filter((spell) => {
      if (knownIds.has(spell.id)) return false;
      if (isWizard && spell.spell_type !== "wizard") return false;
      if (isPriest && spell.spell_type !== "priest") return false;
      return true;
    });
  }, [allSpells, spells, isWizard, isPriest]);

  const filteredLearnableSpells = useMemo(() => {
    return learnableSpells.filter((s) => {
      if (learnLevelFilter !== null && s.level !== learnLevelFilter) return false;
      if (learnSearchQuery.trim()) {
        const q = learnSearchQuery.toLowerCase();
        const name = spellName(s).toLowerCase();
        if (
          !name.includes(q) &&
          !s.name.toLowerCase().includes(q) &&
          !(s.school && s.school.toLowerCase().includes(q)) &&
          !(s.sphere && s.sphere.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [learnableSpells, learnSearchQuery, learnLevelFilter, spellName]);

  // Available spell levels for filter chips
  const availableLevels = useMemo(() => {
    const levels = new Set(spells.map((s) => s.spell.level));
    return Array.from(levels).sort((a, b) => a - b);
  }, [spells]);

  async function handleTogglePrepared(spellId: string, currentlyPrepared: boolean) {
    const spell = spells.find((s) => s.spell_id === spellId);
    if (!spell) return;

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
      .eq("character_id", character.id)
      .eq("spell_id", spellId);
    setLoading(false);
    router.refresh();
  }

  async function handleLearnSpell(spellId: string) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("character_spells").insert({
      character_id: character.id,
      spell_id: spellId,
      prepared: false,
    });
    if (insertError) {
      console.error("Failed to learn spell:", insertError);
      setError(tSpells("learnSpellError"));
      setLoading(false);
      return;
    }
    setLoading(false);
    setLearnDialogOpen(false);
    setLearnSearchQuery("");
    setLearnLevelFilter(null);
    router.refresh();
  }

  async function handleRemoveSpell(spellId: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("character_spells")
      .delete()
      .eq("character_id", character.id)
      .eq("spell_id", spellId);
    setLoading(false);
    router.refresh();
  }

  if (!isWizard && !isPriest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-muted-foreground" data-testid="spellbook-no-magic">
          {tSpells("notACaster")}
        </p>
        <Link
          href={`/characters/${character.id}`}
          className="mt-4 text-sm text-primary underline"
          data-testid="spellbook-back-link"
        >
          {t("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" data-testid="spellbook">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/characters/${character.id}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              data-testid="spellbook-back-link"
              aria-label={t("back")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="font-heading text-lg uppercase tracking-wider">{t("title")}</h1>
          </div>
          {!readOnly && (
            <Button
              size="sm"
              className="min-h-[44px]"
              onClick={() => setLearnDialogOpen(true)}
              disabled={loading}
              data-testid="spellbook-learn-button"
            >
              {t("learnSpell")}
            </Button>
          )}
        </div>
      </header>

      {/* Sticky Resource Tracker */}
      <div className="sticky top-[57px] z-10 border-b border-border bg-background px-4 py-2">
        <div className="mx-auto max-w-3xl">
          <ResourceTracker
            isWizard={isWizard}
            isPriest={isPriest}
            level={casterLevel}
            wisScore={character.wis}
            spells={spells}
            maxSpellLevel={maxSpellLevel}
          />
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-[44px] w-full rounded-md border border-input bg-input px-3 py-2 text-sm"
            data-testid="spellbook-search"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Level filter chips */}
            <Badge
              variant={levelFilter === null ? "default" : "outline"}
              className="min-h-[32px] cursor-pointer px-3"
              onClick={() => setLevelFilter(null)}
              data-testid="spellbook-filter-all"
            >
              {t("filterAll")}
            </Badge>
            {availableLevels.map((lvl) => (
              <Badge
                key={lvl}
                variant={levelFilter === lvl ? "default" : "outline"}
                className="min-h-[32px] cursor-pointer px-3"
                onClick={() => setLevelFilter(levelFilter === lvl ? null : lvl)}
                data-testid={`spellbook-filter-level-${lvl}`}
              >
                L{lvl}
              </Badge>
            ))}

            {/* Separator */}
            <div className="mx-1 h-5 w-px bg-border" />

            {/* Prepared toggle */}
            <Badge
              variant={preparedFilter ? "default" : "outline"}
              className="min-h-[32px] cursor-pointer px-3"
              onClick={() => setPreparedFilter(!preparedFilter)}
              data-testid="spellbook-filter-prepared"
            >
              {t("filterPrepared")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Spell List */}
      <main className="flex-1 px-4 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          {filteredSpells.length === 0 && spells.length === 0 && (
            <div
              className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground"
              data-testid="spellbook-empty"
            >
              <p>{t("noSpells")}</p>
              {!readOnly && <p className="text-sm">{t("learnFirst")}</p>}
            </div>
          )}
          {filteredSpells.length === 0 && spells.length > 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">{t("noSpells")}</div>
          )}
          {filteredSpells.map((charSpell) => {
            const spellLevel = charSpell.spell.level;
            const available = totalSlots[spellLevel - 1] ?? 0;
            const prepared = preparedCountByLevel[spellLevel] ?? 0;
            const canPrepare = !charSpell.prepared && prepared < available;

            return (
              <SpellCard
                key={charSpell.spell_id}
                charSpell={charSpell}
                readOnly={readOnly}
                loading={loading}
                canPrepare={canPrepare}
                onTogglePrepared={handleTogglePrepared}
                onRemove={handleRemoveSpell}
              />
            );
          })}
        </div>
      </main>

      {/* Learn Spell Dialog */}
      {learnDialogOpen && !readOnly && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLearnDialogOpen(false);
              setLearnSearchQuery("");
              setLearnLevelFilter(null);
            }
          }}
          data-testid="spellbook-learn-dialog"
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-xl bg-card ring-1 ring-foreground/10 sm:mx-4 sm:rounded-xl">
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-heading text-lg">{t("learnDialogTitle")}</h2>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[44px] min-w-[44px]"
                onClick={() => {
                  setLearnDialogOpen(false);
                  setLearnSearchQuery("");
                  setLearnLevelFilter(null);
                }}
                data-testid="spellbook-learn-dialog-close"
              >
                {t("closeDialog")}
              </Button>
            </div>

            {/* Search + Filters */}
            <div className="border-b p-4">
              <input
                type="text"
                placeholder={t("learnSearch")}
                value={learnSearchQuery}
                onChange={(e) => setLearnSearchQuery(e.target.value)}
                className="min-h-[44px] w-full rounded-md border border-input bg-input px-3 py-2 text-sm"
                data-testid="spellbook-learn-search"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge
                  variant={learnLevelFilter === null ? "default" : "outline"}
                  className="min-h-[32px] cursor-pointer px-3"
                  onClick={() => setLearnLevelFilter(null)}
                  data-testid="spellbook-learn-filter-all"
                >
                  {t("filterAll")}
                </Badge>
                {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((n) => (
                  <Badge
                    key={n}
                    variant={learnLevelFilter === n ? "default" : "outline"}
                    className="min-h-[32px] cursor-pointer px-3"
                    onClick={() => setLearnLevelFilter(learnLevelFilter === n ? null : n)}
                    data-testid={`spellbook-learn-filter-level-${n}`}
                  >
                    L{n}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Learnable Spell List */}
            <div className="flex-1 overflow-y-auto p-4">
              {error && (
                <div
                  className="mb-3 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive"
                  data-testid="spellbook-learn-error"
                >
                  {error}
                </div>
              )}
              {filteredLearnableSpells.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  {t("noSpells")}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredLearnableSpells.map((spell) => (
                    <div
                      key={spell.id}
                      className="flex items-start justify-between rounded-md border border-border p-3"
                      data-testid={`spellbook-learnable-${spell.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{spellName(spell)}</span>
                          <Badge variant="outline" className="shrink-0 text-xs">
                            L{spell.level}
                          </Badge>
                          <Badge variant="outline" className="shrink-0 text-xs capitalize">
                            {spell.school ?? spell.sphere}
                          </Badge>
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          <ReactMarkdown>{spellDesc(spell)}</ReactMarkdown>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="ml-2 min-h-[44px] shrink-0"
                        disabled={loading}
                        onClick={() => handleLearnSpell(spell.id)}
                        data-testid={`spellbook-learn-${spell.id}`}
                      >
                        {t("learnButton")}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
