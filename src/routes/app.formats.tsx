import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid } from "lucide-react";

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
  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight">Content Formats</h1>
        <p className="text-muted-foreground mt-1">The post formats moving the needle in your niche, ranked by performance.</p>
      </div>
      <div className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-12 shadow-pop flex flex-col items-center gap-4 text-center">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/25 via-primary/15 to-violet/30 border border-primary/40 grid place-items-center text-primary shadow-pop">
          <LayoutGrid className="size-7" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Скоро</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Аналіз контентних форматів буде доступний у наступному оновленні.
          </p>
        </div>
      </div>
    </div>
  );
}
