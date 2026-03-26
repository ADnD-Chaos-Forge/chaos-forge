import Link from "next/link";
import { requireAuth } from "@/lib/supabase/auth";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

export default async function CharactersLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="flex flex-1 flex-col" data-testid="characters-layout">
      <nav className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/characters">
            <Button variant="ghost" size="sm" data-testid="nav-characters">
              Charaktere
            </Button>
          </Link>
          <Link href="/characters/new">
            <Button variant="ghost" size="sm" data-testid="nav-new-character">
              Neuer Charakter
            </Button>
          </Link>
        </div>
        <LogoutButton />
      </nav>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
