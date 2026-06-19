import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/trends")({
  head: () => ({
    meta: [
      { title: "Trends — Navio" },
      { name: "description", content: "Local audios, hashtags, and formats bubbling up before they peak." },
      { property: "og:title", content: "Trends — Navio" },
      { property: "og:description", content: "Local audios, hashtags, and formats bubbling up before they peak." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/trends" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/trends" },
    ],
  }),
  component: Trends,
});

function Trends() {
  return <PageObjectRenderer pageKey="trend_tracker" />;
}
