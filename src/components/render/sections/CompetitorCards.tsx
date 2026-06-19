import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface VisualAnalysis {
  text_overlay?: number | null;
  visual_focus?: number | null;
  cta_visibility?: number | null;
  human_presence?: number | null;
  first_frame_clarity?: number | null;
  visual_note?: string | null;
}

interface ContentAnalysis {
  trust_signal?: number | null;
  hook_strength?: number | null;
  topic_relevance?: number | null;
  conversion_bridge?: number | null;
  content_note?: string | null;
}

interface CompetitorCard {
  platform?: string | null;
  username?: string | null;
  display_name?: string | null;
  weak_side?: string | null;
  strong_side?: string | null;
  threat_level?: string | null;
  our_advantage?: string | null;
  opportunity_for_us?: string | null;
  threat_for_us?: string | null;
  overall_score?: number | null;
  evidence_chips?: unknown;
  visual_analysis?: VisualAnalysis | null;
  content_analysis?: ContentAnalysis | null;
}

const threatColor: Record<string, string> = {
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const threatLabel: Record<string, string> = {
  high: "Висока загроза",
  medium: "Середня загроза",
  low: "Низька загроза",
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
        <div
          className="h-full rounded-full bg-primary/60"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function CompetitorCards({ sectionKey, section }: SectionProps) {
  const items: CompetitorCard[] = Array.isArray(section.items)
    ? section.items
    : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="space-y-4">
        {items.map((card, i) => {
          const threatKey = card.threat_level ?? "";
          const badgeCls =
            threatColor[threatKey] ??
            "text-muted-foreground bg-muted/20 border-border/40";

          return (
            <div
              key={i}
              className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-display font-bold text-base leading-snug">
                    {card.display_name ?? card.username}
                  </p>
                  {card.username && card.display_name && (
                    <p className="text-xs text-muted-foreground">
                      @{card.username}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {card.overall_score != null && (
                    <span className="rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-xs font-semibold tabular-nums">
                      {card.overall_score}
                    </span>
                  )}
                  {threatKey && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeCls}`}
                    >
                      {threatLabel[threatKey] ?? threatKey}
                    </span>
                  )}
                </div>
              </div>

              {/* Strong / Weak */}
              <div className="grid sm:grid-cols-2 gap-3">
                {card.strong_side && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 mb-1">
                      Сильна сторона
                    </p>
                    <p className="text-sm leading-snug">{card.strong_side}</p>
                  </div>
                )}
                {card.weak_side && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400 mb-1">
                      Слабка сторона
                    </p>
                    <p className="text-sm leading-snug">{card.weak_side}</p>
                  </div>
                )}
              </div>

              {/* Threat / Opportunity */}
              {card.threat_for_us && (
                <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-400 mb-1">
                    Загроза для нас
                  </p>
                  <p className="text-sm leading-snug">{card.threat_for_us}</p>
                </div>
              )}
              {card.opportunity_for_us && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                    Наша можливість
                  </p>
                  <p className="text-sm leading-snug">
                    {card.opportunity_for_us}
                  </p>
                </div>
              )}

              {/* Score bars */}
              {(card.visual_analysis || card.content_analysis) && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {card.visual_analysis && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Візуал
                      </p>
                      <ScoreBar
                        label="First frame"
                        value={card.visual_analysis.first_frame_clarity}
                      />
                      <ScoreBar
                        label="Text overlay"
                        value={card.visual_analysis.text_overlay}
                      />
                      <ScoreBar
                        label="Visual focus"
                        value={card.visual_analysis.visual_focus}
                      />
                      <ScoreBar
                        label="CTA visibility"
                        value={card.visual_analysis.cta_visibility}
                      />
                    </div>
                  )}
                  {card.content_analysis && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Контент
                      </p>
                      <ScoreBar
                        label="Hook strength"
                        value={card.content_analysis.hook_strength}
                      />
                      <ScoreBar
                        label="Topic relevance"
                        value={card.content_analysis.topic_relevance}
                      />
                      <ScoreBar
                        label="Trust signal"
                        value={card.content_analysis.trust_signal}
                      />
                      <ScoreBar
                        label="Conversion bridge"
                        value={card.content_analysis.conversion_bridge}
                      />
                    </div>
                  )}
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
