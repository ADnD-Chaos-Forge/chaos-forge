"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LocaleToggle() {
  const router = useRouter();

  function toggleLocale() {
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    const next = current === "en" ? "de" : "en";
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    router.refresh();
  }

  const current =
    typeof document !== "undefined"
      ? (document.cookie
          .split("; ")
          .find((c) => c.startsWith("NEXT_LOCALE="))
          ?.split("=")[1] ?? "de")
      : "de";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      data-testid="locale-toggle"
      aria-label={current === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
    >
      {current === "de" ? "EN" : "DE"}
    </Button>
  );
}
