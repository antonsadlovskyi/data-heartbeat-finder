
-- ============================================================
-- PROFILES + WORKSPACES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profile self read"   on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profile self update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profile self insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_name text not null,
  niche text,
  product_description text,
  target_audience text,
  main_goal text,
  country text,
  language text,
  notes text,
  created_at timestamptz not null default now()
);
create index workspaces_owner_idx on public.workspaces(owner_id);
grant select, insert, update, delete on public.workspaces to authenticated;
grant all on public.workspaces to service_role;
alter table public.workspaces enable row level security;
create policy "ws owner read"   on public.workspaces for select to authenticated using (owner_id = auth.uid());
create policy "ws owner write"  on public.workspaces for insert to authenticated with check (owner_id = auth.uid());
create policy "ws owner update" on public.workspaces for update to authenticated using (owner_id = auth.uid());
create policy "ws owner delete" on public.workspaces for delete to authenticated using (owner_id = auth.uid());

-- Security-definer helper used by all child tables
create or replace function public.owns_workspace(_ws uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workspaces where id = _ws and owner_id = auth.uid())
$$;

-- ============================================================
-- Helper macro idea: every child table has the same RLS shape.
-- We just write it out.
-- ============================================================

create table public.social_accounts (
  account_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_type text,
  platform text,
  username text,
  profile_url text,
  profile_name text,
  bio text,
  followers_count numeric,
  following_count numeric,
  posts_count numeric,
  external_url text,
  account_positioning text,
  first_impression text,
  status text,
  last_scraped_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index social_accounts_ws_idx on public.social_accounts(workspace_id);
grant select, insert, update, delete on public.social_accounts to authenticated;
grant all on public.social_accounts to service_role;
alter table public.social_accounts enable row level security;
create policy "sa rw" on public.social_accounts for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.account_snapshots (
  snapshot_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id text references public.social_accounts(account_id) on delete cascade,
  date timestamptz,
  followers_count numeric,
  following_count numeric,
  posts_count numeric,
  avg_likes_last_10 numeric,
  avg_comments_last_10 numeric,
  avg_views_last_10 numeric,
  engagement_rate numeric,
  posts_last_7_days numeric,
  reels_last_7_days numeric,
  carousels_last_7_days numeric,
  static_posts_last_7_days numeric,
  notes text
);
create index snap_ws_idx on public.account_snapshots(workspace_id);
grant select, insert, update, delete on public.account_snapshots to authenticated;
grant all on public.account_snapshots to service_role;
alter table public.account_snapshots enable row level security;
create policy "snap rw" on public.account_snapshots for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.social_posts (
  post_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id text references public.social_accounts(account_id) on delete cascade,
  platform_post_id text,
  short_code text,
  post_url text,
  post_type text,
  product_type text,
  published_at timestamptz,
  caption text,
  hashtags text,
  mentions text,
  likes_count numeric,
  comments_count numeric,
  views_count numeric,
  shares_count numeric,
  saves_count numeric,
  engagement_rate numeric,
  performance_level text,
  content_pillar text,
  topic text,
  subtopic text,
  hook_text text,
  cta_text text,
  raw_notes text
);
create index posts_ws_idx on public.social_posts(workspace_id);
create index posts_acc_idx on public.social_posts(account_id);
grant select, insert, update, delete on public.social_posts to authenticated;
grant all on public.social_posts to service_role;
alter table public.social_posts enable row level security;
create policy "posts rw" on public.social_posts for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.post_assets (
  asset_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  post_id text references public.social_posts(post_id) on delete cascade,
  asset_order numeric,
  asset_type text,
  asset_url text,
  visual_description text,
  text_on_screen text,
  role_in_post text,
  visual_style text,
  emotion text,
  pacing text,
  quality_score numeric,
  notes text
);
create index assets_ws_idx on public.post_assets(workspace_id);
grant select, insert, update, delete on public.post_assets to authenticated;
grant all on public.post_assets to service_role;
alter table public.post_assets enable row level security;
create policy "assets rw" on public.post_assets for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.post_comments (
  comment_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  post_id text references public.social_posts(post_id) on delete cascade,
  author_username text,
  comment_text text,
  like_count numeric,
  published_at timestamptz,
  comment_type text,
  sentiment text,
  pain_point text,
  objection text,
  buying_signal text,
  question text,
  notes text
);
create index comments_ws_idx on public.post_comments(workspace_id);
grant select, insert, update, delete on public.post_comments to authenticated;
grant all on public.post_comments to service_role;
alter table public.post_comments enable row level security;
create policy "comments rw" on public.post_comments for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.post_analyses (
  analysis_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  post_id text references public.social_posts(post_id) on delete cascade,
  analysis_date timestamptz,
  content_type text,
  format text,
  topic text,
  target_audience text,
  hook_type text,
  hook_strength numeric,
  main_promise text,
  pain_points text,
  emotional_trigger text,
  content_structure text,
  cta_type text,
  cta_strength numeric,
  visual_style text,
  trust_signal text,
  sales_angle text,
  why_it_worked text,
  why_it_failed text,
  reusable_pattern text,
  strategic_note text,
  score_overall numeric
);
create index post_analyses_ws_idx on public.post_analyses(workspace_id);
grant select, insert, update, delete on public.post_analyses to authenticated;
grant all on public.post_analyses to service_role;
alter table public.post_analyses enable row level security;
create policy "pa rw" on public.post_analyses for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.comment_summaries (
  comment_summary_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  post_id text references public.social_posts(post_id) on delete cascade,
  total_comments_analyzed numeric,
  positive_count numeric,
  neutral_count numeric,
  negative_count numeric,
  top_questions text,
  common_objections text,
  audience_pain_points text,
  buying_signals text,
  positive_reactions text,
  content_requests text,
  comment_summary text,
  strategic_insight text
);
create index cs_ws_idx on public.comment_summaries(workspace_id);
grant select, insert, update, delete on public.comment_summaries to authenticated;
grant all on public.comment_summaries to service_role;
alter table public.comment_summaries enable row level security;
create policy "cs rw" on public.comment_summaries for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.account_analyses (
  account_analysis_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id text references public.social_accounts(account_id) on delete cascade,
  period_start timestamptz,
  period_end timestamptz,
  positioning_summary text,
  main_content_pillars text,
  strongest_formats text,
  weakest_formats text,
  tone_of_voice text,
  visual_identity text,
  audience_pain_points text,
  main_hooks text,
  main_ctas text,
  product_angle text,
  trust_signals text,
  community_signals text,
  strengths text,
  weaknesses text,
  opportunities text,
  threats text,
  best_patterns_to_copy text,
  things_to_avoid text,
  strategic_summary text,
  score_overall numeric
);
create index aa_ws_idx on public.account_analyses(workspace_id);
grant select, insert, update, delete on public.account_analyses to authenticated;
grant all on public.account_analyses to service_role;
alter table public.account_analyses enable row level security;
create policy "aa rw" on public.account_analyses for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.competitor_radar (
  radar_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id text references public.social_accounts(account_id) on delete cascade,
  account_name text,
  positioning_strength numeric,
  content_consistency numeric,
  hook_strength numeric,
  educational_value numeric,
  emotional_connection numeric,
  visual_identity numeric,
  sales_clarity numeric,
  community_engagement numeric,
  trust_signals numeric,
  format_diversity numeric,
  trend_usage numeric,
  product_differentiation numeric,
  overall_score numeric,
  main_reason text,
  key_strength text,
  key_weakness text
);
create index radar_ws_idx on public.competitor_radar(workspace_id);
grant select, insert, update, delete on public.competitor_radar to authenticated;
grant all on public.competitor_radar to service_role;
alter table public.competitor_radar enable row level security;
create policy "radar rw" on public.competitor_radar for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.best_outcomes (
  outcome_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  post_id text references public.social_posts(post_id) on delete cascade,
  account_id text references public.social_accounts(account_id) on delete cascade,
  account_name text,
  post_url text,
  post_type text,
  topic text,
  metric_used text,
  metric_value numeric,
  why_selected text,
  hook_text text,
  content_pattern text,
  visual_pattern text,
  comment_reaction text,
  why_it_worked text,
  how_we_can_adapt text,
  risk_if_copying text,
  priority text
);
create index bo_ws_idx on public.best_outcomes(workspace_id);
grant select, insert, update, delete on public.best_outcomes to authenticated;
grant all on public.best_outcomes to service_role;
alter table public.best_outcomes enable row level security;
create policy "bo rw" on public.best_outcomes for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.competitor_comparison (
  comparison_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  own_account_id text,
  competitor_account_id text,
  period_start timestamptz,
  period_end timestamptz,
  area text,
  own_score numeric,
  competitor_score numeric,
  gap numeric,
  who_is_stronger text,
  why text,
  what_to_learn text,
  recommended_action text,
  priority text
);
create index cc_ws_idx on public.competitor_comparison(workspace_id);
grant select, insert, update, delete on public.competitor_comparison to authenticated;
grant all on public.competitor_comparison to service_role;
alter table public.competitor_comparison enable row level security;
create policy "cc rw" on public.competitor_comparison for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.workspace_report (
  report_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  report_date timestamptz,
  period_start timestamptz,
  period_end timestamptz,
  executive_summary text,
  main_success_factors text,
  market_patterns text,
  own_profile_strengths text,
  own_profile_weaknesses text,
  competitor_strengths text,
  competitor_weaknesses text,
  best_opportunities text,
  main_threats text,
  recommended_strategy text,
  next_7_days_actions text,
  next_30_days_actions text,
  key_content_ideas text,
  final_note text
);
create index wr_ws_idx on public.workspace_report(workspace_id);
grant select, insert, update, delete on public.workspace_report to authenticated;
grant all on public.workspace_report to service_role;
alter table public.workspace_report enable row level security;
create policy "wr rw" on public.workspace_report for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));

create table public.action_plan (
  action_id text primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  action_type text,
  priority text,
  based_on_insight text,
  what_to_do text,
  content_format text,
  example_topic text,
  expected_effect text,
  responsible text,
  status text,
  deadline timestamptz,
  notes text
);
create index ap_ws_idx on public.action_plan(workspace_id);
grant select, insert, update, delete on public.action_plan to authenticated;
grant all on public.action_plan to service_role;
alter table public.action_plan enable row level security;
create policy "ap rw" on public.action_plan for all to authenticated using (public.owns_workspace(workspace_id)) with check (public.owns_workspace(workspace_id));
