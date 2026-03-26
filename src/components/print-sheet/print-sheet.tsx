"use client";

import Image from "next/image";
import { RACES } from "@/lib/rules/races";
import { CLASSES, getClassGroup } from "@/lib/rules/classes";
import { getAlignmentLabel } from "@/lib/rules/alignment";
import { getXpForNextLevel } from "@/lib/rules/experience";
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
import type { CharacterRow } from "@/lib/supabase/types";

interface PrintSheetProps {
  character: CharacterRow;
}

export function PrintSheet({ character }: PrintSheetProps) {
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

  const strDisplay =
    character.str === 18 && character.str_exceptional
      ? `18/${character.str_exceptional === 100 ? "00" : String(character.str_exceptional).padStart(2, "0")}`
      : String(character.str);

  return (
    <>
      {/* Print button - hidden when printing */}
      <div className="flex justify-center gap-4 p-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-gray-800 px-6 py-2 text-white hover:bg-gray-700"
          data-testid="print-trigger-button"
        >
          Drucken (Cmd+P)
        </button>
        <button
          onClick={() => window.history.back()}
          className="rounded border border-gray-400 px-6 py-2 hover:bg-gray-100"
        >
          Zurück
        </button>
      </div>

      {/* Print sheet - A4 optimized */}
      <div
        className="mx-auto max-w-[210mm] bg-white p-6 text-black print:m-0 print:max-w-none print:p-4"
        data-testid="print-sheet"
      >
        {/* ── Personal Information ──────────────────────────────── */}
        <section className="mb-4 border-b-2 border-black pb-3" data-testid="print-section-personal">
          <div className="flex items-start gap-4">
            {/* Avatar */}
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
                  <span className="font-semibold">Rasse:</span> {race?.name ?? "—"}
                </div>
                <div>
                  <span className="font-semibold">Klasse:</span> {cls?.name ?? "—"}
                </div>
                <div>
                  <span className="font-semibold">Stufe:</span> {character.level}
                </div>
                <div>
                  <span className="font-semibold">Trefferwürfel:</span>{" "}
                  {cls ? `d${cls.hitDie}` : "—"}
                </div>
                <div>
                  <span className="font-semibold">HP:</span> {character.hp_current}/
                  {character.hp_max}
                </div>
                <div>
                  <span className="font-semibold">Gesinnung:</span>{" "}
                  {getAlignmentLabel(character.alignment)}
                </div>
                <div>
                  <span className="font-semibold">XP:</span>{" "}
                  {character.xp_current.toLocaleString("de-DE")}
                  {character.class_id &&
                    (() => {
                      const next = getXpForNextLevel(
                        character.class_id as ClassId,
                        character.level
                      );
                      return next ? ` / ${next.toLocaleString("de-DE")}` : " (Max)";
                    })()}
                </div>
                <div>
                  <span className="font-semibold">Schatz:</span>{" "}
                  {character.gold_pp > 0 ? `${character.gold_pp} PP, ` : ""}
                  {character.gold_gp} GP
                  {character.gold_sp > 0 ? `, ${character.gold_sp} SP` : ""}
                  {character.gold_cp > 0 ? `, ${character.gold_cp} CP` : ""}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ability Scores ────────────────────────────────────── */}
        <section className="mb-4" data-testid="print-section-abilities">
          <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">Attribute</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-1 font-semibold">Attribut</th>
                <th className="py-1 text-center font-semibold">Wert</th>
                <th className="py-1 font-semibold">Modifikatoren</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1">Stärke (STR)</td>
                <td className="py-1 text-center font-mono font-bold">{strDisplay}</td>
                <td className="py-1 text-xs">
                  Treffer: {strMods.hitAdj >= 0 ? "+" : ""}
                  {strMods.hitAdj}, Schaden: {strMods.dmgAdj >= 0 ? "+" : ""}
                  {strMods.dmgAdj}, Gewicht: {strMods.weightAllow} lbs, Türen: {strMods.openDoors},
                  Gitter: {strMods.bendBars}%
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Geschicklichkeit (DEX)</td>
                <td className="py-1 text-center font-mono font-bold">{character.dex}</td>
                <td className="py-1 text-xs">
                  Reaktion: {dexMods.reactionAdj >= 0 ? "+" : ""}
                  {dexMods.reactionAdj}, Fernkampf: {dexMods.missileAdj >= 0 ? "+" : ""}
                  {dexMods.missileAdj}, RK: {dexMods.defensiveAdj >= 0 ? "+" : ""}
                  {dexMods.defensiveAdj}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Konstitution (CON)</td>
                <td className="py-1 text-center font-mono font-bold">{character.con}</td>
                <td className="py-1 text-xs">
                  HP: {conMods.hpAdj >= 0 ? "+" : ""}
                  {conMods.hpAdj}/Stufe, Systemschock: {conMods.systemShock}%, Auferstehung:{" "}
                  {conMods.resurrectionSurvival}%
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Intelligenz (INT)</td>
                <td className="py-1 text-center font-mono font-bold">{character.int}</td>
                <td className="py-1 text-xs">
                  Sprachen: {intMods.numberOfLanguages}
                  {intMods.spellLevel ? `, Max. Zauberstufe: ${intMods.spellLevel}` : ""}
                  {intMods.chanceToLearn ? `, Zauber lernen: ${intMods.chanceToLearn}%` : ""}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Weisheit (WIS)</td>
                <td className="py-1 text-center font-mono font-bold">{character.wis}</td>
                <td className="py-1 text-xs">
                  Mag. Abwehr: {wisMods.magicalDefenseAdj >= 0 ? "+" : ""}
                  {wisMods.magicalDefenseAdj}, Zauberversagen: {wisMods.spellFailure}%
                  {wisMods.bonusSpells.length > 0 &&
                    `, Bonuszauber: ${wisMods.bonusSpells.join("/")}`}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1">Charisma (CHA)</td>
                <td className="py-1 text-center font-mono font-bold">{character.cha}</td>
                <td className="py-1 text-xs">
                  Gefolgsleute: {chaMods.maxHenchmen}, Loyalität:{" "}
                  {chaMods.loyaltyBase >= 0 ? "+" : ""}
                  {chaMods.loyaltyBase}, Reaktion: {chaMods.reactionAdj >= 0 ? "+" : ""}
                  {chaMods.reactionAdj}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── Combat ────────────────────────────────────────────── */}
        <section className="mb-4" data-testid="print-section-combat">
          <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">Kampfwerte</h2>
          <div className="grid grid-cols-4 gap-3 text-center text-sm">
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">ETW0 (THAC0)</div>
              <div className="font-mono text-xl font-bold">{thac0}</div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">Rüstungsklasse</div>
              <div className="font-mono text-xl font-bold">{baseAC}</div>
              <div className="text-xs text-gray-500">Basis</div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">Treffer-Mod</div>
              <div className="font-mono text-xl font-bold">
                {strMods.hitAdj >= 0 ? "+" : ""}
                {strMods.hitAdj}
              </div>
            </div>
            <div className="rounded border border-gray-300 p-2">
              <div className="text-xs text-gray-500">Schadens-Mod</div>
              <div className="font-mono text-xl font-bold">
                {strMods.dmgAdj >= 0 ? "+" : ""}
                {strMods.dmgAdj}
              </div>
            </div>
          </div>
        </section>

        {/* ── Saving Throws ─────────────────────────────────────── */}
        {saves && (
          <section className="mb-4" data-testid="print-section-saves">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
              Rettungswürfe
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              {[
                { label: "Gift/Lähmung/Tod", value: saves.paralyzation },
                { label: "Stab/Rute/Zepter", value: saves.rod },
                { label: "Versteinerung/Verwandlung", value: saves.petrification },
                { label: "Odemwaffe", value: saves.breath },
                { label: "Zauber", value: saves.spell },
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
        {(race?.racialAbilities?.length || cls?.classAbilities?.length) && (
          <section className="mb-4" data-testid="print-section-abilities-list">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">
              Fähigkeiten
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {race?.racialAbilities && race.racialAbilities.length > 0 && (
                <div>
                  <h3 className="font-semibold">Rassenfähigkeiten ({race.name})</h3>
                  <ul className="mt-1 list-inside list-disc text-xs">
                    {race.racialAbilities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {cls?.classAbilities && cls.classAbilities.length > 0 && (
                <div>
                  <h3 className="font-semibold">Klassenfähigkeiten ({cls.name})</h3>
                  <ul className="mt-1 list-inside list-disc text-xs">
                    {cls.classAbilities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Notes ─────────────────────────────────────────────── */}
        {character.notes && (
          <section className="mb-4" data-testid="print-section-notes">
            <h2 className="mb-2 border-b border-gray-400 font-serif text-lg font-bold">Notizen</h2>
            <p className="whitespace-pre-wrap text-sm">{character.notes}</p>
          </section>
        )}

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="mt-6 flex items-center justify-between border-t border-gray-300 pt-2 text-xs text-gray-400">
          <span>Chaos Forge — AD&D 2nd Edition Manager</span>
          <span>
            Erstellt am{" "}
            {new Date(character.created_at).toLocaleDateString("de-DE", {
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
