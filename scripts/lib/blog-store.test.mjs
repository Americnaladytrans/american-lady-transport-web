import test from "node:test";
import assert from "node:assert/strict";
import { ensurePost, cleanArticleHtml, supabaseHasTitle, postToSupabase, titleDate } from "./blog-store.mjs";

test("JSON mode never requires the unavailable database", async () => {
  process.env.BLOG_STORAGE_MODE = "json";
  const fetchBefore = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("Unexpected network access"); };
  try {
    assert.equal(await supabaseHasTitle("test"), false);
    assert.equal(await postToSupabase({}), undefined);
  } finally { globalThis.fetch = fetchBefore; }
});

test("reruns reuse saved posts without generating or writing duplicates", async () => {
  process.env.BLOG_STORAGE_MODE = "json";
  const existing = { title: "Weekly test", content: "<p>Saved content</p>" };
  const fail = () => { throw new Error("Should not run"); };
  const result = await ensurePost("Weekly test", fail, { read: async () => [existing], write: fail, lookup: fail, mirror: fail });
  assert.equal(result.created, false);
  assert.equal(result.post, existing);
});

test("new article is saved with sanitized content before optional mirroring", async () => {
  const order = [];
  const result = await ensurePost("New report", async () => ({ content: '<h2>News</h2><script>alert(1)</script>', excerpt: "News" }), {
    read: async () => [], lookup: async () => false,
    write: async post => { order.push("write"); assert.equal(post.content, "<h2>News</h2>"); },
    mirror: async () => { order.push("mirror"); },
  });
  assert.equal(result.created, true);
  assert.deepEqual(order, ["write", "mirror"]);
});

test("a mirror-only article can recover into the JSON source without regeneration", async () => {
  const result = await ensurePost("Recovered", () => { throw new Error("No generation"); }, {
    read: async () => [], lookup: async () => ({ content: "<p>Recovered</p>", excerpt: "Recovered", published_at: "2026-09-18T12:00:00Z" }),
    write: async () => {}, mirror: () => { throw new Error("No duplicate mirror"); },
  });
  assert.equal(result.post.published_at, "2026-09-18T12:00:00Z");
});

test("sanitizer strips active content, event handlers, unsafe protocols and styles", () => {
  const html = cleanArticleHtml('<h2 onclick="x()">News</h2><img src=x onerror=x()><iframe src="https://evil.test"></iframe><a href="javascript:alert(1)">bad</a><a href="//evil.test">relative</a><a href="https://example.com" style="color:red">good</a>');
  assert.equal(html, '<h2>News</h2><a>bad</a><a>relative</a><a href="https://example.com">good</a>');
});

test("titles use Chicago dates across UTC midnight", () => {
  assert.equal(titleDate(new Date("2026-09-26T00:10:00Z")), "September 25, 2026");
});
