import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";

export const Route = createFileRoute("/app/ideas")({
  component: IdeasPage,
  head: () => ({
    meta: [
      { title: "Ideas — Navio" },
      { name: "description", content: "AI-suggested content ideas tailored to your niche and audience." },
      { property: "og:title", content: "Ideas — Navio" },
      { property: "og:description", content: "AI-suggested content ideas tailored to your niche and audience." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/ideas" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/ideas" },
    ],
  }),
});

function normPriority(v: string): "high" | "medium" | "low" {
  if (v === "high" || v === "Високий") return "high";
  if (v === "medium" || v === "Середній") return "medium";
  return "low";
}

function normEffort(v: string): "high" | "medium" | "low" {
  if (v === "high" || v === "Високий") return "high";
  if (v === "medium" || v === "Середній") return "medium";
  return "low";
}

function priorityBadgeClass(p: "high" | "medium" | "low") {
  if (p === "high") return "bg-primary text-primary-foreground border-0";
  if (p === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-muted text-muted-foreground border-border";
}

function effortBadgeClass(e: "high" | "medium" | "low") {
  if (e === "low") return "bg-success/20 text-success border-success/40";
  if (e === "medium") return "bg-muted text-muted-foreground border-border";
  return "bg-red-500/20 text-red-400 border-red-500/40";
}

function IdeasPage() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("idea_suggestions");

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="idea_suggestions" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="idea_suggestions" roleKey={role} generatedAt={generatedAt} />;

  const summary = payload.sections?.summary ?? {};
  const groups: any[] = payload.sections?.idea_groups ?? [];

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">{summary.title || "Ідеї для дій"}</h1>
        {summary.ideas_count != null && (
          <p className="text-muted-foreground mt-1">{summary.ideas_count} ідей сформовано</p>
        )}
      </header>

      {groups.map((group) => {
        const isOpportunities = group.group_key === "opportunities";
        return (
          <section key={group.group_key} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold">{group.label}</h2>
              <Badge variant="outline" className="rounded-full">{(group.items ?? []).length}</Badge>
            </div>

            {isOpportunities ? (
              <div className="grid md:grid-cols-2 gap-4">
                {(group.items ?? []).map((item: any, i: number) => {
                  const p = normPriority(item.priority ?? "");
                  const e = normEffort(item.effort ?? "");
                  return (
                    <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`rounded-full border text-xs ${priorityBadgeClass(p)}`}>
                          priority: {p}
                        </Badge>
                        <Badge className={`rounded-full border text-xs ${effortBadgeClass(e)}`}>
                          effort: {e}
                        </Badge>
                      </div>
                      <h3 className="font-display text-lg font-semibold leading-snug">{item.opportunity}</h3>
                      {item.expected_impact && (
                        <p className="text-sm text-muted-foreground">{item.expected_impact}</p>
                      )}
                      {item.recommended_action && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-primary font-medium">Дія →</summary>
                          <p className="mt-2 text-muted-foreground">{item.recommended_action}</p>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {(group.items ?? []).map((item: any, i: number) => (
                  <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3">
                    <h3 className="font-display text-lg font-semibold leading-snug">{item.test_type}</h3>
                    {item.hypothesis && (
                      <p className="text-sm text-muted-foreground">{item.hypothesis}</p>
                    )}
                    {(item.metric_to_watch || item.success_criteria) && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-primary font-medium">Деталі →</summary>
                        <div className="mt-2 space-y-1 text-muted-foreground">
                          {item.metric_to_watch && <p><span className="font-medium text-foreground">Метрика:</span> {item.metric_to_watch}</p>}
                          {item.success_criteria && <p><span className="font-medium text-foreground">Успіх:</span> {item.success_criteria}</p>}
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {groups.length === 0 && <PageObjectEmpty pageKey="idea_suggestions" roleKey={role} generatedAt={generatedAt} />}
    </div>
  );
}
