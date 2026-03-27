"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Users, ScrollText, FileUp } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";

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

export function AppNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: Top nav bar */}
      <nav
        className="hidden items-center justify-between border-b border-border px-6 py-3 sm:flex"
        data-testid="app-nav"
      >
        <div className="flex items-center gap-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  data-testid={item.testId}
                >
                  <item.icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </button>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      {/* Mobile: Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background px-2 py-1 sm:hidden"
        data-testid="app-nav-mobile"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <button
                className={`flex w-full flex-col items-center gap-0.5 rounded-md py-2 text-xs transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`${item.testId}-mobile`}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate">{t(item.labelKey)}</span>
              </button>
            </Link>
          );
        })}
        <div className="flex flex-col items-center gap-0.5 py-2">
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}
