import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PlatformFilter,
  Language,
  Workspace,
  OwnSocialProfile,
  CompetitorProfile,
  Insight,
  TodoItem,
  TrackingExperiment,
  IdeaSuggestion,
  TrendItem,
  CompetitorScorecard,
  ContentFormatAnalysis,
  DashboardCard,
  Post,
  PostMetrics,
  NotificationSubscription,
} from "./data/types";
import {
  mockWorkspace,
  mockOwnProfiles,
  mockCompetitors,
  mockScorecards,
  mockInsights,
  mockTodos,
  mockExperiments,
  mockIdeas,
  mockTrends,
  mockFormats,
  mockDashboardCards,
  mockPosts,
  mockMetrics,
  mockNotifications,
} from "./data/mock";

interface NavioState {
  // UI
  platform: PlatformFilter;
  language: Language;
  setPlatform: (p: PlatformFilter) => void;
  setLanguage: (l: Language) => void;

  // Data (mutable mock — replace with DB queries later)
  workspace: Workspace;
  ownProfiles: OwnSocialProfile[];
  competitors: CompetitorProfile[];
  scorecards: CompetitorScorecard[];
  insights: Insight[];
  todos: TodoItem[];
  experiments: TrackingExperiment[];
  ideas: IdeaSuggestion[];
  trends: TrendItem[];
  formats: ContentFormatAnalysis[];
  dashboardCards: DashboardCard[];
  posts: Post[];
  metrics: PostMetrics[];
  notifications: NotificationSubscription[];

  // Mutations
  updateWorkspace: (w: Partial<Workspace>) => void;
  updateOwnProfileDiagnosis: (id: string, corrections: OwnSocialProfile["user_corrections"]) => void;
  upsertTodo: (t: TodoItem) => void;
  setTodoStatus: (id: string, status: TodoItem["status"]) => void;
  upsertExperiment: (e: TrackingExperiment) => void;
  setInsightStatus: (id: string, status: Insight["status"]) => void;
  setIdeaStatus: (id: string, status: IdeaSuggestion["status"]) => void;
  addCompetitor: (c: CompetitorProfile) => void;
  removeCompetitor: (id: string) => void;
  upsertNotification: (n: NotificationSubscription) => void;
}

export const useNavio = create<NavioState>()(
  persist(
    (set) => ({
      platform: "all",
      language: "en",
      setPlatform: (p) => set({ platform: p }),
      setLanguage: (l) => set({ language: l }),

      workspace: mockWorkspace,
      ownProfiles: mockOwnProfiles,
      competitors: mockCompetitors,
      scorecards: mockScorecards,
      insights: mockInsights,
      todos: mockTodos,
      experiments: mockExperiments,
      ideas: mockIdeas,
      trends: mockTrends,
      formats: mockFormats,
      dashboardCards: mockDashboardCards,
      posts: mockPosts,
      metrics: mockMetrics,
      notifications: mockNotifications,

      updateWorkspace: (w) =>
        set((s) => ({ workspace: { ...s.workspace, ...w, updated_at: new Date().toISOString() } })),
      updateOwnProfileDiagnosis: (id, corrections) =>
        set((s) => ({
          ownProfiles: s.ownProfiles.map((p) =>
            p.id === id ? { ...p, user_corrections: { ...p.user_corrections, ...corrections } } : p
          ),
        })),
      upsertTodo: (t) =>
        set((s) => {
          const exists = s.todos.find((x) => x.id === t.id);
          return { todos: exists ? s.todos.map((x) => (x.id === t.id ? t : x)) : [t, ...s.todos] };
        }),
      setTodoStatus: (id, status) =>
        set((s) => ({
          todos: s.todos.map((t) =>
            t.id === id
              ? { ...t, status, completed_at: status === "completed" ? new Date().toISOString() : t.completed_at }
              : t
          ),
        })),
      upsertExperiment: (e) =>
        set((s) => {
          const exists = s.experiments.find((x) => x.id === e.id);
          return {
            experiments: exists ? s.experiments.map((x) => (x.id === e.id ? e : x)) : [e, ...s.experiments],
          };
        }),
      setInsightStatus: (id, status) =>
        set((s) => ({ insights: s.insights.map((i) => (i.id === id ? { ...i, status } : i)) })),
      setIdeaStatus: (id, status) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, status } : i)) })),
      addCompetitor: (c) => set((s) => ({ competitors: [c, ...s.competitors] })),
      removeCompetitor: (id) =>
        set((s) => ({ competitors: s.competitors.filter((c) => c.id !== id) })),
      upsertNotification: (n) =>
        set((s) => {
          const exists = s.notifications.find((x) => x.id === n.id);
          return {
            notifications: exists ? s.notifications.map((x) => (x.id === n.id ? n : x)) : [n, ...s.notifications],
          };
        }),
    }),
    {
      name: "navio-state-v1",
      // Only persist user-facing UI prefs + corrections-ish state; mock data
      // resets on schema change.
      partialize: (s) => ({
        platform: s.platform,
        language: s.language,
        todos: s.todos,
        experiments: s.experiments,
        insights: s.insights,
        ideas: s.ideas,
        ownProfiles: s.ownProfiles,
        workspace: s.workspace,
        notifications: s.notifications,
      }),
    }
  )
);
