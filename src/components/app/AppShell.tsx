import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Lightbulb, ListChecks, Sparkles,
  Layers, BarChart3, TrendingUp, Settings, Wand2, Database, FileSearch,
} from "lucide-react";
import { PlatformSwitcher } from "./PlatformSwitcher";
import { RoleSwitcher } from "./RoleSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

type NavItem = {
  to: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/app", labelKey: "nav.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/database", labelKey: "nav.database", icon: Database },
  { to: "/app/competitors", labelKey: "nav.competitors", icon: Users },
  { to: "/app/analyses", labelKey: "nav.analyses", icon: FileSearch },
  { to: "/app/insights", labelKey: "nav.insights", icon: Lightbulb },
  { to: "/app/todos", labelKey: "nav.todos", icon: ListChecks },
  { to: "/app/ideas", labelKey: "nav.ideas", icon: Sparkles },
  { to: "/app/formats", labelKey: "nav.formats", icon: Layers },
  { to: "/app/performance", labelKey: "nav.performance", icon: BarChart3 },
  { to: "/app/trends", labelKey: "nav.trends", icon: TrendingUp },
  { to: "/app/setup", labelKey: "nav.setup", icon: Wand2 },
  { to: "/app/settings", labelKey: "nav.settings", icon: Settings },
];

export function AppShell() {
  const location = useLocation();
  const t = useT();
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="h-16 flex items-center px-5 border-b border-border/60">
          <Logo />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={cn(
                  "flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm transition",
                  active
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className="size-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/60 bg-card/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <span className="hidden lg:inline text-xs text-muted-foreground">
              {t("role.tailored")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <PlatformSwitcher />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}