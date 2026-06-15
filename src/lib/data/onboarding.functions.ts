import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const db = (supabase: any) => supabase as any;

interface OnboardingInput {
  project_name: string;
  niche: string;
  target_audience: string;
  product_description: string;
  main_goal: string;
  report_language: "uk" | "en" | "de";
  own_accounts: { platform: string; username: string; profile_url?: string }[];
  competitor_accounts: { platform: string; username: string }[];
}

export const submitOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: OnboardingInput) => i)
  .handler(async ({ context, data }) => {
    const webhookUrl = process.env.N8N_WF01_WEBHOOK_URL;
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (!webhookUrl) throw new Error("N8N_WF01_WEBHOOK_URL not configured");
    if (!secret) throw new Error("N8N_WEBHOOK_SECRET not configured");

    const { supabase, userId } = context;
    const { data: { user } } = await supabase.auth.getUser();

    const email = user?.email ?? "";
    const displayName = user?.user_metadata?.full_name ?? user?.email ?? "";

    const payload = {
      contract_version: "onboarding_v1",
      source: {
        client: "web_app",
        environment: process.env.NODE_ENV === "production" ? "production" : "development",
        submitted_at: new Date().toISOString(),
        locale: data.report_language,
        timezone: "Europe/Kiev",
      },
      auth: {
        auth_user_id: userId,
        email,
      },
      user: {
        display_name: displayName,
        company_name: null,
        role_in_company: "owner",
      },
      workspace: {
        project_name: data.project_name,
        niche: data.niche,
        country: "Ukraine",
        timezone: "Europe/Kiev",
        target_audience: data.target_audience,
        product_description: data.product_description,
        main_goal: data.main_goal,
        business_stage: null,
        website_url: null,
        additional_context: null,
      },
      languages: {
        report_language: data.report_language,
        content_language: data.report_language,
        interface_language: data.report_language,
      },
      accounts: {
        own_accounts: data.own_accounts,
        competitor_accounts: data.competitor_accounts,
      },
      analysis_request: {
        requested_platforms: ["instagram"],
        enabled_role_views: ["owner", "marketer", "smm"],
        primary_role_view: "owner",
        analysis_depth: "standard",
        trigger_initial_analysis: true,
        requested_scope: {
          posts_per_account: 10,
          include_video_transcription: true,
          include_media_description: true,
          include_comments: true,
          include_profile_stats: true,
        },
      },
      plan: {
        plan_id: "one_time_analysis",
        payment_status: "paid",
        subscription_status: "active",
        billing_provider: "internal_mvp",
      },
      run_initial_refresh: true,
      notification_dry_run: true,
    };

    // 1. INSERT до app.onboarding_submissions перед відправкою
    const { data: submission, error: insertErr } = await db(supabase)
      .schema("app")
      .from("onboarding_submissions")
      .insert({
        email,
        display_name: displayName,
        project_name: data.project_name,
        payload,
        status: "pending",
      })
      .select("onboarding_submission_id")
      .single();

    if (insertErr) {
      console.error("[onboarding] INSERT error:", insertErr.message);
    }

    const submissionId: string | null = submission?.onboarding_submission_id ?? null;

    // 2. POST до n8n webhook
    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-FlyHigh-Webhook-Secret": secret,
        },
        body: JSON.stringify(payload),
      });
    } catch (fetchErr: any) {
      if (submissionId) {
        await db(supabase).schema("app").from("onboarding_submissions")
          .update({ status: "error", error_message: fetchErr?.message ?? "fetch failed" })
          .eq("onboarding_submission_id", submissionId);
      }
      return { ok: false as const, error: `Network error: ${fetchErr?.message ?? "unknown"}` };
    }

    if (!res.ok) {
      const errText = `HTTP ${res.status}`;
      if (submissionId) {
        await db(supabase).schema("app").from("onboarding_submissions")
          .update({ status: "error", error_message: errText })
          .eq("onboarding_submission_id", submissionId);
      }
      return { ok: false as const, error: errText };
    }

    const json = await res.json() as
      | { ok: true; status: string; workspace_id: string; app_user_id: string; run_label: string;
          frontend_next_step: { action: string; workspace_id: string; redirect_to: string } }
      | { ok: false; status?: string; error: string };

    // 3. UPDATE статус + run_label
    if (submissionId) {
      await db(supabase).schema("app").from("onboarding_submissions")
        .update({
          status: json.ok ? "submitted" : "error",
          run_label: json.ok ? json.run_label : null,
          error_message: json.ok ? null : json.error,
        })
        .eq("onboarding_submission_id", submissionId);
    }

    return json;
  });
