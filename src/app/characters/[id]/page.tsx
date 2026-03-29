import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/supabase/auth";
import { GlassCard } from "@/components/glass-card";
import { PenLine, Swords } from "lucide-react";
import type { CharacterRow } from "@/lib/supabase/types";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  await requireAuth();
  const supabase = await createClient();
  const t = await getTranslations("characters");

  const { data: character } = await supabase
    .from("characters")
    .select("id, name, avatar_url")
    .eq("id", id)
    .single<Pick<CharacterRow, "id" | "name" | "avatar_url">>();

  if (!character) {
    notFound();
  }

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-6 p-6"
      data-testid="character-choice-page"
    >
      {/* Character avatar + name */}
      <div className="flex flex-col items-center gap-3">
        {character.avatar_url ? (
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary/30">
            <Image
              src={character.avatar_url}
              alt={character.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-muted font-heading text-2xl">
            {character.name.charAt(0)}
          </div>
        )}
        <h1 className="font-heading text-2xl text-primary sm:text-3xl">{character.name}</h1>
        <p className="text-center text-muted-foreground">{t("characterChoice")}</p>
      </div>

      <div className="grid w-full max-w-lg grid-rows-[1fr_1fr] gap-4 sm:grid-cols-2 sm:grid-rows-[1fr]">
        <Link
          href={`/characters/${id}/manage`}
          className="block"
          data-testid="character-manage-link"
        >
          <GlassCard
            glow="neutral"
            className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <PenLine className="h-10 w-10 text-primary" />
            <h2 className="font-heading text-lg">{t("manageCharacter")}</h2>
            <p className="text-sm text-muted-foreground">{t("manageCharacterDesc")}</p>
          </GlassCard>
        </Link>

        <Link href={`/characters/${id}/play`} className="block" data-testid="character-play-link">
          <GlassCard
            glow="neutral"
            className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <Swords className="h-10 w-10 text-primary" />
            <h2 className="font-heading text-lg">{t("playCharacter")}</h2>
            <p className="text-sm text-muted-foreground">{t("playCharacterDesc")}</p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
