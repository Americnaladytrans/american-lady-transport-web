# pplx.app Weekly Mirror Deploy Instructions

This file is referenced by the weekly recurring task that updates `american-lady-transport.pplx.app` with the latest blog content.

## Repo & Site
- GitHub repo: `Americnaladytrans/american-lady-transport-web`
- Local clone: `/home/user/workspace/alt-web-new`
- pplx.app site_id: `1dbc65e1-052c-4972-b04b-d9da6367d26b`
- pplx.app subdomain: `american-lady-transport`
- Live URL: https://american-lady-transport.pplx.app

## Exact steps for the cron task

1. **Ensure repo present and up to date:**
   ```bash
   if [ ! -d /home/user/workspace/alt-web-new ]; then
     cd /home/user/workspace && git clone https://github.com/Americnaladytrans/american-lady-transport-web.git alt-web-new
   else
     cd /home/user/workspace/alt-web-new && git fetch origin && git reset --hard origin/main
   fi
   ```
   Use `api_credentials=["github"]` for git operations.

2. **Install deps if missing, then build (no VITE_BASE — pplx.app uses `./`):**
   ```bash
   cd /home/user/workspace/alt-web-new
   [ ! -d node_modules ] && npm ci
   rm -rf dist
   unset VITE_BASE && npm run build
   ```

3. **Sanity check the build has today's posts:**
   ```bash
   python3 -c "import json; d=json.load(open('/home/user/workspace/alt-web-new/src/data/blog-posts.json')); print('newest:', d[0]['title'])"
   ```

4. **Deploy preview (skip the broken-validator screenshot check — known issue with this SPA):**
   ```
   deploy_website(
     user_description="Weekly mirror to pplx.app",
     project_path="/home/user/workspace/alt-web-new/dist",
     site_name="American Lady Transport",
     entry_point="index.html",
     should_validate=false
   )
   ```

5. **Publish to existing pplx.app subdomain:**
   ```
   publish_website(
     user_description="Refreshing american-lady-transport.pplx.app weekly",
     project_path="/home/user/workspace/alt-web-new",
     dist_path="/home/user/workspace/alt-web-new/dist",
     app_name="American Lady Transport",
     subdomain="american-lady-transport",
     site_id="1dbc65e1-052c-4972-b04b-d9da6367d26b"
   )
   ```

6. **Notify the user via send_notification** if both steps succeeded, including the newest post title from step 3.
