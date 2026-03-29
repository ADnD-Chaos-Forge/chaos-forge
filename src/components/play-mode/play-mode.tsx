"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { PlayHpBar } from "./play-hp-bar";
import { PlayCombatPanel } from "./play-combat-panel";
import { PlaySpellbookPanel } from "./play-spellbook-panel";
import { PlayChecksPanel } from "./play-checks-panel";
import { PlayInventoryPanel } from "./play-inventory-panel";
import { PlayCoinPursePanel } from "./play-coin-purse-panel";
import {
  getMulticlassThac0,
  getMulticlassSaves,
  getMulticlassGroups,
} from "@/lib/rules/multiclass";
import type { ClassId } from "@/lib/rules/types";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
} from "@/lib/rules/abilities";
import { calculateAC, calculateEncumbrance, getMovementRate } from "@/lib/rules/equipment";
import { hasThiefSkills, getBackstabMultiplier } from "@/lib/rules/thief";
import { getClassGroupColors } from "@/lib/utils/class-colors";
import type {
  CharacterRow,
  CharacterClassRow,
  CharacterEquipmentWithDetails,
  CharacterSpellWithDetails,
  CharacterWeaponProficiencyRow,
  CharacterNWPWithDetails,
  CharacterInventoryWithDetails,
} from "@/lib/supabase/types";
import type { CoinPurse } from "@/lib/rules/equipment";

// Icons as simple SVG components
function SwordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275z" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function BackpackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M9 6V4a3 3 0 0 1 6 0v2" />
      <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
    </svg>
  );
}

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
    </svg>
  );
}

type PanelId = "combat" | "spellbook" | "checks" | "inventory" | "coinPurse";

interface PlayModeProps {
  character: CharacterRow;
  characterClasses: CharacterClassRow[];
  userId: string;
  equipment: CharacterEquipmentWithDetails[];
  spells: CharacterSpellWithDetails[];
  weaponProficiencies: CharacterWeaponProficiencyRow[];
  nonweaponProficiencies: CharacterNWPWithDetails[];
  inventory: CharacterInventoryWithDetails[];
}

export function PlayMode({
  character: initialCharacter,
  characterClasses,
  userId,
  equipment: initialEquipment,
  spells: initialSpells,
  weaponProficiencies,
  nonweaponProficiencies,
  inventory: initialInventory,
}: PlayModeProps) {
  const t = useTranslations("playMode");
  const [character, setCharacter] = useState(initialCharacter);
  const [spells, setSpells] = useState(initialSpells);
  const [inventory, setInventory] = useState(initialInventory);
  const [activePanel, setActivePanel] = useState<PanelId>("combat");

  const isOwner = character.user_id === userId;

  // Derived rules engine values
  const activeClasses = useMemo(
    () => characterClasses.filter((cc) => cc.is_active),
    [characterClasses]
  );
  const classEntries = useMemo(
    () => activeClasses.map((cc) => ({ classId: cc.class_id as ClassId, level: cc.level })),
    [activeClasses]
  );
  const classIds = useMemo(
    () => activeClasses.map((cc) => cc.class_id as ClassId),
    [activeClasses]
  );
  const classGroups = useMemo(() => getMulticlassGroups(classIds), [classIds]);
  const primaryGroup = classGroups[0] ?? "warrior";

  const thac0 = useMemo(() => getMulticlassThac0(classEntries), [classEntries]);
  const saves = useMemo(() => getMulticlassSaves(classEntries), [classEntries]);

  const strMods = useMemo(
    () =>
      getStrengthModifiers(
        character.str,
        character.str_exceptional ?? undefined,
        character.str_muscle ?? undefined,
        character.str_stamina ?? undefined
      ),
    [character.str, character.str_exceptional, character.str_muscle, character.str_stamina]
  );
  const dexMods = useMemo(
    () =>
      getDexterityModifiers(
        character.dex,
        character.dex_aim ?? undefined,
        character.dex_balance ?? undefined
      ),
    [character.dex, character.dex_aim, character.dex_balance]
  );
  const conMods = useMemo(
    () =>
      getConstitutionModifiers(
        character.con,
        character.con_health ?? undefined,
        character.con_fitness ?? undefined
      ),
    [character.con, character.con_health, character.con_fitness]
  );
  const intMods = useMemo(
    () =>
      getIntelligenceModifiers(
        character.int,
        character.int_knowledge ?? undefined,
        character.int_reason ?? undefined
      ),
    [character.int, character.int_knowledge, character.int_reason]
  );
  const wisMods = useMemo(
    () =>
      getWisdomModifiers(
        character.wis,
        character.wis_intuition ?? undefined,
        character.wis_willpower ?? undefined
      ),
    [character.wis, character.wis_intuition, character.wis_willpower]
  );
  const chaMods = useMemo(
    () =>
      getCharismaModifiers(
        character.cha,
        character.cha_leadership ?? undefined,
        character.cha_appearance ?? undefined
      ),
    [character.cha, character.cha_leadership, character.cha_appearance]
  );

  // Equipment calculations
  const equippedArmor = useMemo(
    () => initialEquipment.find((e) => e.equipped && e.armor),
    [initialEquipment]
  );
  const equippedShield = useMemo(
    () => initialEquipment.some((e) => e.equipped && e.armor && e.armor.ac >= 8),
    [initialEquipment]
  );
  const totalWeight = useMemo(() => {
    const eqWeight = initialEquipment.reduce((sum, e) => {
      const w = e.weapon?.weight ?? e.armor?.weight ?? 0;
      return sum + w * e.quantity;
    }, 0);
    const invWeight = inventory.reduce((sum, i) => {
      const w = i.item?.weight ?? 0;
      return sum + w * i.quantity;
    }, 0);
    return eqWeight + invWeight;
  }, [initialEquipment, inventory]);
  const encumbranceLevel = useMemo(
    () => calculateEncumbrance(totalWeight, strMods.weightAllow),
    [totalWeight, strMods.weightAllow]
  );
  const movementRate = useMemo(
    () => getMovementRate(12, character.ignore_encumbrance ? "unencumbered" : encumbranceLevel),
    [encumbranceLevel, character.ignore_encumbrance]
  );

  const isMagicalProtection = equippedArmor?.armor?.is_magical_protection ?? false;

  const ac = useMemo(
    () =>
      calculateAC({
        equippedArmorAC: equippedArmor?.armor?.ac ?? null,
        shieldEquipped: equippedShield,
        dexDefenseAdj: dexMods.defensiveAdj,
        classGroups,
        encumbrance: encumbranceLevel,
        ignoreEncumbrance: character.ignore_encumbrance,
        isMagicalProtection,
      }),
    [
      equippedArmor,
      equippedShield,
      dexMods.defensiveAdj,
      classGroups,
      encumbranceLevel,
      character.ignore_encumbrance,
      isMagicalProtection,
    ]
  );

  const showSpells = useMemo(
    () => classGroups.some((g) => g === "wizard" || g === "priest") || classIds.includes("bard"),
    [classGroups, classIds]
  );
  const showThiefSkills = useMemo(() => hasThiefSkills(classIds), [classIds]);
  const backstabMultiplier = useMemo(() => {
    if (!showThiefSkills) return null;
    const thiefClass = activeClasses.find(
      (cc) => cc.class_id === "thief" || cc.class_id === "bard"
    );
    return thiefClass ? getBackstabMultiplier(thiefClass.level) : null;
  }, [showThiefSkills, activeClasses]);

  const colors = getClassGroupColors(primaryGroup);

  // Coin purse
  const coinPurse: CoinPurse = useMemo(
    () => ({
      pp: character.gold_pp,
      gp: character.gold_gp,
      ep: character.gold_ep,
      sp: character.gold_sp,
      cp: character.gold_cp,
    }),
    [character.gold_pp, character.gold_gp, character.gold_ep, character.gold_sp, character.gold_cp]
  );

  // Instant DB write helper
  const updateCharacter = useCallback(
    async (updates: Partial<CharacterRow>) => {
      setCharacter((prev) => ({ ...prev, ...updates }));
      const supabase = createClient();
      const { error } = await supabase.from("characters").update(updates).eq("id", character.id);
      if (error) console.error("Failed to update character:", error);
    },
    [character.id]
  );

  function handleHpChange(newHp: number) {
    updateCharacter({ hp_current: newHp });
  }

  function handleCoinChange(newPurse: CoinPurse) {
    updateCharacter({
      gold_pp: newPurse.pp,
      gold_gp: newPurse.gp,
      gold_ep: newPurse.ep,
      gold_sp: newPurse.sp,
      gold_cp: newPurse.cp,
    });
  }

  async function handleCastSpell(spellId: string, pointsCost: number) {
    if (character.spell_system === "points") {
      const newUsed = character.spell_points_used + pointsCost;
      updateCharacter({ spell_points_used: newUsed });
    } else {
      // Slots mode: mark first non-expended instance as expended
      let marked = false;
      setSpells((prev) =>
        prev.map((s) => {
          if (!marked && s.spell_id === spellId && s.prepared && !s.expended) {
            marked = true;
            return { ...s, expended: true };
          }
          return s;
        })
      );
      const supabase = createClient();
      // Only mark one row — use prepared=true and expended=false filter with limit
      const { error } = await supabase
        .from("character_spells")
        .update({ expended: true })
        .eq("character_id", character.id)
        .eq("spell_id", spellId)
        .eq("prepared", true)
        .eq("expended", false);
      if (error) console.error("Failed to mark spell as expended:", error);
    }
  }

  async function handleRest() {
    if (character.spell_system === "points") {
      updateCharacter({ spell_points_used: 0 });
    } else {
      setSpells((prev) => prev.map((s) => (s.prepared ? { ...s, expended: false } : s)));
      const supabase = createClient();
      const { error } = await supabase
        .from("character_spells")
        .update({ expended: false })
        .eq("character_id", character.id)
        .eq("prepared", true);
      if (error) console.error("Failed to reset spell slots:", error);
    }
  }

  const panels: { id: PanelId; label: string; icon: React.ReactNode; show: boolean }[] = [
    { id: "combat", label: t("combat"), icon: <SwordIcon className="h-4 w-4" />, show: true },
    {
      id: "spellbook",
      label: t("spellbook"),
      icon: <SparklesIcon className="h-4 w-4" />,
      show: showSpells,
    },
    { id: "checks", label: t("checks"), icon: <TargetIcon className="h-4 w-4" />, show: true },
    {
      id: "inventory",
      label: t("inventory"),
      icon: <BackpackIcon className="h-4 w-4" />,
      show: true,
    },
    { id: "coinPurse", label: t("coinPurse"), icon: <CoinsIcon className="h-4 w-4" />, show: true },
  ];

  const visiblePanels = panels.filter((p) => p.show);

  return (
    <div className="mx-auto w-full max-w-6xl" data-testid="play-mode">
      <PlayHpBar
        characterId={character.id}
        name={character.name}
        avatarUrl={character.avatar_url}
        hpCurrent={character.hp_current}
        hpMax={character.hp_max}
        ac={ac}
        thac0={thac0}
        classGroup={primaryGroup}
        onHpChange={handleHpChange}
      />

      {/* Mobile: Pill navigation */}
      <div
        className="sticky top-[72px] z-20 flex flex-wrap justify-center gap-1 bg-background/80 px-2 py-2 backdrop-blur-sm sm:hidden"
        data-testid="play-panel-nav"
      >
        {visiblePanels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activePanel === panel.id
                ? `${colors.badge}`
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
            data-testid={`play-nav-${panel.id}`}
          >
            {panel.icon}
            {panel.label}
          </button>
        ))}
      </div>

      {/* Desktop: All panels visible in 2-column grid */}
      <div className="hidden gap-4 p-4 sm:grid sm:grid-cols-[1fr_1fr] lg:grid-cols-[55%_45%]">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <PlayCombatPanel
            equipment={initialEquipment}
            weaponProficiencies={weaponProficiencies}
            thac0={thac0}
            strMods={strMods}
            dexMods={dexMods}
            classGroups={classGroups}
            classEntries={classEntries}
            equippedArmor={equippedArmor ?? null}
            equippedShield={equippedShield}
            dexDefenseAdj={dexMods.defensiveAdj}
            ac={ac}
            encumbrance={encumbranceLevel}
            movementRate={movementRate}
            backstabMultiplier={backstabMultiplier}
            ignoreEncumbrance={character.ignore_encumbrance}
            isMagicalProtection={isMagicalProtection}
          />
          {showSpells && (
            <PlaySpellbookPanel
              spells={spells}
              character={character}
              classGroups={classGroups}
              classEntries={classEntries}
              wisScore={character.wis}
              readOnly={!isOwner}
              onCast={handleCastSpell}
              onRest={handleRest}
            />
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <PlayChecksPanel
            saves={saves}
            character={character}
            strMods={strMods}
            dexMods={dexMods}
            conMods={conMods}
            intMods={intMods}
            wisMods={wisMods}
            chaMods={chaMods}
            showThiefSkills={showThiefSkills}
            nonweaponProficiencies={nonweaponProficiencies}
          />
          <PlayCoinPursePanel
            characterId={character.id}
            coinPurse={coinPurse}
            readOnly={!isOwner}
            onCoinChange={handleCoinChange}
          />
          <PlayInventoryPanel
            characterId={character.id}
            inventory={inventory}
            totalWeight={totalWeight}
            encumbrance={encumbranceLevel}
            readOnly={!isOwner}
            onInventoryChange={setInventory}
          />
        </div>
      </div>

      {/* Mobile: Single panel view */}
      <div className="p-3 sm:hidden">
        {activePanel === "combat" && (
          <PlayCombatPanel
            equipment={initialEquipment}
            weaponProficiencies={weaponProficiencies}
            thac0={thac0}
            strMods={strMods}
            dexMods={dexMods}
            classGroups={classGroups}
            classEntries={classEntries}
            equippedArmor={equippedArmor ?? null}
            equippedShield={equippedShield}
            dexDefenseAdj={dexMods.defensiveAdj}
            ac={ac}
            encumbrance={encumbranceLevel}
            movementRate={movementRate}
            backstabMultiplier={backstabMultiplier}
            ignoreEncumbrance={character.ignore_encumbrance}
            isMagicalProtection={isMagicalProtection}
          />
        )}
        {activePanel === "spellbook" && showSpells && (
          <PlaySpellbookPanel
            spells={spells}
            character={character}
            classGroups={classGroups}
            classEntries={classEntries}
            wisScore={character.wis}
            readOnly={!isOwner}
            onCast={handleCastSpell}
            onRest={handleRest}
          />
        )}
        {activePanel === "checks" && (
          <PlayChecksPanel
            saves={saves}
            character={character}
            strMods={strMods}
            dexMods={dexMods}
            conMods={conMods}
            intMods={intMods}
            wisMods={wisMods}
            chaMods={chaMods}
            showThiefSkills={showThiefSkills}
            nonweaponProficiencies={nonweaponProficiencies}
          />
        )}
        {activePanel === "inventory" && (
          <PlayInventoryPanel
            characterId={character.id}
            inventory={inventory}
            totalWeight={totalWeight}
            encumbrance={encumbranceLevel}
            readOnly={!isOwner}
            onInventoryChange={setInventory}
          />
        )}
        {activePanel === "coinPurse" && (
          <PlayCoinPursePanel
            characterId={character.id}
            coinPurse={coinPurse}
            readOnly={!isOwner}
            onCoinChange={handleCoinChange}
          />
        )}
      </div>
    </div>
  );
}
