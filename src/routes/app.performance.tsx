import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, MapPin, ArrowUpRight, ArrowDownRight, Sparkles, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ScatterChart, Scatter, ZAxis } from "recharts";

export const Route = createFileRoute("/app/performance")({ component: Performance });

const reach = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  reach: 600 + Math.sin(i / 4) * 200 + i * 25 + Math.random() * 100,
  engagement: 3 + Math.cos(i / 5) * 1.2 + i * 0.05,
}));

const correlation = [
  { likes: 412, comments: 38, type: "Reel BTS", z: 200 },
  { likes: 287, comments: 22, type: "Carousel", z: 150 },
  { likes: 98, comments: 14, type: "Story", z: 80 },
  { likes: 540, comments: 51, type: "Reel BTS", z: 240 },
  { likes: 180, comments: 12, type: "Single", z: 60 },
  { likes: 612, comments: 78, type: "Reel BTS", z: 280 },
  { likes: 220, comments: 18, type: "Carousel", z: 100 },
  { likes: 340, comments: 28, type: "Single", z: 120 },
];

function Performance() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">My Performance</h1>
          <p className="text-muted-foreground mt-1">Connected accounts and how FlyHigh insights moved your numbers.</p>
        </div>
        <Button className="rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90"><Plug className="size-4 mr-1.5" /> Connect another</Button>
      </div>

      {/* Connected accounts */}
      <div className="grid md:grid-cols-3 gap-4">
        <Account icon={<Instagram className="size-5" />} name="@cafe_svitlo" platform="Instagram" connected />
        <Account icon={<Facebook className="size-5" />} name="Café Svitlo" platform="Facebook" connected />
        <Account icon={<MapPin className="size-5" />} name="Café Svitlo · Lviv" platform="Google Business" />
      </div>

      {/* Before/After lift */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/40 via-primary/20 to-violet/50 border border-primary/60 p-8 text-primary-foreground shadow-glow relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative grid md:grid-cols-[auto_1fr_auto] items-center gap-6">
          <Sparkles className="size-10" />
          <div>
            <Badge variant="outline" className="rounded-full bg-primary/20 border-primary/40 text-foreground mb-2">Insight lift</Badge>
            <h3 className="font-display text-2xl font-bold">You applied 3 insights this week.</h3>
            <p className="text-foreground/80 mt-1">Reach +18% · Engagement rate +0.8pt · Followers +212. Keep it going.</p>
          </div>
        </div>
      </div>

      {/* Reach chart */}
      <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-semibold">Reach over time</h3>
            <p className="text-sm text-muted-foreground">Last 30 days · all connected accounts</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="rounded-full">7d</Badge>
            <Badge className="rounded-full bg-primary text-primary-foreground border-0">30d</Badge>
            <Badge variant="outline" className="rounded-full">90d</Badge>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={reach}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Line type="monotone" dataKey="reach" stroke="oklch(0.82 0.15 220)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlation */}
      <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="mb-4">
          <h3 className="font-display text-xl font-semibold">Likes ↔ Comments correlation</h3>
          <p className="text-sm text-muted-foreground">Bubble size = saves. BTS Reels cluster top-right.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" dataKey="likes" name="Likes" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="comments" name="Comments" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[80, 400]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Scatter data={correlation} fill="oklch(0.82 0.15 220)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Account({ icon, name, platform, connected }: any) {
  return (
    <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop flex items-center gap-3">
      <div className="size-11 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 grid place-items-center  text-primary shadow-pop">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{name}</div>
        <div className="text-xs text-muted-foreground">{platform}</div>
      </div>
      {connected ? (
        <Badge className="rounded-full bg-success text-success-foreground border-0">Connected</Badge>
      ) : (
        <Button size="sm" variant="outline" className="rounded-full">Connect</Button>
      )}
    </div>
  );
}
