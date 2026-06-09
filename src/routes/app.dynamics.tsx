import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";

export const Route = createFileRoute("/app/dynamics")({
  head: () => ({ meta: [{ title: "Dynamics — Navio" }] }),
  component: DynamicsPage,
});

function threatChangeBadge(change: string) {
  if (change === "increased" || change === "up") {
    return (
      <Badge className="rounded-full text-[10px] bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
        <TrendingUp className="size-2.5" /> посилився
      </Badge>
    );
  }
  if (change === "decreased" || change === "down") {
    return (
      <Badge className="rounded-full text-[10px] bg-green-500/15 text-green-400 border border-green-500/30 flex items-center gap-1">
        <TrendingDown className="size-2.5" /> послабився
      </Badge>
    );
  }
  return (
    <Badge className="rounded-full text-[10px] bg-muted/30 text-muted-foreground border border-border/40 flex items-center gap-1">
      <Minus className="size-2.5" /> стабільний
    </Badge>
  );
}

function DeltaArrow({ delta }: { delta: number }) {
  if (delta > 0) return <span className="text-green-400 font-bold">+{delta} ↑</span>;
  if (delta < 0) return <span className="text-red-400 font-bold">{delta} ↓</span>;
  return <span className="text-muted-foreground">0 →</span>;
}

function DynamicsPage() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("dynamics");
  const t = useT();

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("dynamics.loading")}</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="dynamics" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="dynamics" roleKey={role} generatedAt={generatedAt} />;

  const period = payload.period ?? {};
  const summary = payload.sections?.summary ?? {};
  const roleFocus = payload.sections?.role_focus ?? null;
  const segmentDeltas: any[] = payload.sections?.segment_deltas ?? [];
  const competitorDeltas: any[] = payload.sections?.competitor_deltas ?? [];

  // If periods aren't comparable — show empty state with explanation
  if (summary.is_comparable === false) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">{t("dynamics.title")}</h1>
        </div>
        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            {summary.summary ?? "Недостатньо даних для порівняння періодів."}
          </p>
          {summary.comparison_status && (
            <Badge variant="outline" className="rounded-full text-xs">{summary.comparison_status}</Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("dynamics.title")}</h1>
        {(period.period_start || period.period_end) && (
          <p className="text-muted-foreground mt-1">
            {period.period_start} — {period.period_end}
            {period.run_label && <span className="ml-2 text-xs opacity-60">({period.run_label})</span>}
          </p>
        )}
        {summary.summary && (
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl">{summary.summary}</p>
        )}
        {(summary.current_run_label || summary.previous_run_label) && (
          <div className="flex gap-3 mt-2">
            {summary.previous_run_label && (
              <Badge variant="outline" className="rounded-full text-xs">← {summary.previous_run_label}</Badge>
            )}
            {summary.current_run_label && (
              <Badge className="rounded-full text-xs bg-primary/15 text-primary border-primary/30">
                → {summary.current_run_label}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Role focus block */}
      {roleFocus && roleFocus.interpretation && (
        <div className="rounded-3xl bg-primary/10 border border-primary/30 p-6 shadow-pop space-y-4">
          <div className="text-xs font-semibold text-primary uppercase tracking-widest">
            {roleFocus.title ?? "Фокус для твоєї ролі"}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {roleFocus.interpretation.what_changed && (
              <div className="rounded-2xl bg-background/40 border border-border/40 p-4 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Що змінилось</div>
                <p className="text-sm leading-relaxed">{roleFocus.interpretation.what_changed}</p>
              </div>
            )}
            {roleFocus.interpretation.why_it_matters && (
              <div className="rounded-2xl bg-background/40 border border-border/40 p-4 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Чому це важливо</div>
                <p className="text-sm leading-relaxed">{roleFocus.interpretation.why_it_matters}</p>
              </div>
            )}
            {roleFocus.interpretation.recommended_decision && (
              <div className="rounded-2xl bg-background/40 border border-primary/20 p-4 space-y-1">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">Рекомендоване рішення</div>
                <p className="text-sm leading-relaxed">{roleFocus.interpretation.recommended_decision}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Segment deltas */}
      {segmentDeltas.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">Зміни по сегментах</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {segmentDeltas.map((seg: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-4 shadow-pop space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm truncate">
                    {(seg.segment ?? "").replace(/_/g, " ")}
                  </div>
                  {seg.platform && (
                    <Badge variant="outline" className="rounded-full text-[10px] shrink-0">{seg.platform}</Badge>
                  )}
                </div>
                <div className="text-base font-mono">
                  <DeltaArrow delta={seg.posts_delta ?? 0} />
                </div>
                {(seg.current_posts_count != null || seg.previous_posts_count != null) && (
                  <div className="text-xs text-muted-foreground">
                    {seg.previous_posts_count ?? "—"} → {seg.current_posts_count ?? "—"} постів
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Competitor deltas */}
      {competitorDeltas.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">Зміни конкурентів</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {competitorDeltas.map((c: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">{c.display_name ?? c.username}</div>
                    <div className="text-xs text-muted-foreground">@{c.username}</div>
                  </div>
                  {threatChangeBadge(c.threat_change)}
                </div>
                {c.delta_summary && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.delta_summary}</p>
                )}
                <div className="flex gap-4 text-xs border-t border-border/60 pt-2">
                  {c.strategic_delta != null && (
                    <div>
                      <span className="text-muted-foreground">Стратег. δ: </span>
                      <DeltaArrow delta={c.strategic_delta} />
                    </div>
                  )}
                  {c.performance_delta != null && (
                    <div>
                      <span className="text-muted-foreground">Performance δ: </span>
                      <DeltaArrow delta={c.performance_delta} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fallback if no data sections */}
      {segmentDeltas.length === 0 && competitorDeltas.length === 0 && !roleFocus && (
        <PageObjectEmpty pageKey="dynamics" roleKey={role} generatedAt={generatedAt} />
      )}
    </div>
  );
}
