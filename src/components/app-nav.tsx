import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export function AppNav() {
  return (
    <nav
      className="flex items-center justify-between border-b border-border px-6 py-3"
      data-testid="app-nav"
    >
      <div className="flex items-center gap-4">
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
      </div>
      <LogoutButton />
    </nav>
  );
}
