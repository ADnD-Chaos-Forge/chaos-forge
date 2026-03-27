import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { CharacterCard } from "@/components/character-card";
import type { CharacterRow, CharacterClassRow, CharacterShareRow } from "@/lib/supabase/types";

export default async function CharactersPage() {
  const t = await getTranslations("characters");
  const ts = await getTranslations("sharing");
  const user = await requireAuth();
  const supabase = await createClient();
  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .order("updated_at", { ascending: false })
    .returns<CharacterRow[]>();

  // Load all character_classes for display
  const { data: allCharClasses } = await supabase
    .from("character_classes")
    .select("*")
    .returns<CharacterClassRow[]>();

  // Load shares where the current user is the recipient (to detect shared characters)
  const { data: myShares } = await supabase
    .from("character_shares")
    .select("*")
    .eq("shared_with_user_id", user.id)
    .returns<CharacterShareRow[]>();

  const sharedCharacterIds = new Set((myShares ?? []).map((s) => s.character_id));

  const charClassMap = new Map<string, CharacterClassRow[]>();
  for (const cc of allCharClasses ?? []) {
    const existing = charClassMap.get(cc.character_id) ?? [];
    existing.push(cc);
    charClassMap.set(cc.character_id, existing);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6" data-testid="characters-page">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-primary sm:text-3xl">{t("title")}</h1>
        <Link href="/characters/new">
          <Button data-testid="create-character-button">{t("newCharacter")}</Button>
        </Link>
      </div>

      {!characters || characters.length === 0 ? (
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          data-testid="no-characters"
        >
          <p className="text-lg text-muted-foreground">{t("noCharacters")}</p>
          <Link href="/characters/new">
            <Button size="lg">{t("createFirst")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => {
            const classes = charClassMap.get(character.id) ?? [];
            const isOwner = character.user_id === user.id;
            const isSharedWithMe = sharedCharacterIds.has(character.id);

            return (
              <CharacterCard
                key={character.id}
                character={character}
                classes={classes}
                isOwner={isOwner}
                isSharedWithMe={isSharedWithMe}
                sharedByLabel={
                  !isOwner ? ts("sharedBy", { player: character.player_name || "?" }) : undefined
                }
                badgePrivateLabel={ts("badgePrivate")}
                badgeSharedLabel={ts("badgeShared")}
                badgePublicLabel={ts("badgePublic")}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
