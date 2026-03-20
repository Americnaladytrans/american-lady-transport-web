import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Rss } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string;
}

const BlogPage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Blog | American Lady Transport"
        description="Weekly freight industry reports and logistics insights from American Lady Transport."
        canonicalPath="/blog"
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Industry Insights
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Weekly reports on freight markets, logistics trends, and industry news.
            </p>
            <a
              href="https://zmyeyyzhuwzdpjinecmg.supabase.co/functions/v1/rss-feed"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-accent hover:text-accent/80 transition-colors"
              title="Subscribe via RSS"
            >
              <Rss className="w-4 h-4" /> Subscribe via RSS
            </a>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 shadow-elegant animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : !posts?.length ? (
            <p className="text-center text-muted-foreground text-lg">
              No posts yet. Check back soon!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-card rounded-lg p-6 shadow-elegant hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
