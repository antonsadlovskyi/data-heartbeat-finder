import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Navio" },
      { name: "description", content: "Your daily marketing intelligence snapshot." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return <PageObjectRenderer pageKey="dashboard" />;
}
