import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { Spellbook } from "@/components/spellbook/spellbook";
import type {
  CharacterRow,
  CharacterClassRow,
  CharacterSpellWithDetails,
  SpellRow,
} from "@/lib/supabase/types";

interface SpellbookPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpellbookPage({ params }: SpellbookPageProps) {
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

  const { data: characterClasses } = await supabase
    .from("character_classes")
    .select("*")
    .eq("character_id", id)
    .returns<CharacterClassRow[]>();

  const { data: spells } = await supabase
    .from("character_spells")
    .select("*, spell:spells(*)")
    .eq("character_id", id);

  const { data: allSpells } = await supabase
    .from("spells")
    .select("*")
    .order("level")
    .order("name")
    .returns<SpellRow[]>();

  return (
    <Spellbook
      character={character}
      characterClasses={characterClasses ?? []}
      userId={user.id}
      spells={(spells as CharacterSpellWithDetails[]) ?? []}
      allSpells={allSpells ?? []}
    />
  );
}
