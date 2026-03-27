"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { RaceId, ClassId } from "@/lib/rules/types";
import { validateImportFiles } from "./import-validation";

interface ScannedCharacter {
  name: string;
  race: RaceId;
  class: ClassId;
  level: number;
  str: number;
  strExceptional: number | null;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  hpMax: number;
}

interface FilePreview {
  file: File;
  previewUrl: string | null; // null for PDFs
}

export default function ImportCharacterPage() {
  const router = useRouter();
  const t = useTranslations("import");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState<ScannedCharacter | null>(null);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  const validateFiles = useCallback(
    (files: File[]): string | null => {
      const result = validateImportFiles(files);
      if (!result.valid && result.errorKey) {
        return t(result.errorKey, result.errorParams);
      }
      return null;
    },
    [t]
  );

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      setError(validationError);
      return;
    }

    const previews: FilePreview[] = selectedFiles.map((file) => ({
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setFilePreviews(previews);
    setError(null);
  }

  function removeFile(index: number) {
    setFilePreviews((prev) => {
      const removed = prev[index];
      if (removed.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleScan() {
    if (filePreviews.length === 0) {
      setError(t("noFiles"));
      return;
    }

    setError(null);
    setScanning(true);

    try {
      const formData = new FormData();
      for (const { file } of filePreviews) {
        formData.append("files", file);
      }

      const res = await fetch("/api/scan-character", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setScanned(data.character);
      }
    } catch {
      setError("Scan fehlgeschlagen.");
    }

    setScanning(false);
  }

  function updateField<K extends keyof ScannedCharacter>(key: K, value: ScannedCharacter[K]) {
    if (!scanned) return;
    setScanned({ ...scanned, [key]: value });
  }

  async function handleCreate() {
    if (!scanned) return;
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Nicht eingeloggt.");
        setSaving(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("characters")
        .insert({
          user_id: user.id,
          name: scanned.name,
          level: scanned.level,
          race_id: scanned.race,
          class_id: scanned.class,
          str: scanned.str,
          str_exceptional: scanned.strExceptional,
          dex: scanned.dex,
          con: scanned.con,
          int: scanned.int,
          wis: scanned.wis,
          cha: scanned.cha,
          hp_current: scanned.hpMax,
          hp_max: scanned.hpMax,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      // Also insert into character_classes
      if (scanned.class) {
        await supabase.from("character_classes").insert({
          character_id: data.id,
          class_id: scanned.class,
          level: scanned.level,
          xp_current: 0,
        });
      }

      router.push(`/characters/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Erstellen.");
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6" data-testid="import-page">
      <h1 className="font-heading text-3xl text-primary">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>

      {/* Upload area */}
      {!scanned && (
        <>
          <div
            className="flex cursor-pointer flex-col items-center gap-4 rounded-md border-2 border-dashed border-border p-12 transition-colors hover:border-primary/50"
            onClick={() => fileInputRef.current?.click()}
            data-testid="import-dropzone"
          >
            {filePreviews.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-muted-foreground">{t("dropzone")}</p>
                <p className="text-xs text-muted-foreground/70">{t("dropzoneHint")}</p>
              </div>
            ) : (
              <p className="text-sm text-primary">
                {t("filesSelected", { count: filePreviews.length })}
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              data-testid="import-file-input"
            />
          </div>

          {/* Preview grid */}
          {filePreviews.length > 0 && (
            <div
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
              data-testid="import-preview-grid"
            >
              {filePreviews.map((fp, index) => (
                <div
                  key={`${fp.file.name}-${index}`}
                  className="group relative flex flex-col items-center gap-2 rounded-md border border-border p-2"
                  data-testid={`import-preview-${index}`}
                >
                  {fp.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fp.previewUrl}
                      alt={fp.file.name}
                      className="h-24 w-full rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded bg-muted text-sm font-medium text-primary">
                      PDF
                    </div>
                  )}
                  <p className="w-full truncate text-center text-xs text-muted-foreground">
                    {fp.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground shadow-sm hover:bg-destructive/80"
                    aria-label={t("removeFile")}
                    data-testid={`import-remove-file-${index}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Scan button */}
          {filePreviews.length > 0 && (
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="self-center"
              data-testid="import-scan-button"
            >
              {scanning ? t("scanning") : t("title")}
            </Button>
          )}
        </>
      )}

      {/* Scanned result — editable */}
      {scanned && (
        <Card data-testid="import-result">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-primary">{t("resultTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="import-name">Name</Label>
                <Input
                  id="import-name"
                  value={scanned.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  data-testid="import-name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="import-level">Stufe</Label>
                <Input
                  id="import-level"
                  type="number"
                  min={1}
                  max={20}
                  value={scanned.level}
                  onChange={(e) => updateField("level", parseInt(e.target.value) || 1)}
                  data-testid="import-level"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {(["str", "dex", "con", "int", "wis", "cha"] as const).map((attr) => (
                <div key={attr} className="flex flex-col gap-1">
                  <Label htmlFor={`import-${attr}`} className="text-xs uppercase">
                    {attr}
                  </Label>
                  <Input
                    id={`import-${attr}`}
                    type="number"
                    min={3}
                    max={18}
                    value={scanned[attr]}
                    onChange={(e) =>
                      updateField(attr, Math.max(3, Math.min(18, parseInt(e.target.value) || 3)))
                    }
                    className="text-center"
                    data-testid={`import-${attr}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="import-hp">Max. HP</Label>
              <Input
                id="import-hp"
                type="number"
                min={1}
                value={scanned.hpMax}
                onChange={(e) => updateField("hpMax", Math.max(1, parseInt(e.target.value) || 1))}
                className="max-w-[100px]"
                data-testid="import-hp"
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setScanned(null);
                  // Clean up preview URLs
                  for (const fp of filePreviews) {
                    if (fp.previewUrl) URL.revokeObjectURL(fp.previewUrl);
                  }
                  setFilePreviews([]);
                }}
              >
                {t("newPhoto")}
              </Button>
              <Button onClick={handleCreate} disabled={saving} data-testid="import-create-button">
                {saving ? t("creating") : t("createCharacter")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive" data-testid="import-error">
          {error}
        </p>
      )}
    </div>
  );
}
