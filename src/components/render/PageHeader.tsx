import { AlertTriangle } from "lucide-react";
import { EvidenceChips } from "./EvidenceChips";
import { dataStatusBadgeClass, dataStatusLabel } from "./StateViews";

interface Summary {
  title?: string | null;
  main_takeaway?: string | null;
  weak_spot?: string | null;
  recommended_fix?: string | null;
  evidence_chips?: unknown;
}

interface ViewContext {
  data_warning?: string | null;
  role_label?: string | null;
  platform_label?: string | null;
}

/**
 * Page-object header: the title plus the three strategic lines (main takeaway /
 * weak spot / recommended fix), evidence chips, a data_status badge, and a
 * data_warning banner shown for `partial` pages or whenever view_context carries
 * a warning. `fallbackUsed` surfaces that platform-specific data was unavailable
 * and the aggregate ("All") view is being shown instead.
 */
export function PageHeader({
  summary,
  viewContext,
  dataStatus,
  fallbackUsed,
}: {
  summary?: Summary | null;
  viewContext?: ViewContext | null;
  dataStatus: string | null;
  fallbackUsed?: boolean;
}) {
  const s = summary ?? {};
  const vc = viewContext ?? {};
  const dataWarning = vc.data_warning ?? null;
  const showWarning = dataStatus === "partial" || dataWarning != null;

  return (
    <header className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            {s.title ?? "—"}
          </h1>
          {(vc.role_label || vc.platform_label) && (
            <p className="text-xs text-muted-foreground">
              {[vc.role_label, vc.platform_label].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${dataStatusBadgeClass(dataStatus)}`}
          >
            {dataStatusLabel(dataStatus)}
          </span>
          {fallbackUsed && (
            <span className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground">
              показано дані «Усі»
            </span>
          )}
        </div>
      </div>

      {s.main_takeaway && (
        <div className="rounded-3xl bg-primary/10 border border-primary/30 p-6 shadow-pop space-y-3">
          <p className="font-display text-lg sm:text-xl font-bold leading-snug">
            {s.main_takeaway}
          </p>
          {(s.weak_spot || s.recommended_fix) && (
            <div className="grid sm:grid-cols-2 gap-3">
              {s.weak_spot && (
                <div className="rounded-2xl border border-border/50 bg-card/40 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Слабке місце
                  </div>
                  <p className="text-sm leading-snug">{s.weak_spot}</p>
                </div>
              )}
              {s.recommended_fix && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                    Рекомендація
                  </div>
                  <p className="text-sm leading-snug">{s.recommended_fix}</p>
                </div>
              )}
            </div>
          )}
          <EvidenceChips chips={s.evidence_chips} />
        </div>
      )}

      {showWarning && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-3.5 text-sm text-yellow-200/90">
          <AlertTriangle className="size-4 mt-0.5 text-yellow-400 shrink-0" />
          <span>
            {dataWarning ?? "Дані часткові — висновки варто сприймати обережно."}
          </span>
        </div>
      )}
    </header>
  );
}
