import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// types.ts is not fully regenerated – cast to any for tables outside
// the generated type definitions (app_users, social_accounts, workspace_settings)
const db = (supabase: any) => supabase as any;

// ---------------------------------------------------------------------------
// Internal helper – get workspace + app_user_id for the authed user
// ---------------------------------------------------------------------------
async function getWorkspaceForUser(supabase: any, userId: string) {
  const { data: member, error: memberErr } = await supabase
    .schema("core")
    .from("workspace_members")
    .select("workspace_id, app_user_id")
    .eq("auth_user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (memberErr) throw new Error(memberErr.message);
  if (!member) throw new Error("No active workspace found for this user");

  const { data: ws, error: wsErr } = await supabase
    .schema("core")
    .from("workspaces")
    .select("*")
    .eq("workspace_id", member.workspace_id)
    .maybeSingle();

  if (wsErr) throw new Error(wsErr.message);
  if (!ws) throw new Error("Workspace record not found");

  return { ws, appUserId: member.app_user_id as string | null };
}

// ---------------------------------------------------------------------------
// getUserSettings
// ---------------------------------------------------------------------------
export const getUserSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { ws, appUserId } = await getWorkspaceForUser(supabase, userId);

    // Profile – core.app_users (linked via workspace_members.app_user_id)
    let profile: { display_name: string | null; email: string | null } | null = null;
    if (appUserId) {
      const { data: appUser } = await db(supabase)
        .schema("core")
        .from("app_users")
        .select("display_name, email")
        .eq("app_user_id", appUserId)
        .maybeSingle();
      if (appUser) profile = appUser;
    }

    // Social accounts – core.social_accounts
    const { data: accounts } = await db(supabase)
      .schema("core")
      .from("social_accounts")
      .select("*")
      .eq("workspace_id", ws.workspace_id);

    return {
      workspace: ws,
      profile: profile ?? { display_name: null, email: null },
      accounts: (accounts ?? []) as any[],
      // notification_subscriptions table does not exist yet
      notifications: [] as any[],
    };
  });

// ---------------------------------------------------------------------------
// updateWorkspaceSettings
// ---------------------------------------------------------------------------
export const updateWorkspaceSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (i: {
      project_name?: string;
      niche?: string;
      product_description?: string;
      target_audience?: string;
      main_goal?: string;
      country?: string;
      language?: string;
      notes?: string;
    }) => i,
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { ws } = await getWorkspaceForUser(supabase, userId);

    const allowed = [
      "project_name", "niche", "product_description",
      "target_audience", "main_goal", "country", "language",
    ] as const;
    const patch: Record<string, any> = {};
    for (const k of allowed) {
      if (data[k] !== undefined) patch[k] = data[k];
    }
    if (Object.keys(patch).length === 0) return ws;

    const { data: updated, error } = await db(supabase)
      .schema("core")
      .from("workspaces")
      .update(patch)
      .eq("workspace_id", ws.workspace_id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

// ---------------------------------------------------------------------------
// updateUserProfile – updates display_name in core.app_users
// ---------------------------------------------------------------------------
export const updateUserProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { display_name?: string; avatar_url?: string }) => i)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { appUserId } = await getWorkspaceForUser(supabase, userId);
    if (!appUserId) throw new Error("No app_user_id linked to this auth user");

    const patch: Record<string, any> = {};
    if (data.display_name !== undefined) patch.display_name = data.display_name;

    if (Object.keys(patch).length === 0) return { ok: true };

    const { data: updated, error } = await db(supabase)
      .schema("core")
      .from("app_users")
      .update(patch)
      .eq("app_user_id", appUserId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

// ---------------------------------------------------------------------------
// upsertNotification / deleteNotification – stub (no backing table yet)
// TODO: create app.notification_subscriptions and implement properly
// ---------------------------------------------------------------------------
export const upsertNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (i: {
      id?: string;
      channel: "telegram" | "email";
      destination: string;
      frequency?: "daily" | "weekly" | "urgent_only";
      active?: boolean;
    }) => i,
  )
  .handler(async () => {
    return { ok: true, stub: true };
  });

export const deleteNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async () => {
    return { ok: true, stub: true };
  });

// ---------------------------------------------------------------------------
// deleteSocialAccount
// ---------------------------------------------------------------------------
export const deleteSocialAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { account_id: string }) => i)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { ws } = await getWorkspaceForUser(supabase, userId);

    const { error } = await db(supabase)
      .schema("core")
      .from("social_accounts")
      .delete()
      .eq("account_id", data.account_id)
      .eq("workspace_id", ws.workspace_id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
