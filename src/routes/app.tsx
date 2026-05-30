import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/app")({
  component: AppGate,
  head: () => ({ meta: [{ title: "Navio · Dashboard" }] }),
});

function AppGate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell />;
}
