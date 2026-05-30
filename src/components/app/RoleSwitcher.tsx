import { ROLES, useRole, type RoleKey } from "@/lib/role-store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

export function RoleSwitcher() {
  const role = useRole((s) => s.role);
  const setRole = useRole((s) => s.setRole);
  const t = useT();
  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/60 p-0.5 backdrop-blur">
      {ROLES.map((r) => {
        const active = r.key === role;
        const labelKey = `role.${r.key}` as TranslationKey;
        const descKey = `role.${r.key}_desc` as TranslationKey;
        return (
          <button
            key={r.key}
            onClick={() => setRole(r.key as RoleKey)}
            title={t(descKey)}
            className={cn(
              "px-3 h-7 rounded-full text-xs font-medium transition",
              active
                ? "bg-primary text-primary-foreground shadow-pop"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}