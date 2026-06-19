import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, BarChart3, TrendingUp, Settings,
  Trophy, Zap, Activity, FlaskConical, LogOut,
} from "lucide-react";
import { PlatformSwitcher } from "./PlatformSwitcher";
import { RoleSwitcher } from "./RoleSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { supabase } from "@/integrations/supabase/client";

type NavItem = {
  to: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

// Exactly the 9 canonical V2 pages, each mapped to its canonical page_key route
// (see memory: navio-v2-contract). Legacy routes (analyses/insights/ideas/todos/
// database/formats/setup) are dropped from nav here; full removal is Session 8.
const nav: NavItem[] = [
  { to: "/app", labelKey: "nav.dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/competitors", labelKey: "nav.competitors", icon: Users },
  { to: "/app/best-outcomes", labelKey: "nav.best_outcomes", icon: Trophy },
  { to: "/app/competitor-moves", labelKey: "nav.competitor_moves", icon: Zap },
  { to: "/app/performance", labelKey: "nav.performance", icon: BarChart3 },
  { to: "/app/trends", labelKey: "nav.trends", icon: TrendingUp },
  { to: "/app/hypotheses", labelKey: "nav.hypotheses", icon: FlaskConical },
  { to: "/app/dynamics", labelKey: "nav.dynamics", icon: Activity },
  { to: "/app/connected", labelKey: "nav.settings", icon: Settings },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

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
        <div className="p-3 border-t border-border/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 h-9 px-3 w-full rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            <LogOut className="size-4" />
            Вийти
          </button>
        </div>
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