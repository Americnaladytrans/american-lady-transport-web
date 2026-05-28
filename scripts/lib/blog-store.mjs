/*
 * Shared blog post storage helpers used by both the Weekly Freight Report
 * and the Domestic Trucking Industry News Roundup scripts.
 *
 * - Supabase writes power the live dynamic site at usealt.com.
 * - JSON file writes power the static copy site at src/data/blog-posts.json.
 *
 * Each post is written to BOTH so the two sites stay in sync, but the script
 * is idempotent: if a post for `title` already exists in a store, that store
 * is skipped on subsequent runs.
 */

import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const BLOG_JSON_RELATIVE_PATH = "src/data/blog-posts.json";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

export function buildPost({ title, content, excerpt, publishedAt }) {
  return {
    id: randomUUID(),
    title,
    slug: slugify(title),
    excerpt,
    content,
    published_at: publishedAt || new Date().toISOString(),
  };
}

/* ─── Supabase (powers dynamic usealt.com) ─── */

export async function supabaseHasTitle(title) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?title=eq.${encodeURIComponent(title)}&select=id,content,excerpt,slug,published_at`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0 ? data[0] : false;
}

export async function postToSupabase(post) {
  // Supabase historically uses a timestamped slug to avoid collisions across
  // workflow re-runs. We preserve that behavior here for the live site.
  const supabaseSlug = `${post.slug}-${Date.now().toString(36)}`;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      title: post.title,
      slug: supabaseSlug,
      content: post.content,
      excerpt: post.excerpt,
      is_published: true,
      published_at: post.published_at,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert error: ${res.status} - ${text}`);
  }
  const data = await res.json();
  console.log(`✓ Supabase post created: ${data[0]?.slug}`);
  return data[0];
}

/* ─── Static JSON (powers static copy site) ─── */

function resolveJsonPath() {
  // Resolve relative to the repo root, regardless of where Node is launched.
  // scripts/lib/blog-store.mjs → ../../src/data/blog-posts.json
  const here = new URL(".", import.meta.url).pathname;
  return path.resolve(here, "..", "..", "src", "data", "blog-posts.json");
}

export async function readJsonPosts() {
  const filePath = resolveJsonPath();
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export function jsonHasTitle(posts, title) {
  return posts.some((p) => p.title === title);
}

export async function writeJsonPost(post) {
  const filePath = resolveJsonPath();
  const posts = await readJsonPosts();

  if (jsonHasTitle(posts, post.title)) {
    console.log(`✓ JSON already contains "${post.title}". Skipping JSON write.`);
    return { changed: false };
  }

  // Newest first
  posts.unshift({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    published_at: post.published_at,
  });

  // Keep file readable in PRs and diffs
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2) + "\n", "utf-8");
  console.log(`✓ Wrote post to ${BLOG_JSON_RELATIVE_PATH} (now ${posts.length} posts total)`);
  return { changed: true };
}
