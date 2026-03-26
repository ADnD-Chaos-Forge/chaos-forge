import { createClient } from "@/lib/supabase/client";
import { resizeImageToSquare } from "./resize";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Nur JPG, PNG oder WebP Dateien sind erlaubt.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Die Datei darf maximal 2 MB groß sein.";
  }
  return null;
}

export async function uploadAvatar(
  file: File,
  userId: string,
  characterId: string
): Promise<UploadResult> {
  const validationError = validateFile(file);
  if (validationError) {
    return { url: null, error: validationError };
  }

  try {
    const resized = await resizeImageToSquare(file);
    const supabase = createClient();
    const path = `${userId}/${characterId}.webp`;

    // Remove old avatar if exists
    await supabase.storage.from("avatars").remove([path]);

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, resized, {
      contentType: "image/webp",
      upsert: true,
    });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    // Update character record
    await supabase.from("characters").update({ avatar_url: publicUrl }).eq("id", characterId);

    return { url: publicUrl, error: null };
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : "Upload fehlgeschlagen.",
    };
  }
}
