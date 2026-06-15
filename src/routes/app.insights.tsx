import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { getInsightsFeed, applyInsight } from "@/lib/data/insights.functions";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/app/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Navio" },
      { name: "description", content: "What is working and what is not in your niche — with concrete next actions." },
      { property: "og:title", content: "Insights — Navio" },
      { property: "og:description", content: "What is working and what is not in your niche — with concrete next actions." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/insights" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/insights" },
    ],
  }),
  component: Insights,
});

function priorityColor(p: string) {
  if (p === "high") return "bg-primary text-primary-foreground border-0";
  if (p === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-muted text-muted-foreground border-border";
}

function priorityLabel(p: string) {
  if (p === "high") return "Високий";
  if (p === "medium") return "Середній";
  return "Низький";
}

function Insights() {
  const role = useRole(s => s.role);
  const { payload, isLoading: poLoading, isPending, dataStatus, role: poRole, generatedAt, isError, error } =
    usePageObject<any>("insights_feed");

  const getInsightsFn = useServerFn(getInsightsFeed);
  const applyFn = useServerFn(applyInsight);
  const queryClient = useQueryClient();
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const insightsQuery = useQuery({
    queryKey: ["insights-feed"],
    queryFn: () => getInsightsFn({ data: undefined }),
    enabled: !poLoading && !isPending,
  });

  async function handleApply(insight_id: string) {
    setApplyingId(insight_id);
    try {
      const result = await applyFn({ data: { insight_id, role_key: role } });
      if (result.ok) {
        toast.success("Todo створено!");
        queryClient.invalidateQueries({ queryKey: ["insights-feed"] });
        queryClient.invalidateQueries({ queryKey: ["page-object", "todos"] });
      } else {
        const msg =
          result.status === "no_insight_found" ? "Інсайт не знайдено" :
          result.status === "workspace_not_allowed" ? "Немає доступу до workspace" :
          result.error ?? "Сталася помилка";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Невідома помилка");
    } finally {
      setApplyingId(null);
    }
  }

  if (poLoading) return <div className="text-sm text-muted-foreground p-6">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="insights_feed" roleKey={poRole} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="insights_feed" roleKey={poRole} generatedAt={generatedAt} />;

  const summary = payload.sections?.summary ?? {};
  const paragraphs: string[] = (summary.summary ?? "").split(/\n\n+/).filter(Boolean);
  const insights: any[] = insightsQuery.data?.insights ?? [];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{summary.title || "Інсайти"}</h1>
      </div>

      {/* Summary block */}
      {paragraphs.length > 0 && (
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop flex gap-4">
              <div className="shrink-0 size-8 rounded-xl bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 grid place-items-center text-xs font-bold text-primary">
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 pt-1">{p}</p>
            </div>
          ))}
        </div>
      )}

      {/* Insight cards */}
      {insightsQuery.isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Завантаження інсайтів...
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold">Всі інсайти</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <div
                key={insight.insight_id}
                className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge className={`rounded-full border text-xs ${priorityColor(insight.priority)}`}>
                    {priorityLabel(insight.priority)}
                  </Badge>
                  {insight.platform && insight.platform !== "all" && (
                    <Badge variant="outline" className="rounded-full text-xs">{insight.platform}</Badge>
                  )}
                  {insight.apply_status === "applied" && (
                    <Badge className="rounded-full bg-success text-success-foreground border-0 text-xs">Застосовано ✓</Badge>
                  )}
                  {insight.apply_status === "pending" && (
                    <Badge variant="outline" className="rounded-full text-xs text-muted-foreground">Обробляється...</Badge>
                  )}
                </div>

                <h3 className="font-display text-base font-semibold leading-snug">{insight.title}</h3>

                {insight.short_summary && (
                  <p className="text-sm text-muted-foreground">{insight.short_summary}</p>
                )}

                {insight.recommended_action && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary font-medium">Рекомендована дія →</summary>
                    <p className="mt-2 text-muted-foreground">{insight.recommended_action}</p>
                  </details>
                )}

                {insight.apply_status === "not_applied" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                    disabled={applyingId === insight.insight_id}
                    onClick={() => handleApply(insight.insight_id)}
                  >
                    {applyingId === insight.insight_id
                      ? <><Loader2 className="size-3 mr-1 animate-spin" /> Застосовуємо...</>
                      : "Застосувати → Todo"
                    }
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
