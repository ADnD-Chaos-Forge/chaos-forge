"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LocaleToggle() {
  const router = useRouter();
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const locale =
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("NEXT_LOCALE="))
        ?.split("=")[1] ?? "de";
    setCurrent(locale);
  }, []);

  function toggleLocale() {
    const next = current === "en" ? "de" : "en";
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    setCurrent(next);
    router.refresh();
  }

  // Render nothing until client-side hydration is done (avoids mismatch)
  if (current === null) {
    return (
      <Button variant="ghost" size="sm" data-testid="locale-toggle" aria-hidden>
        &nbsp;&nbsp;
      </Button>
    );
  }

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
