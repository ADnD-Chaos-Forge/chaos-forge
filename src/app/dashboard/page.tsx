import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarDisplay } from "@/components/avatar-display";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
import type { CharacterRow, SessionRow } from "@/lib/supabase/types";

function hpColor(current: number, max: number): string {
  if (max === 0) return "text-muted-foreground";
  const pct = current / max;
  if (pct > 0.5) return "text-green-400";
  if (pct > 0.25) return "text-yellow-400";
  return "text-red-400";
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const supabase = await createClient();

  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .order("name")
    .returns<CharacterRow[]>();

  const { data: latestSession } = await supabase
    .from("sessions")
    .select("*")
    .order("session_date", { ascending: false })
    .limit(1)
    .returns<SessionRow[]>();

  const avgLevel =
    characters && characters.length > 0
      ? Math.round(characters.reduce((sum, c) => sum + c.level, 0) / characters.length)
      : 0;

  const classGroups =
    characters?.reduce(
      (acc, c) => {
        const cls = c.class_id ? CLASSES[c.class_id as keyof typeof CLASSES] : null;
        const group = cls?.group ?? "unknown";
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) ?? {};

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" data-testid="dashboard-page">
      <h1 className="font-heading text-3xl text-primary">{t("title")}</h1>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground">{t("adventurers")}</div>
            <div className="font-heading text-3xl text-primary">{characters?.length ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground">{t("averageLevel")}</div>
            <div className="font-heading text-3xl text-primary">{avgLevel}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-xs text-muted-foreground">{t("classDistribution")}</div>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {Object.entries(classGroups).map(([group, count]) => (
                <Badge key={group} variant="secondary">
                  {group}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Session */}
      {latestSession && latestSession.length > 0 && (
        <Link href={`/sessions/${latestSession[0].id}`}>
          <Card className="transition-colors hover:border-primary/50" data-testid="latest-session">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="text-xs text-muted-foreground">{t("latestSession")}</div>
                <div className="font-heading text-lg">{latestSession[0].title}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(latestSession[0].session_date).toLocaleDateString("de-DE")}
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Character Grid */}
      <h2 className="font-heading text-xl">{t("allCharacters")}</h2>
      {!characters || characters.length === 0 ? (
        <p className="text-muted-foreground">{t("noCharacters")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => {
            const race = character.race_id ? RACES[character.race_id as keyof typeof RACES] : null;
            const cls = character.class_id
              ? CLASSES[character.class_id as keyof typeof CLASSES]
              : null;
            const hpClass = hpColor(character.hp_current, character.hp_max);

            return (
              <Link key={character.id} href={`/characters/${character.id}`}>
                <Card
                  className="transition-colors hover:border-primary/50"
                  data-testid={`dashboard-char-${character.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <AvatarDisplay
                        name={character.name}
                        avatarUrl={character.avatar_url}
                        size={48}
                      />
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        <div className="flex flex-wrap gap-1">
                          {race && (
                            <Badge variant="secondary" className="text-xs">
                              {race.name}
                            </Badge>
                          )}
                          {cls && (
                            <Badge variant="secondary" className="text-xs">
                              {cls.name}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Stufe {character.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`font-mono text-lg ${hpClass}`}>
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
