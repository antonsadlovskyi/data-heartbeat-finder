import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Canonical V2 platforms backed by app.page_objects (see memory: navio-v2-contract). */
export const PLATFORMS = ["all", "instagram", "tiktok", "threads", "x"] as const;
export type Platform = (typeof PLATFORMS)[number];

const inputSchema = z.object({
  page_key: z.string().min(1).max(64),
  role_key: z.enum(["owner", "marketer", "smm"]),
  workspace_id: z.string().uuid(),
  platform: z.enum(PLATFORMS).default("all"),
  language: z.string().min(2).max(8).default("uk"),
});

/**
 * Page object payload (schema_version `page_object_v2`). Typed loosely here —
 * the strict per-component typing lands with PageObjectRenderer in Session 3.
 */
export interface PageObjectPayload {
  schema_version?: string;
  meta?: Record<string, any>;
  view_context?: Record<string, any>;
  summary?: Record<string, any>;
  score?: Record<string, any>;
  sections?: Record<string, any>;
  evidence_context?: Record<string, any>;
  actions?: any[];
  empty_state?: Record<string, any> | null;
  error_state?: Record<string, any> | null;
  [key: string]: any;
}

/**
 * Full envelope returned by `app.get_page_object`. The RPC always returns a
 * single jsonb object (never multiple rows) and never throws — missing rows
 * come back with `data_status: 'empty'` / `status: 'missing'` and an empty_state.
 */
export interface PageObjectRpcResponse {
  status: string | null;
  payload: PageObjectPayload | null;
  data_status: string | null;
  resolved_platform: string | null;
  requested_platform: string | null;
  fallback_used: boolean;
  role_view: string | null;
  role_key: string | null;
  page_key: string | null;
  page_title: string | null;
  language: string | null;
  generated_at: string | null;
  updated_at: string | null;
  page_version: string | null;
  object_version: string | null;
  page_object_id: string | null;
  analysis_job_id: string | null;
  workspace_id: string | null;
  run_label?: string | null;
  section_key?: string | null;
}

export interface WorkspaceMeta {
  id: string;
  project_name: string | null;
  niche: string | null;
}

export type GetPageObjectResult = PageObjectRpcResponse & {
  workspace: WorkspaceMeta | null;
};

export const getPageObject = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data, context }): Promise<GetPageObjectResult> => {
    const { supabase } = context;

    // Workspace meta (project_name/niche) for page headers — separate from the
    // page object itself, which the RPC owns.
    const { data: ws, error: wsErr } = await supabase
      .schema("core")
      .from("workspaces")
      .select("workspace_id, project_name, niche")
      .eq("workspace_id", data.workspace_id)
      .maybeSingle();

    if (wsErr) throw new Error(wsErr.message);

    const workspace: WorkspaceMeta | null = ws
      ? { id: ws.workspace_id, project_name: ws.project_name, niche: ws.niche }
      : null;

    // Single source of truth for the UI: one RPC, platform + language aware,
    // platform-fallback handled server-side. Returns exactly one object.
    const { data: rpc, error } = await (supabase.schema("app") as any).rpc(
      "get_page_object",
      {
        p_workspace_id: data.workspace_id,
        p_page_key: data.page_key,
        p_role_key: data.role_key,
        p_platform: data.platform,
        p_language: data.language,
      }
    );

    if (error) throw new Error(error.message);

    const res = (rpc ?? {}) as Partial<PageObjectRpcResponse>;

    return {
      status: res.status ?? null,
      payload: res.payload ?? null,
      data_status: res.data_status ?? null,
      resolved_platform: res.resolved_platform ?? null,
      requested_platform: res.requested_platform ?? data.platform,
      fallback_used: res.fallback_used ?? false,
      role_view: res.role_view ?? null,
      role_key: res.role_key ?? data.role_key,
      page_key: res.page_key ?? data.page_key,
      page_title: res.page_title ?? null,
      language: res.language ?? data.language,
      generated_at: res.generated_at ?? null,
      updated_at: res.updated_at ?? null,
      page_version: res.page_version ?? null,
      object_version: res.object_version ?? null,
      page_object_id: res.page_object_id ?? null,
      analysis_job_id: res.analysis_job_id ?? null,
      workspace_id: res.workspace_id ?? data.workspace_id,
      run_label: res.run_label ?? null,
      section_key: res.section_key ?? null,
      workspace,
    };
  });
