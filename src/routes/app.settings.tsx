import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Globe, Send, Mail, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/data/types";
import {
  getUserSettings,
  updateWorkspaceSettings,
  updateUserProfile,
  upsertNotification,
  deleteNotification,
} from "@/lib/data/settings.functions";

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
  const fetchSettings = useServerFn(getUserSettings);
  const updateWs = useServerFn(updateWorkspaceSettings);
  const updateProfile = useServerFn(updateUserProfile);
  const upsertNotif = useServerFn(upsertNotification);
  const deleteNotif = useServerFn(deleteNotification);
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => fetchSettings({ data: {} } as any),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["user-settings"] });

  const langMut = useMutation({
    mutationFn: (language: Language) => updateWs({ data: { language } } as any),
    onSuccess: invalidate,
  });
  const profileMut = useMutation({
    mutationFn: (display_name: string) => updateProfile({ data: { display_name } } as any),
    onSuccess: invalidate,
  });
  const notifMut = useMutation({
    mutationFn: (n: any) => upsertNotif({ data: n } as any),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteNotif({ data: { id } } as any),
    onSuccess: invalidate,
  });

  const language = ((data?.workspace as any)?.language as Language) ?? "en";
  const notifications: any[] = data?.notifications ?? [];
  const displayName = (data?.profile as any)?.display_name ?? "";

  const [draftChannel, setDraftChannel] = useState<"telegram" | "email">("email");
  const [draftDest, setDraftDest] = useState("");

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Language, notifications, and how Navio reaches you.</p>
      </header>

      {/* Profile */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Your profile</h2>
            <p className="text-xs text-muted-foreground">Saved to your account.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Display name</Label>
            <Input
              key={displayName}
              defaultValue={displayName}
              placeholder="Your name"
              className="rounded-xl bg-background/40"
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== displayName) profileMut.mutate(v);
              }}
            />
          </div>
        </div>
      </section>

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
              onClick={() => langMut.mutate(l.id)}
              className={cn(
                "px-4 h-9 rounded-full text-sm font-medium border transition",
                language === l.id
                  ? "bg-primary/20 text-primary border-primary/40"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/5",
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
                <div className="text-xs text-muted-foreground">{String(n.frequency).replace("_", " ")}</div>
              </div>
              <Switch
                checked={!!n.active}
                onCheckedChange={(v) =>
                  notifMut.mutate({
                    id: n.id,
                    channel: n.channel,
                    destination: n.destination,
                    frequency: n.frequency,
                    active: v,
                  })
                }
              />
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => deleteMut.mutate(n.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground text-center">No channels yet.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 items-center">
          <select
            value={draftChannel}
            onChange={(e) => setDraftChannel(e.target.value as any)}
            className="h-9 rounded-full bg-background/40 border border-border/60 px-3 text-sm"
          >
            <option value="email">Email</option>
            <option value="telegram">Telegram</option>
          </select>
          <Input
            value={draftDest}
            onChange={(e) => setDraftDest(e.target.value)}
            placeholder={draftChannel === "email" ? "you@example.com" : "@telegram_handle"}
            className="h-9 rounded-full bg-background/40 max-w-xs"
          />
          <Button
            size="sm"
            className="rounded-full bg-primary text-primary-foreground"
            disabled={!draftDest.trim() || notifMut.isPending}
            onClick={() => {
              notifMut.mutate({
                channel: draftChannel,
                destination: draftDest.trim(),
                frequency: "weekly",
                active: true,
              });
              setDraftDest("");
            }}
          >
            Add channel
          </Button>
        </div>
      </section>

      {/* Plan */}
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