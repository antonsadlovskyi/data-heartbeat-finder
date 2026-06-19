import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPageObject } from "@/lib/data/page-objects.functions";
import { useRole } from "@/lib/role-store";
import { usePlatform } from "@/lib/platform-store";
import { useWorkspace } from "@/lib/hooks/use-workspace";

/**
 * Terminal data_status values: the page object is fully resolved, nothing more
 * is coming from the backend, so stop polling. Anything outside this set is a
 * transitional backend state (e.g. generating/processing) and is polled.
 */
const TERMINAL_STATUSES = new Set([
  "ready",
  "partial",
  "empty",
  "not_connected",
  "failed",
]);

export function usePageObject<T = any>(pageKey: string) {
  const role = useRole((s) => s.role);
  const platform = usePlatform((s) => s.platform);
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace();
  const fetcher = useServerFn(getPageObject);

  const query = useQuery({
    queryKey: ["page-object", pageKey, role, platform, workspaceId],
    queryFn: () =>
      fetcher({
        data: {
          page_key: pageKey,
          role_key: role,
          platform,
          language: "uk",
          workspace_id: workspaceId!,
        },
      } as any),
    enabled: !!workspaceId && !isWorkspaceLoading,
    refetchInterval: (q) => {
      const status = (q.state.data as any)?.data_status as string | null | undefined;
      // No data yet, or a terminal state → don't poll. Only transitional
      // backend states keep polling.
      if (!status || TERMINAL_STATUSES.has(status)) return false;
      return 30000;
    },
  });

  const dataStatus = (query.data as any)?.data_status ?? null;
  // "Pending" only while the backend is still working — not for terminal
  // states like partial / not_connected, which render their own views.
  const isPending = dataStatus != null && !TERMINAL_STATUSES.has(dataStatus);

  const { isError: isWorkspaceError, error: workspaceError } = useWorkspace();

  return {
    ...query,
    role,
    platform,
    workspaceId,
    isWorkspaceLoading,
    isWorkspaceError,
    workspaceError,
    isPending,
    dataStatus,
    resolvedPlatform: (query.data as any)?.resolved_platform ?? null,
    fallbackUsed: (query.data as any)?.fallback_used ?? false,
    status: (query.data as any)?.status ?? null,
    payload: (query.data?.payload ?? null) as T | null,
    generatedAt: query.data?.generated_at ?? null,
    workspace: query.data?.workspace ?? null,
  };
}
