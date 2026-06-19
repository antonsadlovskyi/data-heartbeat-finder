import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface TrendCard {
  trend_id?: string | null;
  trend_name?: string | null;
  stage?: string | null;
  platform?: string | null;
  signal_strength?: number | null;
  why_it_matters?: string | null;
  visual_pattern?: string | null;
  content_pattern?: string | null;
  recommended_action?: string | null;
  evidence_chips?: unknown;
  // PDF-schema fallback
  title?: string | null;
  direction?: string | null;
  strength?: number | string | null;
  description?: string | null;
  recommendation?: string | null;
}

const stageConfig: Record<
  string,
  { label: string; cls: string; icon: string }
> = {
  growing: {
    label: "Росте",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: "↑",
  },
  up: {
    label: "Вгору",
    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    icon: "↑",
  },
  stable: {
    label: "Стабільний",
    cls: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    icon: "→",
  },
  declining: {
    label: "Спадає",
    cls: "text-red-400 bg-red-500/10 border-red-500/30",
    icon: "↓",
  },
  down: {
    label: "Вниз",
    cls: "text-red-400 bg-red-500/10 border-red-500/30",
    icon: "↓",
  },
};

function StrengthBar({ value }: { value?: number | string | null }) {
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseFloat(value)
        : null;
  if (num == null || isNaN(num)) return null;
  const pct = Math.min(100, Math.max(0, num));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>Сила сигналу</span>
        <span className="tabular-nums font-semibold">{num}</span>
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

export function TrendCards({ sectionKey, section }: SectionProps) {
  const items: TrendCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="space-y-3">
        {items.map((card, i) => {
          const stageKey = card.stage ?? card.direction ?? "";
          const stage = stageConfig[stageKey];
          const name = card.trend_name ?? card.title;
          const strength = card.signal_strength ?? card.strength;
          const description = card.why_it_matters ?? card.description;
          const action = card.recommended_action ?? card.recommendation;

          return (
            <div
              key={i}
              className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start gap-3 flex-wrap">
                {stage && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stage.cls}`}
                  >
                    <span>{stage.icon}</span>
                    {stage.label}
                  </span>
                )}
                {!stage && stageKey && (
                  <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {stageKey}
                  </span>
                )}
                {name && (
                  <p className="font-display font-bold text-base leading-snug flex-1">
                    {name}
                  </p>
                )}
              </div>

              <StrengthBar value={strength} />

              {description && (
                <p className="text-sm text-muted-foreground leading-snug">
                  {description}
                </p>
              )}

              {/* Patterns */}
              {(card.visual_pattern || card.content_pattern) && (
                <div className="grid sm:grid-cols-2 gap-2">
                  {card.visual_pattern && (
                    <div className="rounded-2xl border border-border/40 bg-muted/10 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        Візуал
                      </p>
                      <p className="text-sm">{card.visual_pattern}</p>
                    </div>
                  )}
                  {card.content_pattern && (
                    <div className="rounded-2xl border border-border/40 bg-muted/10 px-3 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        Контент
                      </p>
                      <p className="text-sm">{card.content_pattern}</p>
                    </div>
                  )}
                </div>
              )}

              {action && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                    Рекомендована дія
                  </p>
                  <p className="text-sm leading-snug">{action}</p>
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
