import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";

export function AppNav() {
  const t = useTranslations("nav");

  return (
    <nav
      className="flex items-center justify-between border-b border-border px-6 py-3"
      data-testid="app-nav"
    >
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" data-testid="nav-dashboard">
            {t("dashboard")}
          </Button>
        </Link>
        <Link href="/characters">
          <Button variant="ghost" size="sm" data-testid="nav-characters">
            {t("characters")}
          </Button>
        </Link>
        <Link href="/sessions">
          <Button variant="ghost" size="sm" data-testid="nav-sessions">
            {t("sessions")}
          </Button>
        </Link>
        <Link href="/characters/import">
          <Button variant="ghost" size="sm" data-testid="nav-import">
            {t("import")}
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <LocaleToggle />
        <ThemeToggle />
        <LogoutButton />
      </div>
    </nav>
  );
}
