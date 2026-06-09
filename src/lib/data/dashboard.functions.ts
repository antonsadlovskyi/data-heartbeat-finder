import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureWorkspace(supabase: any, userId: string) {
  const { data: existing } = await supabase
    .from("workspaces").select("*").eq("owner_id", userId)
    .order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (existing) return existing;
  const { data: created, error } = await supabase
    .from("workspaces").insert({ owner_id: userId, project_name: "My Workspace" })
    .select().single();
  if (error) throw new Error(error.message);
  return created;
}

export const getDashboardData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const workspace = await ensureWorkspace(supabase, userId);
    const wsId = workspace.id;
    const [
      accountsR, snapshotsR, postsR, assetsR, commentsR,
      radarR, comparisonsR, actionsR, reportR, analysesR,
    ] = await Promise.all([
      supabase.from("social_accounts").select("*").eq("workspace_id", wsId),
      supabase.from("account_snapshots").select("*").eq("workspace_id", wsId),
      supabase.from("social_posts").select("*").eq("workspace_id", wsId),
      supabase.from("post_assets").select("asset_id").eq("workspace_id", wsId),
      supabase.from("post_comments").select("comment_id").eq("workspace_id", wsId),
      supabase.from("competitor_radar").select("*").eq("workspace_id", wsId),
      supabase.from("competitor_comparison").select("*").eq("workspace_id", wsId),
      supabase.from("action_plan").select("*").eq("workspace_id", wsId),
      supabase.from("workspace_report").select("*").eq("workspace_id", wsId).limit(1).maybeSingle(),
      supabase.from("account_analyses").select("*").eq("workspace_id", wsId),
    ]);
    return {
      workspace,
      accounts: accountsR.data ?? [],
      snapshots: snapshotsR.data ?? [],
      posts: postsR.data ?? [],
      assetCount: assetsR.data?.length ?? 0,
      commentCount: commentsR.data?.length ?? 0,
      radar: radarR.data ?? [],
      comparisons: comparisonsR.data ?? [],
      actions: actionsR.data ?? [],
      report: reportR.data ?? null,
      analyses: analysesR.data ?? [],
    };
  });

