"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  getWeaponProficiencySlots,
  getNonweaponProficiencySlots,
  getNonproficiencyPenalty,
  canSpecialize,
} from "@/lib/rules/proficiencies";
import type { ClassGroup, ClassId } from "@/lib/rules/types";
import { RACES } from "@/lib/rules/races";
import { getIntelligenceModifiers } from "@/lib/rules/abilities";
import type {
  CharacterWeaponProficiencyRow,
  CharacterNWPWithDetails,
  NonweaponProficiencyRow,
  CharacterLanguageRow,
} from "@/lib/supabase/types";

const NWP_GROUP_FILTERS = [
  { key: "all", label: "Alle" },
  { key: "general", label: "Allgemein" },
  { key: "warrior", label: "Krieger" },
  { key: "priest", label: "Priester" },
  { key: "rogue", label: "Schurke" },
  { key: "wizard", label: "Magier" },
] as const;

const ABILITY_OPTIONS = [
  { value: "str", label: "STR" },
  { value: "dex", label: "DEX" },
  { value: "con", label: "CON" },
  { value: "int", label: "INT" },
  { value: "wis", label: "WIS" },
  { value: "cha", label: "CHA" },
] as const;

interface CustomNwpForm {
  name: string;
  ability: string;
  modifier: number;
  group_type: string;
  slots_required: number;
}

const emptyCustomNwpForm: CustomNwpForm = {
  name: "",
  ability: "int",
  modifier: 0,
  group_type: "general",
  slots_required: 1,
};

const LANGUAGE_SUGGESTIONS = [
  "Common",
  "Elfisch",
  "Zwergisch",
  "Gnomisch",
  "Halblingisch",
  "Orkisch",
  "Goblinisch",
  "Koboldisch",
  "Ogerhaft",
  "Riesisch",
  "Drachisch",
  "Sylvanisch",
  "Abyssal",
  "Infernal",
  "Celestisch",
];

interface TabProficienciesProps {
  characterId: string;
  userId: string;
  classId: string;
  classGroup: string;
  level: number;
  intScore: number;
  raceId: string;
  weaponProficiencies: CharacterWeaponProficiencyRow[];
  nonweaponProficiencies: CharacterNWPWithDetails[];
  allNonweaponProficiencies: NonweaponProficiencyRow[];
  languages: CharacterLanguageRow[];
}

export function TabProficiencies({
  characterId,
  userId,
  classId,
  classGroup,
  level,
  intScore,
  raceId,
  weaponProficiencies,
  nonweaponProficiencies,
  allNonweaponProficiencies,
  languages,
}: TabProficienciesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newWeaponName, setNewWeaponName] = useState("");
  const [newWeaponSpecialized, setNewWeaponSpecialized] = useState(false);
  const [nwpSearchQuery, setNwpSearchQuery] = useState("");
  const [nwpGroupFilter, setNwpGroupFilter] = useState<string>("all");
  const [showCustomNwpForm, setShowCustomNwpForm] = useState(false);
  const [customNwp, setCustomNwp] = useState<CustomNwpForm>(emptyCustomNwpForm);
  const [newLanguage, setNewLanguage] = useState("");

  const group = classGroup as ClassGroup;
  const weaponSlots = getWeaponProficiencySlots(group, level);
  const nwpSlots = getNonweaponProficiencySlots(group, level, intScore);
  const penalty = getNonproficiencyPenalty(group);
  const showSpecialization = canSpecialize(classId as ClassId);

  const usedWeaponSlots = weaponProficiencies.reduce(
    (sum, wp) => sum + (wp.specialization ? 2 : 1),
    0
  );

  const usedNwpSlots = nonweaponProficiencies.reduce(
    (sum, nwp) => sum + nwp.proficiency.slots_required,
    0
  );

  // Filter NWPs: general group is always accessible, plus the character's class group
  const accessibleGroups = ["general", classGroup];
  const availableNwps = useMemo(() => {
    return allNonweaponProficiencies.filter(
      (nwp) =>
        accessibleGroups.includes(nwp.group_type) &&
        !nonweaponProficiencies.some((existing) => existing.proficiency_id === nwp.id)
    );
  }, [allNonweaponProficiencies, nonweaponProficiencies, accessibleGroups]);

  // Filtered NWPs by search query and group filter
  const filteredAvailableNwps = useMemo(() => {
    return availableNwps.filter((nwp) => {
      // Group filter
      if (nwpGroupFilter !== "all" && nwp.group_type !== nwpGroupFilter) return false;
      // Text search
      if (nwpSearchQuery.trim()) {
        const q = nwpSearchQuery.toLowerCase();
        if (!nwp.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [availableNwps, nwpSearchQuery, nwpGroupFilter]);

  async function addWeaponProficiency() {
    const trimmed = newWeaponName.trim();
    if (!trimmed) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("character_weapon_proficiencies").insert({
      character_id: characterId,
      weapon_name: trimmed,
      specialization: newWeaponSpecialized,
    });
    if (error) {
      console.error("Failed to add weapon proficiency:", error);
      setLoading(false);
      return;
    }
    setNewWeaponName("");
    setNewWeaponSpecialized(false);
    setLoading(false);
    router.refresh();
  }

  async function removeWeaponProficiency(id: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_weapon_proficiencies").delete().eq("id", id);
    setLoading(false);
    router.refresh();
  }

  async function toggleSpecialization(wp: CharacterWeaponProficiencyRow) {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("character_weapon_proficiencies")
      .update({ specialization: !wp.specialization })
      .eq("id", wp.id);
    setLoading(false);
    router.refresh();
  }

  async function addNonweaponProficiency(nwpId: string) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("character_nonweapon_proficiencies").insert({
      character_id: characterId,
      proficiency_id: nwpId,
    });
    if (error) {
      console.error("Failed to add NWP:", error);
    }
    setLoading(false);
    router.refresh();
  }

  async function removeNonweaponProficiency(id: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_nonweapon_proficiencies").delete().eq("id", id);
    setLoading(false);
    router.refresh();
  }

  async function createCustomNwp() {
    const trimmed = customNwp.name.trim();
    if (!trimmed) return;

    setLoading(true);
    const supabase = createClient();

    // Insert custom NWP into nonweapon_proficiencies table
    const { data: newNwp } = await supabase
      .from("nonweapon_proficiencies")
      .insert({
        name: trimmed,
        ability: customNwp.ability,
        modifier: customNwp.modifier,
        group_type: customNwp.group_type,
        slots_required: customNwp.slots_required,
        is_custom: true,
        created_by: userId,
      })
      .select("id")
      .single();

    if (newNwp) {
      // Also add it to the character
      await supabase.from("character_nonweapon_proficiencies").insert({
        character_id: characterId,
        proficiency_id: newNwp.id,
      });
    }

    setCustomNwp(emptyCustomNwpForm);
    setShowCustomNwpForm(false);
    setLoading(false);
    router.refresh();
  }

  const raceData = RACES[raceId as keyof typeof RACES];
  const defaultLanguages = raceData?.defaultLanguages ?? [];
  const maxLanguages = getIntelligenceModifiers(intScore).numberOfLanguages;
  const allLanguageNames = [...defaultLanguages, ...languages.map((l) => l.language_name)];
  const availableSuggestions = LANGUAGE_SUGGESTIONS.filter(
    (lang) => !allLanguageNames.includes(lang)
  );

  async function addLanguage(languageName: string) {
    const trimmed = languageName.trim();
    if (!trimmed) return;
    if (allLanguageNames.includes(trimmed)) return;

    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_languages").insert({
      character_id: characterId,
      language_name: trimmed,
    });
    setNewLanguage("");
    setLoading(false);
    router.refresh();
  }

  async function removeLanguage(id: string) {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("character_languages").delete().eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6" data-testid="tab-proficiencies">
      {/* Weapon Proficiencies */}
      <div data-testid="weapon-proficiencies-section">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg">Waffenfertigkeiten</h3>
          <Badge variant="outline" data-testid="weapon-slots-counter">
            {usedWeaponSlots}/{weaponSlots} Slots verwendet
          </Badge>
        </div>

        <p className="mb-3 text-sm text-muted-foreground" data-testid="nonproficiency-penalty">
          Malus bei ungeübter Waffe: {penalty}
        </p>

        {/* Weapon list */}
        {weaponProficiencies.length > 0 && (
          <div className="mb-4 flex flex-col gap-2" data-testid="weapon-proficiency-list">
            {weaponProficiencies.map((wp) => (
              <div
                key={wp.id}
                className="flex items-center justify-between rounded-md border border-border p-2"
                data-testid={`weapon-proficiency-${wp.id}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{wp.weapon_name}</span>
                  {wp.specialization && (
                    <Badge data-testid={`weapon-specialized-${wp.id}`}>Spezialisiert</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {showSpecialization && (
                    <label className="flex items-center gap-1 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={wp.specialization}
                        onChange={() => toggleSpecialization(wp)}
                        disabled={loading}
                        data-testid={`weapon-specialization-toggle-${wp.id}`}
                      />
                      Spezialisierung
                    </label>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWeaponProficiency(wp.id)}
                    disabled={loading}
                    data-testid={`weapon-remove-${wp.id}`}
                  >
                    Entfernen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add weapon */}
        {usedWeaponSlots < weaponSlots && (
          <div className="flex items-center gap-2" data-testid="add-weapon-proficiency">
            <Input
              placeholder="Waffenname eingeben..."
              value={newWeaponName}
              onChange={(e) => setNewWeaponName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addWeaponProficiency();
              }}
              className="flex-1"
              data-testid="weapon-name-input"
            />
            {showSpecialization && (
              <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={newWeaponSpecialized}
                  onChange={(e) => setNewWeaponSpecialized(e.target.checked)}
                  data-testid="weapon-specialization-checkbox"
                />
                Spezialisierung
              </label>
            )}
            <Button
              onClick={addWeaponProficiency}
              disabled={loading || !newWeaponName.trim()}
              data-testid="weapon-add-button"
            >
              Hinzufügen
            </Button>
          </div>
        )}
      </div>

      {/* Non-Weapon Proficiencies */}
      <div data-testid="nwp-section">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg">Allgemeine Fertigkeiten</h3>
          <Badge variant="outline" data-testid="nwp-slots-counter">
            {usedNwpSlots}/{nwpSlots} Slots verwendet
          </Badge>
        </div>

        {/* NWP list */}
        {nonweaponProficiencies.length > 0 && (
          <div className="mb-4 flex flex-col gap-2" data-testid="nwp-list">
            {nonweaponProficiencies.map((nwp) => {
              const abilityTarget = intScore + nwp.proficiency.modifier;
              return (
                <div
                  key={nwp.id}
                  className="flex items-center justify-between rounded-md border border-border p-2"
                  data-testid={`nwp-${nwp.id}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{nwp.proficiency.name}</span>
                    <Badge variant="outline" data-testid={`nwp-ability-${nwp.id}`}>
                      {nwp.proficiency.ability}{" "}
                      {nwp.proficiency.modifier >= 0
                        ? `+${nwp.proficiency.modifier}`
                        : nwp.proficiency.modifier}
                    </Badge>
                    <span
                      className="text-xs text-muted-foreground"
                      data-testid={`nwp-check-${nwp.id}`}
                    >
                      Probe: {abilityTarget}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNonweaponProficiency(nwp.id)}
                    disabled={loading}
                    data-testid={`nwp-remove-${nwp.id}`}
                  >
                    Entfernen
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add NWP - searchable list */}
        {usedNwpSlots < nwpSlots && (
          <div data-testid="add-nwp">
            {/* Search input */}
            <input
              type="text"
              placeholder="Fertigkeit suchen..."
              value={nwpSearchQuery}
              onChange={(e) => setNwpSearchQuery(e.target.value)}
              className="mb-3 w-full rounded-md border border-input bg-input p-2 text-sm"
              data-testid="nwp-search"
            />

            {/* Group filter buttons */}
            <div className="mb-3 flex flex-wrap gap-2">
              {NWP_GROUP_FILTERS.map((f) => (
                <Button
                  key={f.key}
                  variant={nwpGroupFilter === f.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNwpGroupFilter(f.key)}
                  data-testid={`nwp-filter-${f.key}`}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* Scrollable NWP list */}
            <div className="max-h-64 overflow-y-auto rounded-md border border-border">
              {filteredAvailableNwps.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Keine passenden Fertigkeiten gefunden.
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  {filteredAvailableNwps.map((nwp) => (
                    <div
                      key={nwp.id}
                      className="flex items-center justify-between border-b border-border p-3 last:border-b-0"
                      data-testid={`nwp-option-${nwp.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{nwp.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {nwp.ability} {nwp.modifier >= 0 ? `+${nwp.modifier}` : nwp.modifier}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {nwp.slots_required} {nwp.slots_required === 1 ? "Slot" : "Slots"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        disabled={loading}
                        onClick={() => addNonweaponProficiency(nwp.id)}
                        data-testid={`nwp-add-${nwp.id}`}
                      >
                        Hinzufügen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom NWP creation */}
            <div className="mt-4">
              {!showCustomNwpForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCustomNwpForm(true)}
                  data-testid="nwp-custom-create-button"
                >
                  Eigene Fertigkeit erstellen
                </Button>
              ) : (
                <div className="rounded-md border border-border p-4" data-testid="nwp-custom-form">
                  <h4 className="mb-3 font-heading text-sm">Eigene Fertigkeit erstellen</h4>
                  <div className="flex flex-col gap-3">
                    <Input
                      placeholder="Name der Fertigkeit"
                      value={customNwp.name}
                      onChange={(e) => setCustomNwp((prev) => ({ ...prev, name: e.target.value }))}
                      data-testid="nwp-custom-name"
                    />
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Attribut</label>
                        <select
                          value={customNwp.ability}
                          onChange={(e) =>
                            setCustomNwp((prev) => ({ ...prev, ability: e.target.value }))
                          }
                          className="w-full rounded-md border border-input bg-input p-2 text-sm"
                          data-testid="nwp-custom-ability"
                        >
                          {ABILITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">
                          Modifikator
                        </label>
                        <Input
                          type="number"
                          value={customNwp.modifier}
                          onChange={(e) =>
                            setCustomNwp((prev) => ({
                              ...prev,
                              modifier: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                          data-testid="nwp-custom-modifier"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Gruppe</label>
                        <select
                          value={customNwp.group_type}
                          onChange={(e) =>
                            setCustomNwp((prev) => ({ ...prev, group_type: e.target.value }))
                          }
                          className="w-full rounded-md border border-input bg-input p-2 text-sm"
                          data-testid="nwp-custom-group"
                        >
                          <option value="general">Allgemein</option>
                          <option value="warrior">Krieger</option>
                          <option value="priest">Priester</option>
                          <option value="rogue">Schurke</option>
                          <option value="wizard">Magier</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-muted-foreground">Slots</label>
                        <Input
                          type="number"
                          min={1}
                          value={customNwp.slots_required}
                          onChange={(e) =>
                            setCustomNwp((prev) => ({
                              ...prev,
                              slots_required: Math.max(1, parseInt(e.target.value, 10) || 1),
                            }))
                          }
                          data-testid="nwp-custom-slots"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={createCustomNwp}
                        disabled={loading || !customNwp.name.trim()}
                        data-testid="nwp-custom-submit"
                      >
                        Erstellen & Hinzufügen
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowCustomNwpForm(false);
                          setCustomNwp(emptyCustomNwpForm);
                        }}
                        data-testid="nwp-custom-cancel"
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Languages */}
      <div data-testid="languages-section">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-heading text-lg">Sprachen</h3>
          <Badge variant="outline" data-testid="languages-counter">
            {allLanguageNames.length}/{defaultLanguages.length + maxLanguages} Sprachen
          </Badge>
        </div>

        <p className="mb-3 text-sm text-muted-foreground" data-testid="languages-max-info">
          Zusätzliche Sprachen durch Intelligenz: {maxLanguages}
        </p>

        {/* Language list */}
        {allLanguageNames.length > 0 && (
          <div className="mb-4 flex flex-col gap-2" data-testid="language-list">
            {/* Default race languages */}
            {defaultLanguages.map((lang) => (
              <div
                key={`default-${lang}`}
                className="flex items-center justify-between rounded-md border border-border p-2"
                data-testid={`language-${lang}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{lang}</span>
                  <Badge variant="secondary" data-testid={`language-race-badge-${lang}`}>
                    (Rassensprache)
                  </Badge>
                </div>
              </div>
            ))}

            {/* Character-added languages */}
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center justify-between rounded-md border border-border p-2"
                data-testid={`language-${lang.language_name}`}
              >
                <span className="text-sm font-medium">{lang.language_name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang.id)}
                  disabled={loading}
                  data-testid={`language-remove-${lang.language_name}`}
                >
                  Entfernen
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add language */}
        {languages.length < maxLanguages && (
          <div data-testid="add-language">
            <div className="mb-3 flex items-center gap-2">
              <Input
                placeholder="Sprache eingeben..."
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addLanguage(newLanguage);
                }}
                className="flex-1"
                data-testid="language-name-input"
              />
              <Button
                onClick={() => addLanguage(newLanguage)}
                disabled={loading || !newLanguage.trim()}
                data-testid="language-add-button"
              >
                Hinzufügen
              </Button>
            </div>

            {/* Suggested languages */}
            {availableSuggestions.length > 0 && (
              <div data-testid="language-suggestions">
                <p className="mb-2 text-xs text-muted-foreground">Vorschläge:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((lang) => (
                    <Button
                      key={lang}
                      variant="outline"
                      size="sm"
                      onClick={() => addLanguage(lang)}
                      disabled={loading}
                      data-testid={`language-suggest-${lang}`}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
