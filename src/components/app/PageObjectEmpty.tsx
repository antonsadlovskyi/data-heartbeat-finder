import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { ROLES, type RoleKey } from "@/lib/role-store";

export function PageObjectEmpty({
  pageKey,
  roleKey,
  generatedAt,
}: {
  pageKey: string;
  roleKey: RoleKey;
  generatedAt?: string | null;
}) {
  const qc = useQueryClient();
  const roleLabel = ROLES.find((r) => r.key === roleKey)?.label ?? roleKey;
  return (
    <div className="max-w-3xl mx-auto mt-12 rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center space-y-4">
      <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center mx-auto">
        <Sparkles className="size-7 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">
          Analysis pending for the {roleLabel} view
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          We're still preparing the{" "}
          <code className="text-foreground/80">{pageKey}</code> view for the{" "}
          <code className="text-foreground/80">{roleKey}</code> role. It will
          fill in automatically once the latest analysis pass completes.
        </p>
        {generatedAt && (
          <p className="text-[11px] text-muted-foreground mt-2">
            Last generated: {new Date(generatedAt).toLocaleString()}
          </p>
        )}
      </div>
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => qc.invalidateQueries({ queryKey: ["page-object", pageKey, roleKey] })}
      >
        <RefreshCw className="size-3.5 mr-1.5" /> Re-check
      </Button>
    </div>
  );
}