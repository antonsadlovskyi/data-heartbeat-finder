
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TABLE public.page_objects (
  workspace_id uuid NOT NULL,
  page_key text NOT NULL,
  role_key text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, page_key, role_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_objects TO authenticated;
GRANT ALL ON public.page_objects TO service_role;

ALTER TABLE public.page_objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_objects rw"
ON public.page_objects
FOR ALL
TO authenticated
USING (public.owns_workspace(workspace_id))
WITH CHECK (public.owns_workspace(workspace_id));

CREATE TRIGGER page_objects_set_updated_at
BEFORE UPDATE ON public.page_objects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
