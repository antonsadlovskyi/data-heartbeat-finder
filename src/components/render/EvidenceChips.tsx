/**
 * Renders `summary.evidence_chips[]` (plain strings) as compact chips. This is
 * the lightweight surface for evidence in Session 3; the richer
 * evidence-context drawer (post/metric/visual/… signals) lands later.
 */
export function EvidenceChips({ chips }: { chips?: unknown }) {
  const list = Array.isArray(chips) ? chips.filter(Boolean) : [];
  if (list.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-[11px] text-muted-foreground"
        >
          {String(chip)}
        </span>
      ))}
    </div>
  );
}
