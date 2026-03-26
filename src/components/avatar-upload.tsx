"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AvatarDisplay } from "@/components/avatar-display";
import { uploadAvatar, validateFile } from "@/lib/avatar/upload";

interface AvatarUploadProps {
  characterId: string;
  userId: string;
  characterName: string;
  currentAvatarUrl: string | null;
}

export function AvatarUpload({
  characterId,
  userId,
  characterName,
  currentAvatarUrl,
}: AvatarUploadProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setUploading(true);
      const result = await uploadAvatar(file, userId, characterId);
      setUploading(false);

      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        router.refresh();
      }
    },
    [characterId, userId, router]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="relative" data-testid="avatar-upload">
      {/* Avatar with hover overlay */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer"
        data-testid="avatar-upload-trigger"
      >
        <AvatarDisplay name={characterName} avatarUrl={currentAvatarUrl} size={80} />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs text-white">Ändern</span>
        </div>
      </button>

      {/* Upload Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
          data-testid="avatar-upload-modal"
        >
          <div
            className="mx-4 flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl text-primary">Avatar hochladen</h3>

            <div className="flex justify-center">
              <AvatarDisplay name={characterName} avatarUrl={currentAvatarUrl} size={120} />
            </div>

            {/* Drop Zone */}
            <div
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed p-8 transition-colors ${
                dragOver ? "border-primary bg-primary/10" : "border-border"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-testid="avatar-dropzone"
            >
              <p className="text-sm text-muted-foreground">
                Bild hierher ziehen oder klicken zum Auswählen
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG oder WebP (max. 2 MB)</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="avatar-file-input"
            />

            {uploading && <p className="text-center text-sm text-muted-foreground">Lade hoch...</p>}

            {error && (
              <p className="text-sm text-destructive" data-testid="avatar-upload-error">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
