import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify shared secret
  const authHeader = req.headers.get("x-webhook-secret");
  const expectedSecret = Deno.env.get("BLOG_WEBHOOK_SECRET");

  if (!expectedSecret || authHeader !== expectedSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { title, content, excerpt, post_type, tags } = await req.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "title and content are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const slug = slugify(title) + "-" + Date.now().toString(36);
    const autoExcerpt =
      excerpt || content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";

    const baseData: Record<string, unknown> = {
      title,
      slug,
      content,
      excerpt: autoExcerpt,
      is_published: true,
      published_at: new Date().toISOString(),
    };

    // Try with post_type/tags first; fall back without if columns don't exist yet
    const fullData = { ...baseData };
    if (post_type) fullData.post_type = post_type;
    if (tags && Array.isArray(tags)) fullData.tags = tags;

    let { data, error } = await supabase
      .from("blog_posts")
      .insert(fullData)
      .select()
      .single();

    // If columns don't exist (42703), retry without post_type/tags
    if (error && error.code === "42703") {
      console.warn("post_type/tags columns not found, inserting without them");
      ({ data, error } = await supabase
        .from("blog_posts")
        .insert(baseData)
        .select()
        .single());
    }

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, post: data }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error creating blog post:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
