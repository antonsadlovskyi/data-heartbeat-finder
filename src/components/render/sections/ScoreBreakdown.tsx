import type { SectionProps } from "./index";

interface BreakdownMetric {
  metric?: string | null;
  value?: number | null;
  weight?: number | null;
}

interface ScoreBreakdownItem {
  platform?: string | null;
  score?: number | null;
  label?: string | null;
  breakdown?: BreakdownMetric[] | null;
}

const platformLabel: Record<string, string> = {
  instagram: "Instagram",
  tiktok:    "TikTok",
  threads:   "Threads",
  x:         "X",
  all:       "Всі платформи",
};

function ScoreBar({ label, value }: { label: string; value?: number | null }) {
  if (value == null) return null;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ScoreBreakdown({ sectionKey, section }: SectionProps) {
  const items: ScoreBreakdownItem[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">{section.title ?? sectionKey}</h2>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5">
          <p className="text-sm text-muted-foreground">Немає даних</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => {
            const metrics: BreakdownMetric[] = Array.isArray(item.breakdown) ? item.breakdown : [];
            return (
              <div key={item.platform ?? i} className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-semibold text-base">
                    {platformLabel[item.platform ?? ""] ?? item.platform}
                  </p>
                  {item.score != null && (
                    <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-sm font-bold tabular-nums">
                      {item.score}
                    </span>
                  )}
                </div>
                {item.label && (
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                )}
                {metrics.length > 0 && (
                  <div className="space-y-2">
                    {metrics.map((m, mi) => (
                      <ScoreBar key={mi} label={m.metric ?? ""} value={m.value} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
