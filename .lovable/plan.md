
## Goal

Move three pages off the local JSON mocks (`apify-dataset.json`, `account-analyses.json`) onto a real Supabase backend that **n8n writes into directly**. Each user only sees rows belonging to workspaces they own (auth + RLS). The schema mirrors the existing mock 1:1 so the current dashboards keep rendering.

## 1. Enable Lovable Cloud

Provision the backend (Postgres + Auth + Storage). After this we have `VITE_SUPABASE_*` for the browser and `SUPABASE_SERVICE_ROLE_KEY` for n8n.

## 2. Database schema (mirrors `apify-dataset.json`)

One migration creates these tables in `public`. Every table carries `workspace_id uuid` (FK → `workspaces.id`) so RLS can scope by ownership. Each gets explicit `GRANT`s + RLS enabled.

```text
workspaces            (id, owner_id→auth.users, project_name, niche, main_goal, ...)
social_accounts       (account_id pk, workspace_id, platform, username, followers_count, ...)
account_snapshots     (snapshot_id pk, account_id, workspace_id, engagement_rate, captured_at, ...)
social_posts          (post_id pk, account_id, workspace_id, post_type, caption, likes_count,
                       engagement_rate, content_pillar, performance_level, post_url, ...)
post_assets           (asset_id pk, post_id, workspace_id, asset_type, url, ...)
post_comments         (comment_id pk, post_id, workspace_id, author, text, sentiment, ...)
competitor_radar      (radar_id pk, workspace_id, account_id, account_name, overall_score,
                       positioning_strength ... product_differentiation, key_strength,
                       key_weakness, main_reason)
best_outcomes         (outcome_id pk, workspace_id, account_id, metric, value, ...)
competitor_comparison (comparison_id pk, workspace_id, competitor_account_id, area, own_score,
                       competitor_score, gap, who_is_stronger, priority, recommended_action)
workspace_report      (report_id pk, workspace_id, period_start, period_end, executive_summary,
                       own_profile_strengths, own_profile_weaknesses, best_opportunities,
                       main_threats)
action_plan           (action_id pk, workspace_id, action_type, what_to_do, based_on_insight,
                       content_format, priority, deadline)
account_analyses      (analysis_id pk, workspace_id, account_id, ...)   ← mirrors account-analyses.json
```

### Roles & RLS

- `profiles` table (id → `auth.users`, display_name) created on signup via trigger.
- `workspace_members(workspace_id, user_id, role)` for shared workspaces.
- Security-definer helper `public.is_workspace_member(_ws uuid)`.
- Per-table policies: `SELECT/INSERT/UPDATE/DELETE` only when `is_workspace_member(workspace_id)`.
- `service_role` granted ALL on every table (this is what n8n uses).
- No `anon` grants — everything is auth-gated.

## 3. Auth

- Email/password + Google sign-in via the Lovable broker.
- `_authenticated` layout route gates the `/app/*` subtree.
- `/login`, `/signup`, `/reset-password` public routes.
- Root `onAuthStateChange` listener invalidates router + query cache.
- `attachSupabaseAuth` middleware confirmed in `src/start.ts`.

## 4. Server functions (live data layer)

Thin `*.functions.ts` files in `src/lib/data/` — each protected by `requireSupabaseAuth`, queries scoped via RLS:

- `getWorkspace()` — current user's active workspace + report.
- `getDatabaseDashboard()` — accounts, snapshots, posts (top), assets count, comments count, radar, comparisons, action_plan, workspace_report. One round-trip used by `/app/database`.
- `getCompetitorRadar()` — radar rows + comparisons for `/app/competitors`.
- `getAccountAnalyses()` — full per-account analyses for `/app/analyses`.

All return plain serializable DTOs. Loaders use `ensureQueryData` + `useSuspenseQuery` (canonical Query pattern). Each route gets `errorComponent` + `notFoundComponent`.

## 5. Page wiring (this round)

Replace mock imports with server-fn data:

| Route | Source today | Source after |
|---|---|---|
| `/app/database` | `apify-dataset.json` | `getDatabaseDashboard()` |
| `/app/competitors` | mock | `getCompetitorRadar()` |
| `/app/analyses` | `account-analyses.json` | `getAccountAnalyses()` |

Visual layouts stay (KPIs, SWOT tiles, BarChart + RadarChart, top posts, gap table, action list). Empty/loading/error states added — when n8n hasn't pushed anything yet, each section shows a friendly "Waiting for n8n run" placeholder with a copy-paste hint.

Other pages (`insights`, `todos`, `ideas`, `formats`, `performance`, `trends`, `setup`, `settings`) continue using mock data until a later round.

## 6. n8n integration guide (in `/app/settings`)

A new "n8n connection" panel shows:

- The user's `workspace_id` (copy button).
- Supabase project URL (`VITE_SUPABASE_URL`).
- Instructions: in n8n add a **Supabase** credential using `SUPABASE_SERVICE_ROLE_KEY` (we generate a one-click "Reveal & copy" gated by a confirm dialog — value is fetched through a `requireSupabaseAuth`'d server fn that checks the user owns the workspace).
- Table cheatsheet: which JSON keys map to which columns + required `workspace_id` on every insert.

## 7. Seed

Optional one-time seed server fn `seedFromMock()` that inserts the existing `apify-dataset.json` rows under the current user's workspace, so the UI is non-empty before the first n8n run. Triggered from a button in `/app/settings`.

## Technical notes

- New files: `supabase/migrations/<ts>_init_schema.sql`, `src/lib/data/{dashboard,radar,analyses}.functions.ts`, `src/routes/_authenticated.tsx`, `src/routes/login.tsx`, `src/routes/signup.tsx`, `src/routes/reset-password.tsx`, `src/components/app/N8nPanel.tsx`.
- Edits: `src/router.tsx` (auth context), `src/routes/__root.tsx` (auth listener), `src/start.ts` (verify `attachSupabaseAuth`), `src/routes/app.*.tsx` move under `_authenticated`, `app.database.tsx` / `app.competitors.tsx` / `app.analyses.tsx` swap data source.
- All schema changes via timestamped migrations; data inserts via insert tool, not migrations.
- Each `public.*` table migration includes the canonical GRANT block (authenticated + service_role; no anon).

## Out of scope (next round)

- Wiring the remaining `/app/*` pages to live data.
- Realtime subscriptions (Supabase Realtime) for live n8n updates — easy add-on once tables exist.
- Webhook ingestion path (not needed since you chose the direct Supabase node).
