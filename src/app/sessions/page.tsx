import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionRow, TagRow } from "@/lib/supabase/types";

const TAG_COLORS: Record<string, string> = {
  npc: "bg-red-900/50 text-red-200",
  location: "bg-green-900/50 text-green-200",
  item: "bg-blue-900/50 text-blue-200",
  quest: "bg-purple-900/50 text-purple-200",
};

export default async function SessionsPage() {
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
        <h1 className="font-heading text-3xl text-primary">Die Chronik des Chaos</h1>
        <Link href="/sessions/new">
          <Button data-testid="create-session-button">Neue Session</Button>
        </Link>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
          data-testid="no-sessions"
        >
          <p className="text-lg text-muted-foreground">
            Noch keine Sessions in der Chronik. Zeit, das erste Abenteuer festzuhalten!
          </p>
          <Link href="/sessions/new">
            <Button size="lg">Erste Session erstellen</Button>
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
                <Card
                  className="transition-colors hover:border-primary/50"
                  data-testid={`session-card-${session.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-heading text-xl">{session.title}</CardTitle>
                      <span className="text-sm text-muted-foreground">{dateStr}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {session.summary}
                      </p>
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
