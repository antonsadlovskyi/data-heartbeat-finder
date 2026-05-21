## FlyHigh: Upgrade prototype into full AI marketing intelligence app

### Scope
Transform the existing 5-page prototype (Landing, Dashboard, Competitor Radar, Insights, Trends, Performance, Onboarding) into a 10-page dashboard app with a backend-ready data layer, mock data matching the proposed DB schema, and i18n-ready text constants.

### Architecture
- **Data layer** at `src/lib/data/` with:
  - `types.ts` — all TypeScript interfaces matching the DB tables (users, workspaces, own_social_profiles, competitor_profiles, profile_snapshots, posts, post_metrics, competitor_scorecards, insights, todo_items, tracking_experiments, idea_suggestions, trend_items, content_format_analysis, dashboard_cards, notification_subscriptions, adjacent_industries)
  - `mock.ts` — rich mock data for a sample café workspace
  - `services.ts` — typed async service functions (`getDashboardCards`, `getCompetitors`, `getCompetitorScorecards`, `getInsights`, `getTodos`, `applyInsightToTodo`, `startTrackingTodo`, etc.) backed by in-memory state via a Zustand store, ready to swap for DB queries.
- **State**: a single Zustand store `src/lib/store.ts` holds mutable mock state (todos, experiments, profile corrections, applied insights) so actions persist across navigation.
- **i18n**: `src/lib/i18n/` with `en.ts`, `uk.ts`, `de.ts` dictionaries + `useT()` hook reading language from store. All UI labels go through `t("key")`.

### Routing (TanStack flat file routing)
Keep landing at `/`, app under `/app/*`:
- `/app` → Dashboard (replaces current app.index)
- `/app/competitors` → Competitor Radar (rebuild)
- `/app/insights` → Insights Feed (rebuild)
- `/app/todos` → To Dos & Action Tracking (new)
- `/app/ideas` → Idea Suggestions (new)
- `/app/formats` → Content Format Analysis (new)
- `/app/performance` → My Performance (rebuild)
- `/app/trends` → Trend Tracker (keep, light update)
- `/app/setup` → Profile Setup / Strategy Profile (upgrade onboarding)
- `/app/settings` → Settings & Notifications (new)

### Reusable components (`src/components/app/`)
`PlatformSwitcher`, `ScoreCard`, `InsightCard`, `CompetitorRankCard`, `EmbeddedPostCard`, `TodoCard`, `TrackingExperimentCard`, `IdeaCard`, `TrendCard`, `ProfileDiagnosisCard`, `MetricComparisonChart`, `PageHeader`, `ActionButton`, `EmptyState`.

### AppShell updates
- Sidebar gets 10 nav items grouped: Workspace (Dashboard, Competitor Radar, Insights, To Dos, Ideas, Formats, Performance, Trends) + Account (Setup, Settings)
- Header gets global `PlatformSwitcher` (workspace store) + last-scan timestamp + business name
- Sidebar collapsible on small screens

### Page content (high-level)
Each page wired to service functions, shows real mock data, every card has action buttons that mutate store state. Empty states reference "n8n / Apify will populate this".

**Dashboard**: position-today scorecards, top-3 actions, competitors-moved feed, active tracking experiments with before/after, best-competitor-outcomes grid.

**Competitor Radar**: ranking table sorted by overall score, "What makes the winners win" summary, per-competitor detail drawer, best-outcomes panel, filters.

**Insights Feed**: card feed with type/priority/difficulty badges, "Apply" opens a modal (metric, baseline, period, target) → creates Todo + tracking experiment via service fn.

**To Dos**: 5-column kanban (Open / In progress / Tracking / Paused / Completed) + Results tab.

**Ideas**: grouped idea cards (content, campaign, offer, visual, community, collab).

**Content Formats**: per-format scorecards with usage count, avg score, best example, content-gap section.

**My Performance**: own profile overview, vs-competitor chart, profile diagnosis with inline edit, action results.

**Trend Tracker**: minimal — trend cards by category + seasonal calendar list.

**Setup**: multi-step wizard with progress indicator, AI-detected sections with "correct if needed".

**Settings**: language selector, connected profiles, competitor management, notifications (Telegram/Email/freq), scan frequency, export placeholders.

### MVP scope guardrails
- Mock data only; no real Apify/n8n/DB calls.
- All Zustand mutations are local; service functions are async-shaped to ease later DB swap.
- Focus polish on: AppShell, Dashboard, Competitor Radar, Insights Feed, To Dos, My Performance. Lighter polish on Ideas, Formats, Trends, Setup, Settings.
- Keep current cosmic dark visual style + design tokens in `src/styles.css`. No new color tokens needed beyond what exists.

### Technical notes
- Add deps: `zustand` (state), keep existing `recharts`, `lucide-react`, `framer-motion` if present.
- All new routes are children of existing `/app` layout — `AppShell` is the parent `Outlet`.
- Update `src/routeTree.gen.ts` is auto-managed; just create files.
- Landing page keeps current style, ensure prominent "Open Dashboard" CTA links to `/app`.

### Out of scope (this edit)
- Real auth, real backend, real Apify/n8n integration.
- PDF/CSV export functionality (UI buttons only).
- Adjacent industries page (data model only, no page).
- Generate-content-draft AI calls (button stubs).
