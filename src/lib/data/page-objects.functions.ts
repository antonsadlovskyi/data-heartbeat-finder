import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

    return {
      payload: (row?.payload ?? null) as any,
      generated_at: row?.generated_at ?? null,
      workspace: { id: ws.id, project_name: ws.project_name, niche: ws.niche },
    };
  });