import { EvidenceChips } from "../EvidenceChips";
import type { SectionProps } from "./index";

interface MoveItem {
  move_id?: string | null;
  platform?: string | null;
  competitor?: string | null;
  move_title?: string | null;
  threat_level?: string | null;
  evidence_chips?: unknown;
  why_it_matters?: string | null;
  short_description?: string | null;
  recommended_response?: string | null;
}

interface MoveGroup {
  label?: string | null;
  group_key?: string | null;
  items?: unknown;
}

const threatColor: Record<string, string> = {
  high:   "text-red-400 bg-red-500/10 border-red-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const threatLabel: Record<string, string> = {
  high: "Висока загроза", medium: "Середня загроза", low: "Низька загроза",
};

export function MoveGroups({ sectionKey, section }: SectionProps) {
  const groups: MoveGroup[] = Array.isArray((section as { groups?: unknown }).groups)
    ? (section as { groups: MoveGroup[] }).groups
    : [];

  return (
    <section className="space-y-5">
      <h2 className="font-display text-lg font-bold">{section.title ?? sectionKey}</h2>
      {groups.map((group, gi) => {
        const items: MoveItem[] = Array.isArray(group.items) ? group.items : [];
        return (
          <div key={gi} className="space-y-3">
            {group.label && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </p>
            )}
            {items.map((move, mi) => {
              const threatKey = move.threat_level ?? "";
              const badgeCls = threatColor[threatKey] ?? "text-muted-foreground bg-muted/20 border-border/40";
              return (
                <div
                  key={move.move_id ?? mi}
                  className="rounded-3xl border border-border/60 bg-card/70 shadow-pop p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <p className="font-display font-bold text-base leading-snug">{move.move_title}</p>
                      {move.competitor && (
                        <p className="text-xs text-muted-foreground mt-0.5">{move.competitor}</p>
                      )}
                    </div>
                    {threatKey && (
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeCls}`}>
                        {threatLabel[threatKey] ?? threatKey}
                      </span>
                    )}
                  </div>

                  {move.short_description && (
                    <p className="text-sm text-muted-foreground leading-snug">{move.short_description}</p>
                  )}

                  {move.why_it_matters && (
                    <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-400 mb-1">Чому важливо</p>
                      <p className="text-sm leading-snug">{move.why_it_matters}</p>
                    </div>
                  )}

                  {move.recommended_response && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">Рекомендована відповідь</p>
                      <p className="text-sm leading-snug">{move.recommended_response}</p>
                    </div>
                  )}

                  <EvidenceChips chips={move.evidence_chips} />
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
