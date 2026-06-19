import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface ChangeCard {
  title?: string | null;
  impact?: string | null;
  platform?: string | null;
  change_type?: string | null;
  recommended_response?: string | null;
  evidence_chips?: unknown;
}

const changeTypeColor: Record<string, string> = {
  competitor_change: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  market_shift: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  platform_update: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  trend_signal: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const changeTypeLabel: Record<string, string> = {
  competitor_change: "Конкурент",
  market_shift: "Ринок",
  platform_update: "Платформа",
  trend_signal: "Тренд",
};

export function ChangeCards({ sectionKey, section }: SectionProps) {
  const items: ChangeCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="space-y-3">
        {items.map((card, i) => {
          const typeKey = card.change_type ?? "";
          const badgeCls =
            changeTypeColor[typeKey] ??
            "text-muted-foreground bg-muted/20 border-border/40";
          const typeLabel = changeTypeLabel[typeKey] ?? typeKey;

          return (
            <div
              key={i}
              className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-3"
            >
              <div className="flex items-start gap-3 flex-wrap">
                {typeKey && (
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeCls}`}
                  >
                    {typeLabel}
                  </span>
                )}
                <p className="font-display font-bold text-base leading-snug flex-1">
                  {card.title}
                </p>
              </div>

              {card.impact && (
                <p className="text-sm text-muted-foreground leading-snug">
                  {card.impact}
                </p>
              )}

              {card.recommended_response && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
                    Рекомендована відповідь
                  </p>
                  <p className="text-sm leading-snug">
                    {card.recommended_response}
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
