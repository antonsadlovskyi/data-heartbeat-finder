import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Eye, Lightbulb, TrendingUp, BarChart3, Settings, Bell, Search, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/competitors", label: "Competitor Radar", icon: Eye },
  { to: "/app/insights", label: "Insights Feed", icon: Lightbulb },
  { to: "/app/trends", label: "Trend Tracker", icon: TrendingUp },
  { to: "/app/performance", label: "My Performance", icon: BarChart3 },
];

export function AppShell() {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground flex relative">
      {/* Ambient cosmic backdrop */}
      <div className="fixed inset-0 starfield opacity-40 pointer-events-none" />
      <div className="fixed inset-x-0 bottom-0 h-1/2 horizon-glow opacity-50 pointer-events-none" />

      {/* Sidebar */}
      <aside className="relative z-10 w-64 shrink-0 border-r border-border/40 bg-sidebar/70 backdrop-blur-xl p-4 flex flex-col sticky top-0 h-screen">
        <Link to="/" className="px-2 py-3">
          <Logo markClassName="size-8" />
        </Link>

        <nav className="mt-6 space-y-1">
          {nav.map(item => {
            const active = item.end ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-glow"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 via-card to-violet/20 border border-primary/40 p-4 shadow-glow overflow-hidden">
            <div className="absolute -top-12 -right-12 size-32 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Crown className="size-4" />
                <span className="font-semibold text-sm">Trial · 5 days left</span>
              </div>
              <p className="text-xs text-foreground/75 mb-3">Unlock weekly AI reports and 10 competitors.</p>
              <Button size="sm" className="w-full rounded-full bg-primary text-primary-foreground hover:opacity-90 text-xs uppercase tracking-widest font-bold">Upgrade</Button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 py-2 border-t border-border/40 pt-4">
            <div className="size-9 rounded-full bg-primary/20 border border-primary/40 grid place-items-center font-bold text-sm text-primary">O</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Olena K.</div>
              <div className="text-xs text-muted-foreground truncate">Café Svitlo · Lviv</div>
            </div>
            <Settings className="size-4 text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1 min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/40">
          <div className="flex items-center gap-4 px-8 py-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search competitors, insights, hashtags..." className="pl-10 h-10 rounded-full bg-card/80 border-border/60 focus-visible:ring-primary/40" />
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-border/60 bg-card/60 hover:bg-card">
              <Bell className="size-4 text-primary" />
            </Button>
            <Badge variant="outline" className="rounded-full border-primary/40 text-primary text-[10px] uppercase tracking-widest">Live · 4m ago</Badge>
          </div>
        </header>
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
