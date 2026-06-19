import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/best-outcomes")({
  head: () => ({ meta: [{ title: "Best Competitor Outcomes — Navio" }] }),
  component: BestOutcomes,
});

function BestOutcomes() {
  return <PageObjectRenderer pageKey="best_competitor_outcomes" />;
}
