# American Lady Transport — Backup & Redeploy Guide

This document explains how to fully recover this website from scratch if something ever breaks.

## Live Site
- **URL:** https://american-lady-transport.pplx.app
- **Future custom domain:** americanladytrans.com (pointing via HostGator, not yet configured)
- **Perplexity site_id:** `1dbc65e1-052c-4972-b04b-d9da6367d26b`
- **Email:** info@usealt.com

## Stack
- **Framework:** React + TypeScript + Vite
- **Routing:** react-router-dom (BrowserRouter)
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Perplexity pplx.app (static SPA)
- **External services:** NONE — site is fully static
  - Contact forms → mailto:info@usealt.com
  - Blog posts → static JSON at `src/data/blog-posts.json`
  - No Supabase, no API keys, no database

## Backup Locations
1. **GitHub (primary):** https://github.com/Americnaladytrans/american-lady-transport-web
2. **Google Drive ZIP:** `website-backup-american-lady-transport-YYYY-MM-DD.zip` (in Website Backups folder)
3. **Perplexity sandbox** (temporary — do not rely on this)

## Recover & Redeploy From GitHub

```bash
# 1. Clone the repo
git clone https://github.com/Americnaladytrans/american-lady-transport-web.git
cd american-lady-transport-web

# 2. Install dependencies
npm install

# 3. Build the production bundle
npm run build
# Output: ./dist/

# 4. Test locally (optional)
npm run preview
```

## Redeploy to Perplexity pplx.app

In a Perplexity conversation, ask Computer to:

> Deploy the `american-lady-transport-web/dist` folder to pplx.app, updating the existing site with site_id `1dbc65e1-052c-4972-b04b-d9da6367d26b`.

Or run these tools directly:
1. `deploy_website` with `project_path=/path/to/dist`, `entry_point="index.html"`, `should_validate=false`
2. `publish_website` with `dist_path=/path/to/dist`, `site_id="1dbc65e1-052c-4972-b04b-d9da6367d26b"`, `subdomain="american-lady-transport"`

> **IMPORTANT:** Always pass `should_validate=false` to `deploy_website`. The validator's 404 check is a false positive for SPAs.

## Recover From Google Drive ZIP

1. Download the latest `website-backup-american-lady-transport-*.zip` from Drive
2. Unzip
3. Push to a new GitHub repo (or restore over the existing one):
   ```bash
   cd american-lady-transport-web
   git init
   git remote add origin https://github.com/Americnaladytrans/american-lady-transport-web.git
   git add -A
   git commit -m "Restore from backup"
   git push -u origin main --force
   ```
4. Follow "Recover & Redeploy From GitHub" above

## Adding/Editing Blog Posts

Blog posts are static JSON. To add a new post:

1. Open `src/data/blog-posts.json`
2. Add a new object at the top of the array (newest first):
   ```json
   {
     "id": "unique-id-here",
     "title": "Post Title",
     "slug": "post-title-slug",
     "excerpt": "Short summary shown on the listing page",
     "content": "Full markdown content of the post",
     "published_at": "2026-05-28T12:00:00Z",
     "post_type": "weekly-report"
   }
   ```
3. Commit, push, rebuild, redeploy

## Editing Banner Links

The home page has banner links to companion apps. Update them in:
- `src/components/Banner.tsx` (or similar — search for `lovable.app` in repo)

Current banner targets (still pointing to Loveable until those apps are rebuilt):
- Fuel Surcharge → fuel-surcharge.lovable.app
- Partial Rate IQ → partial-pro.lovable.app
- Pack My Trailer → pack-my-trailer.lovable.app

## Vite Config Notes

`vite.config.ts` has:
- `base: "./"` — required for relative asset paths on pplx.app
- `lovable-tagger` plugin REMOVED — do not re-add

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| White page on pplx.app | Missing `base: "./"` in vite.config.ts | Add it, rebuild |
| 404 on direct links (e.g. /blog) | SPA routing not configured server-side | Already handled by pplx.app — ignore validator warnings |
| Build fails: "lovable-tagger not found" | Stale import in vite.config.ts | Remove the import |
