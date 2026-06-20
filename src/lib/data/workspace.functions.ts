import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns the current user's active workspace membership + onboarding_status.
 * Reads from core.workspace_members joined with core.workspaces.
 */
export const getMyWorkspace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    console.log("[getMyWorkspace] userId from token:", userId);

    const { data, error } = await supabase
      .schema("core")
      .from("workspace_members")
      .select(
        "workspace_id, workspace_role, default_view_mode, allowed_view_modes, allowed_platforms, status, workspace:workspace_id(onboarding_status)"
      )
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    console.log("[getMyWorkspace] data:", data, "error:", error);
    if (error) throw new Error(error.message);
    if (!data) return null;

    const ws = data.workspace as { onboarding_status: string } | null;

    return {
      workspaceId: data.workspace_id as string,
      workspaceRole: data.workspace_role as string,
      defaultViewMode: data.default_view_mode as string,
      allowedViewModes: data.allowed_view_modes as string[],
      allowedPlatforms: data.allowed_platforms as string[],
      onboardingStatus: ws?.onboarding_status ?? null,
    };
  });

/**
 * DEV/TEST: marks the current user's workspace as paid → analysis_starting.
 */
export const markWorkspaceAsPaid = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;

    const { data: member, error: memberError } = await supabase
      .schema("core")
      .from("workspace_members")
      .select("workspace_id")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (memberError) throw new Error(memberError.message);
    if (!member) throw new Error("No active workspace found");

    const { error } = await supabase
      .schema("core")
      .from("workspaces")
      .update({ onboarding_status: "analysis_starting" })
      .eq("workspace_id", member.workspace_id);

    if (error) throw new Error(error.message);

    return { ok: true };
  });
