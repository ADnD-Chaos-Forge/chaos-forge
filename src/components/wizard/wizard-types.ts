import type { RaceId, ClassId } from "@/lib/rules/types";

export interface WizardState {
  // Step 1: Basics
  name: string;
  level: number;
  // Step 2: Abilities
  str: number;
  strExceptional: number | null;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  // Step 3: Race
  raceId: RaceId | null;
  // Step 4: Class
  classId: ClassId | null;
  // Step 5: Combat (calculated + HP input)
  hpMax: number;
  // Step 6-7: Equipment & Spells (deferred to character edit for MVP)
  // Step 8: Summary
}

export const INITIAL_WIZARD_STATE: WizardState = {
  name: "",
  level: 1,
  str: 10,
  strExceptional: null,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
  raceId: null,
  classId: null,
  hpMax: 1,
};

export const WIZARD_STEPS = [
  { id: "basics", label: "Grunddaten" },
  { id: "abilities", label: "Attribute" },
  { id: "race", label: "Rasse" },
  { id: "class", label: "Klasse" },
  { id: "combat", label: "Kampfwerte" },
  { id: "summary", label: "Zusammenfassung" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];
