import { requireAuth } from "@/lib/supabase/auth";
import { AppNav } from "@/components/app-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="flex flex-1 flex-col" data-testid="dashboard-layout">
      <AppNav />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
