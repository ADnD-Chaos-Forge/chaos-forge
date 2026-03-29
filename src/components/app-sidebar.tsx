"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Users, ScrollText, FileUp, LogOut } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    labelKey: "dashboard" as const,
    testId: "nav-dashboard",
  },
  { href: "/characters", icon: Users, labelKey: "characters" as const, testId: "nav-characters" },
  { href: "/sessions", icon: ScrollText, labelKey: "sessions" as const, testId: "nav-sessions" },
  { href: "/characters/import", icon: FileUp, labelKey: "import" as const, testId: "nav-import" },
];

interface AppSidebarProps {
  userEmail?: string;
}

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav
      className="fixed left-0 top-0 z-50 hidden h-full w-16 flex-col items-center border-r border-border glass py-4 sm:flex"
      data-testid="app-sidebar"
    >
      {/* Navigation Icons */}
      <div className="flex flex-1 flex-col items-center gap-1 pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={<Link href={item.href} />}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
                data-testid={item.testId}
              >
                <item.icon className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-1 pb-2">
        {userEmail && (
          <Tooltip>
            <TooltipTrigger
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
              data-testid="sidebar-user-avatar"
            >
              {userEmail.charAt(0).toUpperCase()}
            </TooltipTrigger>
            <TooltipContent side="right">{userEmail}</TooltipContent>
          </Tooltip>
        )}
        <LocaleToggle />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            data-testid="logout-button-sidebar"
          >
            <LogOut className="h-5 w-5" />
          </TooltipTrigger>
          <TooltipContent side="right">{t("logout")}</TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
}
