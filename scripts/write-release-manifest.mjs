import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const raw = await fs.readFile("src/data/blog-posts.json", "utf8");
const posts = JSON.parse(raw);
const release = {
  repository: "Americnaladytrans/american-lady-transport-web",
  commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  run_id: process.env.GITHUB_RUN_ID || null,
  created_at: new Date().toISOString(),
  blog_sha256: createHash("sha256").update(raw).digest("hex"),
  post_count: posts.length,
  latest: posts.slice(0, 4).map(({ title, slug, published_at }) => ({ title, slug, published_at })),
};
await fs.writeFile("dist/blog-release.json", JSON.stringify(release, null, 2) + "\n");
