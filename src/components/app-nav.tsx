"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Users, ScrollText, FileUp, Ellipsis } from "lucide-react";
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

interface AppNavProps {
  userEmail?: string;
}

export function AppNav({ userEmail }: AppNavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const morePanelRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);

  // Close panel when any nav link is clicked
  function closeMore() {
    setMoreOpen(false);
  }

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
          {userEmail && (
            <span className="text-xs text-muted-foreground" data-testid="nav-user-email">
              {userEmail}
            </span>
          )}
          <LocaleToggle />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>

      {/* Mobile: Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden" data-testid="app-nav-mobile">
        {/* Backdrop */}
        {moreOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMoreOpen(false)}
            data-testid="mobile-more-backdrop"
          />
        )}

        {/* More panel */}
        {moreOpen && (
          <div
            ref={morePanelRef}
            className="glass glow-neutral rounded-t-xl absolute bottom-full left-0 right-0 z-40 mb-1 flex flex-col gap-3 p-4"
            data-testid="mobile-more-panel"
          >
            {userEmail && (
              <span
                className="truncate text-xs text-muted-foreground"
                data-testid="mobile-more-email"
              >
                {userEmail}
              </span>
            )}
            <div className="flex items-center justify-between">
              <LocaleToggle />
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="relative z-40 flex items-center justify-around border-t border-border bg-background px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className="flex-1" onClick={closeMore}>
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
          <button
            ref={moreTriggerRef}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-xs transition-colors ${
              moreOpen ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setMoreOpen((prev) => !prev)}
            data-testid="mobile-more-trigger"
          >
            <Ellipsis className="h-5 w-5" />
            <span className="truncate">{t("more")}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
