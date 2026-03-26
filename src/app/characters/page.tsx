import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
import type { CharacterRow } from "@/lib/supabase/types";

export default async function CharactersPage() {
  const supabase = await createClient();
  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .order("updated_at", { ascending: false })
    .returns<CharacterRow[]>();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" data-testid="characters-page">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">Deine Charaktere</h1>
        <Link href="/characters/new">
          <Button data-testid="create-character-button">Neuer Charakter</Button>
        </Link>
      </div>

      {!characters || characters.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center" data-testid="no-characters">
          <p className="text-lg text-muted-foreground">
            Noch keine Charaktere erstellt. Zeit, deine Legende zu schmieden!
          </p>
          <Link href="/characters/new">
            <Button size="lg">Ersten Charakter erstellen</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => {
            const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
            const cls = character.class_id ? CLASSES[character.class_id as keyof typeof CLASSES] : null;

            return (
              <Link key={character.id} href={`/characters/${character.id}`}>
                <Card className="transition-colors hover:border-primary/50" data-testid={`character-card-${character.id}`}>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">{character.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {race && <Badge variant="secondary">{race.name}</Badge>}
                      {cls && <Badge variant="secondary">{cls.name}</Badge>}
                      <Badge variant="outline">Stufe {character.level}</Badge>
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
