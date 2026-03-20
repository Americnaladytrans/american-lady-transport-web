import { useState } from "react";
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
  post_type?: string;
}

const FILTERS = [
  { label: "All Posts", value: "all" },
  { label: "Weekly Reports", value: "weekly-report" },
  { label: "Industry News", value: "industry-news" },
];

const BlogPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      // Try with post_type column first; fall back to title-based inference
      let result = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published_at, post_type")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (result.error?.code === "42703") {
        // post_type column doesn't exist yet — query without it
        result = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false }) as typeof result;
      }

      if (result.error) throw result.error;

      return (result.data ?? []).map((p: any) => ({
        ...p,
        post_type:
          p.post_type ??
          (p.title?.toLowerCase().includes("roundup") ||
           p.title?.toLowerCase().includes("industry news")
            ? "industry-news"
            : "weekly-report"),
      })) as BlogPost[];
    },
  });

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts?.filter((p) => p.post_type === activeFilter);

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
          <div className="text-center mb-12">
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

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
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
          ) : !filteredPosts?.length ? (
            <p className="text-center text-muted-foreground text-lg">
              No posts yet. Check back soon!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group bg-card rounded-lg p-6 shadow-elegant hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        post.post_type === "industry-news"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {post.post_type === "industry-news" ? "Industry News" : "Weekly Report"}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
                    </div>
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
