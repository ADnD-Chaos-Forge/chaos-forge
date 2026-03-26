import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { CharacterSheet } from "@/components/character-sheet/character-sheet";
import type {
  CharacterRow,
  CharacterClassRow,
  CharacterEquipmentWithDetails,
  CharacterSpellWithDetails,
  CharacterInventoryWithDetails,
  GeneralItemRow,
  WeaponRow,
  ArmorRow,
  SpellRow,
  CharacterWeaponProficiencyRow,
  CharacterNWPWithDetails,
  NonweaponProficiencyRow,
  CharacterLanguageRow,
} from "@/lib/supabase/types";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single<CharacterRow>();

  if (!character) {
    notFound();
  }

  // Fetch equipment with joined weapon/armor data
  const { data: equipment } = await supabase
    .from("character_equipment")
    .select("*, weapon:weapons(*), armor:armor(*)")
    .eq("character_id", id);

  // Fetch spells with joined spell data
  const { data: spells } = await supabase
    .from("character_spells")
    .select("*, spell:spells(*)")
    .eq("character_id", id);

  // Fetch all reference data for add dialogs
  const { data: allWeapons } = await supabase
    .from("weapons")
    .select("*")
    .order("name")
    .returns<WeaponRow[]>();

  const { data: allArmor } = await supabase
    .from("armor")
    .select("*")
    .order("ac", { ascending: false })
    .returns<ArmorRow[]>();

  const { data: allSpells } = await supabase
    .from("spells")
    .select("*")
    .order("level")
    .order("name")
    .returns<SpellRow[]>();

  // Fetch proficiencies
  const { data: weaponProfs } = await supabase
    .from("character_weapon_proficiencies")
    .select("*")
    .eq("character_id", id)
    .returns<CharacterWeaponProficiencyRow[]>();

  const { data: nwProfs } = await supabase
    .from("character_nonweapon_proficiencies")
    .select("*, proficiency:nonweapon_proficiencies(*)")
    .eq("character_id", id);

  const { data: allNWPs } = await supabase
    .from("nonweapon_proficiencies")
    .select("*")
    .order("name")
    .returns<NonweaponProficiencyRow[]>();

  // Fetch character classes (multiclass support)
  const { data: characterClasses } = await supabase
    .from("character_classes")
    .select("*")
    .eq("character_id", id)
    .returns<CharacterClassRow[]>();

  // Fetch inventory
  const { data: inventoryData } = await supabase
    .from("character_inventory")
    .select("*, item:general_items(*)")
    .eq("character_id", id);

  const { data: allGeneralItems } = await supabase
    .from("general_items")
    .select("*")
    .order("name")
    .returns<GeneralItemRow[]>();

  // Fetch languages
  const { data: languages } = await supabase
    .from("character_languages")
    .select("*")
    .eq("character_id", id)
    .returns<CharacterLanguageRow[]>();

  return (
    <CharacterSheet
      character={character}
      characterClasses={characterClasses ?? []}
      userId={user.id}
      equipment={(equipment as CharacterEquipmentWithDetails[]) ?? []}
      spells={(spells as CharacterSpellWithDetails[]) ?? []}
      allWeapons={allWeapons ?? []}
      allArmor={allArmor ?? []}
      allSpells={allSpells ?? []}
      weaponProficiencies={weaponProfs ?? []}
      nonweaponProficiencies={(nwProfs as CharacterNWPWithDetails[]) ?? []}
      inventory={(inventoryData as CharacterInventoryWithDetails[]) ?? []}
      allGeneralItems={allGeneralItems ?? []}
      allNonweaponProficiencies={allNWPs ?? []}
      languages={languages ?? []}
    />
  );
}
