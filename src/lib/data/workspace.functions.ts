import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns the current user's active workspace membership.
 * Reads from core.workspace_members using auth_user_id = auth.uid()
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
        "workspace_id, workspace_role, default_view_mode, allowed_view_modes, allowed_platforms, status"
      )
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    console.log("[getMyWorkspace] data:", data, "error:", error);
    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      workspaceId: data.workspace_id as string,
      workspaceRole: data.workspace_role as string,
      defaultViewMode: data.default_view_mode as string,
      allowedViewModes: data.allowed_view_modes as string[],
      allowedPlatforms: data.allowed_platforms as string[],
    };
  });
