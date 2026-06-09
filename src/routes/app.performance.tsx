import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";

export const Route = createFileRoute("/app/performance")({
  head: () => ({
    meta: [
      { title: "My Performance — Navio" },
      { name: "description", content: "Correlate what you post with how it performs across all connected accounts." },
      { property: "og:title", content: "My Performance — Navio" },
      { property: "og:description", content: "Correlate what you post with how it performs across all connected accounts." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/performance" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/performance" },
    ],
  }),
  component: Performance,
});

const STRONG_SPOTS_LABELS: Record<string, string> = {
  brand_positioning_signal: "Сильний бренд",
  high_content_learning_value: "Висока навчальна цінність",
  high_product_learning_value: "Навчальна цінність продукту",
  high_strategic_value: "Висока стратегічна цінність",
  high_value_low_engagement: "Висока цінність, низьке залучення",
  offer_signal: "Чіткий офер",
  pricing_signal: "Цінова сигналізація",
  product_signal: "Продуктовий сигнал",
  strong_marketer_relevance: "Релевантний для маркетологів",
  strong_owner_relevance: "Релевантний для власників",
  strong_smm_relevance: "Релевантний для SMM",
};

function formatSpot(key: string): string {
  return STRONG_SPOTS_LABELS[key] ?? key.replace(/_/g, " ");
}

function threatColor(level: string) {
  if (level === "high") return "text-red-400";
  if (level === "medium") return "text-yellow-400";
  return "text-muted-foreground";
}

function threatBadgeClass(level: string) {
  if (level === "high") return "bg-red-500/20 text-red-400 border-red-500/40";
  if (level === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-muted text-muted-foreground border-border";
}

function Performance() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("my_performance");

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="my_performance" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="my_performance" roleKey={role} generatedAt={generatedAt} />;

  const perfSummary = payload.sections?.performance_summary ?? {};
  const benchmark: any[] = payload.sections?.benchmark_vs_competitors ?? [];
  const topPosts: any[] = payload.sections?.own_top_posts ?? [];
  const weakPosts: any[] = payload.sections?.own_weak_posts ?? [];

  const summaryParagraphs: string[] = (perfSummary.summary ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {perfSummary.title || "Моя ефективність"}
        </h1>
      </div>

      {/* Not enough data banner */}
      {perfSummary.overall_status === "not_enough_data" && (
        <div className="rounded-3xl bg-yellow-500/10 border border-yellow-500/30 p-6 space-y-2">
          <div className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Недостатньо даних</div>
          <p className="font-semibold">Недостатньо власних постів для аналізу</p>
          {perfSummary.recommended_focus && (
            <p className="text-sm text-muted-foreground">{perfSummary.recommended_focus}</p>
          )}
        </div>
      )}

      {/* Summary text */}
      {summaryParagraphs.length > 0 && (
        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop space-y-4">
          {summaryParagraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/90">{p}</p>
          ))}
        </div>
      )}

      {/* Top posts (when available) */}
      {topPosts.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">Топ пости</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {topPosts.map((post: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
                <p className="text-sm">{post.caption || post.post_id}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benchmark vs competitors */}
      {benchmark.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold">Конкуренти для порівняння</h2>
            <Badge variant="outline" className="rounded-full">{benchmark.length}</Badge>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {benchmark.map((comp: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{comp.display_name}</div>
                    <div className="text-xs text-muted-foreground">@{comp.username}</div>
                  </div>
                  {comp.profile_url && (
                    <a href={comp.profile_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {comp.overall_score != null && (
                    <Badge variant="outline" className="rounded-full text-xs">
                      Score: {typeof comp.overall_score === "number" ? comp.overall_score.toFixed(1) : comp.overall_score}
                    </Badge>
                  )}
                  {comp.strategic_threat_level && (
                    <Badge className={`rounded-full border text-xs ${threatBadgeClass(comp.strategic_threat_level)}`}>
                      {comp.strategic_threat_level} threat
                    </Badge>
                  )}
                  {comp.platform && (
                    <Badge variant="outline" className="rounded-full text-xs">{comp.platform}</Badge>
                  )}
                </div>

                {comp.strong_spots?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {comp.strong_spots.map((spot: string, j: number) => (
                      <Badge key={j} variant="outline" className="rounded-full text-xs">
                        {formatSpot(spot)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
