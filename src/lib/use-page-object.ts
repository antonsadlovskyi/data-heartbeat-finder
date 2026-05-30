import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPageObject } from "@/lib/data/page-objects.functions";
import { useRole } from "@/lib/role-store";

export function usePageObject<T = any>(pageKey: string) {
  const role = useRole((s) => s.role);
  const fetcher = useServerFn(getPageObject);
  const query = useQuery({
    queryKey: ["page-object", pageKey, role],
    queryFn: () => fetcher({ data: { page_key: pageKey, role_key: role } } as any),
  });
  return {
    ...query,
    role,
    payload: (query.data?.payload ?? null) as T | null,
    generatedAt: query.data?.generated_at ?? null,
    workspace: query.data?.workspace ?? null,
  };
}