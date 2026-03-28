import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Transkription ist nicht konfiguriert (OPENAI_API_KEY fehlt)." },
      { status: 503 }
    );
  }

  try {
    const { audioUrl, entryId } = await request.json();

    if (!audioUrl || !entryId) {
      return NextResponse.json(
        { error: "audioUrl und entryId sind erforderlich." },
        { status: 400 }
      );
    }

    // Verify entry belongs to user
    const { data: entry } = await supabase
      .from("session_entries")
      .select("id, user_id")
      .eq("id", entryId)
      .single();

    if (!entry || entry.user_id !== user.id) {
      return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
    }

    // Download audio from Supabase Storage URL
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      return NextResponse.json({ error: "Audio konnte nicht geladen werden." }, { status: 422 });
    }

    const audioBlob = await audioResponse.blob();

    // Send to OpenAI Whisper API
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "de");

    const whisperResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.json().catch(() => ({}));
      const errorMsg =
        (errorData as { error?: { message?: string } })?.error?.message ??
        "Transkription fehlgeschlagen.";
      return NextResponse.json({ error: errorMsg }, { status: 502 });
    }

    const result = (await whisperResponse.json()) as { text: string };
    const transcription = result.text;

    // Update session entry with transcription
    await supabase
      .from("session_entries")
      .update({ audio_transcription: transcription })
      .eq("id", entryId);

    return NextResponse.json({ transcription });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Transkription fehlgeschlagen.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
