import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface TrackingInfo {
  metric_key?: string | null;
  target_value?: number | null;
  baseline_value?: number | null;
  tracking_type?: string | null;
  comparison_method?: string | null;
  success_condition?: string | null;
  tracking_period_days?: number | null;
}

interface HypothesisAction {
  label?: string | null;
  action_type?: string | null;
}

interface HypothesisCard {
  hypothesis_id?: string | null;
  title?: string | null;
  hypothesis?: string | null;
  why?: string | null;
  status?: string | null;
  priority?: string | null;
  platform?: string | null;
  role_key?: string | null;
  impact_score?: number | null;
  effort_score?: number | null;
  confidence_score?: number | null;
  evidence_chips?: unknown;
  recommended_action?: string | null;
  tracking?: TrackingInfo | null;
  actions?: HypothesisAction[] | null;
}

const statusConfig: Record<string, { label: string; badge: string }> = {
  suggested:    { label: "Пропонується",  badge: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  active:       { label: "Активна",       badge: "text-primary bg-primary/10 border-primary/30" },
  validated:    { label: "Підтверджена",  badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  inconclusive: { label: "Неоднозначна", badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
};

const priorityConfig: Record<string, string> = {
  high:   "text-red-400",
  medium: "text-yellow-400",
  low:    "text-muted-foreground",
};

const priorityLabel: Record<string, string> = {
  high: "Високий", medium: "Середній", low: "Низький",
};

function ScoreBar({ label, value, color = "bg-primary/60" }: { label: string; value?: number | null; color?: string }) {
  if (value == null) return null;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function HypothesisCards({ sectionKey, section }: SectionProps) {
  const items: HypothesisCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">{section.title ?? sectionKey}</h2>
      <div className="space-y-4">
        {items.map((card, i) => {
          const statusCfg = statusConfig[card.status ?? ""] ?? { label: card.status ?? "", badge: "text-muted-foreground bg-muted/20 border-border/40" };
          const priorityCls = priorityConfig[card.priority ?? ""] ?? "text-muted-foreground";
          const actions: HypothesisAction[] = Array.isArray(card.actions) ? card.actions : [];

          return (
            <div
              key={card.hypothesis_id ?? i}
              className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <p className="font-display font-bold text-base leading-snug flex-1">{card.title}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {card.priority && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${priorityCls}`}>
                      {priorityLabel[card.priority] ?? card.priority}
                    </span>
                  )}
                  {card.status && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusCfg.badge}`}>
                      {statusCfg.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Hypothesis statement */}
              {card.hypothesis && (
                <p className="text-sm text-muted-foreground leading-snug">{card.hypothesis}</p>
              )}

              {/* Why */}
              {card.why && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">Чому</p>
                  <p className="text-sm leading-snug">{card.why}</p>
                </div>
              )}

              {/* Score bars */}
              <div className="space-y-2">
                <ScoreBar label="Вплив"      value={card.impact_score}     color="bg-emerald-500/60" />
                <ScoreBar label="Зусилля"    value={card.effort_score}     color="bg-yellow-500/60" />
                <ScoreBar label="Впевненість" value={card.confidence_score} color="bg-primary/60" />
              </div>

              {/* Recommended action */}
              {card.recommended_action && (
                <div className="rounded-2xl border border-border/40 bg-muted/10 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Рекомендована дія</p>
                  <p className="text-sm leading-snug">{card.recommended_action}</p>
                </div>
              )}

              {/* Tracking */}
              {card.tracking && (
                <div className="rounded-2xl border border-border/40 bg-muted/10 px-4 py-3 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Трекінг</p>
                  {card.tracking.metric_key && (
                    <p className="text-sm font-mono text-muted-foreground">{card.tracking.metric_key}</p>
                  )}
                  {card.tracking.baseline_value != null && card.tracking.target_value != null && (
                    <p className="text-xs text-muted-foreground">
                      {card.tracking.baseline_value} → {card.tracking.target_value}
                      {card.tracking.tracking_period_days && ` · ${card.tracking.tracking_period_days} днів`}
                    </p>
                  )}
                  {card.tracking.success_condition && (
                    <p className="text-xs text-emerald-400">{card.tracking.success_condition}</p>
                  )}
                </div>
              )}

              <EvidenceChips chips={card.evidence_chips} />

              {/* Action buttons */}
              {actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {actions.map((action, ai) => (
                    <button
                      key={ai}
                      className="rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-xs font-medium text-foreground hover:bg-muted/40 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
