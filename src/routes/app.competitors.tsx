import { createFileRoute } from "@tanstack/react-router";
import { Eye, Heart, MessageCircle, TrendingUp, TrendingDown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/app/competitors")({ component: Competitors });

const competitors = [
  { handle: "@latte.art.lv", name: "Latte Art Lab", emoji: "🎨", followers: "15.1k", er: 7.2, posts7d: 9, reach: 48000, trend: "up", reviews: 4.8, grad: "bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40" },
  { handle: "@cafe_svit", name: "Café Svit", emoji: "☕", followers: "12.4k", er: 5.8, posts7d: 7, reach: 32000, trend: "up", reviews: 4.6, grad: "bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40" },
  { handle: "@morningbrew_lv", name: "Morning Brew", emoji: "🌅", followers: "6.2k", er: 6.4, posts7d: 11, reach: 22000, trend: "up", reviews: 4.7, grad: "bg-gradient-to-br from-primary/30 via-violet/25 to-primary/30 border border-primary/40" },
  { handle: "@lviv_coffee", name: "Lviv Coffee Roasters", emoji: "🫘", followers: "8.9k", er: 4.1, posts7d: 4, reach: 18000, trend: "down", reviews: 4.5, grad: "bg-gradient-to-br from-primary/25 via-violet/20 to-primary/30 border border-primary/40" },
  { handle: "@bean_to_cup", name: "Bean to Cup", emoji: "🍪", followers: "4.8k", er: 3.9, posts7d: 3, reach: 9500, trend: "down", reviews: 4.3, grad: "bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40" },
  { handle: "@kavarna_centr", name: "Kavarna Centr", emoji: "📍", followers: "9.3k", er: 4.7, posts7d: 6, reach: 21000, trend: "up", reviews: 4.4, grad: "bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40" },
];

const formatMix = [
  { f: "Reels", v: 48 }, { f: "Carousel", v: 22 }, { f: "Single", v: 18 }, { f: "Story", v: 12 },
];

function Competitors() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Competitor Radar</h1>
          <p className="text-muted-foreground mt-1">6 of 10 watched · last sync 4 minutes ago</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">Compare two</Button>
          <Button className="rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90">+ Add competitor</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {competitors.map(c => (
          <div key={c.handle} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop hover:shadow-pop transition-all">
            <div className="grid lg:grid-cols-[auto_1fr_auto] gap-5 items-center">
              <div className="flex items-center gap-4 min-w-[220px]">
                <div className={`size-14 rounded-2xl grid place-items-center text-3xl ${c.grad} shadow-pop`}>{c.emoji}</div>
                <div>
                  <div className="font-display text-lg font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.handle} · {c.followers} followers</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Stat label="Engagement" value={`${c.er}%`} highlight={c.er > 6} />
                <Stat label="Posts (7d)" value={c.posts7d.toString()} />
                <Stat label="Est. reach" value={`${(c.reach / 1000).toFixed(1)}k`} icon={c.trend === "up" ? <TrendingUp className="size-3 text-success" /> : <TrendingDown className="size-3 text-destructive" />} />
                <Stat label="Reviews" value={c.reviews.toString()} icon={<Star className="size-3 text-warning fill-warning" />} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">Open</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail view sample */}
      <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 grid place-items-center text-2xl shadow-pop">🎨</div>
            <div>
              <div className="font-display text-xl font-bold">Latte Art Lab</div>
              <div className="text-xs text-muted-foreground">@latte.art.lv · deep dive · last 30 days</div>
            </div>
          </div>
          <Badge className="rounded-full bg-success text-success-foreground">Outperforming you in 4 of 5 metrics</Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Format mix (last 30 days)</h4>
            <div className="h-48">
              <ResponsiveContainer>
                <BarChart data={formatMix}>
                  <XAxis dataKey="f" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                  <Bar dataKey="v" fill="oklch(0.82 0.15 220)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Top hashtags</h4>
            <div className="flex flex-wrap gap-2">
              {["#latteartlviv", "#specialtycoffee", "#lvivfood", "#morningvibes", "#brewedinlviv", "#thirdwave", "#flatwhite", "#pourover", "#coffeeshop", "#kavalviv"].map((h, i) => (
                <Badge key={h} variant="outline" className="rounded-full" style={{ fontSize: `${14 - i * 0.5}px` }}>{h}</Badge>
              ))}
            </div>

            <h4 className="text-sm font-semibold mt-6 mb-3">Top posts</h4>
            <div className="space-y-2">
              {[
                { c: "Pour-over morning routine", r: "48k", l: "3.2k", m: "184" },
                { c: "Behind the bar with Anna", r: "22k", l: "1.4k", m: "92" },
                { c: "How we pick beans · Ethiopia", r: "18k", l: "1.1k", m: "76" },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/60 p-3">
                  <div className="size-10 rounded-xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 shrink-0" />
                  <div className="flex-1 text-sm font-medium truncate">{p.c}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1"><Eye className="size-3" /> {p.r}</span>
                    <span className="flex items-center gap-1"><Heart className="size-3" /> {p.l}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="size-3" /> {p.m}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, highlight }: any) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className={`font-display text-lg font-bold flex items-center gap-1.5 ${highlight ? "text-primary" : ""}`}>{value}{icon}</div>
    </div>
  );
}
