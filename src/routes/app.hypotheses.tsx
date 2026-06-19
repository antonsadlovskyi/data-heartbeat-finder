import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/hypotheses")({
  head: () => ({ meta: [{ title: "Hypotheses — Navio" }] }),
  component: HypothesesPage,
});

function HypothesesPage() {
  return <PageObjectRenderer pageKey="hypotheses" />;
}
