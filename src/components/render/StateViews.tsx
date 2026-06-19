import { Sparkles, RefreshCw, AlertTriangle, Loader2, PlugZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { PageObjectSkeleton } from "@/components/app/PageObjectEmpty";

// Re-export the existing skeleton so the renderer has a single import surface.
export { PageObjectSkeleton as RenderSkeleton } from "@/components/app/PageObjectEmpty";

/** Colour treatment for a `data_status` badge. */
export function dataStatusBadgeClass(status: string | null | undefined) {
  switch (status) {
    case "ready":
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case "partial":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "failed":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    case "not_connected":
    case "empty":
    default:
      return "bg-muted/30 text-muted-foreground border-border/40";
  }
}

const DATA_STATUS_LABEL: Record<string, string> = {
  ready: "Готово",
  partial: "Частково",
  empty: "Немає даних",
  not_connected: "Не підключено",
  failed: "Помилка",
};

export function dataStatusLabel(status: string | null | undefined) {
  if (!status) return "—";
  return DATA_STATUS_LABEL[status] ?? status;
}

function Recheck({ pageKey }: { pageKey: string }) {
  const qc = useQueryClient();
  return (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={() => qc.invalidateQueries({ queryKey: ["page-object", pageKey] })}
    >
      <RefreshCw className="size-3.5 mr-1.5" /> Перевірити ще раз
    </Button>
  );
}

/** Backend still working on this page object — keep polling, show progress. */
export function PendingState({
  pageKey,
  dataStatus,
}: {
  pageKey: string;
  dataStatus: string | null;
}) {
  return (
    <div className="max-w-3xl mx-auto mt-12 rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center space-y-4">
      <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center mx-auto">
        <Loader2 className="size-7 text-primary animate-spin" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">Аналіз готується…</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          Дані для цієї сторінки ще обробляються. Сторінка оновиться автоматично.
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-2 font-mono">
          {pageKey} · {dataStatus ?? "pending"}
        </p>
      </div>
      <Recheck pageKey={pageKey} />
    </div>
  );
}

/**
 * Empty / not_connected. Prefers the structured `empty_state` from the payload
 * (title / description / primary_action) and falls back to a generic message.
 */
export function EmptyState({
  pageKey,
  dataStatus,
  emptyState,
}: {
  pageKey: string;
  dataStatus: string | null;
  emptyState?: {
    title?: string | null;
    description?: string | null;
    primary_action?: { label?: string | null; action_type?: string | null } | null;
  } | null;
}) {
  const notConnected = dataStatus === "not_connected";
  const title =
    emptyState?.title ??
    (notConnected ? "Платформа ще не підключена" : "Поки що немає даних");
  const description =
    emptyState?.description ??
    "Коли з'являться дані для цього зрізу, вони відобразяться тут.";
  const Icon = notConnected ? PlugZap : Sparkles;

  return (
    <div className="max-w-3xl mx-auto mt-12 rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center space-y-4">
      <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center mx-auto">
        <Icon className="size-7 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          {description}
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-2 font-mono">
          {pageKey} · {dataStatus ?? "empty"}
        </p>
      </div>
      <Recheck pageKey={pageKey} />
    </div>
  );
}

/**
 * Hard failure: query error, `data_status='failed'`, or a payload `error_state`.
 */
export function ErrorState({
  pageKey,
  errorState,
  message,
}: {
  pageKey: string;
  errorState?: { title?: string | null; description?: string | null } | null;
  message?: string | null;
}) {
  const title = errorState?.title ?? "Не вдалося завантажити сторінку";
  const description =
    errorState?.description ??
    message ??
    "Сталася помилка під час завантаження даних. Спробуйте ще раз.";

  return (
    <div className="max-w-3xl mx-auto mt-12 rounded-3xl border border-red-500/30 bg-red-500/5 p-10 text-center space-y-4">
      <div className="size-14 rounded-2xl bg-red-500/15 border border-red-500/30 grid place-items-center mx-auto">
        <AlertTriangle className="size-7 text-red-400" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 whitespace-pre-wrap">
          {description}
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-2 font-mono">{pageKey}</p>
      </div>
      <Recheck pageKey={pageKey} />
    </div>
  );
}
