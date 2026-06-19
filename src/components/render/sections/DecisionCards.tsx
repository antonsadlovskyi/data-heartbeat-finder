import type { SectionProps } from "./index";

interface DecisionCard {
  title?: string | null;
  reason?: string | null;
  decision_type?: string | null;
}

const typeConfig: Record<string, { label: string; badge: string; border: string; bg: string }> = {
  start:    { label: "Почати",     badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
  stop:     { label: "Зупинити",   badge: "text-red-400 bg-red-500/10 border-red-500/30",             border: "border-red-500/20",     bg: "bg-red-500/5" },
  watch:    { label: "Слідкувати", badge: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",   border: "border-yellow-500/20",  bg: "bg-yellow-500/5" },
  continue: { label: "Продовжити", badge: "text-blue-400 bg-blue-500/10 border-blue-500/30",          border: "border-blue-500/20",    bg: "bg-blue-500/5" },
};

const fallbackConfig = { label: "", badge: "text-muted-foreground bg-muted/20 border-border/40", border: "border-border/60", bg: "bg-card/70" };

export function DecisionCards({ sectionKey, section }: SectionProps) {
  const items: DecisionCard[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">{section.title ?? sectionKey}</h2>
      <div className="space-y-3">
        {items.map((card, i) => {
          const cfg = typeConfig[card.decision_type ?? ""] ?? fallbackConfig;
          return (
            <div
              key={i}
              className={`rounded-3xl border ${cfg.border} ${cfg.bg} shadow-pop p-5 space-y-2`}
            >
              <div className="flex items-start gap-3 flex-wrap">
                {card.decision_type && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.badge}`}>
                    {cfg.label || card.decision_type}
                  </span>
                )}
                <p className="font-display font-bold text-base leading-snug flex-1">
                  {card.title}
                </p>
              </div>
              {card.reason && (
                <p className="text-sm text-muted-foreground leading-snug">{card.reason}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
