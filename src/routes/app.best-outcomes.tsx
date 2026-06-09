import { createFileRoute } from "@tanstack/react-router";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/best-outcomes")({
  head: () => ({ meta: [{ title: "Best Competitor Outcomes — Navio" }] }),
  component: BestOutcomes,
});

const num = (v: any) => (typeof v === "number" ? v : parseFloat(v) || 0);

function BestOutcomes() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("best_competitor_outcomes");
  const t = useT();

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("best_outcomes.loading")}</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="best_competitor_outcomes" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="best_competitor_outcomes" roleKey={role} generatedAt={generatedAt} />;

  const summary = payload.sections?.summary ?? {};
  const patterns: any[] = payload.sections?.patterns ?? [];
  const topPosts: any[] = payload.sections?.top_posts ?? [];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{summary.title ?? t("best_outcomes.title")}</h1>
        {summary.summary && <p className="text-muted-foreground mt-1">{summary.summary}</p>}
      </div>

      {summary.main_pattern && (
        <div className="rounded-3xl bg-primary/10 border border-primary/30 p-6 shadow-pop">
          <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Key Pattern</div>
          <p className="text-base font-medium">{summary.main_pattern}</p>
        </div>
      )}

      {patterns.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">{t("best_outcomes.pattern_title")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {patterns.map((p: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-2">
                <div className="font-semibold text-sm">{p.pattern}</div>
                {p.works_because && <p className="text-xs text-muted-foreground">{p.works_because}</p>}
                {p.platform_specific_note && (
                  <Badge variant="outline" className="rounded-full text-[10px]">{p.platform_specific_note}</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {topPosts.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">{t("best_outcomes.top_posts_title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPosts.map((item: any, i: number) => {
              const post = item.post ?? {};
              const metrics = item.metrics ?? {};
              const analysis = item.analysis ?? {};
              const competitor = item.competitor ?? {};
              return (
                <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-4 shadow-pop space-y-3">
                  {post.preview_image_url ? (
                    <img
                      src={post.preview_image_url}
                      alt="preview"
                      className="w-full h-36 object-cover rounded-2xl bg-muted"
                    />
                  ) : (
                    <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-primary/20 to-violet/20 grid place-items-center text-3xl font-bold text-primary">
                      {(competitor.display_name ?? competitor.username ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">@{competitor.username ?? "—"}</div>
                    {post.caption_excerpt && (
                      <p className="text-xs mt-1 line-clamp-2">{post.caption_excerpt}</p>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>❤️ {num(metrics.likes_count).toLocaleString()}</span>
                    <span>👁 {num(metrics.views_count).toLocaleString()}</span>
                    <span>💬 {num(metrics.comments_count).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.hook_type && <Badge className="rounded-full text-[10px] bg-primary/15 text-primary border-primary/30">{analysis.hook_type}</Badge>}
                    {analysis.funnel_stage && <Badge variant="outline" className="rounded-full text-[10px]">{analysis.funnel_stage}</Badge>}
                  </div>
                  {analysis.adaptation_for_us && (
                    <p className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">{analysis.adaptation_for_us}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {patterns.length === 0 && topPosts.length === 0 && (
        <PageObjectEmpty pageKey="best_competitor_outcomes" roleKey={role} generatedAt={generatedAt} />
      )}
    </div>
  );
}
