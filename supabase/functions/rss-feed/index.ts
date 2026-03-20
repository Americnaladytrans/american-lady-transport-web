import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://usealt.com";
const FEED_TITLE = "American Lady Transport — Industry Insights";
const FEED_DESCRIPTION =
  "Weekly freight industry reports and logistics insights from American Lady Transport, a freight brokerage in Willis, TX.";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("title, slug, content, excerpt, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const now = new Date().toUTCString();
    const lastBuild = posts?.length
      ? new Date(posts[0].published_at).toUTCString()
      : now;

    const items = (posts ?? [])
      .map((post) => {
        const link = `${SITE_URL}/blog/${post.slug}`;
        const pubDate = new Date(post.published_at).toUTCString();
        const description = post.excerpt || stripHtml(post.content).substring(0, 300) + "...";

        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("RSS feed error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
