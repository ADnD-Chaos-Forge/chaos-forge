"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function getLocaleFromCookie(): string {
  if (typeof document === "undefined") return "de";
  return (
    document.cookie
      .split("; ")
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] ?? "de"
  );
}

function subscribe(callback: () => void) {
  // Re-check on storage/cookie changes (no native cookie event, so we use a simple interval)
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getServerSnapshot() {
  return "de";
}

export function LocaleToggle() {
  const router = useRouter();
  const current = useSyncExternalStore(subscribe, getLocaleFromCookie, getServerSnapshot);

  const toggleLocale = useCallback(() => {
    const next = current === "en" ? "de" : "en";
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    router.refresh();
  }, [current, router]);

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
