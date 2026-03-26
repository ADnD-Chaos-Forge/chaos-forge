"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
import { getAlignmentLabel } from "@/lib/rules/alignment";
import { getXpForNextLevel } from "@/lib/rules/experience";
import type { ClassId } from "@/lib/rules/types";
import { getMulticlassThac0, getMulticlassSaves } from "@/lib/rules/multiclass";
import { getAttacksPerRound } from "@/lib/rules/combat";
import { hasThiefSkills, getBackstabMultiplier } from "@/lib/rules/thief";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
} from "@/lib/rules/abilities";
import type { CharacterRow, CharacterClassRow } from "@/lib/supabase/types";

interface PrintSheetProps {
  character: CharacterRow;
  characterClasses: CharacterClassRow[];
}

export function PrintSheet({ character, characterClasses }: PrintSheetProps) {
  const t = useTranslations("print");
  const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;

  const activeClasses = characterClasses.filter((cc) => cc.is_active);
  const classEntries = activeClasses.map((cc) => ({
    classId: cc.class_id as ClassId,
    level: cc.level,
  }));
  const classNames = activeClasses
    .map((cc) => CLASSES[cc.class_id as ClassId]?.name ?? cc.class_id)
    .join(" / ");
  const levelDisplay = activeClasses.map((cc) => cc.level).join("/");
  const hitDice = activeClasses
    .map((cc) => {
      const def = CLASSES[cc.class_id as ClassId];
      return def ? `d${def.hitDie}` : "—";
    })
    .join("/");

  const thac0 = classEntries.length > 0 ? getMulticlassThac0(classEntries) : 20;
  const saves = classEntries.length > 0 ? getMulticlassSaves(classEntries) : null;
  const strMods = getStrengthModifiers(character.str, character.str_exceptional ?? undefined);
  const dexMods = getDexterityModifiers(character.dex);
  const conMods = getConstitutionModifiers(character.con);
  const intMods = getIntelligenceModifiers(character.int);
  const wisMods = getWisdomModifiers(character.wis);
  const chaMods = getCharismaModifiers(character.cha);
  const baseAC = 10 + dexMods.defensiveAdj;

  const strDisplay =
    character.str === 18 && character.str_exceptional
      ? `18/${character.str_exceptional === 100 ? "00" : String(character.str_exceptional).padStart(2, "0")}`
      : String(character.str);

  const attacksDisplay =
    classEntries.length > 0
      ? classEntries
          .map((ce) => getAttacksPerRound(CLASSES[ce.classId]?.group ?? "warrior", ce.level))
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(" / ")
      : "1";

  return (
    <>
      <div className="flex justify-center gap-4 p-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-gray-800 px-6 py-2 text-white hover:bg-gray-700"
          data-testid="print-trigger-button"
        >
          {t("print")}
        </button>
        <button
          onClick={() => window.history.back()}
          className="rounded border border-gray-400 px-6 py-2 hover:bg-gray-100"
        >
          {t("back")}
        </button>
      </div>

      <div
        className="mx-auto max-w-[210mm] bg-white p-6 text-black print:m-0 print:max-w-none print:p-4"
        data-testid="print-sheet"
      >
        {/* ── Personal Information ──────────────────────────────── */}
        <section className="mb-4 border-b-2 border-black pb-3" data-testid="print-section-personal">
          <div className="flex items-start gap-4">
            {character.avatar_url && (
              <Image
                src={character.avatar_url}
                alt={character.name}
                width={72}
                height={72}
                className="rounded border border-gray-300 object-cover"
                style={{ width: 72, height: 72 }}
              />
            )}
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold">{character.name}</h1>
              <div className="mt-1 grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="font-semibold">{t("race")}:</span> {race?.name ?? "—"}
                </div>
                <div>
                  <span className="font-semibold">{t("class")}:</span> {classNames || "—"}
                </div>
                <div>
                  <span className="font-semibold">{t("level")}:</span>{" "}
                  {levelDisplay || character.level}
                </div>
                <div>
                  <span className="font-semibold">{t("hitDie")}:</span> {hitDice || "—"}
                </div>
                <div>
                  <span className="font-semibold">{t("hp")}:</span> {character.hp_current}/
                  {character.hp_max}
                </div>
                <div>
                  <span className="font-semibold">{t("alignment")}:</span>{" "}
                  {getAlignmentLabel(character.alignment)}
                </div>
                <div>
                  <span className="font-semibold">{t("xp")}:</span>{" "}
                  {activeClasses.length > 0
                    ? activeClasses
                        .map((cc) => {
                          const name = CLASSES[cc.class_id as ClassId]?.name ?? cc.class_id;
                          const next = getXpForNextLevel(cc.class_id as ClassId, cc.level);
                          return `${name}: ${cc.xp_current.toLocaleString()}${next ? ` / ${next.toLocaleString()}` : " (Max)"}`;
                        })
                        .join("; ")
                    : character.xp_current.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">{t("treasure")}:</span>{" "}
                  {character.gold_pp > 0 ? `${character.gold_pp} PP, ` : ""}
                  {character.gold_gp} GP
                  {character.gold_sp > 0 ? `, ${character.gold_sp} SP` : ""}
                  {character.gold_cp > 0 ? `, ${character.gold_cp} CP` : ""}
                </div>
                {character.player_name && (
                  <div>
                    <span className="font-semibold">{t("player")}:</span> {character.player_name}
                  </div>
                )}
                {character.age != null && (
                  <div>
                    <span className="font-semibold">{t("age")}:</span> {character.age}
                  </div>
                )}
                {character.height_cm != null && (
                  <div>
                    <span className="font-semibold">{t("height")}:</span> {character.height_cm} cm
                  </div>
                )}
                {character.weight_kg != null && (
                  <div>
                    <span className="font-semibold">{t("weight")}:</span> {character.weight_kg} kg
                  </div>
                )}
                {character.gender && (
                  <div>
                    <span className="font-semibold">{t("gender")}:</span> {character.gender}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Ability Scores ────────────────────────────────────── */}
        <section className="mb-4" data-testid="print-section-abilities">
          <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
            {t("abilities")}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-1 font-semibold">{t("attribute")}</th>
                <th className="py-1 text-center font-semibold">{t("value")}</th>
                <th className="py-1 font-semibold">{t("modifiers")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1">{t("strName")}</td>
                <td className="py-1 text-center font-mono font-bold">{strDisplay}</td>
                <td className="py-1 text-xs">
                  {t("hit")}: {strMods.hitAdj >= 0 ? "+" : ""}
                  {strMods.hitAdj}, {t("damage")}: {strMods.dmgAdj >= 0 ? "+" : ""}
                  {strMods.dmgAdj}, {t("weightAllow")}: {strMods.weightAllow} lbs, {t("doors")}:{" "}
                  {strMods.openDoors}, {t("bars")}: {strMods.bendBars}%
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">{t("dexName")}</td>
                <td className="py-1 text-center font-mono font-bold">{character.dex}</td>
                <td className="py-1 text-xs">
                  {t("reaction")}: {dexMods.reactionAdj >= 0 ? "+" : ""}
                  {dexMods.reactionAdj}, {t("missile")}: {dexMods.missileAdj >= 0 ? "+" : ""}
                  {dexMods.missileAdj}, {t("ac")}: {dexMods.defensiveAdj >= 0 ? "+" : ""}
                  {dexMods.defensiveAdj}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">{t("conName")}</td>
                <td className="py-1 text-center font-mono font-bold">{character.con}</td>
                <td className="py-1 text-xs">
                  {t("hpPerLevel")}: {conMods.hpAdj >= 0 ? "+" : ""}
                  {conMods.hpAdj}, {t("systemShock")}: {conMods.systemShock}%, {t("resurrection")}:{" "}
                  {conMods.resurrectionSurvival}%
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">{t("intName")}</td>
                <td className="py-1 text-center font-mono font-bold">{character.int}</td>
                <td className="py-1 text-xs">
                  {t("languages")}: {intMods.numberOfLanguages}
                  {intMods.spellLevel ? `, ${t("maxSpellLevel")}: ${intMods.spellLevel}` : ""}
                  {intMods.chanceToLearn ? `, ${t("learnSpell")}: ${intMods.chanceToLearn}%` : ""}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">{t("wisName")}</td>
                <td className="py-1 text-center font-mono font-bold">{character.wis}</td>
                <td className="py-1 text-xs">
                  {t("magDefense")}: {wisMods.magicalDefenseAdj >= 0 ? "+" : ""}
                  {wisMods.magicalDefenseAdj}, {t("spellFailure")}: {wisMods.spellFailure}%
                  {wisMods.bonusSpells.length > 0 &&
                    `, ${t("bonusSpells")}: ${wisMods.bonusSpells.join("/")}`}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">{t("chaName")}</td>
                <td className="py-1 text-center font-mono font-bold">{character.cha}</td>
                <td className="py-1 text-xs">
                  {t("henchmen")}: {chaMods.maxHenchmen}, {t("loyalty")}:{" "}
                  {chaMods.loyaltyBase >= 0 ? "+" : ""}
                  {chaMods.loyaltyBase}, {t("reaction")}: {chaMods.reactionAdj >= 0 ? "+" : ""}
                  {chaMods.reactionAdj}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── Combat ────────────────────────────────────────────── */}
        <section className="mb-4" data-testid="print-section-combat">
          <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
            {t("combatValues")}
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">THAC0</div>
              <div className="font-mono text-xl font-bold">{thac0}</div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">{t("armorClass")}</div>
              <div className="font-mono text-xl font-bold">{baseAC}</div>
              <div className="text-xs text-gray-500">{t("base")}</div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">{t("hitMod")}</div>
              <div className="font-mono text-xl font-bold">
                {strMods.hitAdj >= 0 ? "+" : ""}
                {strMods.hitAdj}
              </div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">{t("damageMod")}</div>
              <div className="font-mono text-xl font-bold">
                {strMods.dmgAdj >= 0 ? "+" : ""}
                {strMods.dmgAdj}
              </div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">{t("attacksPerRound")}</div>
              <div className="font-mono text-xl font-bold">{attacksDisplay}</div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">{t("initiative")}</div>
              <div className="font-mono text-xl font-bold">
                {dexMods.reactionAdj >= 0 ? "+" : ""}
                {dexMods.reactionAdj}
              </div>
            </div>
          </div>
        </section>

        {/* ── Saving Throws ─────────────────────────────────────── */}
        {saves && (
          <section className="mb-4" data-testid="print-section-saves">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
              {t("savingThrows")}
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              {[
                { label: t("savePara"), value: saves.paralyzation },
                { label: t("saveRod"), value: saves.rod },
                { label: t("savePetri"), value: saves.petrification },
                { label: t("saveBreath"), value: saves.breath },
                { label: t("saveSpell"), value: saves.spell },
              ].map(({ label, value }) => (
                <div key={label} className="rounded border border-gray-300 p-2">
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="font-mono text-lg font-bold">{value}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Racial & Class Abilities ──────────────────────────── */}
        {(race?.racialAbilities?.length || activeClasses.length > 0) && (
          <section className="mb-4" data-testid="print-section-abilities-list">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
              {t("abilities_section")}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {race?.racialAbilities && race.racialAbilities.length > 0 && (
                <div>
                  <h3 className="font-semibold">
                    {t("racialAbilities")} ({race.name})
                  </h3>
                  <ul className="mt-1 list-inside list-disc text-xs">
                    {race.racialAbilities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeClasses.map((cc) => {
                const clsDef = CLASSES[cc.class_id as ClassId];
                if (!clsDef?.classAbilities?.length) return null;
                return (
                  <div key={cc.class_id}>
                    <h3 className="font-semibold">
                      {t("classAbilities")} ({clsDef.name})
                    </h3>
                    <ul className="mt-1 list-inside list-disc text-xs">
                      {clsDef.classAbilities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Thief Skills ──────────────────────────────────────── */}
        {hasThiefSkills(activeClasses.map((cc) => cc.class_id as ClassId)) && (
          <section className="mb-4" data-testid="print-section-thief">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
              {t("thiefSkills")}
            </h2>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              {[
                { label: t("locks"), value: character.thief_pick_locks },
                { label: t("traps"), value: character.thief_find_traps },
                { label: t("silent"), value: character.thief_move_silently },
                { label: t("hide"), value: character.thief_hide_shadows },
                { label: t("climb"), value: character.thief_climb_walls },
                { label: t("noise"), value: character.thief_detect_noise },
                { label: t("readLang"), value: character.thief_read_languages },
                {
                  label: t("backstab"),
                  value: `x${getBackstabMultiplier(activeClasses.find((cc) => cc.class_id === "thief" || cc.class_id === "bard")?.level ?? 1)}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="rounded border border-gray-300 p-2">
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="font-mono text-lg font-bold">
                    {typeof value === "number" ? `${value}%` : value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Notes ─────────────────────────────────────────────── */}
        {character.notes && (
          <section className="mb-4" data-testid="print-section-notes">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
              {t("notes")}
            </h2>
            <p className="whitespace-pre-wrap text-sm">{character.notes}</p>
          </section>
        )}

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="mt-6 flex items-center justify-between border-t border-gray-300 pt-2 text-xs text-gray-400">
          <span>{t("footer")}</span>
          <span>
            {t("createdAt")}{" "}
            {new Date(character.created_at).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </footer>
      </div>
    </>
  );
}
