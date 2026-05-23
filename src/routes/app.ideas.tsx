import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useNavio } from "@/lib/store";
import { IdeaCard, EmptyState } from "@/components/app/cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { applyInsightToTodo } from "@/lib/data/services";
import type { IdeaSuggestion } from "@/lib/data/types";

export const Route = createFileRoute("/app/ideas")({
  component: IdeasPage,
  head: () => ({ meta: [{ title: "Navio · Ideas" }] }),
});

function IdeasPage() {
  const platform = useNavio((s) => s.platform);
  const ideas = useNavio((s) => s.ideas);
  const setIdeaStatus = useNavio((s) => s.setIdeaStatus);

  const filtered = useMemo(
    () => ideas.filter((i) => platform === "all" || i.platform === platform || i.platform === "all"),
    [ideas, platform]
  );

  const groups: Record<string, IdeaSuggestion[]> = {};
  filtered.forEach((i) => {
    (groups[i.idea_type] ||= []).push(i);
  });

  async function createTodoFromIdea(idea: IdeaSuggestion) {
    // map an idea to a synthetic insight shape for re-use of applyInsightToTodo
    await applyInsightToTodo(
      {
        id: `i_from_${idea.id}`,
        workspace_id: idea.workspace_id,
        platform: idea.platform,
        title: idea.title,
        insight_type: "opportunity",
        summary: idea.description,
        evidence: idea.why_it_fits,
        related_competitor_ids: [],
        related_post_ids: [],
        suggested_action: idea.implementation_steps[0] ?? idea.description,
        expected_impact: idea.expected_impact,
        difficulty: idea.difficulty,
        priority: 3,
        status: "new",
        created_at: new Date().toISOString(),
      },
      { metric: "engagement_rate", baseline: 3.4, target: 5, trackingPeriodDays: 14 }
    );
    setIdeaStatus(idea.id, "in_todo");
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Ideas</h1>
          <p className="text-muted-foreground mt-1">
            Ready-to-shoot concepts based on what's working for your competitors and the trends you should ride.
          </p>
        </div>
        <Button variant="outline" className="rounded-full">Generate more</Button>
      </header>

      {filtered.length === 0 && (
        <EmptyState title="No ideas for this platform yet" body="Switch the platform filter or run a fresh scan." />
      )}

      {Object.entries(groups).map(([type, list]) => (
        <section key={type} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold capitalize">{type}</h2>
            <Badge variant="outline" className="rounded-full">{list.length}</Badge>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {list.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onCreateTodo={() => createTodoFromIdea(idea)}
                onSave={() => setIdeaStatus(idea.id, "saved")}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
