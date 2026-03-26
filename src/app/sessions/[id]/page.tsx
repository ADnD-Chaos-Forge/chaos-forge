import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { SessionDetail } from "@/components/session/session-detail";
import type { SessionRow, SessionEntryRow, TagRow, CharacterRow } from "@/lib/supabase/types";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single<SessionRow>();

  if (!session) {
    notFound();
  }

  const { data: entries } = await supabase
    .from("session_entries")
    .select("*")
    .eq("session_id", id)
    .order("created_at", { ascending: true })
    .returns<SessionEntryRow[]>();

  // Fetch characters for entries + user's own characters
  const characterIds = [...new Set(entries?.map((e) => e.character_id) ?? [])];
  const { data: entryCharacters } = await supabase
    .from("characters")
    .select("id, name, avatar_url, race_id, class_id")
    .in("id", characterIds.length > 0 ? characterIds : ["none"])
    .returns<Pick<CharacterRow, "id" | "name" | "avatar_url" | "race_id" | "class_id">[]>();

  const { data: userCharacters } = await supabase
    .from("characters")
    .select("id, name, avatar_url")
    .eq("user_id", user.id)
    .returns<Pick<CharacterRow, "id" | "name" | "avatar_url">[]>();

  // Fetch tags
  const { data: sessionTags } = await supabase
    .from("session_tags")
    .select("tag_id, tags(*)")
    .eq("session_id", id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags: TagRow[] = sessionTags?.map((st: any) => st.tags as TagRow).filter(Boolean) ?? [];

  // Fetch all tags for autocomplete
  const { data: allTags } = await supabase
    .from("tags")
    .select("*")
    .order("name")
    .returns<TagRow[]>();

  return (
    <SessionDetail
      session={session}
      entries={entries ?? []}
      entryCharacters={entryCharacters ?? []}
      userCharacters={userCharacters ?? []}
      tags={tags}
      allTags={allTags ?? []}
      userId={user.id}
      isCreator={session.created_by === user.id}
    />
  );
}
