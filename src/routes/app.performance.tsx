import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/performance")({
  head: () => ({
    meta: [
      { title: "My Performance — Navio" },
      { name: "description", content: "Correlate what you post with how it performs across all connected accounts." },
      { property: "og:title", content: "My Performance — Navio" },
      { property: "og:description", content: "Correlate what you post with how it performs across all connected accounts." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/performance" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/performance" },
    ],
  }),
  component: Performance,
});

function Performance() {
  return <PageObjectRenderer pageKey="my_performance" />;
}
