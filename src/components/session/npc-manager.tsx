"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { ChronicleNpcRow } from "@/lib/supabase/types";

interface NpcManagerProps {
  npcs: ChronicleNpcRow[];
}

export function NpcManager({ npcs: initialNpcs }: NpcManagerProps) {
  const t = useTranslations("chronicle");
  const tcom = useTranslations("common");
  const [npcs, setNpcs] = useState(initialNpcs);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredNpcs = npcs.filter(
    (npc) =>
      npc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      npc.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    const supabase = createClient();

    if (editingId) {
      const { error } = await supabase
        .from("chronicle_npcs")
        .update({ name: name.trim(), location: location.trim(), description: description.trim() })
        .eq("id", editingId);
      if (!error) {
        setNpcs((prev) =>
          prev.map((npc) =>
            npc.id === editingId
              ? {
                  ...npc,
                  name: name.trim(),
                  location: location.trim(),
                  description: description.trim(),
                }
              : npc
          )
        );
      }
    } else {
      const { data, error } = await supabase
        .from("chronicle_npcs")
        .insert({ name: name.trim(), location: location.trim(), description: description.trim() })
        .select()
        .single<ChronicleNpcRow>();
      if (!error && data) {
        setNpcs((prev) => [data, ...prev]);
      }
    }

    resetForm();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("chronicle_npcs").delete().eq("id", id);
    if (!error) {
      setNpcs((prev) => prev.filter((npc) => npc.id !== id));
    }
  }

  function startEdit(npc: ChronicleNpcRow) {
    setEditingId(npc.id);
    setName(npc.name);
    setLocation(npc.location);
    setDescription(npc.description);
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setLocation("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <div data-testid="npc-manager">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-xl text-primary">{t("npcs")}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          data-testid="npc-add-button"
        >
          {showForm ? tcom("cancel") : t("addNpc")}
        </Button>
      </div>

      {/* Search */}
      {npcs.length > 3 && (
        <Input
          placeholder={t("searchNpcs")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3"
          data-testid="npc-search"
        />
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="mb-4 rounded-lg border border-border bg-card/50 p-4" data-testid="npc-form">
          <div className="flex flex-col gap-3">
            <Input
              placeholder={t("npcName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="npc-name-input"
              autoFocus
            />
            <Input
              placeholder={t("npcLocation")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              data-testid="npc-location-input"
            />
            <textarea
              placeholder={t("npcDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              data-testid="npc-description-input"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={resetForm}>
                {tcom("cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !name.trim()}
                data-testid="npc-save-button"
              >
                {saving && <Spinner className="mr-2" />}
                {editingId ? tcom("save") : tcom("add")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NPC List */}
      {filteredNpcs.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground" data-testid="npc-empty">
          {t("noNpcs")}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredNpcs.map((npc) => (
            <div
              key={npc.id}
              className="rounded-lg border border-border bg-card/30 p-3"
              data-testid={`npc-card-${npc.id}`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === npc.id ? null : npc.id)}
                >
                  <span className="font-medium">{npc.name}</span>
                  {npc.location && (
                    <span className="ml-2 text-sm text-muted-foreground">— {npc.location}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(npc)}
                    data-testid={`npc-edit-${npc.id}`}
                  >
                    {tcom("edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(npc.id)}
                    data-testid={`npc-delete-${npc.id}`}
                  >
                    {tcom("delete")}
                  </Button>
                </div>
              </div>
              {expandedId === npc.id && npc.description && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {npc.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
