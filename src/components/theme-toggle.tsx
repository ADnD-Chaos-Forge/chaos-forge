"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      data-testid="theme-toggle"
      aria-label={t(theme === "dark" ? "toggleLight" : "toggleDark")}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
