import { componentMap, type SectionData } from "./sections";

/**
 * Resolves a single page-object section to its component via `componentMap`.
 * An unknown `component` value never crashes the page — it renders a visible
 * fallback (the section title plus the raw JSON) so missing components are
 * obvious during the V2 build-out instead of silently dropping data.
 */
export function SectionRenderer({
  sectionKey,
  section,
}: {
  sectionKey: string;
  section: SectionData;
}) {
  const componentKey = section?.component ?? "";
  const Component = componentMap[componentKey];

  if (!Component) {
    return (
      <section className="rounded-2xl border border-dashed border-yellow-500/40 bg-yellow-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-display text-lg font-bold">
            {section?.title ?? sectionKey}
          </h2>
          <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-mono text-yellow-500">
            unknown component: {componentKey || "—"}
          </span>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
          {JSON.stringify(section, null, 2)}
        </pre>
      </section>
    );
  }

  return <Component sectionKey={sectionKey} section={section} />;
}
