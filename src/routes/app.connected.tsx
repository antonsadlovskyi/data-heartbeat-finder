import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/connected")({
  head: () => ({
    meta: [
      { title: "Connected Accounts — Navio" },
      { name: "description", content: "Manage connected platforms, accounts, and workspace settings." },
      { property: "og:title", content: "Connected Accounts — Navio" },
      { property: "og:description", content: "Manage connected platforms, accounts, and workspace settings." },
      { property: "og:url", content: "https://data-heartbeat-finder.lovable.app/app/connected" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://data-heartbeat-finder.lovable.app/app/connected" },
    ],
  }),
  component: ConnectedPage,
});

function ConnectedPage() {
  return <PageObjectRenderer pageKey="settings" />;
}
