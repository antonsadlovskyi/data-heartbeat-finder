import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";

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

function confidenceColor(level: string) {
  if (level === "high") return "bg-success text-success-foreground";
  if (level === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-muted text-muted-foreground";
}

function Insights() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("insights_feed");

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="insights_feed" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="insights_feed" roleKey={role} generatedAt={generatedAt} />;

  const summary = payload.sections?.summary ?? {};
  const quality = payload.data_quality ?? {};
  const paragraphs: string[] = (summary.summary ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{summary.title || "Інсайти"}</h1>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-2">
        {summary.high_priority_count != null && (
          <Badge className="rounded-full bg-primary text-primary-foreground border-0">
            {summary.high_priority_count} пріоритетних інсайтів
          </Badge>
        )}
        {quality.posts_analyzed != null && (
          <Badge variant="outline" className="rounded-full">
            {quality.posts_analyzed} постів проаналізовано
          </Badge>
        )}
        {quality.competitor_accounts_analyzed != null && (
          <Badge variant="outline" className="rounded-full">
            {quality.competitor_accounts_analyzed} акаунтів конкурентів
          </Badge>
        )}
        {quality.own_accounts_analyzed != null && (
          <Badge variant="outline" className="rounded-full">
            {quality.own_accounts_analyzed} власних акаунтів
          </Badge>
        )}
        {quality.confidence_level && (
          <Badge className={`rounded-full border ${confidenceColor(quality.confidence_level)}`}>
            confidence: {quality.confidence_level}
          </Badge>
        )}
      </div>

      {/* Analysis block — one card per paragraph */}
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
    </div>
  );
}
