import type { SectionProps } from "./index";

interface AccountRow {
  platform?: string | null;
  username?: string | null;
  account_type?: string | null;
  status?: string | null;
  scrape_enabled?: boolean | null;
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  active:  { label: "Активний",    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  partial: { label: "Частково",    cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  error:   { label: "Помилка",     cls: "text-red-400 bg-red-500/10 border-red-500/30" },
};

const typeConfig: Record<string, { label: string; cls: string }> = {
  own:        { label: "Власний",     cls: "text-primary bg-primary/10 border-primary/30" },
  competitor: { label: "Конкурент",   cls: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
};

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  tiktok:    "TikTok",
  threads:   "Threads",
  x:         "X",
};

export function AccountTable({ sectionKey, section }: SectionProps) {
  const items: AccountRow[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">{section.title ?? sectionKey}</h2>
      <div className="rounded-3xl border border-border/60 bg-card/70 shadow-pop overflow-hidden">
        {items.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">Немає акаунтів</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">Платформа</th>
                <th className="px-4 py-3 text-left font-semibold">Акаунт</th>
                <th className="px-4 py-3 text-left font-semibold">Тип</th>
                <th className="px-4 py-3 text-left font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => {
                const statusCfg = statusConfig[row.status ?? ""] ?? { label: row.status ?? "", cls: "text-muted-foreground bg-muted/20 border-border/40" };
                const typeCfg   = typeConfig[row.account_type ?? ""] ?? { label: row.account_type ?? "", cls: "text-muted-foreground bg-muted/20 border-border/40" };
                return (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {platformLabel[row.platform ?? ""] ?? row.platform}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      @{row.username}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeCfg.cls}`}>
                        {typeCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
