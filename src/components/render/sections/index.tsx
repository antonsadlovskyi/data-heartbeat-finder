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
import { DecisionCards } from "./DecisionCards";
import { MoveGroups } from "./MoveGroups";
import { HypothesisCards } from "./HypothesisCards";
import { PlatformStatusCards } from "./PlatformStatusCards";
import { AccountTable } from "./AccountTable";
import { ScoreBreakdown } from "./ScoreBreakdown";

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
  DecisionCards,
  MoveGroups,
  HypothesisCards,
  PlatformStatusCards,
  AccountTable,
  ScoreBreakdown,
};

/** Maps `section.component` values to their renderer. 16 canonical keys, 0 stubs. */
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
  // Batch C — real (Session 6)
  decision_cards: DecisionCards,
  move_groups: MoveGroups,
  hypothesis_cards: HypothesisCards,
  platform_status_cards: PlatformStatusCards,
  account_table: AccountTable,
  score_breakdown: ScoreBreakdown,
};
