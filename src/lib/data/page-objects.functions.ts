import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getOwnerTemplate } from "@/lib/data/owner-templates";

const inputSchema = z.object({
  page_key: z.string().min(1).max(64),
  role_key: z.enum(["owner", "marketer", "smm"]),
});

export const getPageObject = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // Find the user's workspace (single-workspace model).
    const { data: ws, error: wsErr } = await supabase
      .from("workspaces")
      .select("id, project_name, niche")
      .limit(1)
      .maybeSingle();

    if (wsErr) throw new Error(wsErr.message);
    if (!ws) {
      return { payload: null, generated_at: null, workspace: null };
    }

    const { data: row, error } = await supabase
      .from("page_objects")
      .select("payload, generated_at, updated_at")
      .eq("workspace_id", ws.id)
      .eq("page_key", data.page_key)
      .eq("role_key", data.role_key)
      .maybeSingle();

    if (error) throw new Error(error.message);

    let payload = (row?.payload ?? null) as any;
    let generated_at = row?.generated_at ?? null;

    // Owner role always sees a meaningful view: if the backend has not written
    // a payload yet, fall back to the curated template (Ukrainian NMT-prep).
    if (!payload && data.role_key === "owner") {
      const tpl = getOwnerTemplate(data.page_key);
      if (tpl) {
        payload = tpl;
        generated_at = generated_at ?? new Date().toISOString();
      }
    }

    return {
      payload,
      generated_at,
      workspace: { id: ws.id, project_name: ws.project_name, niche: ws.niche },
    };
  });