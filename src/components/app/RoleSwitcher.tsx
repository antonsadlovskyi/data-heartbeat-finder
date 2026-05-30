import { ROLES, useRole, type RoleKey } from "@/lib/role-store";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
  const role = useRole((s) => s.role);
  const setRole = useRole((s) => s.setRole);
  return (
    <div className="inline-flex items-center rounded-full border border-border/60 bg-card/60 p-0.5 backdrop-blur">
      {ROLES.map((r) => {
        const active = r.key === role;
        return (
          <button
            key={r.key}
            onClick={() => setRole(r.key as RoleKey)}
            title={r.description}
            className={cn(
              "px-3 h-7 rounded-full text-xs font-medium transition",
              active
                ? "bg-primary text-primary-foreground shadow-pop"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}