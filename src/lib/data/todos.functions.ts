import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const startTodoTracking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: {
    todo_id: string;
    tracking_metric?: string;
    period_days?: number;
  }) => i)
  .handler(async ({ context, data }) => {
    const webhookUrl = process.env.N8N_WF07_URL;
    const secret = process.env.N8N_WF07_SECRET;
    if (!webhookUrl) throw new Error("N8N_WF07_URL not configured");
    if (!secret) throw new Error("N8N_WF07_SECRET not configured");

    const { supabase, userId } = context;

    const { data: member } = await supabase
      .schema("core")
      .from("workspace_members")
      .select("workspace_id")
      .eq("auth_user_id", userId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (!member) throw new Error("No active workspace found");

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-n8n-webhook-secret": secret,
      },
      body: JSON.stringify({
        workspace_id: member.workspace_id,
        auth_user_id: userId,
        todo_id: data.todo_id,
        tracking_metric: data.tracking_metric ?? "content_engagement",
        period_days: data.period_days ?? 14,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
