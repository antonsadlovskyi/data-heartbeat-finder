import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useNavio } from "@/lib/store";
import { FormatCard, EmptyState } from "@/components/app/cards";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/formats")({
  component: FormatsPage,
  head: () => ({
    meta: [
      { title: "Content Formats — Navio" },
      { name: "description", content: "The post formats moving the needle in your niche, ranked by performance." },
      { property: "og:title", content: "Content Formats — Navio" },
      { property: "og:description", content: "The post formats moving the needle in your niche, ranked by performance." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/formats" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/formats" },
    ],
  }),
});

function FormatsPage() {
  const platform = useNavio((s) => s.platform);
  const formats = useNavio((s) => s.formats);

  const filtered = useMemo(
    () =>
      [...formats]
        .filter((f) => platform === "all" || f.platform === platform)
        .sort((a, b) => b.average_performance_score - a.average_performance_score),
    [formats, platform]
  );

  const youUse = filtered.filter((f) => f.user_uses_it);
  const youDont = filtered.filter((f) => !f.user_uses_it);

  return (
    <div className="space-y-8 max-w-7xl">
      <header>
        <h1 className="font-display text-4xl font-bold tracking-tight">Content Formats</h1>
        <p className="text-muted-foreground mt-1">
          The post formats moving the needle in your niche, ranked. Steal the winners, skip the duds.
        </p>
      </header>

      {filtered.length === 0 && (
        <EmptyState title="No format analysis yet" body="A fresh scan will surface what's working on this platform." />
      )}

      {youDont.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold">Gaps — try these next</h2>
            <Badge variant="outline" className="rounded-full">{youDont.length}</Badge>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {youDont.map((f) => <FormatCard key={f.id} format={f} />)}
          </div>
        </section>
      )}

      {youUse.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold">Already in your mix</h2>
            <Badge variant="outline" className="rounded-full">{youUse.length}</Badge>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {youUse.map((f) => <FormatCard key={f.id} format={f} />)}
          </div>
        </section>
      )}
    </div>
  );
}
