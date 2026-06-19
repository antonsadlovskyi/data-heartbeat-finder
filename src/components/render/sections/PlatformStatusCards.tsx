import type { SectionProps } from "./index";

interface PlatformStatusCard {
  platform?: string | null;
  status?: string | null;
  posts_count?: number | null;
  accounts_count?: number | null;
}

const statusConfig: Record<string, { label: string; badge: string; ring: string }> = {
  ready:         { label: "Підключено",       badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", ring: "border-emerald-500/20" },
  partial:       { label: "Частково",          badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",   ring: "border-yellow-500/20" },
  not_connected: { label: "Не підключено",    badge: "text-muted-foreground bg-muted/20 border-border/40",       ring: "border-border/40" },
};

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  tiktok:    "TikTok",
  threads:   "Threads",
  x:         "X (Twitter)",
};

export function PlatformStatusCards({ sectionKey, section }: SectionProps) {
  const items: PlatformStatusCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">{section.title ?? sectionKey}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((card, i) => {
          const statusKey = card.status ?? "";
          const cfg = statusConfig[statusKey] ?? statusConfig.not_connected;
          return (
            <div
              key={card.platform ?? i}
              className={`rounded-3xl border ${cfg.ring} bg-card/70 shadow-pop p-5 space-y-3`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-semibold text-base">
                  {platformLabel[card.platform ?? ""] ?? card.platform}
                </p>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>
                  <span className="font-semibold tabular-nums text-foreground">{card.posts_count ?? 0}</span>{" "}
                  постів
                </span>
                <span>
                  <span className="font-semibold tabular-nums text-foreground">{card.accounts_count ?? 0}</span>{" "}
                  акаунтів
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
