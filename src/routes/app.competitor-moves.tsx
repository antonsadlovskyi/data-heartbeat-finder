import { createFileRoute } from "@tanstack/react-router";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/competitor-moves")({
  head: () => ({ meta: [{ title: "Competitor Moves — Navio" }] }),
  component: CompetitorMovesPage,
});

const TYPE_COLORS: Record<string, string> = {
  offer: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  proof: "bg-green-500/15 text-green-400 border-green-500/30",
  pricing: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  positioning: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  product: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

function typeBadge(type: string) {
  const cls = TYPE_COLORS[type] ?? "bg-muted/30 text-muted-foreground border-border/40";
  return <Badge className={`rounded-full text-[10px] border ${cls}`}>{type}</Badge>;
}

function CompetitorMovesPage() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("competitor_moves");
  const t = useT();

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("competitor_moves.loading")}</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="competitor_moves" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="competitor_moves" roleKey={role} generatedAt={generatedAt} />;

  const period = payload.period ?? {};
  const summary = payload.sections?.summary ?? {};
  // V2 payload may carry `move_groups` as a non-array shape; coerce defensively
  // so this legacy view degrades to its empty state instead of crashing. The
  // real V2 rendering lands in a later session.
  const mg = payload.sections?.move_groups;
  const moveGroups: any[] = Array.isArray(mg) ? mg : [];

  if (moveGroups.length === 0) {
    return <PageObjectEmpty pageKey="competitor_moves" roleKey={role} generatedAt={generatedAt} />;
  }

  // Split into moves vs insights groups
  const movesGroup = moveGroups.find((g: any) => g.group_key === "competitor_moves");
  const insightsGroup = moveGroups.find((g: any) => g.group_key === "product_or_offer_insights");

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("competitor_moves.title")}</h1>
        {(period.period_start || period.period_end) && (
          <p className="text-muted-foreground mt-1">{period.period_start} — {period.period_end}</p>
        )}
      </div>

      {/* Summary stats */}
      {(summary.new_moves_count || summary.product_moves_count) && (
        <div className="flex gap-4 flex-wrap">
          {summary.new_moves_count && (
            <div className="rounded-2xl bg-card/70 border border-border/60 px-5 py-3">
              <div className="text-xs text-muted-foreground">Нових ходів</div>
              <div className="font-display text-2xl font-bold text-primary">{summary.new_moves_count}</div>
            </div>
          )}
          {summary.product_moves_count && (
            <div className="rounded-2xl bg-card/70 border border-border/60 px-5 py-3">
              <div className="text-xs text-muted-foreground">Product-сигналів</div>
              <div className="font-display text-2xl font-bold">{summary.product_moves_count}</div>
            </div>
          )}
        </div>
      )}

      {summary.summary && (
        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
          <p className="text-sm text-muted-foreground leading-relaxed">{summary.summary}</p>
        </div>
      )}

      {/* Competitor moves list */}
      {movesGroup && movesGroup.items?.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">{movesGroup.label ?? "Ходи конкурентів"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {movesGroup.items.map((item: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-sm leading-snug">{item.move_type}</div>
                  {item.competitor_or_account && (
                    <Badge variant="outline" className="rounded-full text-[10px] shrink-0">@{item.competitor_or_account}</Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                )}
                {item.business_meaning && (
                  <div className="text-[11px] border-t border-border/60 pt-2 text-foreground/70 italic">
                    {item.business_meaning}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Product / offer insights */}
      {insightsGroup && insightsGroup.items?.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">{insightsGroup.label ?? "Offer-інсайти"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {insightsGroup.items.map((item: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-2">
                <div className="flex items-center gap-2">
                  {item.type && typeBadge(item.type)}
                </div>
                {item.insight && (
                  <p className="text-sm font-medium leading-snug">{item.insight}</p>
                )}
                {item.what_to_watch && (
                  <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-2">
                    👁 {item.what_to_watch}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
