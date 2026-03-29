"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function FabNewCharacter() {
  const t = useTranslations("nav");

  return (
    <Link
      href="/characters/new"
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full glass glow-neutral touch-press sm:hidden"
      data-testid="fab-new-character"
      aria-label={t("newCharacter")}
    >
      <Plus className="h-6 w-6 text-primary" />
    </Link>
  );
}
