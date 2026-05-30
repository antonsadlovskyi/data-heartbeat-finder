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

// Seed the current user's workspace from the bundled mock dataset.
export const seedWorkspaceFromMock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const mod = await import("./apify-dataset.json");
    const ds: any = (mod as any).default ?? mod;
    const ws = await ensureWorkspace(supabase, userId);
    const wsId = ws.id;

    const prefix = `seed_${wsId.slice(0, 8)}_`;
    const pid = (s: string) => `${prefix}${s}`;
    const ts = (s: any) => (s ? String(s).replace(" ", "T") + (String(s).includes("T") ? "" : "Z") : null);

    // patch workspace name from mock
    const mockWs = ds["02_workspaces"]?.[0];
    if (mockWs) {
      await supabase.from("workspaces").update({
        project_name: mockWs.project_name,
        niche: mockWs.niche,
        product_description: mockWs.product_description,
        target_audience: mockWs.target_audience,
        main_goal: mockWs.main_goal,
        country: mockWs.country,
        language: mockWs.language,
      }).eq("id", wsId);
    }

    const accounts = (ds["03_social_accounts"] ?? []).map((a: any) => ({
      ...a, account_id: pid(a.account_id), workspace_id: wsId,
      last_scraped_at: ts(a.last_scraped_at),
    }));
    if (accounts.length) await supabase.from("social_accounts").upsert(accounts);

    const snaps = (ds["04_account_snapshots"] ?? []).map((x: any) => ({
      ...x, snapshot_id: pid(x.snapshot_id), account_id: pid(x.account_id), workspace_id: wsId, date: ts(x.date),
    }));
    if (snaps.length) await supabase.from("account_snapshots").upsert(snaps);

    const posts = (ds["05_social_posts"] ?? []).map((p: any) => ({
      ...p, post_id: pid(p.post_id), account_id: pid(p.account_id), workspace_id: wsId, published_at: ts(p.published_at),
    }));
    if (posts.length) await supabase.from("social_posts").upsert(posts);

    const assets = (ds["06_post_assets"] ?? []).map((a: any) => ({
      ...a, asset_id: pid(a.asset_id), post_id: pid(a.post_id), workspace_id: wsId,
    }));
    if (assets.length) await supabase.from("post_assets").upsert(assets);

    const comments = (ds["07_post_comments"] ?? []).map((c: any) => ({
      ...c, comment_id: pid(c.comment_id), post_id: pid(c.post_id), workspace_id: wsId, published_at: ts(c.published_at),
    }));
    if (comments.length) await supabase.from("post_comments").upsert(comments);

    const accAn = (ds["10_account_analyses"] ?? []).map((a: any) => ({
      ...a, account_analysis_id: pid(a.account_analysis_id), account_id: pid(a.account_id), workspace_id: wsId,
      period_start: ts(a.period_start), period_end: ts(a.period_end),
    }));
    if (accAn.length) await supabase.from("account_analyses").upsert(accAn);

    const radar = (ds["11_competitor_radar"] ?? []).map((r: any) => ({
      ...r, radar_id: pid(r.radar_id), account_id: pid(r.account_id), workspace_id: wsId,
    }));
    if (radar.length) await supabase.from("competitor_radar").upsert(radar);

    const outcomes = (ds["12_best_outcomes"] ?? []).map((o: any) => ({
      ...o, outcome_id: pid(o.outcome_id), post_id: pid(o.post_id), account_id: pid(o.account_id), workspace_id: wsId,
    }));
    if (outcomes.length) await supabase.from("best_outcomes").upsert(outcomes);

    const comps = (ds["13_competitor_comparison"] ?? []).map((c: any) => ({
      ...c, comparison_id: pid(c.comparison_id),
      own_account_id: c.own_account_id ? pid(c.own_account_id) : null,
      competitor_account_id: c.competitor_account_id ? pid(c.competitor_account_id) : null,
      workspace_id: wsId, period_start: ts(c.period_start), period_end: ts(c.period_end),
    }));
    if (comps.length) await supabase.from("competitor_comparison").upsert(comps);

    const reports = (ds["14_workspace_report"] ?? []).map((r: any) => ({
      ...r, report_id: pid(r.report_id), workspace_id: wsId,
      report_date: ts(r.report_date), period_start: ts(r.period_start), period_end: ts(r.period_end),
    }));
    if (reports.length) await supabase.from("workspace_report").upsert(reports);

    const actions = (ds["15_action_plan"] ?? []).map((a: any) => ({
      ...a, action_id: pid(a.action_id), workspace_id: wsId, deadline: ts(a.deadline),
    }));
    if (actions.length) await supabase.from("action_plan").upsert(actions);

    return { ok: true, workspaceId: wsId };
  });