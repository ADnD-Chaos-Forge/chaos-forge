import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { GlassCard } from "@/components/glass-card";
import { CharacterCard } from "@/components/character-card";
import { RACES } from "@/lib/rules/races";
import { CLASSES } from "@/lib/rules/classes";
import type { CharacterRow, CharacterClassRow, SessionRow } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const ts = await getTranslations("sharing");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .order("name")
    .returns<CharacterRow[]>();

  // Load character_classes for multiclass display
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

  const { data: latestSession } = await supabase
    .from("sessions")
    .select("*")
    .order("session_date", { ascending: false })
    .limit(1)
    .returns<SessionRow[]>();

  // Calculate avg level using character_classes if available
  const avgLevel = (() => {
    if (!characters || characters.length === 0) return 0;
    let totalLevel = 0;
    let count = 0;
    for (const c of characters) {
      const classes = (charClassMap.get(c.id) ?? []).filter((cc) => cc.is_active);
      if (classes.length > 0) {
        totalLevel += Math.max(...classes.map((cc) => cc.level));
      } else {
        totalLevel += c.level;
      }
      count++;
    }
    return Math.round(totalLevel / count);
  })();

  // Class distribution: multiclass chars count for each of their classes
  const classGroups: Record<string, number> = {};
  for (const c of characters ?? []) {
    const classes = (charClassMap.get(c.id) ?? []).filter((cc) => cc.is_active);
    if (classes.length > 0) {
      for (const cc of classes) {
        const cls = CLASSES[cc.class_id as keyof typeof CLASSES];
        const group = cls?.group ?? "unknown";
        classGroups[group] = (classGroups[group] || 0) + 1;
      }
    } else if (c.class_id) {
      const cls = CLASSES[c.class_id as keyof typeof CLASSES];
      const group = cls?.group ?? "unknown";
      classGroups[group] = (classGroups[group] || 0) + 1;
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" data-testid="dashboard-page">
      <h1 className="font-heading text-3xl text-primary">{t("title")}</h1>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard glow="neutral" data-testid="stat-card-adventurers">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">{t("adventurers")}</div>
            <div className="font-heading text-3xl text-primary">{characters?.length ?? 0}</div>
          </div>
        </GlassCard>
        <GlassCard glow="neutral" data-testid="stat-card-avg-level">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">{t("averageLevel")}</div>
            <div className="font-heading text-3xl text-primary">{avgLevel}</div>
          </div>
        </GlassCard>
        <GlassCard glow="neutral" data-testid="stat-card-class-distribution">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">{t("classDistribution")}</div>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {Object.entries(classGroups).map(([group, count]) => (
                <span
                  key={group}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {group}: {count}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Latest Session */}
      {latestSession && latestSession.length > 0 && (
        <Link href={`/sessions/${latestSession[0].id}`}>
          <GlassCard glow="neutral" data-testid="latest-session">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{t("latestSession")}</div>
                <div className="font-heading text-lg">{latestSession[0].title}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(latestSession[0].session_date).toLocaleDateString("de-DE")}
              </div>
            </div>
          </GlassCard>
        </Link>
      )}

      {/* Character Grid */}
      <h2 className="font-heading text-xl">{t("allCharacters")}</h2>
      {!characters || characters.length === 0 ? (
        <p className="text-muted-foreground">{t("noCharacters")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              classes={charClassMap.get(character.id) ?? []}
              isOwner={true}
              isSharedWithMe={false}
              badgePrivateLabel={ts("badgePrivate")}
              badgeSharedLabel={ts("badgeShared")}
              badgePublicLabel={ts("badgePublic")}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
