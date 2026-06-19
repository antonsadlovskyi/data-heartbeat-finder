import { usePageObject } from "@/lib/use-page-object";
import { PageHeader } from "./PageHeader";
import { SectionRenderer } from "./SectionRenderer";
import type { SectionData } from "./sections";
import {
  RenderSkeleton,
  PendingState,
  EmptyState,
  ErrorState,
} from "./StateViews";

/**
 * The single render engine for every V2 page. Given a canonical `pageKey` it
 * reads the page object (role + platform aware) via `usePageObject` and resolves
 * to exactly one of: skeleton (initial load), error (query error /
 * data_status='failed' / payload.error_state), pending (backend still working),
 * empty (empty / not_connected), or the full page (header + sections).
 *
 * Sections are an object map (`section_key -> { title, component, items }`) and
 * are iterated via Object.entries — never treated as an array.
 */
export function PageObjectRenderer({ pageKey }: { pageKey: string }) {
  const {
    payload,
    isLoading,
    isError,
    error,
    isPending,
    dataStatus,
    fallbackUsed,
    isWorkspaceLoading,
    isWorkspaceError,
    workspaceError,
  } = usePageObject<any>(pageKey);

  // 1. Initial load (page object or workspace) → skeleton.
  if (isLoading || isWorkspaceLoading) {
    return <RenderSkeleton />;
  }

  // 2. Hard failures → error state.
  if (isWorkspaceError) {
    return (
      <ErrorState
        pageKey={pageKey}
        message={String((workspaceError as any)?.message ?? workspaceError)}
      />
    );
  }
  if (isError || dataStatus === "failed" || payload?.error_state) {
    return (
      <ErrorState
        pageKey={pageKey}
        errorState={payload?.error_state ?? null}
        message={isError ? String((error as any)?.message ?? error) : null}
      />
    );
  }

  // 3. Backend still working → pending.
  if (isPending) {
    return <PendingState pageKey={pageKey} dataStatus={dataStatus} />;
  }

  // 4. Empty / not_connected → empty state (prefer payload.empty_state).
  if (dataStatus === "empty" || dataStatus === "not_connected" || !payload) {
    return (
      <EmptyState
        pageKey={pageKey}
        dataStatus={dataStatus}
        emptyState={payload?.empty_state ?? null}
      />
    );
  }

  // 5. Ready / partial → header + sections.
  const sections = payload.sections;
  const sectionEntries: [string, SectionData][] =
    sections && typeof sections === "object" && !Array.isArray(sections)
      ? (Object.entries(sections) as [string, SectionData][])
      : [];

  return (
    <div className="space-y-6 max-w-7xl">
      <PageHeader
        summary={payload.summary}
        viewContext={payload.view_context}
        dataStatus={dataStatus}
        fallbackUsed={fallbackUsed}
      />

      <div className="space-y-4">
        {sectionEntries.map(([sectionKey, section]) => (
          <SectionRenderer
            key={sectionKey}
            sectionKey={sectionKey}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}
