import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarDisplay } from "@/components/avatar-display";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
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
            const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
            const classes = (charClassMap.get(character.id) ?? []).filter((cc) => cc.is_active);
            const classNames =
              classes.length > 0
                ? classes
                    .map((cc) => CLASSES[cc.class_id as keyof typeof CLASSES]?.name ?? cc.class_id)
                    .join(" / ")
                : character.class_id
                  ? (CLASSES[character.class_id as keyof typeof CLASSES]?.name ?? null)
                  : null;
            const levelDisplay =
              classes.length > 0
                ? classes.map((cc) => cc.level).join("/")
                : String(character.level);

            const isOwner = character.user_id === user.id;
            const isSharedWithMe = sharedCharacterIds.has(character.id);

            return (
              <Link key={character.id} href={`/characters/${character.id}`}>
                <Card
                  className="transition-colors hover:border-primary/50"
                  data-testid={`character-card-${character.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <AvatarDisplay
                        name={character.name}
                        avatarUrl={character.avatar_url}
                        size={40}
                      />
                      <div className="flex flex-1 items-center gap-2">
                        <CardTitle className="font-heading text-xl">{character.name}</CardTitle>
                        {isOwner && !character.is_public && (
                          <Badge variant="outline" data-testid="badge-private">
                            {ts("badgePrivate")}
                          </Badge>
                        )}
                        {isOwner && character.is_public && (
                          <Badge variant="secondary" data-testid="badge-public">
                            {ts("badgePublic")}
                          </Badge>
                        )}
                        {!isOwner && isSharedWithMe && (
                          <Badge variant="secondary" data-testid="badge-shared">
                            {ts("badgeShared")}
                          </Badge>
                        )}
                        {!isOwner && !isSharedWithMe && character.is_public && (
                          <Badge variant="outline" data-testid="badge-public">
                            {ts("badgePublic")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {race && <Badge variant="secondary">{race.name}</Badge>}
                      {classNames && <Badge variant="secondary">{classNames}</Badge>}
                      <Badge variant="outline">
                        {t("level")} {levelDisplay}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      HP: {character.hp_current}/{character.hp_max}
                    </div>
                    {!isOwner && (
                      <div className="text-xs text-muted-foreground">
                        {ts("sharedBy", { player: character.player_name || "?" })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
