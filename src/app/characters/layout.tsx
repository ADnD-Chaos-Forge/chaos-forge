import { requireAuth } from "@/lib/supabase/auth";
import { AppNav } from "@/components/app-nav";

export default async function CharactersLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="flex flex-1 flex-col" data-testid="characters-layout">
      <AppNav userEmail={user.email ?? ""} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
