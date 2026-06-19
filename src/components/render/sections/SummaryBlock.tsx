import type { SectionProps } from "./index";

export function SummaryBlock({ sectionKey, section }: SectionProps) {
  const main = section.main_takeaway as string | null | undefined;
  const note = section.supporting_note as string | null | undefined;

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6 shadow-pop space-y-3">
        {main && (
          <p className="font-display text-lg sm:text-xl font-bold leading-snug">
            {main}
          </p>
        )}
        {note && (
          <p className="text-sm text-muted-foreground leading-relaxed">{note}</p>
        )}
        {!main && !note && (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </div>
    </section>
  );
}
