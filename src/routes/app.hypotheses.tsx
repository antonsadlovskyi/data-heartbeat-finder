import { createFileRoute } from "@tanstack/react-router";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { useT } from "@/lib/i18n/useT";

export const Route = createFileRoute("/app/hypotheses")({
  head: () => ({ meta: [{ title: "Hypotheses — Navio" }] }),
  component: HypothesesPage,
});

/**
 * Session 2 scaffold: this page is wired to the canonical `hypotheses` page_key
 * and handles every data_status without crashing. The rich card rendering lands
 * with the PageObjectRenderer / hypothesis_cards work in a later session.
 */
function HypothesesPage() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("hypotheses");
  const t = useT();

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">{t("common.loading")}</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="hypotheses" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="hypotheses" roleKey={role} generatedAt={generatedAt} />;

  const summary = payload.summary ?? {};
  const headline: string | null = summary.headline ?? summary.title ?? null;
  const body: string | null = summary.summary ?? summary.text ?? null;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">{t("nav.hypotheses")}</h1>
        {headline && <p className="text-muted-foreground mt-1">{headline}</p>}
        {body && <p className="text-muted-foreground mt-2 text-sm max-w-2xl">{body}</p>}
      </div>

      <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-6 text-sm text-muted-foreground">
        Page object loaded — detailed hypothesis cards arrive in a later session.
        <span className="ml-2 font-mono text-[11px] opacity-60">hypotheses · {dataStatus}</span>
      </div>
    </div>
  );
}
