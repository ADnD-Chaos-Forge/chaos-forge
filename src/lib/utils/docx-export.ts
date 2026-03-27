import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
import { getAlignmentLabel } from "@/lib/rules/alignment";
import { getXpForNextLevel } from "@/lib/rules/experience";
import type { ClassId, ClassGroup } from "@/lib/rules/types";
import { getMulticlassThac0, getMulticlassSaves } from "@/lib/rules/multiclass";
import {
  getAttacksPerRound,
  getAdjustedWeaponThac0,
  formatDamageWithBonus,
} from "@/lib/rules/combat";
import { getNonproficiencyPenalty } from "@/lib/rules/proficiencies";
import { hasThiefSkills, getBackstabMultiplier } from "@/lib/rules/thief";
import { calculateAC } from "@/lib/rules/equipment";
import { feetToMeters, lbsToKg } from "@/lib/utils/units";
import { localized } from "@/lib/utils/localize";
import {
  getStrengthModifiers,
  getDexterityModifiers,
  getConstitutionModifiers,
  getIntelligenceModifiers,
  getWisdomModifiers,
  getCharismaModifiers,
} from "@/lib/rules/abilities";
import type {
  CharacterRow,
  CharacterClassRow,
  CharacterEquipmentWithDetails,
  CharacterSpellWithDetails,
  CharacterWeaponProficiencyRow,
  CharacterNWPWithDetails,
  CharacterLanguageRow,
} from "@/lib/supabase/types";

export interface PrintSheetProps {
  character: CharacterRow;
  characterClasses: CharacterClassRow[];
  equipment: CharacterEquipmentWithDetails[];
  spells: CharacterSpellWithDetails[];
  weaponProficiencies: CharacterWeaponProficiencyRow[];
  nonweaponProficiencies: CharacterNWPWithDetails[];
  languages: CharacterLanguageRow[];
  locale: string;
}

// ─── Helper: bordered table cell ──────────────────────────────────────────────
const BORDER = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "999999",
};

const CELL_BORDERS = {
  top: BORDER,
  bottom: BORDER,
  left: BORDER,
  right: BORDER,
};

function cell(
  text: string,
  opts?: {
    bold?: boolean;
    width?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    font?: string;
    size?: number;
    columnSpan?: number;
  }
): TableCell {
  return new TableCell({
    borders: CELL_BORDERS,
    width: opts?.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    columnSpan: opts?.columnSpan,
    children: [
      new Paragraph({
        alignment: opts?.alignment ?? AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: opts?.bold ?? false,
            font: opts?.font ?? "Calibri",
            size: opts?.size ?? 20, // 10pt
          }),
        ],
      }),
    ],
  });
}

function headerCell(
  text: string,
  opts?: {
    width?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  }
): TableCell {
  return cell(text, { bold: true, ...opts });
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: "Calibri",
        size: 26, // 13pt
      }),
    ],
  });
}

function emptyParagraph(): Paragraph {
  return new Paragraph({ children: [] });
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export async function generateCharacterDocx(props: PrintSheetProps): Promise<Blob> {
  const {
    character,
    characterClasses,
    equipment,
    spells,
    weaponProficiencies,
    nonweaponProficiencies,
    languages,
  } = props;

  const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
  const activeClasses = characterClasses.filter((cc) => cc.is_active);
  const classEntries = activeClasses.map((cc) => ({
    classId: cc.class_id as ClassId,
    level: cc.level,
  }));
  const classNames = activeClasses
    .map((cc) => {
      const cls = CLASSES[cc.class_id as ClassId];
      return cls ? localized(cls.name, cls.name_en, props.locale) : cc.class_id;
    })
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

  const equippedArmorForAC = equipment.find(
    (e) =>
      e.armor &&
      e.equipped &&
      e.armor.name.toLowerCase() !== "schild" &&
      e.armor.name.toLowerCase() !== "shield"
  );
  const hasShieldForAC = equipment.some(
    (e) =>
      e.armor &&
      e.equipped &&
      (e.armor.name.toLowerCase() === "schild" || e.armor.name.toLowerCase() === "shield")
  );
  const effectiveAC = calculateAC(
    equippedArmorForAC?.armor?.ac ?? null,
    hasShieldForAC,
    dexMods.defensiveAdj
  );

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

  // ─── Build document sections ───────────────────────────────────────────────
  const children: (Paragraph | Table)[] = [];

  // ── 1. Header ──────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: character.name,
          bold: true,
          font: "Calibri",
          size: 36, // 18pt
        }),
      ],
    })
  );

  const xpDisplay =
    activeClasses.length > 0
      ? activeClasses
          .map((cc) => {
            const cls = CLASSES[cc.class_id as ClassId];
            const name = cls ? localized(cls.name, cls.name_en, props.locale) : cc.class_id;
            const next = getXpForNextLevel(cc.class_id as ClassId, cc.level);
            return `${name}: ${cc.xp_current.toLocaleString()}${next ? ` / ${next.toLocaleString()}` : " (Max)"}`;
          })
          .join("; ")
      : character.xp_current.toLocaleString();

  const treasureDisplay = [
    character.gold_pp > 0 ? `${character.gold_pp} PP` : "",
    `${character.gold_gp} GP`,
    character.gold_sp > 0 ? `${character.gold_sp} SP` : "",
    character.gold_cp > 0 ? `${character.gold_cp} CP` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const headerLines: string[] = [
    `Race: ${race ? localized(race.name, race.name_en, props.locale) : "—"}  |  Class: ${classNames || "—"}  |  Level: ${levelDisplay || character.level}`,
    `Hit Die: ${hitDice || "—"}  |  HP: ${character.hp_current}/${character.hp_max}  |  Alignment: ${getAlignmentLabel(character.alignment, props.locale)}`,
    `XP: ${xpDisplay}`,
    `Treasure: ${treasureDisplay}`,
  ];
  if (character.player_name) headerLines.push(`Player: ${character.player_name}`);
  if (character.age != null) headerLines.push(`Age: ${character.age}`);
  if (character.height_cm != null) headerLines.push(`Height: ${character.height_cm} cm`);
  if (character.weight_kg != null) headerLines.push(`Weight: ${character.weight_kg} kg`);
  if (character.gender) headerLines.push(`Gender: ${character.gender}`);

  for (const line of headerLines) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: line, font: "Calibri", size: 20 })],
      })
    );
  }

  // ── 2. Abilities Table ─────────────────────────────────────────────────────
  children.push(sectionHeading("Abilities"));

  const abilityRows: { name: string; value: string; mods: string }[] = [
    {
      name: "Strength (STR)",
      value: strDisplay,
      mods: `Hit: ${strMods.hitAdj >= 0 ? "+" : ""}${strMods.hitAdj}, Damage: ${strMods.dmgAdj >= 0 ? "+" : ""}${strMods.dmgAdj}, Weight: ${lbsToKg(strMods.weightAllow)} kg, Doors: ${strMods.openDoors}, Bars: ${strMods.bendBars}%`,
    },
    {
      name: "Dexterity (DEX)",
      value: String(character.dex),
      mods: `Reaction: ${dexMods.reactionAdj >= 0 ? "+" : ""}${dexMods.reactionAdj}, Missile: ${dexMods.missileAdj >= 0 ? "+" : ""}${dexMods.missileAdj}, AC: ${dexMods.defensiveAdj >= 0 ? "+" : ""}${dexMods.defensiveAdj}`,
    },
    {
      name: "Constitution (CON)",
      value: String(character.con),
      mods: `HP/Level: ${conMods.hpAdj >= 0 ? "+" : ""}${conMods.hpAdj}, System Shock: ${conMods.systemShock}%, Resurrection: ${conMods.resurrectionSurvival}%`,
    },
    {
      name: "Intelligence (INT)",
      value: String(character.int),
      mods: `Languages: ${intMods.numberOfLanguages}${intMods.spellLevel ? `, Max Spell Level: ${intMods.spellLevel}` : ""}${intMods.chanceToLearn ? `, Learn Spell: ${intMods.chanceToLearn}%` : ""}`,
    },
    {
      name: "Wisdom (WIS)",
      value: String(character.wis),
      mods: `Mag. Defense: ${wisMods.magicalDefenseAdj >= 0 ? "+" : ""}${wisMods.magicalDefenseAdj}, Spell Failure: ${wisMods.spellFailure}%${wisMods.bonusSpells.length > 0 ? `, Bonus Spells: ${wisMods.bonusSpells.join("/")}` : ""}`,
    },
    {
      name: "Charisma (CHA)",
      value: String(character.cha),
      mods: `Henchmen: ${chaMods.maxHenchmen}, Loyalty: ${chaMods.loyaltyBase >= 0 ? "+" : ""}${chaMods.loyaltyBase}, Reaction: ${chaMods.reactionAdj >= 0 ? "+" : ""}${chaMods.reactionAdj}`,
    },
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            headerCell("Ability", { width: 25 }),
            headerCell("Value", { width: 10, alignment: AlignmentType.CENTER }),
            headerCell("Modifiers", { width: 65 }),
          ],
        }),
        ...abilityRows.map(
          (row) =>
            new TableRow({
              children: [
                cell(row.name, { width: 25 }),
                cell(row.value, {
                  width: 10,
                  alignment: AlignmentType.CENTER,
                  bold: true,
                  font: "Courier New",
                }),
                cell(row.mods, { width: 65, size: 18 }),
              ],
            })
        ),
      ],
    })
  );

  // ── 3. Combat Values ───────────────────────────────────────────────────────
  children.push(sectionHeading("Combat Values"));

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            headerCell("THAC0", { alignment: AlignmentType.CENTER }),
            headerCell("Armor Class", { alignment: AlignmentType.CENTER }),
            headerCell("Hit Mod", { alignment: AlignmentType.CENTER }),
            headerCell("Damage Mod", { alignment: AlignmentType.CENTER }),
            headerCell("Attacks/Round", { alignment: AlignmentType.CENTER }),
            headerCell("Initiative", { alignment: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            cell(String(thac0), {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(String(effectiveAC), {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(`${strMods.hitAdj >= 0 ? "+" : ""}${strMods.hitAdj}`, {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(`${strMods.dmgAdj >= 0 ? "+" : ""}${strMods.dmgAdj}`, {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(attacksDisplay, {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(`${dexMods.reactionAdj >= 0 ? "+" : ""}${dexMods.reactionAdj}`, {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
          ],
        }),
      ],
    })
  );

  // ── 4. Saving Throws ──────────────────────────────────────────────────────
  if (saves) {
    children.push(sectionHeading("Saving Throws"));
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              headerCell("Poison/Para/Death", { alignment: AlignmentType.CENTER }),
              headerCell("Rod/Staff/Wand", { alignment: AlignmentType.CENTER }),
              headerCell("Petrification", { alignment: AlignmentType.CENTER }),
              headerCell("Breath Weapon", { alignment: AlignmentType.CENTER }),
              headerCell("Spell", { alignment: AlignmentType.CENTER }),
            ],
          }),
          new TableRow({
            children: [
              cell(String(saves.paralyzation), {
                alignment: AlignmentType.CENTER,
                bold: true,
                font: "Courier New",
                size: 24,
              }),
              cell(String(saves.rod), {
                alignment: AlignmentType.CENTER,
                bold: true,
                font: "Courier New",
                size: 24,
              }),
              cell(String(saves.petrification), {
                alignment: AlignmentType.CENTER,
                bold: true,
                font: "Courier New",
                size: 24,
              }),
              cell(String(saves.breath), {
                alignment: AlignmentType.CENTER,
                bold: true,
                font: "Courier New",
                size: 24,
              }),
              cell(String(saves.spell), {
                alignment: AlignmentType.CENTER,
                bold: true,
                font: "Courier New",
                size: 24,
              }),
            ],
          }),
        ],
      })
    );
  }

  // ── 5. AC Breakdown ───────────────────────────────────────────────────────
  children.push(sectionHeading("AC Breakdown"));

  const armorReduction = equippedArmorForAC ? `${-(10 - equippedArmorForAC.armor!.ac)}` : "—";
  const armorName = equippedArmorForAC
    ? ` (${localized(equippedArmorForAC.armor!.name, equippedArmorForAC.armor!.name_en, props.locale)})`
    : "";
  const shieldVal = hasShieldForAC ? "-1" : "—";
  const dexVal =
    dexMods.defensiveAdj !== 0
      ? `${dexMods.defensiveAdj >= 0 ? "+" : ""}${dexMods.defensiveAdj}`
      : "—";

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            headerCell("Base", { alignment: AlignmentType.CENTER }),
            headerCell("Armor", { alignment: AlignmentType.CENTER }),
            headerCell("Shield", { alignment: AlignmentType.CENTER }),
            headerCell("DEX", { alignment: AlignmentType.CENTER }),
            headerCell("Final", { alignment: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            cell("10", {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(`${armorReduction}${armorName}`, {
              alignment: AlignmentType.CENTER,
              bold: true,
              size: 20,
            }),
            cell(shieldVal, {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(dexVal, {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
            cell(String(effectiveAC), {
              alignment: AlignmentType.CENTER,
              bold: true,
              font: "Courier New",
              size: 24,
            }),
          ],
        }),
      ],
    })
  );

  // ── 5b. Thief Skills ──────────────────────────────────────────────────────
  if (hasThiefSkills(activeClasses.map((cc) => cc.class_id as ClassId))) {
    children.push(sectionHeading("Thief Skills"));
    const backstabLevel =
      activeClasses.find((cc) => cc.class_id === "thief" || cc.class_id === "bard")?.level ?? 1;
    const thiefData = [
      { label: "Pick Locks", value: `${character.thief_pick_locks}%` },
      { label: "Find Traps", value: `${character.thief_find_traps}%` },
      { label: "Move Silently", value: `${character.thief_move_silently}%` },
      { label: "Hide in Shadows", value: `${character.thief_hide_shadows}%` },
      { label: "Climb Walls", value: `${character.thief_climb_walls}%` },
      { label: "Detect Noise", value: `${character.thief_detect_noise}%` },
      { label: "Read Languages", value: `${character.thief_read_languages}%` },
      { label: "Backstab", value: `x${getBackstabMultiplier(backstabLevel)}` },
    ];
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: thiefData.map((d) =>
              headerCell(d.label, { alignment: AlignmentType.CENTER })
            ),
          }),
          new TableRow({
            children: thiefData.map((d) =>
              cell(d.value, {
                alignment: AlignmentType.CENTER,
                bold: true,
                font: "Courier New",
                size: 24,
              })
            ),
          }),
        ],
      })
    );
  }

  // ── 6. Weapons Table ──────────────────────────────────────────────────────
  const equippedWeapons = equipment.filter((e) => e.weapon && e.equipped);
  if (equippedWeapons.length > 0) {
    children.push(sectionHeading("Weapons"));
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              headerCell("Name"),
              headerCell("THAC0 Melee", { alignment: AlignmentType.CENTER }),
              headerCell("THAC0 Ranged", { alignment: AlignmentType.CENTER }),
              headerCell("Dmg S/M", { alignment: AlignmentType.CENTER }),
              headerCell("Dmg L", { alignment: AlignmentType.CENTER }),
              headerCell("Spd", { alignment: AlignmentType.CENTER }),
              headerCell("Range", { alignment: AlignmentType.CENTER }),
              headerCell("Atk/Rnd", { alignment: AlignmentType.CENTER }),
            ],
          }),
          ...equippedWeapons.map((e) => {
            const weapon = e.weapon!;
            const isProficient = weaponProficiencies.some(
              (wp) => wp.weapon_name.toLowerCase() === weapon.name.toLowerCase()
            );
            const penalty = isProficient
              ? 0
              : getNonproficiencyPenalty(
                  activeClasses.length > 0
                    ? (CLASSES[activeClasses[0].class_id as ClassId]?.group ??
                        ("warrior" as ClassGroup))
                    : ("warrior" as ClassGroup)
                );
            const weaponThac0 = getAdjustedWeaponThac0(
              thac0,
              strMods.hitAdj,
              dexMods.missileAdj,
              weapon.weapon_type,
              penalty
            );
            const rangeStr =
              weapon.weapon_type !== "melee" &&
              weapon.range_short != null &&
              weapon.range_medium != null &&
              weapon.range_long != null
                ? `${feetToMeters(weapon.range_short)}/${feetToMeters(weapon.range_medium)}/${feetToMeters(weapon.range_long)}`
                : "—";

            return new TableRow({
              children: [
                cell(
                  `${localized(weapon.name, weapon.name_en, props.locale)}${!isProficient ? " *" : ""}`
                ),
                cell(String(weaponThac0.melee), {
                  alignment: AlignmentType.CENTER,
                  font: "Courier New",
                }),
                cell(weaponThac0.ranged !== null ? String(weaponThac0.ranged) : "—", {
                  alignment: AlignmentType.CENTER,
                  font: "Courier New",
                }),
                cell(formatDamageWithBonus(weapon.damage_sm, strMods.dmgAdj), {
                  alignment: AlignmentType.CENTER,
                  font: "Courier New",
                }),
                cell(formatDamageWithBonus(weapon.damage_l, strMods.dmgAdj), {
                  alignment: AlignmentType.CENTER,
                  font: "Courier New",
                }),
                cell(String(weapon.speed), {
                  alignment: AlignmentType.CENTER,
                  font: "Courier New",
                }),
                cell(rangeStr, { alignment: AlignmentType.CENTER, font: "Courier New", size: 18 }),
                cell(attacksDisplay, { alignment: AlignmentType.CENTER, font: "Courier New" }),
              ],
            });
          }),
        ],
      })
    );
  }

  // ── 7. Equipment (Armor & Inventory) ──────────────────────────────────────
  const equipmentItems = equipment.filter((e) => e.armor || (e.weapon && !e.equipped));
  if (equipmentItems.length > 0) {
    children.push(sectionHeading("Armor & Inventory"));
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              headerCell("Item", { width: 40 }),
              headerCell("Type", { width: 20, alignment: AlignmentType.CENTER }),
              headerCell("Weight", { width: 20, alignment: AlignmentType.CENTER }),
              headerCell("Status", { width: 20, alignment: AlignmentType.CENTER }),
            ],
          }),
          ...equipmentItems.map(
            (e) =>
              new TableRow({
                children: [
                  cell(
                    e.weapon
                      ? localized(e.weapon.name, e.weapon.name_en, props.locale)
                      : e.armor
                        ? localized(e.armor.name, e.armor.name_en, props.locale)
                        : "—",
                    { width: 40 }
                  ),
                  cell(e.weapon ? "Weapon" : "Armor", {
                    width: 20,
                    alignment: AlignmentType.CENTER,
                  }),
                  cell(`${lbsToKg(e.weapon?.weight ?? e.armor?.weight ?? 0)} kg`, {
                    width: 20,
                    alignment: AlignmentType.CENTER,
                  }),
                  cell(e.equipped ? "Equipped" : "Inventory", {
                    width: 20,
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              })
          ),
        ],
      })
    );
  }

  // ── 8. Spells ─────────────────────────────────────────────────────────────
  if (spells.length > 0) {
    children.push(sectionHeading("Spellbook"));
    for (const cs of spells) {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: localized(cs.spell.name, cs.spell.name_en, props.locale),
              bold: cs.prepared,
              font: "Calibri",
              size: 20,
            }),
            new TextRun({
              text: ` (L${cs.spell.level})`,
              font: "Calibri",
              size: 18,
              color: "666666",
            }),
            ...(cs.prepared
              ? [
                  new TextRun({
                    text: " \u2605",
                    font: "Calibri",
                    size: 18,
                    color: "666666",
                  }),
                ]
              : []),
          ],
        })
      );
    }
  }

  // ── 9. Proficiencies ──────────────────────────────────────────────────────
  if (weaponProficiencies.length > 0 || nonweaponProficiencies.length > 0) {
    children.push(sectionHeading("Proficiencies"));

    if (weaponProficiencies.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "Weapon Proficiencies", bold: true, font: "Calibri", size: 22 }),
          ],
        })
      );
      for (const wp of weaponProficiencies) {
        children.push(
          new Paragraph({
            spacing: { after: 20 },
            indent: { left: 360 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${wp.weapon_name}${wp.specialization ? " (Specialization)" : ""}`,
                font: "Calibri",
                size: 20,
              }),
            ],
          })
        );
      }
    }

    if (nonweaponProficiencies.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: "Non-Weapon Proficiencies",
              bold: true,
              font: "Calibri",
              size: 22,
            }),
          ],
        })
      );
      for (const nwp of nonweaponProficiencies) {
        const modStr =
          nwp.proficiency.modifier >= 0
            ? `+${nwp.proficiency.modifier}`
            : String(nwp.proficiency.modifier);
        children.push(
          new Paragraph({
            spacing: { after: 20 },
            indent: { left: 360 },
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${localized(nwp.proficiency.name, nwp.proficiency.name_en, props.locale)} (${nwp.proficiency.ability} ${modStr})`,
                font: "Calibri",
                size: 20,
              }),
            ],
          })
        );
      }
    }

    if (languages.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [new TextRun({ text: "Languages", bold: true, font: "Calibri", size: 22 })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: languages.map((l) => l.language_name).join(", "),
              font: "Calibri",
              size: 20,
            }),
          ],
        })
      );
    }
  }

  // ── 10. Notes ─────────────────────────────────────────────────────────────
  if (character.notes) {
    children.push(sectionHeading("Notes"));
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: character.notes,
            font: "Calibri",
            size: 20,
          }),
        ],
      })
    );
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  children.push(emptyParagraph());
  children.push(
    new Paragraph({
      spacing: { before: 240 },
      children: [
        new TextRun({
          text: `Chaos Forge — AD&D 2nd Edition Manager  |  Created ${new Date(character.created_at).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })}`,
          font: "Calibri",
          size: 16,
          color: "999999",
        }),
      ],
    })
  );

  // ── Create Document ───────────────────────────────────────────────────────
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
