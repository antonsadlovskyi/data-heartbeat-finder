import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { type RoleKey } from "@/lib/role-store";
import { useT } from "@/lib/i18n/useT";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

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
  const t = useT();
  const roleLabel = t(`role.${roleKey}` as TranslationKey);
  return (
    <div className="max-w-3xl mx-auto mt-12 rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center space-y-4">
      <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center mx-auto">
        <Sparkles className="size-7 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold">
          {t("empty.title", { role: roleLabel })}
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
          {t("empty.body", { page: pageKey, role: roleLabel })}
        </p>
        {generatedAt && (
          <p className="text-[11px] text-muted-foreground mt-2">
            {t("empty.last_generated", { when: new Date(generatedAt).toLocaleString() })}
          </p>
        )}
      </div>
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => qc.invalidateQueries({ queryKey: ["page-object", pageKey, roleKey] })}
      >
        <RefreshCw className="size-3.5 mr-1.5" /> {t("empty.recheck")}
      </Button>
    </div>
  );
}