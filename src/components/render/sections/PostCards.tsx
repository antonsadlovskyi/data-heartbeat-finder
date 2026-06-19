import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface PostScore {
  overall_score?: number | null;
  score_label?: string | null;
}

interface PostMetrics {
  likes_count?: number | null;
  saves_count?: number | null;
  views_count?: number | null;
  comments_count?: number | null;
}

interface PostCompetitor {
  username?: string | null;
  display_name?: string | null;
}

interface PostCard {
  post_id?: string | null;
  post_type?: string | null;
  platform?: string | null;
  score?: PostScore | null;
  metrics?: PostMetrics | null;
  competitor?: PostCompetitor | null;
  why_top?: string | null;
  visual_reason?: string | null;
  adaptation_for_us?: string | null;
  evidence_chips?: unknown;
  // own post variant
  title?: string | null;
  insight?: string | null;
  tags?: unknown;
}

function formatNum(n?: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const scoreLabelCls: Record<string, string> = {
  top_outcome: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  strong: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  average: "text-muted-foreground bg-muted/20 border-border/40",
};

export function PostCards({ sectionKey, section }: SectionProps) {
  const items: PostCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="space-y-4">
        {items.map((card, i) => {
          const scoreLabel = card.score?.score_label ?? "";
          const scoreBadgeCls =
            scoreLabelCls[scoreLabel] ??
            "text-muted-foreground bg-muted/20 border-border/40";
          const m = card.metrics;

          return (
            <div
              key={i}
              className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  {card.title && (
                    <p className="font-display font-bold text-base leading-snug">
                      {card.title}
                    </p>
                  )}
                  {card.competitor && (
                    <p className="text-xs text-muted-foreground">
                      {card.competitor.display_name ?? card.competitor.username}
                      {card.competitor.username &&
                        card.competitor.display_name &&
                        ` · @${card.competitor.username}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {card.post_type && (
                    <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {card.post_type}
                    </span>
                  )}
                  {card.score?.overall_score != null && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${scoreBadgeCls}`}
                    >
                      {card.score.overall_score}
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics row */}
              {m && (
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      ["👁", "Views", m.views_count],
                      ["❤️", "Likes", m.likes_count],
                      ["💬", "Comments", m.comments_count],
                      ["🔖", "Saves", m.saves_count],
                    ] as const
                  ).map(([icon, label, val]) =>
                    val != null ? (
                      <div
                        key={label}
                        className="rounded-2xl border border-border/40 bg-muted/10 p-2.5 text-center"
                      >
                        <p className="text-base">{icon}</p>
                        <p className="font-semibold tabular-nums text-sm">
                          {formatNum(val)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ) : null,
                  )}
                </div>
              )}

              {/* Why top / insight */}
              {card.why_top && (
                <p className="text-sm text-muted-foreground leading-snug">
                  {card.why_top}
                </p>
              )}
              {card.insight && (
                <p className="text-sm text-muted-foreground leading-snug">
                  {card.insight}
                </p>
              )}

              {/* Visual reason */}
              {card.visual_reason && (
                <div className="rounded-2xl border border-border/40 bg-muted/10 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Візуал
                  </p>
                  <p className="text-sm leading-snug">{card.visual_reason}</p>
                </div>
              )}

              {/* Adaptation */}
              {card.adaptation_for_us && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                    Адаптація для нас
                  </p>
                  <p className="text-sm leading-snug">
                    {card.adaptation_for_us}
                  </p>
                </div>
              )}

              <EvidenceChips chips={card.evidence_chips} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
