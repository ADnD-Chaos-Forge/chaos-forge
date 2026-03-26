import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Vision-Import ist nicht konfiguriert (ANTHROPIC_API_KEY fehlt)." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Kein Bild hochgeladen." }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Bild darf maximal 5 MB groß sein." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const isPdf = file.type === "application/pdf";
    const mediaType = file.type as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/gif"
      | "application/pdf";

    const client = new Anthropic({ apiKey });

    const contentBlock = isPdf
      ? {
          type: "document" as const,
          source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
            data: base64,
          },
        };

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: `Analysiere diesen AD&D 2nd Edition Charakterbogen und extrahiere die folgenden Werte als JSON.
Antworte NUR mit validem JSON, kein anderer Text.

Erwartetes Format:
{
  "name": "Charaktername",
  "race": "human|elf|half_elf|dwarf|gnome|halfling|half_orc",
  "class": "fighter|ranger|paladin|mage|cleric|druid|thief|bard",
  "level": 1,
  "str": 10,
  "strExceptional": null,
  "dex": 10,
  "con": 10,
  "int": 10,
  "wis": 10,
  "cha": 10,
  "hpMax": 10
}

Hinweise:
- "race" muss einer der angegebenen IDs sein (Kleinschreibung, Underscore)
- "class" muss einer der angegebenen IDs sein
- "strExceptional" ist nur relevant bei STR 18 und Krieger-Klassen (1-100, wobei 100 = "18/00")
- Wenn ein Wert nicht lesbar ist, verwende einen sinnvollen Standardwert
- Übersetze deutsche Bezeichnungen (z.B. "Mensch" → "human", "Kämpfer" → "fighter")`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Konnte keine Charakterdaten aus dem Bild extrahieren." },
        { status: 422 }
      );
    }

    const extracted = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ character: extracted });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Scan fehlgeschlagen.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
