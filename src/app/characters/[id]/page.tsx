import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CharacterSheet } from "@/components/character-sheet/character-sheet";
import type { CharacterRow } from "@/lib/supabase/types";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single<CharacterRow>();

  if (!character) {
    notFound();
  }

  return <CharacterSheet character={character} />;
}
