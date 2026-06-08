import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPageObject } from "@/lib/data/page-objects.functions";
import { useRole } from "@/lib/role-store";
import { useWorkspace } from "@/lib/hooks/use-workspace";

export function usePageObject<T = any>(pageKey: string) {
  const role = useRole((s) => s.role);
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace();
  const fetcher = useServerFn(getPageObject);

  const query = useQuery({
    queryKey: ["page-object", pageKey, role, workspaceId],
    queryFn: () =>
      fetcher({
        data: {
          page_key: pageKey,
          role_key: role,
          workspace_id: workspaceId!,
        },
      } as any),
    enabled: !!workspaceId && !isWorkspaceLoading,
    refetchInterval: (q) => {
      const status = (q.state.data as any)?.data_status;
      return status !== "ready" ? 30000 : false;
    },
  });

  const dataStatus = (query.data as any)?.data_status ?? null;
  const isPending = dataStatus !== null && dataStatus !== "ready";

  const { isError: isWorkspaceError, error: workspaceError } = useWorkspace();

  return {
    ...query,
    role,
    workspaceId,
    isWorkspaceLoading,
    isWorkspaceError,
    workspaceError,
    isPending,
    dataStatus,
    payload: (query.data?.payload ?? null) as T | null,
    generatedAt: query.data?.generated_at ?? null,
    workspace: query.data?.workspace ?? null,
  };
}
