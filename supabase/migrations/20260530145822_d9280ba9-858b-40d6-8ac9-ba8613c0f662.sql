
CREATE TABLE public.notification_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  channel text NOT NULL,
  destination text NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_subscriptions TO authenticated;
GRANT ALL ON public.notification_subscriptions TO service_role;

ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ns rw" ON public.notification_subscriptions
  FOR ALL TO authenticated
  USING (public.owns_workspace(workspace_id))
  WITH CHECK (public.owns_workspace(workspace_id));

CREATE INDEX idx_ns_workspace ON public.notification_subscriptions(workspace_id);
