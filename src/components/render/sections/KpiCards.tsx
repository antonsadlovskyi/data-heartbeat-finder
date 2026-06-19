import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface KpiCard {
  label?: string | null;
  value?: string | null;
  comment?: string | null;
  card_key?: string | null;
  evidence_chips?: unknown;
}

const accentClass: Record<string, string> = {
  weak_spot: "border-red-500/30 bg-red-500/5",
  opportunity: "border-emerald-500/30 bg-emerald-500/5",
  risk: "border-yellow-500/30 bg-yellow-500/5",
  next_move: "border-primary/30 bg-primary/5",
};

const labelClass: Record<string, string> = {
  weak_spot: "text-red-400",
  opportunity: "text-emerald-400",
  risk: "text-yellow-400",
  next_move: "text-primary",
};

export function KpiCards({ sectionKey, section }: SectionProps) {
  const items: KpiCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((card, i) => {
          const key = card.card_key ?? "";
          const borderBg = accentClass[key] ?? "border-border/60 bg-card/70";
          const lc = labelClass[key] ?? "text-muted-foreground";
          return (
            <div
              key={i}
              className={`rounded-3xl border ${borderBg} p-5 shadow-pop space-y-2`}
            >
              {card.label && (
                <div
                  className={`text-[10px] font-semibold uppercase tracking-widest ${lc}`}
                >
                  {card.label}
                </div>
              )}
              {card.value && (
                <p className="font-display text-xl font-bold leading-snug">
                  {card.value}
                </p>
              )}
              {card.comment && (
                <p className="text-sm text-muted-foreground leading-snug">
                  {card.comment}
                </p>
              )}
              <EvidenceChips chips={card.evidence_chips} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
