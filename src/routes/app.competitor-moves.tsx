import { createFileRoute } from "@tanstack/react-router";
import { PageObjectRenderer } from "@/components/render/PageObjectRenderer";

export const Route = createFileRoute("/app/competitor-moves")({
  head: () => ({ meta: [{ title: "Competitor Moves — Navio" }] }),
  component: CompetitorMovesPage,
});

function CompetitorMovesPage() {
  return <PageObjectRenderer pageKey="competitor_moves" />;
}
