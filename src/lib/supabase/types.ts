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
