import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { validateImportFiles } from "@/app/characters/import/import-validation";

type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

function buildContentBlock(
  base64: string,
  mediaType: string,
  isPdf: boolean
):
  | { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } }
  | { type: "image"; source: { type: "base64"; media_type: ImageMediaType; data: string } } {
  if (isPdf) {
    return {
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 },
    };
  }
  return {
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: mediaType as ImageMediaType,
      data: base64,
    },
  };
}

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

    // Support both old "image" field (single file) and new "files" field (multiple files)
    const files = formData.getAll("files") as File[];
    const legacyFile = formData.get("image") as File | null;

    const allFiles = files.length > 0 ? files : legacyFile ? [legacyFile] : [];

    const validation = validateImportFiles(allFiles);
    if (!validation.valid) {
      const errorMessages: Record<string, string> = {
        noFiles: "Keine Dateien hochgeladen.",
        tooManyFiles: "Maximal 5 Dateien erlaubt.",
        fileTooLarge: `Datei "${validation.errorParams?.name ?? ""}" ist zu groß (max. 10 MB pro Datei).`,
        totalTooLarge: "Gesamtgröße darf 50 MB nicht überschreiten.",
      };
      return NextResponse.json(
        { error: errorMessages[validation.errorKey ?? "noFiles"] },
        { status: 400 }
      );
    }

    // Build content blocks for all files
    const contentBlocks: Array<
      | {
          type: "document";
          source: { type: "base64"; media_type: "application/pdf"; data: string };
        }
      | { type: "image"; source: { type: "base64"; media_type: ImageMediaType; data: string } }
    > = [];

    for (const file of allFiles) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const isPdf = file.type === "application/pdf";
      contentBlocks.push(buildContentBlock(base64, file.type, isPdf));
    }

    const isMultiFile = allFiles.length > 1;

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            ...contentBlocks,
            {
              type: "text",
              text: `Analysiere diesen AD&D 2nd Edition Charakterbogen und extrahiere ALLE verfügbaren Werte als JSON.
Antworte NUR mit validem JSON, kein anderer Text.
${isMultiFile ? "\nDieser Charakterbogen erstreckt sich über mehrere Seiten/Dateien. Kombiniere die Informationen aus allen Seiten zu einem einzelnen Charakter.\n" : ""}
Erwartetes Format:
{
  "name": "Charaktername",
  "race": "human|elf|half_elf|dwarf|gnome|halfling|half_orc",
  "class": "fighter|ranger|paladin|mage|cleric|druid|thief|bard",
  "kit": null,
  "level": 1,
  "alignment": "chaotic_neutral",
  "xp": 0,
  "str": 10,
  "strExceptional": null,
  "dex": 10,
  "con": 10,
  "int": 10,
  "wis": 10,
  "cha": 10,
  "strStamina": null,
  "strMuscle": null,
  "dexAim": null,
  "dexBalance": null,
  "conHealth": null,
  "conFitness": null,
  "intReason": null,
  "intKnowledge": null,
  "wisIntuition": null,
  "wisWillpower": null,
  "chaLeadership": null,
  "chaAppearance": null,
  "hpMax": 10,
  "hpCurrent": 10,
  "goldPp": 0,
  "goldGp": 0,
  "goldSp": 0,
  "goldCp": 0,
  "playerName": null,
  "age": null,
  "gender": null,
  "weaponProficiencies": [],
  "equipment": [],
  "nwps": []
}

Hinweise:
- "race" muss einer der angegebenen IDs sein (Kleinschreibung, Underscore)
- "class" muss einer der angegebenen IDs sein
- "kit" kann "barbarian", "cavalier", "swashbuckler", "berserker", "assassin", "acrobat", "witch" etc. sein, oder null wenn kein Kit angegeben
- "alignment" muss eine ID sein: lawful_good, neutral_good, chaotic_good, lawful_neutral, true_neutral, chaotic_neutral, lawful_evil, neutral_evil, chaotic_evil
- "strExceptional" ist nur relevant bei STR 18 und Krieger-Klassen (1-100, wobei 100 = "18/00")
- Sub-Stats (strStamina, strMuscle, etc.) sind Player's Option Werte. Extrahiere sie wenn vorhanden, sonst null
- "weaponProficiencies" ist ein Array von {"name": "Waffe", "specialized": true/false}
- "equipment" ist ein Array von Strings mit den getragenen/mitgeführten Gegenständen
- "nwps" ist ein Array von Strings mit den Non-Weapon Proficiency Namen
- "xp" ist der aktuelle Erfahrungspunktestand
- Wenn ein Wert nicht lesbar ist, verwende null statt einen Standardwert zu raten
- Übersetze deutsche Bezeichnungen (z.B. "Mensch" → "human", "Kämpfer" → "fighter", "Chaotisch Neutral" → "chaotic_neutral")`,
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
