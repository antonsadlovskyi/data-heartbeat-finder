import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar as RadarShape, ResponsiveContainer, Legend, Tooltip,
} from "recharts";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";

export const Route = createFileRoute("/app/competitors")({ 
  head: () => ({
    meta: [
      { title: "Competitor Radar — Navio" },
      { name: "description", content: "Track up to 10 local rivals across Instagram, Facebook, TikTok and Google Maps." },
      { property: "og:title", content: "Competitor Radar — Navio" },
      { property: "og:description", content: "Track up to 10 local rivals across Instagram, Facebook, TikTok and Google Maps." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/competitors" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/competitors" },
    ],
  }),
  component: Competitors,
});

const num = (v: any) => (typeof v === "number" ? v : parseFloat(v) || 0);

function Competitors() {
  const { payload, isLoading, role, generatedAt } = usePageObject<any>("competitors");
  const t = useT();

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("competitors.loading")}</div>;
  if (!payload) return <PageObjectEmpty pageKey="competitors" roleKey={role} generatedAt={generatedAt} />;

  const ranked = (payload.ranked ?? []) as any[];
  const headline = payload.headline ?? t("competitors.headline_fallback", { n: ranked.length });
  const h2h = payload.head_to_head as any | undefined;
  const radarChartData = h2h ? (h2h.axes ?? []).map((a: any) => ({
    axis: a.axis,
    [h2h.own_name]: num(a.you),
    [h2h.top_name]: num(a.top),
  })) : [];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">{t("competitors.title")}</h1>
          <p className="text-muted-foreground mt-1">{headline}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">{t("competitors.compare_two")}</Button>
          <Button className="rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90">{t("competitors.add")}</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {ranked.map((c: any, idx: number) => {
          const score = num(c.overall);
          const stronger = c.is_own ? false : score >= num(payload.own_score ?? 0);
          return (
          <div key={c.account_id ?? idx} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop hover:shadow-pop transition-all">
            <div className="grid lg:grid-cols-[auto_1fr_auto] gap-5 items-center">
              <div className="flex items-center gap-4 min-w-[220px]">
                <div className="size-14 rounded-2xl grid place-items-center font-display text-xl font-bold bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 text-primary shadow-pop">
                  {(c.name ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="font-display text-lg font-bold flex items-center gap-2">
                    {c.name}
                    {c.is_own && <Badge className="rounded-full text-[10px] bg-primary/15 text-primary border-primary/30">{t("competitors.you_badge")}</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.handle ? `@${String(c.handle).replace(/^@/, "")}` : "—"} · {c.followers ?? "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Stat label={t("competitors.stat.overall")} value={score.toFixed(1)} highlight={score >= 7} icon={stronger ? <TrendingUp className="size-3 text-success" /> : <TrendingDown className="size-3 text-warning" />} />
                <Stat label={t("competitors.stat.hook")} value={num(c.hook).toFixed(1)} />
                <Stat label={t("competitors.stat.visual")} value={num(c.visual).toFixed(1)} />
                <Stat label={t("competitors.stat.trust")} value={num(c.trust).toFixed(1)} />
              </div>

              <div className="flex gap-2">
                {c.external_url && (
                  <a href={c.external_url} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="rounded-full">{t("competitors.open")}</Button>
                  </a>
                )}
              </div>
            </div>
            {(c.key_strength || c.key_weakness) && (
              <div className="grid md:grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/60">
                {c.key_strength && <div className="text-[11px] text-success/90"><b>+ {t("competitors.strength")}:</b> {c.key_strength}</div>}
                {c.key_weakness && <div className="text-[11px] text-warning/90"><b>− {t("competitors.weakness")}:</b> {c.key_weakness}</div>}
              </div>
            )}
          </div>
        );})}
      </div>

      {h2h && (
        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-display text-xl font-bold">{t("competitors.h2h_title", { top: h2h.top_name })}</div>
              <div className="text-xs text-muted-foreground">{t("competitors.h2h_subtitle")}</div>
            </div>
            <Badge className="rounded-full bg-primary/15 text-primary border-primary/30">
              {t("competitors.delta_overall", { n: num(h2h.delta).toFixed(1) })}
            </Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                <RadarShape name={h2h.own_name} dataKey={h2h.own_name} stroke="oklch(0.78 0.13 220)" fill="oklch(0.78 0.13 220)" fillOpacity={0.25} />
                <RadarShape name={h2h.top_name} dataKey={h2h.top_name} stroke="oklch(0.7 0.17 30)" fill="oklch(0.7 0.17 30)" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {h2h.comparisons?.length > 0 && (
            <div className="grid md:grid-cols-2 gap-2 mt-4">
              {h2h.comparisons.slice(0, 6).map((c: any, i: number) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-background/40 p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold capitalize">{c.area}</span>
                    <span className={c.who_is_stronger === "competitor" ? "text-warning" : "text-success"}>
                      {c.who_is_stronger === "competitor" ? "−" : "+"}{num(c.gap).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{c.recommended_action}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
