import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Calendar, Sparkles, ChevronDown, Target, Layers, Megaphone, ShieldCheck, AlertTriangle, Lightbulb, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import analyses from "@/lib/data/account-analyses.json";

export const Route = createFileRoute("/app/analyses")({
  component: Analyses,
  head: () => ({ meta: [{ title: "Navio · Account Analyses" }] }),
});

type Analysis = (typeof analyses)[number];

const splitList = (s?: string | null) =>
  (s ?? "").split(/;|\u2022|\n/).map((x) => x.trim()).filter(Boolean);

const accountName = (id: string) => {
  const map: Record<string, string> = {
    acc_001: "Dragi",
    acc_002: "Talinaa_s",
    acc_003: "Kristina ZNOHUB",
    acc_004: "ZNOHUB Online",
  };
  return map[id] ?? id;
};

function Analyses() {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(analyses[0]?.account_analysis_id ?? null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return analyses as Analysis[];
    return (analyses as Analysis[]).filter((a) =>
      JSON.stringify(a).toLowerCase().includes(needle)
    );
  }, [q]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Account Analyses</h1>
          <p className="text-muted-foreground mt-1">
            {analyses.length} deep dives · positioning, SWOT and strategic recommendations
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search positioning, hooks, pillars…"
            className="pl-9 rounded-full bg-card/60 border-border/60"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const open = openId === a.account_analysis_id;
          return (
            <div
              key={a.account_analysis_id}
              className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 shadow-pop overflow-hidden"
            >
              <button
                onClick={() => setOpenId(open ? null : a.account_analysis_id)}
                className="w-full text-left p-5 flex items-center gap-4 hover:bg-white/[0.02] transition"
              >
                <div className="size-12 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center text-primary font-display font-bold shadow-pop">
                  {accountName(a.account_id).slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-display text-lg font-bold">{accountName(a.account_id)}</div>
                    <Badge variant="outline" className="rounded-full text-[11px]">
                      {a.account_analysis_id}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                    {a.positioning_summary}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {a.period_start} → {a.period_end}
                  </span>
                </div>
                <ChevronDown className={cn("size-5 text-muted-foreground transition", open && "rotate-180")} />
              </button>

              {open && (
                <div className="border-t border-border/60 p-6 space-y-6">
                  <Block icon={<Target className="size-4" />} label="Positioning">
                    <p className="text-sm leading-relaxed">{a.positioning_summary}</p>
                  </Block>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Chips icon={<Layers className="size-4" />} label="Content pillars" items={splitList(a.main_content_pillars)} tone="primary" />
                    <Chips icon={<Sparkles className="size-4" />} label="Strongest formats" items={splitList(a.strongest_formats)} tone="success" />
                    <Chips icon={<Ban className="size-4" />} label="Weakest formats" items={splitList(a.weakest_formats)} tone="warning" />
                    <Chips icon={<Megaphone className="size-4" />} label="Main hooks" items={splitList(a.main_hooks)} tone="primary" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Tone of voice" value={a.tone_of_voice} />
                    <Field label="Visual identity" value={a.visual_identity} />
                    <Field label="Audience pain points" value={a.audience_pain_points} />
                    <Field label="Main CTAs" value={a.main_ctas} />
                    <Field label="Product angle" value={a.product_angle} />
                    <Field label="Trust signals" value={a.trust_signals} />
                    <Field label="Community signals" value={a.community_signals} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SwotCard tone="success" icon={<ShieldCheck className="size-4" />} title="Strengths" value={a.strengths} />
                    <SwotCard tone="warning" icon={<AlertTriangle className="size-4" />} title="Weaknesses" value={a.weaknesses} />
                    <SwotCard tone="primary" icon={<Lightbulb className="size-4" />} title="Opportunities" value={a.opportunities} />
                    <SwotCard tone="destructive" icon={<AlertTriangle className="size-4" />} title="Threats" value={a.threats} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SwotCard tone="success" icon={<Sparkles className="size-4" />} title="Best patterns to copy" value={a.best_patterns_to_copy} />
                    <SwotCard tone="destructive" icon={<Ban className="size-4" />} title="Things to avoid" value={a.things_to_avoid} />
                  </div>

                  <div className="rounded-2xl bg-primary/10 border border-primary/30 p-4">
                    <div className="text-xs uppercase tracking-wide text-primary/80 mb-1.5 font-semibold">
                      Strategic summary
                    </div>
                    <p className="text-sm leading-relaxed">{a.strategic_summary}</p>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                    <div className="text-xs text-muted-foreground">
                      Scored {a.score_overall} · Period {a.period_start} → {a.period_end}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">Save to ideas</Button>
                      <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:opacity-90">
                        Turn into to-do
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            No analyses match “{q}”.
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1 font-semibold">{label}</div>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

const TONE: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
};

function Chips({ icon, label, items, tone = "primary" }: { icon: React.ReactNode; label: string; items: string[]; tone?: keyof typeof TONE }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground mb-2 font-semibold">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span key={i} className={cn("text-xs px-2.5 py-1 rounded-full border", TONE[tone])}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function SwotCard({ icon, title, value, tone }: { icon: React.ReactNode; title: string; value?: string | null; tone: keyof typeof TONE }) {
  if (!value) return null;
  return (
    <div className={cn("rounded-2xl border p-4", TONE[tone])}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide mb-1.5 font-semibold">
        {icon} {title}
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{value}</p>
    </div>
  );
}