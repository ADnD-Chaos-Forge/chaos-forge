import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarDisplay } from "@/components/avatar-display";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
import type { CharacterRow, CharacterClassRow } from "@/lib/supabase/types";

export default async function CharactersPage() {
  const t = await getTranslations("characters");
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

  const charClassMap = new Map<string, CharacterClassRow[]>();
  for (const cc of allCharClasses ?? []) {
    const existing = charClassMap.get(cc.character_id) ?? [];
    existing.push(cc);
    charClassMap.set(cc.character_id, existing);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" data-testid="characters-page">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">{t("title")}</h1>
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
                      <CardTitle className="font-heading text-xl">{character.name}</CardTitle>
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
