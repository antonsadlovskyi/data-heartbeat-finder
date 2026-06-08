import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";
import { useRole } from "@/lib/role-store";

export const Route = createFileRoute("/app/competitors")({
  head: () => ({
    meta: [{ title: "Competitor Radar — Navio" }],
  }),
  component: Competitors,
});

const num = (v: any) => (typeof v === "number" ? v : parseFloat(v) || 0);

function threatColor(level: string) {
  if (level === "high") return "text-red-400";
  if (level === "medium") return "text-yellow-400";
  return "text-muted-foreground";
}

function Competitors() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("competitor_radar");
  const t = useT();
  const currentRole = useRole((s) => s.role);

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("competitors.loading")}</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="competitor_radar" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="competitor_radar" roleKey={role} generatedAt={generatedAt} />;

  const summary = payload.sections?.radar_summary ?? {};
  const scores: any[] = payload.sections?.competitor_scores ?? [];
  const roleInterp = payload.sections?.role_interpretation?.[currentRole] ?? null;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("competitors.title")}</h1>
        {summary.summary && <p className="text-muted-foreground mt-1">{summary.summary}</p>}
      </div>

      {/* Main gap / advantage */}
      {(summary.main_gap_for_us || summary.main_advantage_for_us) && (
        <div className="grid md:grid-cols-2 gap-4">
          {summary.main_gap_for_us && (
            <div className="rounded-3xl bg-yellow-500/10 border border-yellow-500/30 p-5 space-y-1">
              <div className="text-xs font-semibold text-yellow-400 uppercase tracking-widest">Головна можливість</div>
              <p className="text-sm leading-relaxed line-clamp-5">{summary.main_gap_for_us.split("\n")[0]}</p>
            </div>
          )}
          {summary.main_advantage_for_us && (
            <div className="rounded-3xl bg-primary/10 border border-primary/30 p-5 space-y-1">
              <div className="text-xs font-semibold text-primary uppercase tracking-widest">Наша перевага</div>
              <p className="text-sm leading-relaxed">{summary.main_advantage_for_us}</p>
            </div>
          )}
        </div>
      )}

      {/* Competitor list */}
      {scores.length > 0 ? (
        <div className="grid gap-4">
          {scores.map((c: any, idx: number) => {
            const overall = num(c.overall_score);
            const strategic = num(c.strategic_score);
            const isHigh = c.strategic_threat_level === "high";
            return (
              <div
                key={c.account_id ?? idx}
                className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop hover:shadow-pop transition-all"
              >
                <div className="grid lg:grid-cols-[auto_1fr_auto] gap-5 items-start">
                  {/* Avatar + info */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className="size-14 rounded-2xl grid place-items-center font-display text-xl font-bold bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 text-primary shadow-pop shrink-0">
                      {(c.display_name ?? c.username ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base font-bold truncate">{c.display_name ?? c.username}</div>
                      <div className="text-xs text-muted-foreground">@{c.username} · {c.platform}</div>
                      <div className="text-xs text-muted-foreground">{c.posts_count} постів</div>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="flex gap-6 flex-wrap items-center">
                    <Stat label="Overall score" value={overall.toFixed(0)} icon={isHigh ? <TrendingUp className="size-3 text-red-400" /> : <TrendingDown className="size-3 text-muted-foreground" />} highlight={isHigh} />
                    <Stat label="Strategic score" value={strategic.toFixed(0)} />
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Threat level</div>
                      <div className={`font-display text-sm font-bold flex items-center gap-1.5 ${threatColor(c.strategic_threat_level)}`}>
                        {isHigh ? <ShieldAlert className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                        {c.strategic_threat_level ?? "—"}
                      </div>
                    </div>
                  </div>

                  {/* Link */}
                  {c.profile_url && (
                    <a href={c.profile_url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                        <ExternalLink className="size-3" /> {t("competitors.open")}
                      </Button>
                    </a>
                  )}
                </div>

                {/* Strong / weak spots */}
                {(c.strong_spots?.length > 0 || c.weak_spots?.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/60">
                    {(c.strong_spots ?? []).slice(0, 5).map((s: string) => (
                      <Badge key={s} className="rounded-full text-[10px] bg-success/10 text-success border-success/30">+ {s.replace(/_/g, " ")}</Badge>
                    ))}
                    {(c.weak_spots ?? []).slice(0, 3).map((s: string) => (
                      <Badge key={s} variant="outline" className="rounded-full text-[10px] text-warning border-warning/30">− {s.replace(/_/g, " ")}</Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <PageObjectEmpty pageKey="competitor_radar" roleKey={role} generatedAt={generatedAt} />
      )}

      {/* Role interpretation */}
      {roleInterp && (
        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-6 shadow-pop space-y-4">
          <div className="font-display text-xl font-bold">Рекомендації для ролі</div>
          {roleInterp.main_message && (
            <p className="text-sm text-muted-foreground leading-relaxed">{roleInterp.main_message}</p>
          )}
          {roleInterp.recommended_decisions?.length > 0 && (
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              {roleInterp.recommended_decisions.map((d: any, i: number) => (
                <div key={i} className="rounded-2xl border border-border/60 bg-background/40 p-4 space-y-1">
                  <p className="text-sm font-semibold">{d.recommendation}</p>
                  {d.why && <p className="text-xs text-muted-foreground">{d.why}</p>}
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
      <div className={`font-display text-lg font-bold flex items-center gap-1.5 ${highlight ? "text-red-400" : ""}`}>
        {value}{icon}
      </div>
    </div>
  );
}
