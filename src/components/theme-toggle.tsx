"use client";

import { useTranslations } from "next-intl";
import { Sun, Moon } from "lucide-react";
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
      className="relative overflow-hidden"
    >
      <span
        className={`inline-block transition-transform duration-300 ${
          theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      >
        <Sun className="h-4 w-4" />
      </span>
      <span
        className={`absolute inline-block transition-transform duration-300 ${
          theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      >
        <Moon className="h-4 w-4" />
      </span>
    </Button>
  );
}
