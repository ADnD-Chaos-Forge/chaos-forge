"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AvatarDisplay } from "@/components/avatar-display";
import type { CharacterRow } from "@/lib/supabase/types";

interface SessionEntryFormProps {
  sessionId: string;
  userId: string;
  userCharacters: Pick<CharacterRow, "id" | "name" | "avatar_url">[];
}

export function SessionEntryForm({ sessionId, userId, userCharacters }: SessionEntryFormProps) {
  const router = useRouter();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    userCharacters.length === 1 ? userCharacters[0].id : null
  );
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCharacterId || !content.trim()) return;

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("session_entries").insert({
      session_id: sessionId,
      character_id: selectedCharacterId,
      user_id: userId,
      content: content.trim(),
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md border border-dashed border-border p-4"
      data-testid="session-entry-form"
    >
      <h3 className="font-heading text-lg">Deinen Beitrag schreiben</h3>

      {/* Character selection */}
      {userCharacters.length > 1 && (
        <div className="flex flex-col gap-2">
          <Label>Als welcher Charakter?</Label>
          <div className="flex flex-wrap gap-2">
            {userCharacters.map((char) => (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelectedCharacterId(char.id)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 transition-colors ${
                  selectedCharacterId === char.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                }`}
                data-testid={`entry-character-${char.id}`}
              >
                <AvatarDisplay name={char.name} avatarUrl={char.avatar_url} size={24} />
                <span className="text-sm">{char.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCharacterId && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="entry-content">
              Beitrag (Markdown){" "}
              <span className="text-muted-foreground">— aus der Sicht deines Charakters</span>
            </Label>
            <textarea
              id="entry-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] w-full rounded-md border border-input bg-input p-3 text-sm"
              placeholder="Was hat dein Charakter erlebt? Was waren die wichtigsten Momente?"
              data-testid="entry-content-textarea"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving || !content.trim()}
              data-testid="entry-submit-button"
            >
              {saving ? "Speichere..." : "Beitrag veröffentlichen"}
            </Button>
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-destructive" data-testid="entry-error">
          {error}
        </p>
      )}
    </form>
  );
}
