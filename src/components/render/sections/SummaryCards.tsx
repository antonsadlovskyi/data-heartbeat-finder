import type { SectionProps } from "./index";

interface SummaryCard {
  label?: string | null;
  value?: string | null;
  comment?: string | null;
}

export function SummaryCards({ sectionKey, section }: SectionProps) {
  const items: SummaryCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((card, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-pop space-y-1"
          >
            {card.label && (
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {card.label}
              </div>
            )}
            {card.value && (
              <p className="font-display text-lg font-bold leading-snug">
                {card.value}
              </p>
            )}
            {card.comment && (
              <p className="text-sm text-muted-foreground leading-snug">
                {card.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
