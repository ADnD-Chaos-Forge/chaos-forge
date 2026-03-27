import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Badge } from "@/components/ui/badge";
import type { SessionRow, TagRow } from "@/lib/supabase/types";

const TAG_COLORS: Record<string, string> = {
  npc: "bg-red-900/50 text-red-200",
  location: "bg-green-900/50 text-green-200",
  item: "bg-blue-900/50 text-blue-200",
  quest: "bg-purple-900/50 text-purple-200",
};

export default async function SessionsPage() {
  const t = await getTranslations("sessions");
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .order("session_date", { ascending: false })
    .returns<SessionRow[]>();

  // Fetch tags for all sessions
  const sessionIds = sessions?.map((s) => s.id) ?? [];
  const { data: sessionTags } = await supabase
    .from("session_tags")
    .select("session_id, tag_id, tags(*)")
    .in("session_id", sessionIds.length > 0 ? sessionIds : ["none"]);

  // Group tags by session
  const tagsBySession: Record<string, TagRow[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessionTags?.forEach((st: any) => {
    if (!tagsBySession[st.session_id]) tagsBySession[st.session_id] = [];
    if (st.tags) tagsBySession[st.session_id].push(st.tags as TagRow);
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" data-testid="sessions-page">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl text-primary">{t("title")}</h1>
        <Link href="/sessions/new">
          <Button data-testid="create-session-button">{t("newSession")}</Button>
        </Link>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          data-testid="no-sessions"
        >
          <p className="text-lg text-muted-foreground">{t("noSessions")}</p>
          <Link href="/sessions/new">
            <Button size="lg">{t("createFirst")}</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => {
            const tags = tagsBySession[session.id] ?? [];
            const dateStr = new Date(session.session_date).toLocaleDateString("de-DE", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return (
              <Link key={session.id} href={`/sessions/${session.id}`}>
                <GlassCard glow="neutral" data-testid={`session-card-${session.id}`}>
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading text-xl text-foreground">{session.title}</h3>
                    <span className="text-sm text-muted-foreground">{dateStr}</span>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          className={TAG_COLORS[tag.type] ?? ""}
                          variant="secondary"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {session.summary && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {session.summary}
                    </p>
                  )}
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
