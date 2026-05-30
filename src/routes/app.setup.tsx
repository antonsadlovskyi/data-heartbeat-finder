import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Plus, Trash2, Instagram, Music2, Facebook, MapPin } from "lucide-react";
import {
  getUserSettings,
  updateWorkspaceSettings,
  deleteSocialAccount,
} from "@/lib/data/settings.functions";

export const Route = createFileRoute("/app/setup")({
  component: SetupPage,
  head: () => ({
    meta: [
      { title: "Setup — Navio" },
      { name: "description", content: "Configure your Navio workspace, competitors, and connected platforms." },
      { property: "og:title", content: "Setup — Navio" },
      { property: "og:description", content: "Configure your Navio workspace, competitors, and connected platforms." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/setup" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/setup" },
    ],
  }),
});

function SetupPage() {
  const fetchSettings = useServerFn(getUserSettings);
  const updateWs = useServerFn(updateWorkspaceSettings);
  const deleteAcc = useServerFn(deleteSocialAccount);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () => fetchSettings({ data: {} } as any),
  });

  const updateMut = useMutation({
    mutationFn: (patch: Record<string, string>) => updateWs({ data: patch } as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-settings"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (account_id: string) => deleteAcc({ data: { account_id } } as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-settings"] }),
  });

  const workspace: any = data?.workspace ?? {};
  const accounts: any[] = data?.accounts ?? [];
  const own = accounts.filter((a) => (a.account_type ?? "own") === "own");
  const competitors = accounts.filter((a) => a.account_type === "competitor");

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading your workspace…</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Setup</h1>
          <p className="text-muted-foreground mt-1">
            Tell Navio who you are. The sharper the brief, the sharper the insights.
          </p>
        </div>
        <Badge variant="outline" className="rounded-full gap-1.5">
          <Wand2 className="size-3.5" /> AI-assisted
        </Badge>
      </header>

      {/* Business brief */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">Business brief</h2>
          <p className="text-xs text-muted-foreground">Used by every scan, insight and idea.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Business name" value={workspace.project_name ?? ""} onSave={(v) => updateMut.mutate({ project_name: v })} />
          <Field label="Niche" value={workspace.niche ?? ""} onSave={(v) => updateMut.mutate({ niche: v })} />
          <Field label="Country" value={workspace.country ?? ""} onSave={(v) => updateMut.mutate({ country: v })} />
          <Field label="Main goal" value={workspace.main_goal ?? ""} onSave={(v) => updateMut.mutate({ main_goal: v })} />
        </div>
        <FieldArea label="Target audience" value={workspace.target_audience ?? ""} onSave={(v) => updateMut.mutate({ target_audience: v })} />
        <FieldArea label="Product description" value={workspace.product_description ?? ""} onSave={(v) => updateMut.mutate({ product_description: v })} />
      </section>

      <AccountList title="Your profiles" rows={own} onDelete={(id) => deleteMut.mutate(id)} emptyHint="Connect an Instagram or TikTok via your n8n workflow." />

      <AccountList title="Tracked competitors" rows={competitors} onDelete={(id) => deleteMut.mutate(id)} emptyHint="Competitors land here once your n8n workflow inserts them into social_accounts." />
    </div>
  );
}

function PlatformIcon({ platform }: { platform?: string | null }) {
  const Icon = platform === "instagram" ? Instagram : platform === "tiktok" ? Music2 : platform === "facebook" ? Facebook : MapPin;
  return <Icon className="size-4 text-primary" />;
}

function AccountList({ title, rows, onDelete, emptyHint }: { title: string; rows: any[]; onDelete: (account_id: string) => void; emptyHint: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <Badge variant="outline" className="rounded-full">{rows.length}</Badge>
        </div>
        <Button size="sm" variant="outline" className="rounded-full" disabled>
          <Plus className="size-3.5 mr-1" /> Added via n8n
        </Button>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          {emptyHint}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm divide-y divide-border/60 overflow-hidden">
          {rows.map((a) => (
            <div key={a.account_id} className="flex items-center gap-4 p-4">
              <div className="size-10 rounded-xl grid place-items-center bg-primary/10 border border-primary/30">
                <PlatformIcon platform={a.platform} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{a.profile_name ?? a.username ?? a.account_id}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {a.username ? `@${a.username}` : ""} · {a.platform ?? "—"} · {(Number(a.followers_count) || 0).toLocaleString()} followers
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(a.account_id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Input
        defaultValue={value}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (v && v !== value) onSave(v);
        }}
        className="rounded-xl bg-background/40"
      />
    </div>
  );
}

function FieldArea({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Textarea
        defaultValue={value}
        rows={2}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (v && v !== value) onSave(v);
        }}
        className="rounded-xl bg-background/40"
      />
    </div>
  );
}
