import type { ComponentType } from "react";
import { KpiCards } from "./KpiCards";
import { PlatformScoreRow } from "./PlatformScoreRow";
import { BenchmarkTable } from "./BenchmarkTable";
import { SummaryBlock } from "./SummaryBlock";
import { SummaryCards } from "./SummaryCards";
import { ChangeCards } from "./ChangeCards";
import { CompetitorCards } from "./CompetitorCards";
import { PostCards } from "./PostCards";
import { PostCardsCompact } from "./PostCardsCompact";
import { TrendCards } from "./TrendCards";

/**
 * A page-object section: `section_key -> { title, component, items[] }`.
 * The renderer passes the resolved section plus its key down to the matched
 * component. Most sections carry an `items` array, but some carry object-shaped
 * payloads — components must treat `items` defensively.
 */
export interface SectionData {
  title?: string | null;
  component?: string | null;
  items?: unknown;
  [key: string]: unknown;
}

export interface SectionProps {
  sectionKey: string;
  section: SectionData;
}

/**
 * Session 3 stub: every one of the 16 canonical section components renders the
 * same way — a titled card with the section's data as pretty-printed JSON. This
 * lets the whole render pipeline (PageObjectRenderer → SectionRenderer →
 * componentMap) come up end-to-end before the real components land (Sessions
 * 4–7). Each stub is a distinct named component so swapping one for its real
 * implementation later is a one-line change in the map below.
 */
function makeStub(componentName: string): ComponentType<SectionProps> {
  function StubSection({ sectionKey, section }: SectionProps) {
    // Prefer `items`, but fall back to the rest of the section so object-shaped
    // sections (e.g. summary_cards) still show something useful.
    const { title: _t, component: _c, ...rest } = section;
    const data = section.items ?? rest;
    return (
      <section className="rounded-2xl border border-border/50 bg-card/40 p-5 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-display text-lg font-bold">
            {section.title ?? sectionKey}
          </h2>
          <span className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            {componentName}
          </span>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
          {JSON.stringify(data, null, 2)}
        </pre>
      </section>
    );
  }
  StubSection.displayName = `Stub(${componentName})`;
  return StubSection;
}

// The 16 canonical component keys backed by app.page_objects.
// Batch A (Session 4): KpiCards, PlatformScoreRow, BenchmarkTable, SummaryBlock, SummaryCards — real.
// Batch B (Session 5): ChangeCards, CompetitorCards, PostCards, PostCardsCompact, TrendCards — real.
// Remaining 6 stubs replaced in Sessions 6–7.
export {
  KpiCards,
  PlatformScoreRow,
  BenchmarkTable,
  SummaryBlock,
  SummaryCards,
  ChangeCards,
  CompetitorCards,
  PostCards,
  PostCardsCompact,
  TrendCards,
};
export const AccountTable = makeStub("account_table");
export const DecisionCards = makeStub("decision_cards");
export const HypothesisCards = makeStub("hypothesis_cards");
export const MoveGroups = makeStub("move_groups");
export const PlatformStatusCards = makeStub("platform_status_cards");
export const ScoreBreakdown = makeStub("score_breakdown");

/** Maps `section.component` values to their renderer. 16 canonical keys. */
export const componentMap: Record<string, ComponentType<SectionProps>> = {
  // Batch A — real (Session 4)
  kpi_cards: KpiCards,
  platform_score_row: PlatformScoreRow,
  benchmark_table: BenchmarkTable,
  summary_block: SummaryBlock,
  summary_cards: SummaryCards,
  // Batch B — real (Session 5)
  change_cards: ChangeCards,
  competitor_cards: CompetitorCards,
  post_cards: PostCards,
  post_cards_compact: PostCardsCompact,
  trend_cards: TrendCards,
  // Stubs — Sessions 6–7
  account_table: AccountTable,
  decision_cards: DecisionCards,
  hypothesis_cards: HypothesisCards,
  move_groups: MoveGroups,
  platform_status_cards: PlatformStatusCards,
  score_breakdown: ScoreBreakdown,
};
