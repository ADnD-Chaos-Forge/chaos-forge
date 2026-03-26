"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarDisplay } from "@/components/avatar-display";
import { SessionEntryForm } from "./session-entry-form";
import { TagManager } from "./tag-manager";
import type { SessionRow, SessionEntryRow, TagRow, CharacterRow } from "@/lib/supabase/types";

const TAG_COLORS: Record<string, string> = {
  npc: "bg-red-900/50 text-red-200",
  location: "bg-green-900/50 text-green-200",
  item: "bg-blue-900/50 text-blue-200",
  quest: "bg-purple-900/50 text-purple-200",
};

interface SessionDetailProps {
  session: SessionRow;
  entries: SessionEntryRow[];
  entryCharacters: Pick<CharacterRow, "id" | "name" | "avatar_url" | "race_id" | "class_id">[];
  userCharacters: Pick<CharacterRow, "id" | "name" | "avatar_url">[];
  tags: TagRow[];
  allTags: TagRow[];
  userId: string;
  isCreator: boolean;
}

export function SessionDetail({
  session,
  entries,
  entryCharacters,
  userCharacters,
  tags,
  allTags,
  userId,
  isCreator,
}: SessionDetailProps) {
  const router = useRouter();
  const [summary, setSummary] = useState(session.summary);
  const [savingSummary, setSavingSummary] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryDirty, setSummaryDirty] = useState(false);

  const dateStr = new Date(session.session_date).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const characterMap = Object.fromEntries(entryCharacters.map((c) => [c.id, c]));

  // Check if user already has an entry
  const userEntry = entries.find((e) => e.user_id === userId);
  const userHasCharacters = userCharacters.length > 0;

  async function handleSaveSummary() {
    setSavingSummary(true);
    const supabase = createClient();
    await supabase.from("sessions").update({ summary }).eq("id", session.id);
    setSavingSummary(false);
    setSummaryDirty(false);
    router.refresh();
  }

  async function handleGenerateSummary() {
    if (entries.length === 0) return;
    setGeneratingSummary(true);

    try {
      const formattedEntries = entries.map((e) => ({
        characterName: characterMap[e.character_id]?.name ?? "Unbekannt",
        content: e.content,
      }));

      const res = await fetch("/api/summarize-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: formattedEntries }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setSummary(data.summary);
        setSummaryDirty(true);
      }
    } catch {
      alert("Zusammenfassung fehlgeschlagen.");
    }

    setGeneratingSummary(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6" data-testid="session-detail">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-primary" data-testid="session-title">
          {session.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{dateStr}</p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag.id} className={TAG_COLORS[tag.type] ?? ""} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tags Manager (for session creator) */}
      {isCreator && (
        <div className="mb-6">
          <TagManager sessionId={session.id} currentTags={tags} allTags={allTags} />
        </div>
      )}

      <Separator />

      {/* Entries */}
      <div className="my-6 flex flex-col gap-4">
        <h2 className="font-heading text-xl">Charakter-Beiträge</h2>

        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground" data-testid="no-entries">
            Noch keine Beiträge. Schreibe den ersten!
          </p>
        )}

        {entries.map((entry) => {
          const char = characterMap[entry.character_id];
          return (
            <Card key={entry.id} data-testid={`session-entry-${entry.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <AvatarDisplay
                    name={char?.name ?? "?"}
                    avatarUrl={char?.avatar_url ?? null}
                    size={36}
                  />
                  <CardTitle className="text-lg">{char?.name ?? "Unbekannt"}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{entry.content}</ReactMarkdown>
              </CardContent>
            </Card>
          );
        })}

        {/* Entry Form (if user hasn't written one yet and has characters) */}
        {!userEntry && userHasCharacters && (
          <SessionEntryForm
            sessionId={session.id}
            userId={userId}
            userCharacters={userCharacters}
          />
        )}

        {!userHasCharacters && (
          <p className="text-sm text-muted-foreground">
            Erstelle zuerst einen Charakter, um einen Beitrag zu schreiben.
          </p>
        )}
      </div>

      <Separator />

      {/* Summary */}
      <div className="my-6 flex flex-col gap-3" data-testid="session-summary-section">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl">Zusammenfassung</h2>
          <div className="flex gap-2">
            {entries.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={generatingSummary}
                data-testid="generate-summary-button"
              >
                {generatingSummary ? "Generiere..." : "KI-Zusammenfassung"}
              </Button>
            )}
            {summaryDirty && (
              <Button
                size="sm"
                onClick={handleSaveSummary}
                disabled={savingSummary}
                data-testid="save-summary-button"
              >
                {savingSummary ? "Speichere..." : "Speichern"}
              </Button>
            )}
          </div>
        </div>

        {isCreator ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="summary-editor" className="sr-only">
              Zusammenfassung
            </Label>
            <textarea
              id="summary-editor"
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                setSummaryDirty(true);
              }}
              className="min-h-[150px] w-full rounded-md border border-input bg-input p-3 text-sm"
              placeholder="Zusammenfassung der Session (Markdown)..."
              data-testid="summary-editor"
            />
            {summary && (
              <div className="rounded-md border border-border p-4">
                <p className="mb-2 text-xs text-muted-foreground">Vorschau:</p>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : summary ? (
          <div className="prose prose-sm prose-invert max-w-none rounded-md border border-border p-4">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Noch keine Zusammenfassung vorhanden.</p>
        )}
      </div>
    </div>
  );
}
