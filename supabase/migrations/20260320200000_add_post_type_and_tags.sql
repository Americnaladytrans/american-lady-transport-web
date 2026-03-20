-- Add post_type column to distinguish article types
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'weekly-report';

-- Add tags column as a text array
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Tag existing weekly freight reports
UPDATE public.blog_posts
SET post_type = 'weekly-report',
    tags = ARRAY['weekly-report', 'market-pulse', 'rates', 'fuel', 'fraud']
WHERE title LIKE 'Weekly Freight Report%';

-- Create index on post_type for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_post_type ON public.blog_posts (post_type);
