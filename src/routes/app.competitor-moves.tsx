import { createFileRoute } from "@tanstack/react-router";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";

export const Route = createFileRoute("/app/competitor-moves")({
  head: () => ({ meta: [{ title: "Competitor Moves — Navio" }] }),
  component: CompetitorMovesPage,
});

function CompetitorMovesPage() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("competitor_moves");
  const t = useT();

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("competitor_moves.loading")}</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="competitor_moves" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="competitor_moves" roleKey={role} generatedAt={generatedAt} />;

  const period = payload.period ?? {};
  const sections = payload.sections;
  const hasSections = sections && typeof sections === "object" && Object.keys(sections).length > 0;

  const topLevelEntries = Object.entries(payload).filter(
    ([k]) => !["period", "sections", "workspace", "data_quality", "active_filters"].includes(k)
  );

  const hasContent = hasSections || topLevelEntries.length > 0;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("competitor_moves.title")}</h1>
        {(period.period_start || period.period_end) && (
          <p className="text-muted-foreground mt-1">
            {period.period_start} — {period.period_end}
          </p>
        )}
      </div>

      {hasContent ? (
        <div className="grid gap-4">
          {hasSections &&
            Object.entries(sections).map(([key, value]: [string, any]) => (
              <div key={key} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
                <div className="font-semibold text-sm capitalize mb-2">{key.replace(/_/g, " ")}</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                  {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
          {!hasSections &&
            topLevelEntries.map(([key, value]: [string, any]) => (
              <div key={key} className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
                <div className="font-semibold text-sm capitalize mb-2">{key.replace(/_/g, " ")}</div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                  {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                </pre>
              </div>
            ))}
        </div>
      ) : (
        <PageObjectEmpty pageKey="competitor_moves" roleKey={role} generatedAt={generatedAt} />
      )}
    </div>
  );
}
