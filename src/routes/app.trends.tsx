import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Music, Hash, Calendar, Play, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/trends")({ component: Trends });

const audios = [
  { title: "Aesthetic morning vibes", uses: "12.4k", growth: "+280%", duration: "0:18" },
  { title: "Slow-mo coffee pour", uses: "8.7k", growth: "+190%", duration: "0:22" },
  { title: "Lo-fi café beats", uses: "23.1k", growth: "+95%", duration: "0:30" },
  { title: "Український ранок", uses: "4.2k", growth: "+340%", duration: "0:15" },
];

const hashtags = [
  { tag: "#kavalviv", growth: "+220%", posts: "1.2k" },
  { tag: "#lvivmornings", growth: "+180%", posts: "890" },
  { tag: "#brewedinukraine", growth: "+150%", posts: "2.1k" },
  { tag: "#specialtycoffeeua", growth: "+120%", posts: "640" },
  { tag: "#cafelviv", growth: "+98%", posts: "3.4k" },
  { tag: "#latteartlife", growth: "+72%", posts: "8.2k" },
];

const seasonal = [
  { date: "In 12 days", title: "Halloween-themed lattes", desc: "Competitors typically post 5–7 days before. Start drafting a pumpkin spice Reel.", grad: "bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40" },
  { date: "In 23 days", title: "All Saints' Day weekend", desc: "Family-coffee posts spike. Brunch carousels overperform.", grad: "bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40" },
  { date: "In 41 days", title: "St. Nicholas / Christmas market", desc: "Festive cup designs get 3× saves — design yours by Nov 28.", grad: "bg-gradient-to-br from-primary/30 via-violet/25 to-primary/30 border border-primary/40" },
];

function Trends() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">Trend Tracker</h1>
        <p className="text-muted-foreground mt-1">What's bubbling up in Specialty Coffee · Lviv right now.</p>
      </div>

      {/* Audios */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 grid place-items-center  text-primary shadow-pop">
            <Music className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Trending audios</h2>
            <p className="text-xs text-muted-foreground">TikTok + Instagram Reels · last 7 days</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {audios.map(a => (
            <div key={a.title} className="rounded-2xl border border-border/60 p-4 flex items-center gap-3 hover:shadow-pop transition">
              <button className="size-12 rounded-xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 grid place-items-center text-foreground shadow-pop">
                <Play className="size-5 fill-white" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.uses} uses · {a.duration}</div>
              </div>
              <Badge className="rounded-full bg-success text-success-foreground border-0 shrink-0">{a.growth}</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Hashtags */}
      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/25 via-violet/20 to-primary/30 border border-primary/40 grid place-items-center shadow-pop">
            <Hash className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Local hashtags rising</h2>
            <p className="text-xs text-muted-foreground">Sorted by 7-day growth</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {hashtags.map(h => (
            <div key={h.tag} className="rounded-2xl border border-border/60 p-4 flex items-center justify-between">
              <div>
                <div className="font-display text-lg font-semibold">{h.tag}</div>
                <div className="text-xs text-muted-foreground">{h.posts} posts</div>
              </div>
              <div className="flex items-center gap-1 text-success font-semibold text-sm">
                <TrendingUp className="size-4" />{h.growth}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/30 via-violet/25 to-primary/30 border border-primary/40 grid place-items-center text-foreground shadow-pop">
            <Calendar className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Seasonal calendar</h2>
            <p className="text-xs text-muted-foreground">Plan ahead · what your competitors usually post</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {seasonal.map(s => (
            <div key={s.title} className={`rounded-3xl p-6 text-foreground shadow-pop ${s.grad}`}>
              <Badge variant="outline" className="rounded-full bg-primary/20 border-primary/40 text-foreground mb-3">{s.date}</Badge>
              <h3 className="font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-foreground/80">{s.desc}</p>
              <Button variant="ghost" size="sm" className="mt-4 rounded-full px-0 text-foreground hover:bg-primary/10">
                Draft a post <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
