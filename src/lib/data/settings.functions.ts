import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureWorkspace(supabase: any, userId: string) {
  const { data: existing } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return existing;
  const { data: created, error } = await supabase
    .from("workspaces")
    .insert({ owner_id: userId, project_name: "My Workspace" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return created;
}

export const getUserSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const workspace = await ensureWorkspace(supabase, userId);
    const [profileR, accountsR, notifsR] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("social_accounts").select("*").eq("workspace_id", workspace.id),
      supabase
        .from("notification_subscriptions")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),
    ]);
    return {
      workspace,
      profile: profileR.data ?? null,
      accounts: accountsR.data ?? [],
      notifications: notifsR.data ?? [],
    };
  });

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
    const ws = await ensureWorkspace(supabase, userId);
    const patch: Record<string, any> = {};
    for (const k of [
      "project_name",
      "niche",
      "product_description",
      "target_audience",
      "main_goal",
      "country",
      "language",
      "notes",
    ] as const) {
      if (data[k] !== undefined) patch[k] = data[k];
    }
    if (Object.keys(patch).length === 0) return ws;
    const { data: updated, error } = await supabase
      .from("workspaces")
      .update(patch)
      .eq("id", ws.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

export const updateUserProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { display_name?: string; avatar_url?: string }) => i)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const patch: Record<string, any> = {};
    if (data.display_name !== undefined) patch.display_name = data.display_name;
    if (data.avatar_url !== undefined) patch.avatar_url = data.avatar_url;
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (!existing) {
      const { data: created, error } = await supabase
        .from("profiles")
        .insert({ id: userId, ...patch })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return created;
    }
    const { data: updated, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

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
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const ws = await ensureWorkspace(supabase, userId);
    const row = {
      workspace_id: ws.id,
      channel: data.channel,
      destination: data.destination,
      frequency: data.frequency ?? "weekly",
      active: data.active ?? true,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { data: updated, error } = await supabase
        .from("notification_subscriptions")
        .update(row)
        .eq("id", data.id)
        .eq("workspace_id", ws.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }
    const { data: inserted, error } = await supabase
      .from("notification_subscriptions")
      .insert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });

export const deleteNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const ws = await ensureWorkspace(supabase, userId);
    const { error } = await supabase
      .from("notification_subscriptions")
      .delete()
      .eq("id", data.id)
      .eq("workspace_id", ws.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSocialAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { account_id: string }) => i)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const ws = await ensureWorkspace(supabase, userId);
    const { error } = await supabase
      .from("social_accounts")
      .delete()
      .eq("account_id", data.account_id)
      .eq("workspace_id", ws.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });