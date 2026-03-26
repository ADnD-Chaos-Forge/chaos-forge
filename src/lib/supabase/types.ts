/** Database row types — mirrors Supabase schema */

export interface CharacterRow {
  id: string;
  user_id: string;
  name: string;
  level: number;
  race_id: string | null;
  class_id: string | null;
  str: number;
  str_exceptional: number | null;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  hp_current: number;
  hp_max: number;
  notes: string;
  avatar_url: string | null;
  alignment: string;
  xp_current: number;
  gold_pp: number;
  gold_gp: number;
  gold_ep: number;
  gold_sp: number;
  gold_cp: number;
  created_at: string;
  updated_at: string;
}

export interface CharacterInsert {
  name: string;
  level: number;
  race_id: string;
  class_id: string;
  str: number;
  str_exceptional?: number | null;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  hp_current: number;
  hp_max: number;
  notes?: string;
}

export interface CharacterEquipmentRow {
  id: string;
  character_id: string;
  weapon_id: string | null;
  armor_id: string | null;
  quantity: number;
  equipped: boolean;
}

export interface CharacterSpellRow {
  character_id: string;
  spell_id: string;
  prepared: boolean;
}

export interface WeaponRow {
  id: string;
  name: string;
  damage_sm: string;
  damage_l: string;
  weapon_type: "melee" | "ranged" | "both";
  speed: number;
  weight: number;
  cost_gp: number;
  range_short: number | null;
  range_medium: number | null;
  range_long: number | null;
  is_custom: boolean;
  created_by: string | null;
}

export interface ArmorRow {
  id: string;
  name: string;
  ac: number;
  weight: number;
  cost_gp: number;
  max_movement: number;
  is_custom: boolean;
  created_by: string | null;
}

export interface SpellRow {
  id: string;
  name: string;
  level: number;
  spell_type: "wizard" | "priest";
  school: string | null;
  sphere: string | null;
  range: string;
  duration: string;
  area_of_effect: string;
  components: string[];
  description: string;
  is_custom: boolean;
  created_by: string | null;
}

export interface CharacterLanguageRow {
  id: string;
  character_id: string;
  language_name: string;
}

export interface CharacterEquipmentWithDetails extends CharacterEquipmentRow {
  weapon: WeaponRow | null;
  armor: ArmorRow | null;
}

export interface CharacterSpellWithDetails extends CharacterSpellRow {
  spell: SpellRow;
}

export interface NonweaponProficiencyRow {
  id: string;
  name: string;
  ability: string;
  modifier: number;
  group_type: string;
  slots_required: number;
  is_custom: boolean;
  created_by: string | null;
}

export interface CharacterWeaponProficiencyRow {
  id: string;
  character_id: string;
  weapon_name: string;
  specialization: boolean;
}

export interface CharacterNonweaponProficiencyRow {
  id: string;
  character_id: string;
  proficiency_id: string;
}

export interface CharacterNWPWithDetails extends CharacterNonweaponProficiencyRow {
  proficiency: NonweaponProficiencyRow;
}

export interface SessionRow {
  id: string;
  title: string;
  session_date: string;
  summary: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionEntryRow {
  id: string;
  session_id: string;
  character_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  type: "npc" | "location" | "item" | "quest";
  color: string;
}

export interface SessionTagRow {
  session_id: string;
  tag_id: string;
}
