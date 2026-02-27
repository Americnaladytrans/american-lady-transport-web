ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of published posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Allow service role full access" ON public.blog_posts
  FOR ALL USING (true) WITH CHECK (true);