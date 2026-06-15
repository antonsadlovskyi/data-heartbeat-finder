import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageObject } from "@/lib/use-page-object";
import { PageObjectEmpty, PageObjectPending } from "@/components/app/PageObjectEmpty";
import { startTodoTracking } from "@/lib/data/todos.functions";

export const Route = createFileRoute("/app/todos")({
  component: TodosPage,
  head: () => ({
    meta: [
      { title: "To Dos — Navio" },
      { name: "description", content: "Your actionable marketing tasks generated from competitor and trend analysis." },
      { property: "og:title", content: "To Dos — Navio" },
      { property: "og:description", content: "Your actionable marketing tasks generated from competitor and trend analysis." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/todos" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/todos" },
    ],
  }),
});

const STATUS_TABS = [
  { id: "all", label: "Всі" },
  { id: "active", label: "Активні" },
  { id: "tracking", label: "Трекінг" },
  { id: "completed", label: "Виконано" },
] as const;

function priorityBadgeClass(p: string) {
  if (p === "high") return "bg-primary text-primary-foreground border-0";
  if (p === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
  return "bg-muted text-muted-foreground border-border";
}

function TodosPage() {
  const { payload, isLoading, isPending, dataStatus, role, generatedAt, isError, error } =
    usePageObject<any>("todos");
  const [tab, setTab] = useState<"all" | "active" | "tracking" | "completed">("all");
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const startTrackingFn = useServerFn(startTodoTracking);
  const queryClient = useQueryClient();

  async function handleStartTracking(todo_id: string, tracking_metric?: string) {
    setTrackingId(todo_id);
    try {
      await startTrackingFn({ data: { todo_id, tracking_metric } });
      toast.success("Трекінг розпочато!");
      queryClient.invalidateQueries({ queryKey: ["page-object", "todos"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Невідома помилка");
    } finally {
      setTrackingId(null);
    }
  }

  if (isLoading) return <div className="text-sm text-muted-foreground p-6">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-400 text-xs font-mono">ERROR: {String((error as any)?.message ?? error)}</div>;
  if (isPending) return <PageObjectPending pageKey="todos" roleKey={role} dataStatus={dataStatus!} />;
  if (!payload) return <PageObjectEmpty pageKey="todos" roleKey={role} generatedAt={generatedAt} />;

  const todos: any[] = payload.todos ?? [];
  const summary = payload.summary ?? {};

  const filtered = todos.filter((t) => {
    if (tab === "all") return true;
    if (tab === "tracking") return t.tracking_status === "tracking";
    return t.status === tab;
  });

  if (todos.length === 0) return <PageObjectEmpty pageKey="todos" roleKey={role} generatedAt={generatedAt} />;

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Завдання</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <Button
              key={t.id}
              variant={tab === t.id ? "default" : "outline"}
              size="sm"
              className="rounded-full h-8"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </header>

      {/* Summary stats */}
      <div className="flex flex-wrap gap-2">
        {summary.total != null && <Badge variant="outline" className="rounded-full">Всього: {summary.total}</Badge>}
        {summary.active != null && <Badge variant="outline" className="rounded-full">Активних: {summary.active}</Badge>}
        {summary.tracking != null && <Badge variant="outline" className="rounded-full">В трекінгу: {summary.tracking}</Badge>}
        {summary.completed != null && <Badge variant="outline" className="rounded-full">Виконано: {summary.completed}</Badge>}
        {summary.high_priority != null && (
          <Badge className="rounded-full bg-primary text-primary-foreground border-0">Пріоритетних: {summary.high_priority}</Badge>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-8 text-center text-muted-foreground">
          Немає завдань у цій категорії
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((todo) => (
            <div
              key={todo.todo_id}
              className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-3"
            >
              <div className="flex flex-wrap gap-2">
                <Badge className={`rounded-full border text-xs ${priorityBadgeClass(todo.priority)}`}>
                  {todo.priority === "high" ? "Високий" : todo.priority === "medium" ? "Середній" : "Низький"}
                </Badge>
                {todo.platform && todo.platform !== "all" && (
                  <Badge variant="outline" className="rounded-full text-xs">{todo.platform}</Badge>
                )}
                {todo.status === "completed" && (
                  <Badge className="rounded-full bg-success text-success-foreground border-0 text-xs">Виконано</Badge>
                )}
              </div>

              <h3 className="font-display text-base font-semibold leading-snug">{todo.title}</h3>
              {todo.description && <p className="text-sm text-muted-foreground">{todo.description}</p>}

              {todo.recommended_action && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-primary font-medium">Рекомендована дія →</summary>
                  <p className="mt-2 text-muted-foreground">{todo.recommended_action}</p>
                </details>
              )}

              {todo.tracking_status !== "tracking" && todo.status !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs"
                  disabled={trackingId === todo.todo_id}
                  onClick={() => handleStartTracking(todo.todo_id, todo.recommended_tracking_metric)}
                >
                  {trackingId === todo.todo_id
                    ? <><Loader2 className="size-3 mr-1 animate-spin" /> Запускаємо...</>
                    : "Розпочати трекінг →"
                  }
                </Button>
              )}

              {todo.tracking_status === "tracking" && todo.tracking && (
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3 space-y-1 text-xs">
                  <div className="font-semibold text-primary">В трекінгу</div>
                  {todo.tracking.metric_key && <div className="text-muted-foreground">Метрика: {todo.tracking.metric_key}</div>}
                  {todo.tracking.baseline_value != null && (
                    <div className="text-muted-foreground">Baseline: {todo.tracking.baseline_value}</div>
                  )}
                  {todo.tracking.current_value != null && (
                    <div className="text-muted-foreground">Поточне: {todo.tracking.current_value}</div>
                  )}
                  {todo.last_result?.delta_percent != null && (
                    <div className={todo.last_result.delta_percent >= 0 ? "text-success" : "text-destructive"}>
                      Δ {todo.last_result.delta_percent > 0 ? "+" : ""}{todo.last_result.delta_percent}%
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
