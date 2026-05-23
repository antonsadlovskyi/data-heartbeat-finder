import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, FileText, MessageSquare, Image as ImageIcon, Trophy, Target,
  TrendingUp, Sparkles, AlertTriangle, CheckCircle2, ArrowUpRight, Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarShape, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import data from "@/lib/data/apify-dataset.json";

export const Route = createFileRoute("/app/database")({
  component: DatabasePage,
  head: () => ({
    meta: [
      { title: "Database — Navio" },
      { name: "description", content: "Browse the raw marketing intelligence dataset powering your Navio workspace." },
      { property: "og:title", content: "Database — Navio" },
      { property: "og:description", content: "Browse the raw marketing intelligence dataset powering your Navio workspace." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/database" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/database" },
    ],
  }),
});

const ds = data as Record<string, any[]>;
const workspace = ds["02_workspaces"][0];
const report = ds["14_workspace_report"][0];
const accounts = ds["03_social_accounts"];
const snapshots = ds["04_account_snapshots"];
const posts = ds["05_social_posts"];
const assets = ds["06_post_assets"];
const comments = ds["07_post_comments"];
const radar = ds["11_competitor_radar"];
const outcomes = ds["12_best_outcomes"];
const comparisons = ds["13_competitor_comparison"];
const actions = ds["15_action_plan"];

const num = (v: any) => (typeof v === "number" ? v : parseFloat(v) || 0);
const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);
const accountLabel = (id: string) => accounts.find((a) => a.account_id === id)?.username ?? id;

function DatabasePage() {
  const totalAccounts = accounts.length;
  const totalFollowers = accounts.reduce((s, a) => s + num(a.followers_count), 0);
  const totalPosts = posts.length;
  const totalComments = comments.length;
  const avgER =
    snapshots.reduce((s, x) => s + num(x.engagement_rate), 0) / snapshots.length || 0;

  const radarData = radar
    .map((r) => ({
      name: r.account_name,
      overall: num(r.overall_score),
      account_id: r.account_id,
      key_strength: r.key_strength,
      key_weakness: r.key_weakness,
      main_reason: r.main_reason,
    }))
    .sort((a, b) => b.overall - a.overall);

  const topRadar = radarData.slice(0, 1)[0];
  const radarShape = radar
    .filter((r) => ["acc_001", topRadar?.account_id].includes(r.account_id))
    .map((r) => ({
      account: r.account_name,
      positioning: num(r.positioning_strength),
      consistency: num(r.content_consistency),
      hook: num(r.hook_strength),
      educational: num(r.educational_value),
      emotional: num(r.emotional_connection),
      visual: num(r.visual_identity),
      sales: num(r.sales_clarity),
      community: num(r.community_engagement),
      trust: num(r.trust_signals),
      formats: num(r.format_diversity),
      trend: num(r.trend_usage),
      differentiation: num(r.product_differentiation),
    }));

  const radarAxes = [
    "positioning", "consistency", "hook", "educational", "emotional", "visual",
    "sales", "community", "trust", "formats", "trend", "differentiation",
  ];
  const radarChartData = radarAxes.map((axis) => {
    const row: any = { axis };
    radarShape.forEach((r) => (row[r.account] = (r as any)[axis]));
    return row;
  });

  const topPosts = useMemo(
    () =>
      [...posts]
        .map((p) => ({ ...p, _likes: num(p.likes_count), _er: num(p.engagement_rate) }))
        .sort((a, b) => b._likes - a._likes)
        .slice(0, 6),
    []
  );

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full text-[11px]">
              {workspace.project_name}
            </Badge>
            <Badge variant="outline" className="rounded-full text-[11px]">
              {workspace.niche}
            </Badge>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight mt-2">
            Database Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{workspace.main_goal}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Report {report.period_start.slice(0, 10)} → {report.period_end.slice(0, 10)}
        </div>
      </header>

      {/* KPI strip */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard icon={<Users className="size-4" />} label="Accounts tracked" value={totalAccounts} />
        <KpiCard icon={<TrendingUp className="size-4" />} label="Total followers" value={fmtK(totalFollowers)} />
        <KpiCard icon={<FileText className="size-4" />} label="Posts analyzed" value={totalPosts} />
        <KpiCard icon={<ImageIcon className="size-4" />} label="Assets parsed" value={assets.length} />
        <KpiCard icon={<MessageSquare className="size-4" />} label="Comments mined" value={totalComments} />
      </section>

      {/* Executive summary */}
      <Section icon={<Sparkles className="size-4" />} title="Executive summary" subtitle="From workspace report">
        <p className="text-sm leading-relaxed">{report.executive_summary}</p>
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <Tile tone="success" icon={<CheckCircle2 className="size-4" />} title="Own strengths" text={report.own_profile_strengths} />
          <Tile tone="warning" icon={<AlertTriangle className="size-4" />} title="Own weaknesses" text={report.own_profile_weaknesses} />
          <Tile tone="primary" icon={<Sparkles className="size-4" />} title="Best opportunities" text={report.best_opportunities} />
          <Tile tone="destructive" icon={<AlertTriangle className="size-4" />} title="Main threats" text={report.main_threats} />
        </div>
      </Section>

      {/* Competitor radar */}
      <Section icon={<Target className="size-4" />} title="Competitor radar" subtitle={`${radar.length} accounts scored across 12 dimensions`}>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-semibold">
              Overall score ranking
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={radarData} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <XAxis type="number" domain={[0, 10]} hide />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Bar dataKey="overall" fill="oklch(0.78 0.13 220)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 font-semibold">
              You vs top competitor
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                  {radarShape.map((r, i) => (
                    <RadarShape
                      key={r.account}
                      name={r.account}
                      dataKey={r.account}
                      stroke={i === 0 ? "oklch(0.78 0.13 220)" : "oklch(0.7 0.17 30)"}
                      fill={i === 0 ? "oklch(0.78 0.13 220)" : "oklch(0.7 0.17 30)"}
                      fillOpacity={0.25}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          {radarData.slice(0, 4).map((r) => (
            <div key={r.account_id} className="rounded-2xl border border-border/60 bg-background/40 p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="font-display font-bold">@{r.name}</div>
                <Badge className="rounded-full bg-primary/15 text-primary border-primary/30">{r.overall.toFixed(1)} / 10</Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{r.main_reason}</p>
              <div className="text-[11px] text-success/90"><b>+</b> {r.key_strength}</div>
              <div className="text-[11px] text-warning/90 mt-0.5"><b>−</b> {r.key_weakness}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Top posts */}
      <Section icon={<Trophy className="size-4" />} title="Best performing posts" subtitle="Top 6 by likes across all tracked accounts">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topPosts.map((p) => (
            <a key={p.post_id} href={p.post_url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border/60 bg-background/40 p-4 hover:border-primary/40 hover:bg-primary/[0.04] transition group">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <Badge variant="outline" className="rounded-full">{p.post_type}</Badge>
                <PerfPill level={p.performance_level} />
              </div>
              <div className="text-sm font-semibold line-clamp-2 mb-1.5 group-hover:text-primary transition">
                {p.caption || p.topic || p.post_id}
              </div>
              <div className="text-[11px] text-muted-foreground line-clamp-1 mb-3">
                @{accountLabel(p.account_id)} · {p.content_pillar}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-foreground/80"><Flame className="size-3" /> {fmtK(p._likes)} likes</span>
                <span className="text-muted-foreground">ER {(p._er * 100).toFixed(2)}%</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary" />
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* Gap analysis */}
      <Section icon={<TrendingUp className="size-4" />} title="Gap analysis" subtitle={`${comparisons.length} pairwise comparisons across ${new Set(comparisons.map(c => c.area)).size} areas`}>
        <GapTable rows={comparisons.filter((c) => c.priority === "high").slice(0, 8)} />
      </Section>

      {/* Action plan */}
      <Section icon={<CheckCircle2 className="size-4" />} title="Recommended action plan" subtitle={`${actions.length} actions generated from this analysis`}>
        <ActionList rows={actions} />
      </Section>
    </div>
  );
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-4 shadow-pop">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
        {icon} {label}
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 shadow-pop space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <span className="text-primary">{icon}</span> {title}
          </h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

const TONE: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
};

function Tile({ icon, title, text, tone }: { icon: React.ReactNode; title: string; text: string; tone: keyof typeof TONE }) {
  return (
    <div className={cn("rounded-2xl border p-4", TONE[tone])}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide font-semibold mb-1.5">{icon} {title}</div>
      <p className="text-sm leading-relaxed text-foreground/90 line-clamp-5">{text}</p>
    </div>
  );
}

function PerfPill({ level }: { level?: string }) {
  const map: Record<string, string> = {
    high: "bg-success/15 text-success border-success/30",
    medium: "bg-warning/15 text-warning border-warning/30",
    low: "bg-muted text-muted-foreground border-border",
  };
  return <Badge className={cn("rounded-full border text-[10px]", map[level ?? "low"] ?? map.low)}>{level ?? "—"}</Badge>;
}

function GapTable({ rows }: { rows: any[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-background/60 text-[11px] uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="text-left p-3">Area</th>
            <th className="text-left p-3">Competitor</th>
            <th className="text-right p-3">You</th>
            <th className="text-right p-3">Them</th>
            <th className="text-right p-3">Gap</th>
            <th className="text-left p-3">Recommended action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.comparison_id} className="border-t border-border/60 hover:bg-white/[0.02]">
              <td className="p-3 font-semibold capitalize">{r.area}</td>
              <td className="p-3 text-muted-foreground">@{accountLabel(r.competitor_account_id)}</td>
              <td className="p-3 text-right">{num(r.own_score).toFixed(0)}</td>
              <td className="p-3 text-right">{num(r.competitor_score).toFixed(0)}</td>
              <td className={cn("p-3 text-right font-semibold", r.who_is_stronger === "competitor" ? "text-warning" : "text-success")}>
                {r.who_is_stronger === "competitor" ? "−" : "+"}{num(r.gap).toFixed(0)}
              </td>
              <td className="p-3 text-xs text-muted-foreground line-clamp-2 max-w-md">{r.recommended_action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionList({ rows }: { rows: any[] }) {
  const [filter, setFilter] = useState<string>("all");
  const priorities = ["all", "high", "medium", "low"];
  const filtered = filter === "all" ? rows : rows.filter((r) => r.priority === filter);
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {priorities.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={filter === p ? "default" : "outline"}
            onClick={() => setFilter(p)}
            className="rounded-full h-7 px-3 text-xs capitalize"
          >
            {p}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.slice(0, 12).map((a) => (
          <div key={a.action_id} className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="flex items-center justify-between mb-1.5">
              <Badge variant="outline" className="rounded-full text-[10px] capitalize">{(a.action_type ?? "").replace(/_/g, " ")}</Badge>
              <PerfPill level={a.priority} />
            </div>
            <div className="text-sm font-semibold mb-1 line-clamp-2">{a.what_to_do}</div>
            <div className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{a.based_on_insight}</div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>· {a.content_format}</span>
              {a.deadline && <span>· due {String(a.deadline).slice(0, 10)}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}