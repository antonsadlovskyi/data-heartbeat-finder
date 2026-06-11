import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// types.ts is not fully regenerated – use any for tables outside generated types
const db = (supabase: any) => supabase as any;

interface OnboardingInput {
  project_name: string;
  niche: string;
  report_language: "uk" | "en" | "de";
  own_accounts: { platform: string; username: string }[];
  competitor_accounts: { platform: string; username: string }[];
}

export const submitOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: OnboardingInput) => i)
  .handler(async ({ context, data }) => {
    const webhookUrl = process.env.N8N_WF01_WEBHOOK_URL;
    if (!webhookUrl) throw new Error("N8N_WF01_WEBHOOK_URL not configured");

    const { supabase } = context;
    const { data: { user } } = await supabase.auth.getUser();

    const email = user?.email ?? "";
    const displayName = user?.user_metadata?.full_name ?? user?.email ?? "";

    const payload = {
      email,
      display_name: displayName,
      payment_status: "paid",
      plan_id: "one_time_analysis",
      project_name: data.project_name,
      niche: data.niche,
      report_language: data.report_language,
      own_accounts: data.own_accounts,
      competitor_accounts: data.competitor_accounts,
    };

    // -----------------------------------------------------------------------
    // 1. INSERT в app.onboarding_submissions перед відправкою до n8n
    // -----------------------------------------------------------------------
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
      // Не блокуємо – продовжуємо навіть якщо INSERT не вдався
    }

    const submissionId: string | null = submission?.onboarding_submission_id ?? null;

    // -----------------------------------------------------------------------
    // 2. POST до n8n webhook
    // -----------------------------------------------------------------------
    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      | { ok: true; workspace_id: string; run_label: string }
      | { ok: false; status?: string; error: string };

    // -----------------------------------------------------------------------
    // 3. Оновлюємо запис: статус + run_label від n8n
    // -----------------------------------------------------------------------
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
