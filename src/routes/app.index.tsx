import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldAlert, ShieldCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Navio" },
      { name: "description", content: "Your daily marketing intelligence snapshot." },
    ],
  }),
  component: Dashboard,
});

function priorityColor(priority: string) {
  if (priority === "high") return "bg-primary/15 text-primary border-primary/30";
  if (priority === "medium") return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-muted/30 text-muted-foreground border-border/40";
}

function effortColor(effort: string) {
  if (effort === "low") return "bg-green-500/15 text-green-400 border-green-500/30";
  if (effort === "high") return "bg-red-500/15 text-red-400 border-red-500/30";
  return "bg-muted/30 text-muted-foreground border-border/40";
}

function threatColor(level: string) {
  if (level === "high") return "text-red-400";
  if (level === "medium") return "text-yellow-400";
  return "text-muted-foreground";
}

function positionStatusColor(status: string) {
  if (status === "strong") return "bg-green-500/15 text-green-400 border-green-500/30";
  if (status === "weak") return "bg-red-500/15 text-red-400 border-red-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

function Dashboard() {
  const { user } = useAuth();
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, workspace, isError, error, workspaceId, isWorkspaceError, workspaceError } =
    usePageObject<any>("dashboard");
  const t = useT();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground p-6">{t("dashboard.loading")}</div>;
  }
  if (isWorkspaceError) {
    return <div className="p-6 text-red-400 text-xs font-mono whitespace-pre-wrap">WORKSPACE ERROR: {String((workspaceError as any)?.message ?? workspaceError)}</div>;
  }
  if (isError) {
    return <div className="p-6 text-red-400 text-xs font-mono whitespace-pre-wrap">ERROR: {String((error as any)?.message ?? error)}{"\n"}workspaceId: {workspaceId}</div>;
  }
  if (isPending) {
    return <PageObjectPending pageKey="dashboard" roleKey={role} dataStatus={dataStatus!} />;
  }
  if (!payload) {
    return <PageObjectEmpty pageKey="dashboard" roleKey={role} generatedAt={generatedAt} />;
  }

  // Greeting — workspace.project_name works already
  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "there";
  const projectName = workspace?.project_name ?? payload.workspace?.project_name;

  // Real sections
  const snapshot = payload.sections?.business_snapshot ?? null;
  const topOpps = payload.sections?.top_opportunities ?? null;
  const threats = payload.sections?.competitor_threats ?? null;
  const decisions = payload.sections?.recommended_decisions ?? null;
  const oppItems: any[] = topOpps?.items ?? [];
  const threatItems: any[] = threats?.items ?? [];
  const decisionItems: any[] = decisions?.items ?? [];
  const positionStatus = snapshot?.position_vs_competitors?.status ?? "";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            {t("dashboard.greeting", { name: displayName })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {projectName ? `${projectName} · ` : ""}{t("dashboard.subtitle_fallback")}
          </p>
        </div>
        <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-glow hover:opacity-90">
          <Link to="/app/insights">{t("dashboard.view_insights")} <ArrowRight className="ml-2 size-4" /></Link>
        </Button>
      </div>

      {/* Business snapshot — takeaway highlight */}
      {snapshot && (
        <div className="relative overflow-hidden rounded-3xl bg-primary/10 border border-primary/40 p-7 shadow-pop space-y-4">
          <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[260px] space-y-2">
              <div className="text-xs font-semibold text-primary uppercase tracking-widest">
                {snapshot.title ?? "Бізнес-зріз"}
              </div>
              {snapshot.one_sentence_takeaway && (
                <p className="font-display text-xl font-bold leading-snug">{snapshot.one_sentence_takeaway}</p>
              )}
              {snapshot.position_vs_competitors?.short_explanation && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {snapshot.position_vs_competitors.short_explanation}
                </p>
              )}
            </div>
            {positionStatus && (
              <Badge className={`rounded-full border text-sm shrink-0 ${positionStatusColor(positionStatus)}`}>
                {positionStatus === "strong" ? "Сильна позиція" : positionStatus === "weak" ? "Слабка позиція" : "Змішана картина"}
              </Badge>
            )}
          </div>
          {snapshot.summary && (
            <details className="relative group">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Детальний аналіз ↓
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{snapshot.summary}</p>
            </details>
          )}
        </div>
      )}

      {/* Top opportunities */}
      {oppItems.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">{topOpps?.title ?? "Найважливіші можливості"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {oppItems.slice(0, 4).map((opp: any, i: number) => (
              <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {opp.priority && (
                    <Badge className={`rounded-full text-[10px] border ${priorityColor(opp.priority)}`}>
                      {opp.priority === "high" ? "Високий" : opp.priority === "medium" ? "Середній" : "Низький"} пріоритет
                    </Badge>
                  )}
                  {opp.effort && (
                    <Badge className={`rounded-full text-[10px] border ${effortColor(opp.effort)}`}>
                      {opp.effort === "low" ? "Легко" : opp.effort === "high" ? "Складно" : "Середньо"}
                    </Badge>
                  )}
                </div>
                <p className="font-semibold text-sm leading-snug">{opp.opportunity}</p>
                {opp.expected_impact && (
                  <p className="text-xs text-muted-foreground">{opp.expected_impact}</p>
                )}
                {opp.recommended_action && (
                  <details>
                    <summary className="text-xs text-primary cursor-pointer">Дія →</summary>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{opp.recommended_action}</p>
                  </details>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two columns: threats + decisions */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Competitor threats */}
        {threatItems.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">{threats?.title ?? "Конкурентні загрози"}</h2>
            <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 shadow-pop overflow-hidden">
              {threatItems.slice(0, 5).map((c: any, i: number) => {
                const isHigh = c.strategic_threat_level === "high";
                return (
                  <div key={i} className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-border/60" : ""}`}>
                    <div className="size-10 rounded-xl grid place-items-center font-display text-lg font-bold bg-gradient-to-br from-primary/30 via-primary/15 to-violet/30 border border-primary/40 text-primary shrink-0">
                      {(c.display_name ?? c.username ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{c.display_name ?? c.username}</div>
                      <div className="text-xs text-muted-foreground">@{c.username}</div>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <div className="font-display text-base font-bold">{c.overall_score}</div>
                      <div className={`text-xs flex items-center gap-1 justify-end ${threatColor(c.strategic_threat_level)}`}>
                        {isHigh ? <ShieldAlert className="size-3" /> : <ShieldCheck className="size-3" />}
                        {c.strategic_threat_level}
                      </div>
                    </div>
                    {c.profile_url && (
                      <a href={c.profile_url} target="_blank" rel="noreferrer" className="shrink-0">
                        <ExternalLink className="size-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommended decisions */}
        {decisionItems.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold">{decisions?.title ?? "Рекомендовані рішення"}</h2>
            <div className="space-y-3">
              {decisionItems.slice(0, 4).map((d: any, i: number) => (
                <div key={i} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-4 shadow-pop space-y-1">
                  <p className="font-semibold text-sm leading-snug">{d.recommendation}</p>
                  {d.why && <p className="text-xs text-muted-foreground leading-relaxed">{d.why}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fallback if all sections are empty */}
      {!snapshot && oppItems.length === 0 && threatItems.length === 0 && (
        <PageObjectEmpty pageKey="dashboard" roleKey={role} generatedAt={generatedAt} />
      )}
    </div>
  );
}
