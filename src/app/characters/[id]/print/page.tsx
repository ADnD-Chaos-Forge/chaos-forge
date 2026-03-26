import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { PrintSheet } from "@/components/print-sheet/print-sheet";
import type { CharacterRow } from "@/lib/supabase/types";

interface PrintPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrintPage({ params }: PrintPageProps) {
  const { id } = await params;
  await requireAuth();
  const supabase = await createClient();

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single<CharacterRow>();

  if (!character) {
    notFound();
  }

  return <PrintSheet character={character} />;
}
