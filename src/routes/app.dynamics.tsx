import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/dynamics")({
  head: () => ({ meta: [{ title: "Dynamics — Navio" }] }),
  component: DynamicsPage,
});

function DynamicsPage() {
  return <PageObjectRenderer pageKey="dynamics" />;
}
