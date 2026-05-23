// Navio — backend-ready type definitions.
// These mirror the future database tables. n8n/Apify writes to these shapes,
// the frontend reads them through service functions in `./services.ts`.

export type Platform = "instagram" | "tiktok" | "facebook" | "google_maps";
export type PlatformFilter = Platform | "all";
export type Language = "en" | "uk" | "de";

export interface User {
  id: string;
  name: string;
  email: string;
  language: Language;
  created_at: string;
}

export interface Workspace {
  id: string;
  user_id: string;
  business_name: string;
  niche: string;
  location: string;
  target_audience: string;
  brand_positioning: string;
  main_goal: string;
  created_at: string;
  updated_at: string;
}

export interface OwnSocialProfile {
  id: string;
  workspace_id: string;
  platform: Platform;
  handle: string;
  profile_url: string;
  bio: string;
  followers: number;
  following: number;
  avg_engagement_rate: number;
  posting_frequency: string;
  detected_niche: string;
  detected_brand_voice: string;
  detected_visual_style: string;
  detected_content_pillars: string[];
  user_corrections: Partial<{
    niche: string;
    brand_voice: string;
    visual_style: string;
    content_pillars: string[];
    target_audience: string;
  }>;
  last_scanned_at: string;
}

export interface CompetitorProfile {
  id: string;
  workspace_id: string;
  platform: Platform;
  handle: string;
  profile_url: string;
  competitor_name: string;
  niche: string;
  location: string;
  followers: number;
  avg_engagement_rate: number;
  posting_frequency: string;
  strengths: string[];
  weaknesses: string[];
  values_communicated: string[];
  positioning: string;
  product_angle: string;
  main_content_formats: string[];
  why_they_stand_out: string;
  last_scanned_at: string;
  active: boolean;
  // visual helper
  emoji?: string;
}

export interface ProfileSnapshot {
  id: string;
  profile_id: string;
  profile_type: "own" | "competitor";
  platform: Platform;
  followers: number;
  following: number;
  posts_count: number;
  avg_likes: number;
  avg_comments: number;
  avg_views: number;
  avg_engagement_rate: number;
  bio: string;
  scan_date: string;
  raw_data_json: unknown;
  ai_summary: string;
}

export type PostType = "reel" | "carousel" | "static" | "story" | "tiktok_video";

export interface Post {
  id: string;
  profile_id: string;
  profile_type: "own" | "competitor";
  platform: Platform;
  post_url: string;
  embed_url: string;
  post_type: PostType;
  caption: string;
  hashtags: string[];
  audio_name?: string;
  published_at: string;
  thumbnail_url: string;
  creative_format: string;
  marketing_idea: string;
  product_message: string;
  hook_type: string;
  call_to_action: string;
  visual_style: string;
  raw_data_json?: unknown;
}

export interface PostMetrics {
  id: string;
  post_id: string;
  measured_at: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  engagement_rate: number;
  growth_since_last_scan: number;
  performance_score: number; // 0..100
}

export interface CompetitorScorecard {
  id: string;
  workspace_id: string;
  competitor_profile_id: string;
  platform: Platform;
  scan_date: string;
  content_quality_score: number;
  engagement_score: number;
  consistency_score: number;
  trend_usage_score: number;
  brand_clarity_score: number;
  offer_clarity_score: number;
  visual_identity_score: number;
  community_score: number;
  overall_score: number;
  key_success_factors: string[];
  biggest_weaknesses: string[];
  recommended_response: string;
}

export type InsightType =
  | "opportunity"
  | "warning"
  | "trend"
  | "competitor_move"
  | "content_gap"
  | "own_performance"
  | "product_update";

export type InsightStatus = "new" | "applied" | "dismissed" | "saved";

export interface Insight {
  id: string;
  workspace_id: string;
  platform: Platform | "all";
  title: string;
  insight_type: InsightType;
  summary: string;
  evidence: string;
  related_competitor_ids: string[];
  related_post_ids: string[];
  suggested_action: string;
  expected_impact: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  priority: number; // 1..5
  status: InsightStatus;
  created_at: string;
}

export type TodoStatus = "open" | "in_progress" | "tracking" | "paused" | "completed" | "postponed";
export type TodoCategory =
  | "content"
  | "strategy"
  | "profile_optimization"
  | "product"
  | "campaign"
  | "trend";

export interface TodoItem {
  id: string;
  workspace_id: string;
  source_insight_id?: string;
  title: string;
  description: string;
  platform: Platform | "all";
  category: TodoCategory;
  success_metric: string;
  baseline_value: number;
  target_value: number;
  tracking_period_days: number;
  status: TodoStatus;
  due_date?: string;
  created_at: string;
  completed_at?: string;
}

export type ExperimentStatus = "running" | "improved" | "no_change" | "worse" | "inconclusive";

export interface TrackingExperiment {
  id: string;
  workspace_id: string;
  todo_id: string;
  title: string;
  action_taken: string;
  metric_tracked: string;
  baseline_value: number;
  current_value: number;
  target_value: number;
  start_date: string;
  end_date: string;
  result_summary: string;
  result_status: ExperimentStatus;
}

export type IdeaType = "content" | "campaign" | "offer" | "product" | "visual" | "community" | "collab";

export interface IdeaSuggestion {
  id: string;
  workspace_id: string;
  platform: Platform | "all";
  title: string;
  idea_type: IdeaType;
  description: string;
  why_it_fits: string;
  inspiration_posts: string[];
  competitor_reference?: string;
  trend_reference?: string;
  implementation_steps: string[];
  difficulty: "easy" | "medium" | "hard";
  expected_impact: "low" | "medium" | "high";
  created_at: string;
  status: "new" | "saved" | "in_todo" | "dismissed";
}

export type TrendType = "audio" | "hashtag" | "format" | "seasonal_hook" | "visual_style" | "product_angle";

export interface TrendItem {
  id: string;
  workspace_id: string;
  platform: Platform | "all";
  trend_type: TrendType;
  title: string;
  description: string;
  growth_signal: string;
  examples: string[];
  recommended_action: string;
  urgency: "low" | "medium" | "high";
  created_at: string;
}

export interface ContentFormatAnalysis {
  id: string;
  workspace_id: string;
  platform: Platform;
  format_name: string;
  competitor_usage_count: number;
  average_performance_score: number;
  best_example_post_id?: string;
  why_it_works: string;
  recommendation_for_user: string;
  user_uses_it: boolean;
}

export interface AdjacentIndustry {
  id: string;
  workspace_id: string;
  industry_name: string;
  relevance_reason: string;
  top_patterns: string[];
  transferable_ideas: string[];
  priority: number;
}

export interface NotificationSubscription {
  id: string;
  workspace_id: string;
  channel: "telegram" | "email";
  destination: string;
  frequency: "daily" | "weekly" | "urgent_only";
  active: boolean;
}

export interface DashboardCard {
  id: string;
  workspace_id: string;
  card_type: string;
  page: "dashboard" | "competitor_radar" | "insights_feed" | "trend_tracker" | "my_performance";
  title: string;
  subtitle?: string;
  body?: string;
  data_json?: Record<string, unknown>;
  priority: number;
  created_by: "n8n" | "ai" | "user";
  created_at: string;
  expires_at?: string;
  active: boolean;
}
