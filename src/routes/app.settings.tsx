import { createFileRoute } from "@tanstack/react-router";
import { useNavio } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Globe, Send, Mail, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/data/types";
import { N8nPanel } from "@/components/app/N8nPanel";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — Navio" },
      { name: "description", content: "Manage your Navio account, notifications, and language preferences." },
      { property: "og:title", content: "Settings — Navio" },
      { property: "og:description", content: "Manage your Navio account, notifications, and language preferences." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/settings" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/settings" },
    ],
  }),
});

const LANGS: { id: Language; label: string }[] = [
  { id: "en", label: "English" },
  { id: "uk", label: "Українська" },
  { id: "de", label: "Deutsch" },
];

function SettingsPage() {
  const language = useNavio((s) => s.language);
  const setLanguage = useNavio((s) => s.setLanguage);
  const notifications = useNavio((s) => s.notifications);
  const upsertNotification = useNavio((s) => s.upsertNotification);

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Language, notifications, and how Navio reaches you.</p>
      </header>

      <N8nPanel />

      {/* Language */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center">
            <Globe className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Language</h2>
            <p className="text-xs text-muted-foreground">Insights, ideas and copy adapt to this language.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id)}
              className={cn(
                "px-4 h-9 rounded-full text-sm font-medium border transition",
                language === l.id
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center">
            <Bell className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">Get pinged when something actionable lands.</p>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center gap-4 py-3">
              <div className="size-9 rounded-xl grid place-items-center bg-background/40 border border-border/60">
                {n.channel === "telegram" ? <Send className="size-4" /> : <Mail className="size-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium capitalize truncate">{n.channel} · {n.destination}</div>
                <div className="text-xs text-muted-foreground">{n.frequency.replace("_", " ")}</div>
              </div>
              <Switch
                checked={n.active}
                onCheckedChange={(v) => upsertNotification({ ...n, active: v })}
              />
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground text-center">No channels yet.</p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="rounded-full"><Send className="size-3.5 mr-1.5" /> Connect Telegram</Button>
          <Button size="sm" variant="outline" className="rounded-full"><Mail className="size-3.5 mr-1.5" /> Add email</Button>
        </div>
      </section>

      {/* Plan + danger */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl font-semibold">Plan</h2>
            <p className="text-xs text-muted-foreground">You're on the Free preview · 1 workspace · 5 competitors.</p>
          </div>
          <Badge variant="outline" className="rounded-full text-primary border-primary/40">Free preview</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="rounded-full bg-primary text-primary-foreground">Upgrade plan</Button>
          <Button size="sm" variant="outline" className="rounded-full">Export data</Button>
        </div>
      </section>

      <section className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-semibold text-destructive">Danger zone</h2>
            <p className="text-xs text-muted-foreground">Delete workspace and all tracked data. Cannot be undone.</p>
          </div>
          <Button size="sm" variant="outline" className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10">
            <Trash2 className="size-3.5 mr-1.5" /> Delete workspace
          </Button>
        </div>
      </section>
    </div>
  );
}
