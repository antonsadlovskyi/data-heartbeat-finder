import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Sparkles, Heart, MessageCircle, Eye, Star, Flame, Lightbulb, ArrowRight, Play, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const reachData = Array.from({ length: 14 }, (_, i) => ({
  d: i, you: 800 + Math.sin(i / 2) * 200 + i * 60, niche: 600 + Math.cos(i / 3) * 150 + i * 40,
}));

function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Доброго ранку, Olena 👋</h1>
          <p className="text-muted-foreground mt-1">3 new insights · 1 competitor went viral · 2 trends to ride this week.</p>
        </div>
        <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90">
          <Link to="/app/insights">View today's insights <ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </div>

      {/* Top Insight banner */}
      <div
        className="relative overflow-hidden rounded-3xl bg-primary/15 border border-primary/50 p-8 text-foreground shadow-glow"
      >
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-violet/40 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="size-14 rounded-2xl bg-primary/20 backdrop-blur grid place-items-center shrink-0">
            <Sparkles className="size-7" />
          </div>
          <div className="flex-1 min-w-[260px]">
            <Badge variant="outline" className="rounded-full bg-primary/20 border-primary/40 text-foreground mb-2">⚡ Top insight today</Badge>
            <h3 className="font-display text-2xl font-bold">Café Svit posts daily latte-art Reels and gets 4× your reach.</h3>
            <p className="mt-1 text-foreground/80">Try a 15–25s slow-mo Reel this week. We've drafted 3 hooks for you.</p>
          </div>
          <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90">
            See examples
          </Button>
        </div>
      </div>

      {/* Pulse + Market */}
      <div className="grid lg:grid-cols-3 gap-5">
        <PulseCard label="Reach (7d)" value="14.2k" delta="+18%" up data={reachData} />
        <PulseCard label="Engagement rate" value="5.4%" delta="+0.8pt" up data={reachData.map(d => ({ ...d, you: d.you * 0.8 }))} />
        <PulseCard label="New followers" value="+212" delta="-4%" up={false} data={reachData.map(d => ({ ...d, you: d.you * 0.6 }))} />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold">You vs your niche</h3>
              <p className="text-sm text-muted-foreground">Estimated reach, last 14 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> You</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" /> Niche avg</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={reachData}>
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
            <h3 className="font-display text-xl font-semibold">Competitor spotlight</h3>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40 p-4 text-foreground shadow-pop">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/20 grid place-items-center text-2xl">☕</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">@latte.art.lv</div>
                  <div className="text-xs text-foreground/75">went viral · 48k views</div>
                </div>
              </div>
              <p className="mt-3 text-sm">"Pour-over morning routine" Reel — 12× their normal reach.</p>
            </div>

            <div className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Star className="size-4 text-warning" /> <span className="font-medium">@cafe_svit</span>
                <span className="text-muted-foreground">+14 reviews this week</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <div className="flex items-center gap-2 text-sm">
                <ImageIcon className="size-4 text-violet" /> <span className="font-medium">@morningbrew_lv</span>
                <span className="text-muted-foreground">posted 11 stories yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent wins */}
      <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-xl font-semibold">Your recent wins 🎉</h3>
            <p className="text-sm text-muted-foreground">Posts that beat your 30-day average</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full">View all</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <PostCard kind="Reel" caption="Latte art slow-mo, morning sun" reach="3.2k" likes="412" comments="38" lift="+220%" />
          <PostCard kind="Carousel" caption="3 ways we brew our seasonal blend" reach="2.1k" likes="287" comments="22" lift="+85%" />
          <PostCard kind="Story" caption="Behind the bar with Marko" reach="1.4k" likes="98" comments="14" lift="+42%" />
        </div>
      </div>

      {/* Insights teaser */}
      <div className="grid md:grid-cols-2 gap-5">
        <InsightTeaser tone="works" title="Behind-the-scenes Reels work for cafés" body="3.2× more engagement at your competitors over 84 posts." />
        <InsightTeaser tone="fails" title="8+ slide carousels are dragging reach" body="47% reach drop on long carousels in your niche." />
      </div>
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
