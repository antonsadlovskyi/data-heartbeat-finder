import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyWorkspace } from "@/lib/data/workspace.functions";

/**
 * Hook to get the current user's active workspace from Supabase.
 * Reads core.workspace_members WHERE auth_user_id = auth.uid()
 */
export function useWorkspace() {
  const fetcher = useServerFn(getMyWorkspace);

  const query = useQuery({
    queryKey: ["my-workspace"],
    queryFn: () => fetcher(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    workspaceId: query.data?.workspaceId ?? null,
    workspaceRole: query.data?.workspaceRole ?? null,
    defaultViewMode: query.data?.defaultViewMode ?? null,
    allowedViewModes: query.data?.allowedViewModes ?? [],
    allowedPlatforms: query.data?.allowedPlatforms ?? [],
    onboardingStatus: query.data?.onboardingStatus ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
