import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const ADMIN_PASSWORD = "ALT2024!admin";

const BlogAdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: authenticated,
  });

  const updateMutation = useMutation({
    mutationFn: async (post: Partial<BlogPost> & { id: string }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      setEditingPost(null);
      toast({ title: "Post updated!" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({ is_published, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Publish status updated!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Post deleted." });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
    setPassword("");
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditExcerpt(post.excerpt || "");
  };

  const saveEdit = () => {
    if (!editingPost) return;
    updateMutation.mutate({
      id: editingPost.id,
      title: editTitle,
      content: editContent,
      excerpt: editExcerpt,
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-lg shadow-elegant max-w-sm w-full">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-accent" />
            <h1 className="font-serif text-2xl font-bold text-foreground">Blog Admin</h1>
          </div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 mb-4"
            placeholder="Enter admin password"
          />
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8">Manage Blog Posts</h1>

        {editingPost && (
          <div className="bg-card p-6 rounded-lg shadow-elegant mb-8">
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Edit Post</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea id="edit-excerpt" value={editExcerpt} onChange={(e) => setEditExcerpt(e.target.value)} className="mt-1" rows={2} />
              </div>
              <div>
                <Label htmlFor="edit-content">Content (HTML)</Label>
                <Textarea id="edit-content" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="mt-1 font-mono text-sm" rows={12} />
              </div>
              <div className="flex gap-3">
                <Button onClick={saveEdit} disabled={updateMutation.isPending}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading posts...</p>
        ) : !posts?.length ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-card p-5 rounded-lg shadow-elegant flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.is_published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(post.published_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-foreground truncate">{post.title}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(post)} title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => togglePublishMutation.mutate({ id: post.id, is_published: !post.is_published })}
                    title={post.is_published ? "Unpublish" : "Publish"}
                  >
                    {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Delete this post permanently?")) {
                        deleteMutation.mutate(post.id);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogAdminPage;
