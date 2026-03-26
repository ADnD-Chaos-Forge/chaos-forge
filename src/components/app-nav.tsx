import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppNav() {
  return (
    <nav
      className="flex items-center justify-between border-b border-border px-6 py-3"
      data-testid="app-nav"
    >
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" data-testid="nav-dashboard">
            Dashboard
          </Button>
        </Link>
        <Link href="/characters">
          <Button variant="ghost" size="sm" data-testid="nav-characters">
            Charaktere
          </Button>
        </Link>
        <Link href="/sessions">
          <Button variant="ghost" size="sm" data-testid="nav-sessions">
            Chronik
          </Button>
        </Link>
        <Link href="/characters/import">
          <Button variant="ghost" size="sm" data-testid="nav-import">
            Import
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </nav>
  );
}
