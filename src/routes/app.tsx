import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({ meta: [{ title: "FlyHigh · Dashboard" }] }),
});
