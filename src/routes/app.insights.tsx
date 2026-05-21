import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, ArrowRight, Bookmark, Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/insights")({ component: Insights });

const works = [
  { title: "Behind-the-scenes Reels are crushing it", body: "Posts with BTS video format get 3.2× more engagement at your competitors over 84 posts in 30 days.", action: "Film one barista shift and post a 20s Reel by Friday.", evidence: "6 competitors · 84 posts · 95% confidence" },
  { title: "15–25 second Reels outperform longer ones", body: "Sweet-spot length for cafés in Lviv is 18s. Anything past 35s drops 60% in completion rate.", action: "Cut your next Reel down to ≤25s.", evidence: "TikTok + IG · 142 reels" },
  { title: "Posts before 11am get 2× saves", body: "Morning content lands harder for your niche. Latte art at 8–10am is peak.", action: "Schedule your morning Reel for 09:30.", evidence: "30-day window · all competitors" },
  { title: "Hashtag #kavalviv has 4× organic reach", body: "Local-language tag is under-used and over-performing.", action: "Add #kavalviv to your next 5 posts.", evidence: "27 posts using it" },
];

const fails = [
  { title: "Long carousels (8+ slides) flop", body: "47% reach drop on long carousels in your niche. Audience scrolls past.", action: "Cap carousels at 5 slides with a strong slide-1 hook.", evidence: "31 posts analyzed" },
  { title: "Pure promo without storytelling = no saves", body: "Posts that lead with 'sale' or 'discount' have 0.4% save rate vs 3.1% niche avg.", action: "Wrap promos in a story (origin, ritual, result).", evidence: "62 promo posts" },
  { title: "Stock-style food photos underperform", body: "Plated overhead shots without people get 38% less engagement than candid moments.", action: "Add hands, baristas or guests to the next 3 food shots.", evidence: "94 photos clustered" },
];

function Insights() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Insights Feed</h1>
          <p className="text-muted-foreground mt-1">What's working, what's not — fresh from your competitor radar.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">All</Button>
          <Button variant="outline" className="rounded-full">Saved</Button>
          <Button variant="outline" className="rounded-full">Done</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Column title="What's working" tone="works" items={works} />
        <Column title="What's failing" tone="fails" items={fails} />
      </div>
    </div>
  );
}

function Column({ title, tone, items }: { title: string; tone: "works" | "fails"; items: any[] }) {
  const isWorks = tone === "works";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-2xl grid place-items-center text-foreground shadow-pop ${isWorks ? "bg-gradient-to-br from-primary/25 via-violet/20 to-primary/30 border border-primary/40" : "bg-gradient-to-br from-violet/30 via-primary/20 to-primary/30 border border-primary/40"}`}>
          {isWorks ? <Check className="size-5" /> : <X className="size-5" />}
        </div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <Badge variant="outline" className="rounded-full">{items.length} cards</Badge>
      </div>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className={`rounded-3xl p-5 border-2 shadow-pop hover:shadow-pop transition ${isWorks ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}
          >
            <div className="flex items-start gap-3">
              <div className={`size-9 rounded-xl grid place-items-center shrink-0 ${isWorks ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
                <Lightbulb className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold leading-snug">{it.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{it.body}</p>

                <div className="mt-4 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 p-3 flex items-start gap-2">
                  <Sparkles className="size-4 mt-0.5 text-primary shrink-0" />
                  <div className="text-sm">
                    <span className="font-semibold">Do this:</span> {it.action}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{it.evidence}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="rounded-full h-8"><Bookmark className="size-3.5 mr-1" /> Save</Button>
                    <Button size="sm" className="rounded-full h-8 bg-primary text-primary-foreground shadow-glow hover:opacity-90">Apply <ArrowRight className="size-3.5 ml-1" /></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
