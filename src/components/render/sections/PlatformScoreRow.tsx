import type { SectionProps } from "./index";

interface PlatformRow {
  platform?: string | null;
  score?: number | null;
  status?: string | null;
  short_comment?: string | null;
}

const statusDot: Record<string, string> = {
  ready: "bg-emerald-400",
  partial: "bg-yellow-400",
  not_connected: "bg-muted-foreground/40",
};

const platformLabel: Record<string, string> = {
  all: "Усі",
  instagram: "Instagram",
  tiktok: "TikTok",
  threads: "Threads",
  x: "X",
};

export function PlatformScoreRow({ sectionKey, section }: SectionProps) {
  const items: PlatformRow[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="rounded-3xl border border-border/60 bg-card/70 shadow-pop divide-y divide-border/40 overflow-hidden">
        {items.map((row, i) => {
          const score = typeof row.score === "number" ? row.score : null;
          const dot = statusDot[row.status ?? ""] ?? "bg-muted-foreground/40";
          return (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              <span className={`size-2.5 rounded-full shrink-0 ${dot}`} />
              <span className="w-24 shrink-0 text-sm font-medium">
                {platformLabel[row.platform ?? ""] ?? row.platform ?? "—"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                  {score !== null && (
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  )}
                </div>
              </div>
              <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums">
                {score !== null ? score : "—"}
              </span>
              {row.short_comment && (
                <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[200px]">
                  {row.short_comment}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
