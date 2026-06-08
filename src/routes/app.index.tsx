import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Sparkles, Heart, MessageCircle, Eye, Star, Flame, Lightbulb, ArrowRight, Play, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { useAuth } from "@/lib/auth-context";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";

export const Route = createFileRoute("/app/")({
  
  head: () => ({
    meta: [
      { title: "Dashboard — Navio" },
      { name: "description", content: "Your daily marketing intelligence snapshot: reach, engagement, and what to post next." },
      { property: "og:title", content: "Dashboard — Navio" },
      { property: "og:description", content: "Your daily marketing intelligence snapshot: reach, engagement, and what to post next." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app" },
    ],
  }),
  component: Dashboard,
});

const fallbackTrend = Array.from({ length: 14 }, (_, i) => ({
  d: i, you: 800 + Math.sin(i / 2) * 200 + i * 60, niche: 600 + Math.cos(i / 3) * 150 + i * 40,
}));

function Dashboard() {
  const { user } = useAuth();
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, workspace, isError, error, workspaceId, isWorkspaceError, workspaceError } = usePageObject<any>("dashboard");
  const t = useT();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground p-6">{t("dashboard.loading")}</div>;
  }
  if (isWorkspaceError) {
    return <div className="p-6 text-red-400 text-xs font-mono whitespace-pre-wrap">WORKSPACE ERROR: {String((workspaceError as any)?.message ?? workspaceError)}</div>;
  }
  if (isError) {
    return <div className="p-6 text-red-400 text-xs font-mono whitespace-pre-wrap">ERROR: {String((error as any)?.message ?? error)}{"\n"}workspaceId: {workspaceId}</div>;
  }
  if (isPending) {
    return <PageObjectPending pageKey="dashboard" roleKey={role} dataStatus={dataStatus!} />;
  }
  if (!payload) {
    return <PageObjectEmpty pageKey="dashboard" roleKey={role} generatedAt={generatedAt} />;
  }

  const displayName =
    payload.greeting?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "there";
  const projectName = workspace?.project_name ?? payload.greeting?.project_name;
  const subtitle = payload.greeting?.subtitle ?? t("dashboard.subtitle_fallback");
  const topInsight = payload.top_insight;
  const kpis = (payload.kpis ?? []) as any[];
  const trend = (payload.trend ?? fallbackTrend) as any[];
  const spotlight = (payload.spotlight ?? []) as any[];
  const wins = (payload.recent_wins ?? []) as any[];
  const insights = (payload.insights ?? []) as any[];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">{t("dashboard.greeting", { name: displayName })}</h1>
          <p className="text-muted-foreground mt-1">
            {projectName ? `${projectName} · ` : ""}{subtitle}
          </p>
        </div>
        <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90">
          <Link to="/app/insights">{t("dashboard.view_insights")} <ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </div>

      {/* Top Insight banner */}
      {topInsight && (
      <div className="relative overflow-hidden rounded-3xl bg-primary/15 border border-primary/50 p-8 text-foreground shadow-glow">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-violet/40 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="size-14 rounded-2xl bg-primary/20 backdrop-blur grid place-items-center shrink-0">
            <Sparkles className="size-7" />
          </div>
          <div className="flex-1 min-w-[260px]">
            <Badge variant="outline" className="rounded-full bg-primary/20 border-primary/40 text-foreground mb-2">
              {topInsight.badge ?? t("dashboard.top_insight_badge")}
            </Badge>
            <h3 className="font-display text-2xl font-bold">{topInsight.title}</h3>
            <p className="mt-1 text-foreground/80">{topInsight.body}</p>
          </div>
          {topInsight.cta && (
            <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90">
              {topInsight.cta}
            </Button>
          )}
        </div>
      </div>
      )}

      {/* Pulse + Market */}
      <div className="grid lg:grid-cols-3 gap-5">
        {kpis.slice(0, 3).map((k, i) => (
          <PulseCard
            key={i}
            label={k.label}
            value={k.value}
            delta={k.delta}
            up={k.up !== false}
            data={trend}
          />
        ))}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold">{payload.trend_title ?? t("dashboard.trend_title")}</h3>
              <p className="text-sm text-muted-foreground">{payload.trend_subtitle ?? t("dashboard.trend_subtitle")}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> {t("dashboard.you")}</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" /> {t("dashboard.niche_avg")}</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.15 220)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.82 0.15 220)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 280)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.7 0.22 280)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Area type="monotone" dataKey="you" stroke="oklch(0.82 0.15 220)" strokeWidth={3} fill="url(#g1)" />
                <Area type="monotone" dataKey="niche" stroke="oklch(0.7 0.22 280)" strokeWidth={2} fill="url(#g2)" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="size-5 text-coral" />
            <h3 className="font-display text-xl font-semibold">{payload.spotlight_title ?? t("dashboard.spotlight_title")}</h3>
          </div>
          <div className="space-y-3">
            {spotlight.map((s, i) => (
              i === 0 ? (
                <div key={i} className="rounded-2xl bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40 p-4 text-foreground shadow-pop">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/20 grid place-items-center text-2xl">{s.emoji ?? "✨"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{s.handle}</div>
                      <div className="text-xs text-foreground/75">{s.badge}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{s.body}</p>
                </div>
              ) : (
                <div key={i} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    {s.icon === "image" ? <ImageIcon className="size-4 text-violet" /> : <Star className="size-4 text-warning" />}
                    <span className="font-medium">{s.handle}</span>
                    <span className="text-muted-foreground">{s.body}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Recent wins */}
      {wins.length > 0 && (
      <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-xl font-semibold">{payload.wins_title ?? t("dashboard.wins_title")}</h3>
            <p className="text-sm text-muted-foreground">{payload.wins_subtitle ?? t("dashboard.wins_subtitle")}</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full">{t("dashboard.view_all")}</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {wins.slice(0, 3).map((w, i) => (
            <PostCard key={i} kind={w.kind} caption={w.caption} reach={w.reach} likes={w.likes} comments={w.comments} lift={w.lift} />
          ))}
        </div>
      </div>
      )}

      {/* Insights teaser */}
      {insights.length > 0 && (
      <div className="grid md:grid-cols-2 gap-5">
        {insights.slice(0, 2).map((it, i) => (
          <InsightTeaser key={i} tone={it.tone === "fails" ? "fails" : "works"} title={it.title} body={it.body} />
        ))}
      </div>
      )}
    </div>
  );
}

function PulseCard({ label, value, delta, up, data }: any) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Badge variant="outline" className={`rounded-full ${up ? "text-success border-success/40" : "text-destructive border-destructive/40"}`}>
          {up ? <ArrowUpRight className="size-3 mr-1" /> : <ArrowDownRight className="size-3 mr-1" />}{delta}
        </Badge>
      </div>
      <div className="font-display text-4xl font-bold tracking-tight">{value}</div>
      <div className="h-12 mt-3 -mx-2">
        <ResponsiveContainer>
          <LineChart data={data}>
            <Line type="monotone" dataKey="you" stroke="oklch(0.82 0.15 220)" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function PostCard({ kind, caption, reach, likes, comments, lift }: any) {
  const grad = kind === "Reel" ? "bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40" : kind === "Carousel" ? "bg-gradient-to-br from-primary/25 via-violet/20 to-primary/30 border border-primary/40" : "bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40";
  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden">
      <div className={`aspect-video ${grad} grid place-items-center relative`}>
        {kind === "Reel" && <Play className="size-12 text-primary" />}
        {kind === "Carousel" && <ImageIcon className="size-12 text-foreground/70" />}
        {kind === "Story" && <Sparkles className="size-12 text-primary" />}
        <Badge className="absolute top-3 left-3 rounded-full bg-background/80 backdrop-blur text-foreground border-0">{kind}</Badge>
        <Badge className="absolute top-3 right-3 rounded-full bg-success text-success-foreground border-0">{lift}</Badge>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium line-clamp-2">{caption}</p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Eye className="size-3.5" /> {reach}</span>
          <span className="flex items-center gap-1"><Heart className="size-3.5" /> {likes}</span>
          <span className="flex items-center gap-1"><MessageCircle className="size-3.5" /> {comments}</span>
        </div>
      </div>
    </div>
  );
}

function InsightTeaser({ tone, title, body }: { tone: "works" | "fails"; title: string; body: string }) {
  const isWorks = tone === "works";
  return (
    <div className={`rounded-3xl p-6 border-2 shadow-pop ${isWorks ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`size-9 rounded-xl grid place-items-center ${isWorks ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
          <Lightbulb className="size-5" />
        </div>
        <Badge variant="outline" className={`rounded-full uppercase text-[10px] tracking-wider ${isWorks ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}`}>
          {isWorks ? "What works" : "What fails"}
        </Badge>
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Button variant="ghost" size="sm" className="mt-4 rounded-full px-0">Apply to my strategy <ArrowRight className="size-3.5 ml-1" /></Button>
    </div>
  );
}
