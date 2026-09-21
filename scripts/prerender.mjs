import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { chromium } from "playwright";

// Build real HTML from the same React routes visitors use. Never query private data.
const root = process.cwd();
const config = JSON.parse(await fs.readFile(path.join(root, "scripts/site.json"), "utf8"));
const dist = path.join(root, "dist");
const shell = await fs.readFile(path.join(dist, "index.html"));
const base = process.env.VITE_BASE || "/";
const prefix = base === "/" ? "" : base.replace(/\/$/, "");
const routes = [...config.routes];
if (config.blog) {
  const posts = JSON.parse(await fs.readFile(path.join(root, config.blog), "utf8"));
  routes.push(...posts.map(post => `/blog/${post.slug}`));
}
const mime = {".js":"text/javascript",".css":"text/css",".html":"text/html",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".svg":"image/svg+xml",".woff2":"font/woff2",".json":"application/json"};
const server = http.createServer(async (req,res) => {
  const route = decodeURIComponent(new URL(req.url,"http://localhost").pathname).replace(prefix,"");
  const file = path.join(dist,route);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  try {
    if (!(await fs.stat(file)).isFile()) throw new Error("route");
    res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
    res.end(await fs.readFile(file));
  } catch {
    res.setHeader("Content-Type","text/html");
    res.end(shell);
  }
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true});
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror",error=>errors.push(error.message));
  for (const route of [...new Set(routes), "/404"]) {
    errors.length=0;
    await page.goto(`${origin}${prefix}${route}`,{waitUntil:"networkidle"});
    await page.waitForSelector("main h1", {timeout:15000});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    if (errors.length) throw new Error(`${route}: ${errors.join("; ")}`);
    const info = await page.evaluate(({domain,route})=>{
      const meta = (name,content) => {
        let node=document.querySelector(`meta[name="${name}"]`);
        if(!node){node=document.createElement("meta");node.name=name;document.head.appendChild(node);}
        node.content=content;
      };
      document.querySelectorAll('meta[name="keywords"]').forEach(n=>n.remove());
      if(route==="/404"){
        document.title="Page Not Found";
        meta("robots","noindex, follow");
        document.querySelectorAll('link[rel="canonical"],script[type="application/ld+json"]').forEach(n=>n.remove());
      }
      const canonicals=[...document.querySelectorAll('link[rel="canonical"]')];
      if(route!=="/404" && (canonicals.length!==1 || canonicals[0].href!==domain+route)) throw new Error(`Invalid canonical: ${canonicals.map(n=>n.href)}`);
      const main=document.querySelector("main");
      if(main.textContent.trim().length<30) throw new Error("Empty main content");
      return {title:document.title,canonical:canonicals[0]?.href,characters:main.textContent.length,h1s:document.querySelectorAll("h1").length};
    }, {domain:config.domain,route});
    if(info.h1s!==1) throw new Error(`${route}: expected one H1, found ${info.h1s}`);
    let html=await page.content();
    // Every page remains usable before JavaScript executes.
    html=html.replace(/<html([^>]*)>/,"<html$1 data-prerendered=\"true\">");
    const target=route==="/" ? "index.html" : `${route.slice(1)}.html`;
    await fs.mkdir(path.dirname(path.join(dist,target)),{recursive:true});
    await fs.writeFile(path.join(dist,target),html);
    console.log(JSON.stringify({route,...info}));
  }
  // A share image drawn from the existing approved homepage design.
  await page.setViewportSize({width:1200,height:630});
  await page.goto(`${origin}${prefix}/`,{waitUntil:"networkidle"});
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:path.join(dist,"social-card.png")});
  const escape=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;");
  await fs.writeFile(path.join(dist,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(routes)].map(route=>`  <url><loc>${escape(config.domain+route)}</loc></url>`).join("\n")}\n</urlset>\n`);
  await fs.writeFile(path.join(dist,"_redirects"),Object.entries(config.redirects||{}).map(([from,to])=>`${from} ${to} 301`).join("\n")+"\n");
  console.log(`Prerendered ${routes.length} public routes and a real 404 page.`);
} finally {
  await browser.close();
  server.close();
}
