"use client";

import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      data-testid="theme-toggle"
      aria-label={theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
