import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useNavio } from "@/lib/store";
import { TodoCard, TrackingExperimentCard, EmptyState } from "@/components/app/cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  startTodo, startTrackingTodo, pauseTodo, postponeTodo, completeTodo,
} from "@/lib/data/services";
import type { TodoStatus } from "@/lib/data/types";

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

const STATUS_TABS: { id: TodoStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in_progress", label: "Doing" },
  { id: "tracking", label: "Tracking" },
  { id: "paused", label: "Paused" },
  { id: "completed", label: "Done" },
];

function TodosPage() {
  const platform = useNavio((s) => s.platform);
  const todos = useNavio((s) => s.todos);
  const experiments = useNavio((s) => s.experiments);

  const filterTab = "all"; // visual tabs only for v1; keep simple

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      const platformMatch = platform === "all" || t.platform === platform || t.platform === "all";
      const statusMatch = filterTab === "all" || t.status === filterTab;
      return platformMatch && statusMatch;
    });
  }, [todos, platform, filterTab]);

  const active = filtered.filter((t) => t.status !== "completed");
  const done = filtered.filter((t) => t.status === "completed");
  const liveExperiments = experiments.filter((e) => e.result_status === "running" || e.result_status === "improved");

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">To Dos</h1>
          <p className="text-muted-foreground mt-1">
            Concrete weekly actions, each tied to one metric. Pick one, do it, then track the result.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => (
            <Button key={t.id} variant="outline" size="sm" className="rounded-full h-8">
              {t.label}
            </Button>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold">Active</h2>
          <Badge variant="outline" className="rounded-full">{active.length}</Badge>
        </div>
        {active.length === 0 ? (
          <EmptyState title="No active to dos" body="Apply an insight or idea to create your first tracked to do." />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {active.map((t) => (
              <TodoCard
                key={t.id}
                todo={t}
                onStart={() => startTodo(t.id)}
                onTrack={() => startTrackingTodo(t.id)}
                onPause={() => pauseTodo(t.id)}
                onPostpone={() => postponeTodo(t.id)}
                onComplete={() => completeTodo(t.id)}
              />
            ))}
          </div>
        )}
      </section>

      {liveExperiments.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold">Live experiments</h2>
            <Badge variant="outline" className="rounded-full">{liveExperiments.length}</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {liveExperiments.map((e) => <TrackingExperimentCard key={e.id} exp={e} />)}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold">Completed</h2>
            <Badge variant="outline" className="rounded-full">{done.length}</Badge>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-80">
            {done.map((t) => (
              <TodoCard key={t.id} todo={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
