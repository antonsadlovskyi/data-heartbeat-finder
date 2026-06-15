import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const db = (supabase: any) => supabase as any;

async function getWorkspaceId(supabase: any, userId: string): Promise<string> {
  const { data, error } = await supabase
    .schema("core")
    .from("workspace_members")
    .select("workspace_id")
    .eq("auth_user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (error || !data) throw new Error("No active workspace found");
  return data.workspace_id;
}

async function callN8nWebhook(url: string, secret: string, body: object): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-n8n-webhook-secret": secret,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const getInsightsFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const workspace_id = await getWorkspaceId(supabase, userId);
    const { data, error } = await db(supabase)
      .schema("app")
      .from("insights_feed")
      .select(
        "insight_id, title, short_summary, detailed_explanation, priority, " +
        "apply_status, confidence_score, impact_score, effort_score, " +
        "recommended_action, expected_effect, semantic_key, platform, " +
        "recommended_tracking_metric, recommended_tracking_period_days"
      )
      .eq("workspace_id", workspace_id)
      .order("impact_score", { ascending: false });
    if (error) throw new Error(error.message);
    return { insights: (data ?? []) as any[] };
  });

export const applyInsight = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { insight_id: string; role_key: "owner" | "marketer" | "smm" }) => i)
  .handler(async ({ context, data }) => {
    const webhookUrl = process.env.N8N_WF06_URL;
    const secret = process.env.N8N_WF06_SECRET;
    if (!webhookUrl) throw new Error("N8N_WF06_URL not configured");
    if (!secret) throw new Error("N8N_WF06_SECRET not configured");
    const { supabase, userId } = context;
    const workspace_id = await getWorkspaceId(supabase, userId);
    return callN8nWebhook(webhookUrl, secret, {
      workspace_id,
      auth_user_id: userId,
      insight_id: data.insight_id,
      role_key: data.role_key,
    });
  });
