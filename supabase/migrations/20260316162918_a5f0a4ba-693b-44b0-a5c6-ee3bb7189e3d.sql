
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  view_count bigint NOT NULL DEFAULT 0,
  UNIQUE(page_path)
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.page_views FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON public.page_views FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.page_views FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.increment_page_view(p_path text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count bigint;
BEGIN
  INSERT INTO public.page_views (page_path, view_count)
  VALUES (p_path, 1)
  ON CONFLICT (page_path)
  DO UPDATE SET view_count = page_views.view_count + 1
  RETURNING view_count INTO current_count;
  RETURN current_count;
END;
$$;
