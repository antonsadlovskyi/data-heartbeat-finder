// Service layer. These wrap the in-memory Zustand store today; replace each
// function's body with a real DB query (Supabase / API) without touching
// consumers.

import { useNavio } from "../store";
import type {
  CompetitorProfile,
  CompetitorScorecard,
  ContentFormatAnalysis,
  DashboardCard,
  IdeaSuggestion,
  Insight,
  PlatformFilter,
  TodoItem,
  TrackingExperiment,
  TrendItem,
  OwnSocialProfile,
  Post,
  PostMetrics,
} from "./types";

function filterByPlatform<T extends { platform: string }>(items: T[], platform: PlatformFilter): T[] {
  if (platform === "all") return items;
  return items.filter((i) => i.platform === platform || i.platform === "all");
}

// --- Reads -----------------------------------------------------------------

export async function getDashboardCards(platform: PlatformFilter = "all"): Promise<DashboardCard[]> {
  const cards = useNavio.getState().dashboardCards.filter((c) => c.active);
  // dashboard cards aren't platform-scoped today, but keep API ready
  void platform;
  return cards.sort((a, b) => b.priority - a.priority);
}

export async function getCompetitors(platform: PlatformFilter = "all"): Promise<CompetitorProfile[]> {
  const items = useNavio.getState().competitors.filter((c) => c.active);
  return filterByPlatform(items, platform);
}

export async function getCompetitorScorecards(
  platform: PlatformFilter = "all"
): Promise<CompetitorScorecard[]> {
  return filterByPlatform(useNavio.getState().scorecards, platform).sort(
    (a, b) => b.overall_score - a.overall_score
  );
}

export async function getInsights(platform: PlatformFilter = "all"): Promise<Insight[]> {
  return filterByPlatform(useNavio.getState().insights, platform).sort(
    (a, b) => b.priority - a.priority
  );
}

export async function getTodos(): Promise<TodoItem[]> {
  return useNavio.getState().todos;
}

export async function getIdeaSuggestions(platform: PlatformFilter = "all"): Promise<IdeaSuggestion[]> {
  return filterByPlatform(useNavio.getState().ideas, platform);
}

export async function getTrendItems(platform: PlatformFilter = "all"): Promise<TrendItem[]> {
  return filterByPlatform(useNavio.getState().trends, platform);
}

export async function getFormats(platform: PlatformFilter = "all"): Promise<ContentFormatAnalysis[]> {
  const items = useNavio.getState().formats;
  return platform === "all" ? items : items.filter((f) => f.platform === platform);
}

export async function getOwnProfiles(): Promise<OwnSocialProfile[]> {
  return useNavio.getState().ownProfiles;
}

export async function getOwnPerformance(): Promise<{
  followers: number;
  engagement: number;
  posting_frequency: string;
  best_format: string;
  weakest_format: string;
}> {
  const own = useNavio.getState().ownProfiles;
  const totalFollowers = own.reduce((s, p) => s + p.followers, 0);
  const avgEr = own.length ? own.reduce((s, p) => s + p.avg_engagement_rate, 0) / own.length : 0;
  return {
    followers: totalFollowers,
    engagement: Math.round(avgEr * 10) / 10,
    posting_frequency: own[0]?.posting_frequency ?? "—",
    best_format: "Reels (15–25s)",
    weakest_format: "Long carousels",
  };
}

export async function getTopCompetitorPosts(): Promise<Array<{ post: Post; metrics?: PostMetrics; competitor?: CompetitorProfile }>> {
  const { posts, metrics, competitors } = useNavio.getState();
  return posts
    .filter((p) => p.profile_type === "competitor")
    .map((post) => ({
      post,
      metrics: metrics.find((m) => m.post_id === post.id),
      competitor: competitors.find((c) => c.id === post.profile_id),
    }))
    .sort((a, b) => (b.metrics?.performance_score ?? 0) - (a.metrics?.performance_score ?? 0));
}

// --- Mutations -------------------------------------------------------------

export async function applyInsightToTodo(
  insight: Insight,
  opts: { metric: string; baseline: number; target: number; trackingPeriodDays: number }
): Promise<{ todo: TodoItem; experiment: TrackingExperiment }> {
  const id = `t_${Date.now()}`;
  const xid = `x_${Date.now()}`;
  const now = new Date().toISOString();
  const end = new Date(Date.now() + opts.trackingPeriodDays * 86400 * 1000).toISOString();

  const todo: TodoItem = {
    id,
    workspace_id: insight.workspace_id,
    source_insight_id: insight.id,
    title: insight.title,
    description: insight.suggested_action,
    platform: insight.platform,
    category: "content",
    success_metric: opts.metric,
    baseline_value: opts.baseline,
    target_value: opts.target,
    tracking_period_days: opts.trackingPeriodDays,
    status: "in_progress",
    created_at: now,
  };

  const experiment: TrackingExperiment = {
    id: xid,
    workspace_id: insight.workspace_id,
    todo_id: id,
    title: insight.title,
    action_taken: insight.suggested_action,
    metric_tracked: opts.metric,
    baseline_value: opts.baseline,
    current_value: opts.baseline,
    target_value: opts.target,
    start_date: now,
    end_date: end,
    result_summary: "Tracking just started.",
    result_status: "running",
  };

  useNavio.getState().upsertTodo(todo);
  useNavio.getState().upsertExperiment(experiment);
  useNavio.getState().setInsightStatus(insight.id, "applied");
  return { todo, experiment };
}

export async function startTrackingTodo(todoId: string) {
  useNavio.getState().setTodoStatus(todoId, "tracking");
}
export async function pauseTodo(todoId: string) {
  useNavio.getState().setTodoStatus(todoId, "paused");
}
export async function postponeTodo(todoId: string) {
  useNavio.getState().setTodoStatus(todoId, "postponed");
}
export async function completeTodo(todoId: string) {
  useNavio.getState().setTodoStatus(todoId, "completed");
}
export async function startTodo(todoId: string) {
  useNavio.getState().setTodoStatus(todoId, "in_progress");
}
