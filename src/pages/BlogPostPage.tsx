import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import blogPostsData from "@/data/blog-posts.json";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    return (blogPostsData as BlogPost[]).find((p) => p.slug === slug) ?? null;
  }, [slug]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title={post ? `${post.title} | American Lady Transport Blog` : "Blog Post"}
        description={post?.excerpt || "Read the latest from American Lady Transport."}
        canonicalPath={`/blog/${slug}`}
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {!post ? (
            <p className="text-center text-muted-foreground text-lg">Post not found.</p>
          ) : (
            <article>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-8">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
              </div>
              <div
                className="prose prose-lg max-w-none text-foreground 
                  prose-headings:font-serif prose-headings:text-foreground 
                  prose-a:text-accent prose-strong:text-foreground
                  prose-p:text-muted-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
