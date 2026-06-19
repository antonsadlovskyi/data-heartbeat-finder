import type { SectionProps } from "./index";

interface CompactPostMetrics {
  likes_count?: number | null;
  saves_count?: number | null;
  views_count?: number | null;
  comments_count?: number | null;
}

interface CompactPostCard {
  post_id?: string | null;
  post_type?: string | null;
  platform?: string | null;
  title?: string | null;
  metrics?: CompactPostMetrics | null;
  // may also carry metric_label/metric_value from older shapes
  metric_label?: string | null;
  metric_value?: string | null;
  note?: string | null;
  weak_reason?: string | null;
}

function formatNum(n?: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function PostCardsCompact({ sectionKey, section }: SectionProps) {
  const items: CompactPostCard[] = Array.isArray(section.items)
    ? section.items
    : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="rounded-3xl border border-border/60 bg-card/70 shadow-pop overflow-hidden divide-y divide-border/30">
        {items.length === 0 && (
          <p className="px-5 py-4 text-sm text-muted-foreground">
            Немає даних
          </p>
        )}
        {items.map((card, i) => {
          const m = card.metrics;
          const hasMetrics = m != null;

          return (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              {/* Post type badge */}
              {card.post_type && (
                <span className="shrink-0 rounded-full border border-border/50 bg-muted/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.post_type}
                </span>
              )}

              {/* Title / label */}
              <div className="flex-1 min-w-0">
                {card.title && (
                  <p className="truncate text-sm font-medium">{card.title}</p>
                )}
                {card.note && (
                  <p className="truncate text-xs text-muted-foreground">
                    {card.note}
                  </p>
                )}
                {card.weak_reason && (
                  <p className="truncate text-xs text-muted-foreground">
                    {card.weak_reason}
                  </p>
                )}
              </div>

              {/* Metrics or metric_label/value */}
              {hasMetrics && (
                <div className="flex gap-3 shrink-0 text-right">
                  {m?.views_count != null && (
                    <div>
                      <p className="text-xs font-semibold tabular-nums">
                        {formatNum(m.views_count)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Views</p>
                    </div>
                  )}
                  {m?.likes_count != null && (
                    <div>
                      <p className="text-xs font-semibold tabular-nums">
                        {formatNum(m.likes_count)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Likes</p>
                    </div>
                  )}
                </div>
              )}

              {!hasMetrics && card.metric_label && (
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold tabular-nums">
                    {card.metric_value ?? "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {card.metric_label}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
