import type { SectionProps } from "./index";

interface BenchmarkRow {
  metric?: string | null;
  dragi?: string | null;
  competitors?: string | null;
  gap?: string | null;
  comment?: string | null;
}

function GapBadge({ gap }: { gap?: string | null }) {
  if (!gap) return null;
  const isPositive = gap.startsWith("+");
  const isNegative = gap.startsWith("-");
  const cls = isPositive
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    : isNegative
      ? "text-red-400 bg-red-500/10 border-red-500/30"
      : "text-muted-foreground bg-muted/20 border-border/40";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${cls}`}
    >
      {gap}
    </span>
  );
}

export function BenchmarkTable({ sectionKey, section }: SectionProps) {
  const items: BenchmarkRow[] = Array.isArray(section.items) ? section.items : [];

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-bold">
        {section.title ?? sectionKey}
      </h2>
      <div className="rounded-3xl border border-border/60 bg-card/70 shadow-pop overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/10">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Метрика
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ми
              </th>
              <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Конкуренти
              </th>
              <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Розрив
              </th>
              <th className="hidden sm:table-cell px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Коментар
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {items.map((row, i) => (
              <tr key={i} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-3 font-medium">{row.metric ?? "—"}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {row.dragi ?? "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {row.competitors ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <GapBadge gap={row.gap} />
                </td>
                <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground text-xs max-w-[200px]">
                  {row.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
