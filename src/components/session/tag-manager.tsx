"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { TagRow } from "@/lib/supabase/types";

const TAG_TYPES = [
  { value: "npc", label: "NPC", color: "bg-red-900/50 text-red-200" },
  { value: "location", label: "Ort", color: "bg-green-900/50 text-green-200" },
  { value: "item", label: "Gegenstand", color: "bg-blue-900/50 text-blue-200" },
  { value: "quest", label: "Quest", color: "bg-purple-900/50 text-purple-200" },
] as const;

interface TagManagerProps {
  sessionId: string;
  currentTags: TagRow[];
  allTags: TagRow[];
}

export function TagManager({ sessionId, currentTags, allTags }: TagManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [newTagType, setNewTagType] = useState<string>("npc");

  const currentTagIds = new Set(currentTags.map((t) => t.id));
  const filteredTags = allTags.filter(
    (t) => !currentTagIds.has(t.id) && t.name.toLowerCase().includes(search.toLowerCase())
  );
  const canCreateNew =
    search.trim() && !allTags.some((t) => t.name.toLowerCase() === search.toLowerCase());

  async function addExistingTag(tagId: string) {
    const supabase = createClient();
    await supabase.from("session_tags").insert({ session_id: sessionId, tag_id: tagId });
    setSearch("");
    setShowDropdown(false);
    router.refresh();
  }

  async function createAndAddTag() {
    const supabase = createClient();
    const { data: newTag } = await supabase
      .from("tags")
      .insert({ name: search.trim(), type: newTagType })
      .select("id")
      .single();

    if (newTag) {
      await supabase.from("session_tags").insert({ session_id: sessionId, tag_id: newTag.id });
    }
    setSearch("");
    setShowDropdown(false);
    router.refresh();
  }

  async function removeTag(tagId: string) {
    const supabase = createClient();
    await supabase.from("session_tags").delete().eq("session_id", sessionId).eq("tag_id", tagId);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2" data-testid="tag-manager">
      <div className="flex flex-wrap gap-1">
        {currentTags.map((tag) => {
          const typeInfo = TAG_TYPES.find((t) => t.value === tag.type);
          return (
            <Badge
              key={tag.id}
              className={`cursor-pointer ${typeInfo?.color ?? ""}`}
              variant="secondary"
              onClick={() => removeTag(tag.id)}
              data-testid={`tag-${tag.id}`}
            >
              {tag.name} ×
            </Badge>
          );
        })}
      </div>

      <div className="relative">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Tag hinzufügen..."
          className="max-w-xs"
          data-testid="tag-search-input"
        />

        {showDropdown && search && (
          <div className="absolute z-10 mt-1 w-full max-w-xs rounded-md border border-border bg-card shadow-lg">
            {filteredTags.slice(0, 5).map((tag) => (
              <button
                key={tag.id}
                onClick={() => addExistingTag(tag.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                data-testid={`tag-suggestion-${tag.id}`}
              >
                <Badge
                  className={TAG_TYPES.find((t) => t.value === tag.type)?.color ?? ""}
                  variant="secondary"
                >
                  {tag.type}
                </Badge>
                {tag.name}
              </button>
            ))}

            {canCreateNew && (
              <div className="border-t border-border px-3 py-2">
                <div className="mb-2 flex gap-1">
                  {TAG_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewTagType(type.value)}
                      className={`rounded px-2 py-1 text-xs ${
                        newTagType === type.value ? type.color : "text-muted-foreground"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={createAndAddTag} className="w-full">
                  &quot;{search.trim()}&quot; als neuen Tag erstellen
                </Button>
              </div>
            )}

            {filteredTags.length === 0 && !canCreateNew && (
              <p className="px-3 py-2 text-sm text-muted-foreground">Keine Tags gefunden.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
