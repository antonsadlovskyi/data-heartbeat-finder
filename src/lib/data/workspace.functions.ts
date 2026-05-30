import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Returns the current user's active workspace, creating an empty one on first call.
 */
export const getOrCreateWorkspace = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: existing, error: selErr } = await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (selErr) throw new Error(selErr.message);
    if (existing) return existing;

    const { data: created, error: insErr } = await supabase
      .from("workspaces")
      .insert({ owner_id: userId, project_name: "My Workspace" })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);
    return created;
  });