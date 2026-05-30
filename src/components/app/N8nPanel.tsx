import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardData, seedWorkspaceFromMock } from "@/lib/data/dashboard.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Copy, Check, Sparkles } from "lucide-react";

const TABLES = [
  "social_accounts", "account_snapshots", "social_posts", "post_assets",
  "post_comments", "account_analyses", "competitor_radar", "best_outcomes",
  "competitor_comparison", "workspace_report", "action_plan",
];

export function N8nPanel() {
  const fetcher = useServerFn(getDashboardData);
  const seed = useServerFn(seedWorkspaceFromMock);
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fetcher() });
  const [copied, setCopied] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const wsId = data?.workspace?.id ?? "—";
  const supaUrl = import.meta.env.VITE_SUPABASE_URL ?? "";

  const copy = async (v: string, key: string) => {
    await navigator.clipboard.writeText(v);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center">
          <Database className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">n8n Integration</h2>
          <p className="text-xs text-muted-foreground">
            Point your n8n Supabase node here. Use the service role key (server-side only) and
            tag every row with this workspace_id.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Field label="workspace_id" value={wsId} onCopy={() => copy(wsId, "ws")} copied={copied === "ws"} />
        <Field label="Supabase URL" value={supaUrl} onCopy={() => copy(supaUrl, "url")} copied={copied === "url"} />
      </div>

      <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
          Tables n8n can write to
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TABLES.map((t) => (
            <Badge key={t} variant="outline" className="rounded-full font-mono text-[11px]">{t}</Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Every insert must include <code className="text-primary">workspace_id</code>. Use the Supabase node with the{" "}
          <b>service role key</b> stored as an n8n credential — never the publishable key. RLS bypasses for the service role,
          but the workspace_id filter is what keeps tenants separate.
        </p>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <Sparkles className="size-4 text-primary mt-0.5" />
          <div>
            <div className="font-semibold text-sm">Load demo data</div>
            <p className="text-xs text-muted-foreground">
              Populate this workspace with the bundled sample dataset so you can preview every dashboard.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-primary text-primary-foreground"
          disabled={seeding}
          onClick={async () => {
            setSeeding(true);
            try {
              await seed();
              await qc.invalidateQueries({ queryKey: ["dashboard"] });
            } finally {
              setSeeding(false);
            }
          }}
        >
          {seeding ? "Loading…" : "Load demo data"}
        </Button>
      </div>
    </section>
  );
}

function Field({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1 font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        <code className="text-xs flex-1 truncate font-mono">{value}</code>
        <Button size="icon" variant="ghost" className="size-7 shrink-0" onClick={onCopy}>
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </Button>
      </div>
    </div>
  );
}