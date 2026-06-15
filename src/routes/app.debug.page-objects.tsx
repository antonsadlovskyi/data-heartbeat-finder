import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertTriangle, Database, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/debug/page-objects")({
  beforeLoad: () => {
    if (import.meta.env.PROD) {
      throw redirect({ to: "/app" });
    }
  },
  component: PageObjectsDebug,
  head: () => ({
    meta: [
      { title: "Debug Page Objects - FlyHigh" },
      {
        name: "description",
        content: "Developer-only page object read check for app.page_objects.",
      },
    ],
  }),
});

type DebugRole = "owner" | "marketer" | "smm";

type PageObjectRow = {
  page_object_id?: string | null;
  workspace_id?: string | null;
  page_key: string;
  role_key: string;
  page_title: string | null;
  data_status: string | null;
  generated_at: string | null;
  payload: unknown;
};

type SupabaseDebugError = {
  code?: string | null;
  message: string;
  details?: string | null;
  hint?: string | null;
};

type DebugQueryResult<TRow> = {
  data: TRow[] | null;
  error: SupabaseDebugError | null;
};

type SupabaseDebugQuery<TRow = Record<string, unknown>> = PromiseLike<DebugQueryResult<TRow>> & {
  eq: (column: string, value: string) => SupabaseDebugQuery<TRow>;
  limit: (count: number) => SupabaseDebugQuery<TRow>;
  order: (column: string, options: { ascending: boolean }) => SupabaseDebugQuery<TRow>;
};

type SupabaseDebugTable = {
  select: <TRow = Record<string, unknown>>(columns: string) => SupabaseDebugQuery<TRow>;
};

type SupabaseWithDebugSchemas = {
  schema: (schemaName: "app" | "core") => {
    from: (tableName: string) => SupabaseDebugTable;
  };
};

type AuthDiagnostics = {
  activeSession: boolean;
  userId: string | null;
  email: string | null;
  sessionError: string | null;
  userError: string | null;
};

type EnvDiagnostics = {
  viteSupabaseUrl: string;
  viteSupabasePublishableKey: string;
  viteTestWorkspaceId: string;
};

const ROLES: DebugRole[] = ["owner", "marketer", "smm"];
const FALLBACK_WORKSPACE_ID = "db79f43c-7f86-4e83-be43-12e097e0ada3";

function getDebugWorkspaceId() {
  const configured = import.meta.env.VITE_TEST_WORKSPACE_ID as string | undefined;
  if (configured?.trim()) return configured.trim();
  return import.meta.env.DEV ? FALLBACK_WORKSPACE_ID : "";
}

function getDebugSupabase() {
  return supabase as unknown as SupabaseWithDebugSchemas;
}

function maskEnv(value: string | undefined) {
  if (!value) return "present: false";
  if (value.length <= 12) return `present: true (${value.length} chars)`;
  return `present: true (${value.slice(0, 6)}...${value.slice(-4)})`;
}

function getEnvDiagnostics(): EnvDiagnostics {
  return {
    viteSupabaseUrl: maskEnv(import.meta.env.VITE_SUPABASE_URL as string | undefined),
    viteSupabasePublishableKey: maskEnv(
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined,
    ),
    viteTestWorkspaceId: maskEnv(import.meta.env.VITE_TEST_WORKSPACE_ID as string | undefined),
  };
}

async function fetchAppPageObjects(workspaceId: string, role: DebugRole) {
  if (!workspaceId) {
    throw new Error(
      "Missing VITE_TEST_WORKSPACE_ID. Development may use the built-in fallback, but production requires an explicit test workspace id.",
    );
  }

  const { data, error } = await getDebugSupabase()
    .schema("app")
    .from("page_objects")
    .select<PageObjectRow>("page_key, role_key, page_title, data_status, generated_at, payload")
    .eq("workspace_id", workspaceId)
    .eq("role_key", role)
    .order("page_key", { ascending: true });

  if (error) {
    throw new Error(
      `${error.message}${error.details ? ` Details: ${error.details}` : ""}${error.hint ? ` Hint: ${error.hint}` : ""}`,
    );
  }

  return (data ?? []) as PageObjectRow[];
}

async function fetchAuthDiagnostics(): Promise<AuthDiagnostics> {
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] =
    await Promise.all([supabase.auth.getSession(), supabase.auth.getUser()]);

  return {
    activeSession: !!sessionData.session,
    userId: userData.user?.id ?? sessionData.session?.user.id ?? null,
    email: userData.user?.email ?? sessionData.session?.user.email ?? null,
    sessionError: sessionError?.message ?? null,
    userError: userError?.message ?? null,
  };
}

async function probeAppPageObjectsAccess() {
  return getDebugSupabase()
    .schema("app")
    .from("page_objects")
    .select<PageObjectRow>("page_object_id, workspace_id, page_key, role_key")
    .limit(1);
}

async function fetchRawRoleQuery(workspaceId: string, role: DebugRole) {
  return getDebugSupabase()
    .schema("app")
    .from("page_objects")
    .select<PageObjectRow>("page_key, role_key, page_title, data_status, generated_at, payload")
    .eq("workspace_id", workspaceId)
    .eq("role_key", role)
    .order("page_key", { ascending: true });
}

async function fetchWorkspaceMembership(workspaceId: string, userId: string | null) {
  if (!userId) {
    return {
      data: null,
      error: {
        message: "No authenticated user id available. Cannot check core.workspace_members.",
      },
    } satisfies DebugQueryResult<Record<string, unknown>>;
  }

  return getDebugSupabase()
    .schema("core")
    .from("workspace_members")
    .select<Record<string, unknown>>("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);
}

function PageObjectsDebug() {
  const [role, setRole] = useState<DebugRole>("owner");
  const workspaceId = useMemo(() => getDebugWorkspaceId(), []);
  const envDiagnostics = useMemo(() => getEnvDiagnostics(), []);

  const authQuery = useQuery({
    queryKey: ["debug-auth-diagnostics"],
    queryFn: fetchAuthDiagnostics,
    retry: false,
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["debug-app-page-objects", workspaceId, role],
    queryFn: () => fetchAppPageObjects(workspaceId, role),
    retry: false,
  });

  const schemaProbeQuery = useQuery({
    queryKey: ["debug-app-page-objects-probe", workspaceId],
    queryFn: probeAppPageObjectsAccess,
    retry: false,
  });

  const rawRoleQuery = useQuery({
    queryKey: ["debug-app-page-objects-raw-role", workspaceId, role],
    queryFn: () => fetchRawRoleQuery(workspaceId, role),
    retry: false,
  });

  const workspaceMembershipQuery = useQuery({
    queryKey: ["debug-core-workspace-members", workspaceId, authQuery.data?.userId],
    queryFn: () => fetchWorkspaceMembership(workspaceId, authQuery.data?.userId ?? null),
    enabled: authQuery.isSuccess,
    retry: false,
  });

  const rows = data ?? [];
  const firstPayloadPreview = rows[0]?.payload ? JSON.stringify(rows[0].payload, null, 2) : "";
  const membershipRows = workspaceMembershipQuery.data?.data ?? [];

  return (
    <div className="space-y-6 max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="size-4" />
            Developer debug
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight mt-1">app.page_objects</h1>
          <p className="text-muted-foreground mt-1">
            Direct read check for the FlyHigh production schema.
          </p>
        </div>
        <Badge variant="outline" className="rounded-full font-mono">
          expected: 11 rows per role
        </Badge>
      </header>

      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <DebugField label="workspace_id" value={workspaceId || "not configured"} />
          <DebugField label="selected role" value={role} />
          <DebugField
            label="returned rows"
            value={isLoading ? "loading..." : String(rows.length)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ROLES.map((nextRole) => (
            <Button
              key={nextRole}
              type="button"
              size="sm"
              variant={role === nextRole ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setRole(nextRole)}
            >
              {nextRole}
            </Button>
          ))}
          {(isLoading || isFetching) && (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading app.page_objects...
            </span>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Auth diagnostics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Current browser Supabase session and frontend environment visibility.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <DebugField
            label="active session"
            value={authQuery.isLoading ? "loading..." : String(!!authQuery.data?.activeSession)}
          />
          <DebugField label="user.id" value={authQuery.data?.userId ?? "-"} />
          <DebugField label="user.email" value={authQuery.data?.email ?? "-"} />
          <DebugField label="VITE_SUPABASE_URL" value={envDiagnostics.viteSupabaseUrl} />
          <DebugField
            label="VITE_SUPABASE_PUBLISHABLE_KEY"
            value={envDiagnostics.viteSupabasePublishableKey}
          />
          <DebugField label="VITE_TEST_WORKSPACE_ID" value={envDiagnostics.viteTestWorkspaceId} />
        </div>
        {(authQuery.data?.sessionError || authQuery.data?.userError) && (
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
            {authQuery.data.sessionError && (
              <p>
                <b>Session error:</b> {authQuery.data.sessionError}
              </p>
            )}
            {authQuery.data.userError && (
              <p>
                <b>User error:</b> {authQuery.data.userError}
              </p>
            )}
          </div>
        )}
      </section>

      <DiagnosticsSection
        title="Schema/table access check"
        description="Lightweight probe: app.page_objects select page_object_id, workspace_id, page_key, role_key limit 1."
        isLoading={schemaProbeQuery.isLoading}
        result={schemaProbeQuery.data}
      />

      <DiagnosticsSection
        title="Raw role query diagnostics"
        description="Same app.page_objects role query, but with raw data/error displayed for diagnosis."
        isLoading={rawRoleQuery.isLoading || rawRoleQuery.isFetching}
        result={rawRoleQuery.data}
      />

      <DiagnosticsSection
        title="Workspace membership check"
        description="Checks core.workspace_members for the current user and selected workspace_id."
        isLoading={workspaceMembershipQuery.isLoading || workspaceMembershipQuery.isFetching}
        result={workspaceMembershipQuery.data}
      >
        {!workspaceMembershipQuery.isLoading &&
          !workspaceMembershipQuery.data?.error &&
          membershipRows.length === 0 && (
            <p className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
              Current user is probably not a workspace member.
            </p>
          )}
      </DiagnosticsSection>

      {error && (
        <section className="rounded-3xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
          <div className="flex items-center gap-2 font-semibold text-destructive">
            <AlertTriangle className="size-4" />
            Supabase error
          </div>
          <p className="mt-2 text-destructive/90">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </section>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <section className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
          No page objects returned. Possible RLS/Auth/workspace_members issue.
        </section>
      )}

      {rows.length > 0 && (
        <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 shadow-pop overflow-hidden">
          <div className="grid grid-cols-[1fr_1.5fr_0.8fr_1.2fr] gap-3 border-b border-border/60 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
            <span>page_key</span>
            <span>page_title</span>
            <span>data_status</span>
            <span>generated_at</span>
          </div>
          <div className="divide-y divide-border/60">
            {rows.map((row) => (
              <div
                key={`${row.role_key}:${row.page_key}`}
                className="grid grid-cols-[1fr_1.5fr_0.8fr_1.2fr] gap-3 px-4 py-3 text-sm"
              >
                <code className="truncate font-mono text-xs">{row.page_key}</code>
                <span className="truncate">{row.page_title ?? "-"}</span>
                <span className="truncate">{row.data_status ?? "-"}</span>
                <span className="truncate text-muted-foreground">{row.generated_at ?? "-"}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {firstPayloadPreview && (
        <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop">
          <h2 className="font-display text-xl font-semibold">First payload preview</h2>
          <pre className="mt-3 max-h-96 overflow-auto rounded-2xl border border-border/60 bg-background/60 p-4 text-xs leading-relaxed">
            {firstPayloadPreview}
          </pre>
        </section>
      )}
    </div>
  );
}

function DiagnosticsSection({
  title,
  description,
  isLoading,
  result,
  children,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  result?: DebugQueryResult<Record<string, unknown>> | DebugQueryResult<PageObjectRow>;
  children?: React.ReactNode;
}) {
  const rowCount = result?.data?.length ?? 0;
  const preview = result?.data?.[0] ? JSON.stringify(result.data[0], null, 2) : "";

  return (
    <section className="rounded-3xl bg-card/70 backdrop-blur-sm border border-border/60 p-5 shadow-pop space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Badge variant="outline" className="rounded-full font-mono">
          {isLoading ? "loading..." : `${rowCount} rows`}
        </Badge>
      </div>

      {result?.error && <SupabaseErrorDetails error={result.error} />}

      {!isLoading && result && !result.error && rowCount === 0 && (
        <p className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
          Query completed with no Supabase error, but returned 0 rows.
        </p>
      )}

      {children}

      {preview && (
        <pre className="max-h-72 overflow-auto rounded-2xl border border-border/60 bg-background/60 p-4 text-xs leading-relaxed">
          {preview}
        </pre>
      )}
    </section>
  );
}

function SupabaseErrorDetails({ error }: { error: SupabaseDebugError }) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
      <div className="flex items-center gap-2 font-semibold text-destructive">
        <AlertTriangle className="size-4" />
        Supabase error object
      </div>
      <div className="grid gap-2 md:grid-cols-2 mt-3">
        <DebugField label="error.code" value={error.code ?? "-"} />
        <DebugField label="error.message" value={error.message ?? "-"} />
        <DebugField label="error.details" value={error.details ?? "-"} />
        <DebugField label="error.hint" value={error.hint ?? "-"} />
      </div>
      <pre className="mt-3 max-h-56 overflow-auto rounded-xl border border-destructive/30 bg-background/60 p-3 text-xs">
        {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  );
}

function DebugField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1 font-semibold">
        {label}
      </div>
      <code className="block truncate font-mono text-xs">{value}</code>
    </div>
  );
}
