/*
 * Weekly Freight Report — autonomous blog post generator
 *
 * Runs every Friday via GitHub Actions cron. Posts to BOTH:
 *   1. Supabase (powers dynamic site at usealt.com)
 *   2. src/data/blog-posts.json (powers static copy site on GitHub Pages)
 *
 * Fallback chain:
 *   1. Perplexity sonar-pro  (web-search-enabled research + writing)
 *   2. Perplexity sonar      (cheaper model, same API)
 *   3. Graceful exit with clear error (GitHub Actions sends email alert)
 *
 * Required env vars: SUPABASE_URL, SUPABASE_ANON_KEY, PERPLEXITY_API_KEY
 */

import {
  buildPost,
  supabaseHasTitle,
  postToSupabase,
  readJsonPosts,
  jsonHasTitle,
  writeJsonPost,
} from "./lib/blog-store.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const missing = [];
if (!SUPABASE_URL) missing.push("SUPABASE_URL");
if (!SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
if (!PERPLEXITY_API_KEY) missing.push("PERPLEXITY_API_KEY");
if (missing.length) {
  console.error(`FATAL: Missing env vars: ${missing.join(", ")}`);
  console.error("Add these as GitHub repository secrets under Settings > Secrets and variables > Actions.");
  process.exit(1);
}

/* ── helpers ── */
function formatTitleDate(d = new Date()) {
  return d.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "America/Chicago",
  });
}

function getWeekRange() {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 7);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return { startStr: fmt(start), endStr: fmt(end) };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ── API call with retries and model fallback ── */
const MODELS = ["sonar-pro", "sonar"];

async function callPerplexity(systemPrompt, userPrompt) {
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`  Trying ${model} (attempt ${attempt + 1}/3)...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout

        const res = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.status === 402 || res.status === 429) {
          const text = await res.text();
          console.warn(`  ${model} returned ${res.status}: ${text.substring(0, 200)}`);
          if (res.status === 402) {
            console.warn("  Credits exhausted — trying next model...");
            break; // skip to next model
          }
          // 429 = rate limit — wait and retry
          await sleep(10000 * (attempt + 1));
          continue;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API ${res.status}: ${text.substring(0, 200)}`);
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content || content.length < 50) {
          throw new Error("Empty or too-short response from API");
        }
        return content;
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn(`  ${model} timed out after 90s`);
        } else {
          console.warn(`  ${model} attempt ${attempt + 1} failed: ${err.message}`);
        }
        if (attempt < 2) await sleep(5000 * (attempt + 1));
      }
    }
    console.warn(`  All attempts for ${model} exhausted, trying next model...`);
  }
  throw new Error("All AI models failed. Check Perplexity API key and credits.");
}

/* ── research phase: 5 parallel topic queries ── */
async function gatherResearch(weekRange) {
  const systemPrompt = "You are a freight industry research analyst. Return ONLY factual data points, statistics, and developments with source names. Be specific — include numbers, dates, company names, and regulatory references. If you find limited information for a topic, state what you did find rather than refusing.";

  const topics = [
    {
      label: "US Freight Market",
      prompt: `What are the key US trucking and freight market developments from ${weekRange.startStr} to ${weekRange.endStr}? Include: spot rate trends (dry van, reefer, flatbed), load-to-truck ratios, contract rate movements, tender rejection rates, freight volume indicators, and any major carrier news (bankruptcies, mergers, layoffs). Reference DAT, FreightWaves, Cass Freight Index, or ACT Research data where available.`
    },
    {
      label: "Regulation & Enforcement",
      prompt: `What FMCSA, DOT, and trucking regulatory developments occurred from ${weekRange.startStr} to ${weekRange.endStr}? Include: new rulemakings or final rules, ELD enforcement or revocations, CDL rule changes, hours-of-service updates, drug & alcohol clearinghouse news, broker bond requirements, state-level trucking legislation (especially Texas), and any Congressional trucking bills.`
    },
    {
      label: "Fraud, Theft & Cross-Border",
      prompt: `What freight fraud, cargo theft, double-brokering, and cross-border developments occurred from ${weekRange.startStr} to ${weekRange.endStr}? Include: cargo theft incidents or statistics, double-brokering enforcement, CDL fraud or CDL mill crackdowns, US-Mexico border crossings, US-Canada trade, USMCA developments, tariff changes, and CBP enforcement actions.`
    },
    {
      label: "Fuel, Equipment & Operations",
      prompt: `What are the latest diesel fuel prices, equipment news, and operational developments in trucking from ${weekRange.startStr} to ${weekRange.endStr}? Include: EIA national average diesel price, Class 8 truck order data, used truck market conditions, electric truck news, driver pay updates, and truck parking initiatives.`
    },
    {
      label: "Economic & Geopolitical Impacts",
      prompt: `What macroeconomic and geopolitical developments from ${weekRange.startStr} to ${weekRange.endStr} are impacting North American trucking? Include: oil price movements, trade policy changes, inflation/CPI data, manufacturing PMI, weather disruptions, and produce/agriculture shipping developments.`
    }
  ];

  console.log("Starting parallel research across 5 topics...");
  const results = await Promise.allSettled(
    topics.map(async (t) => {
      try {
        const data = await callPerplexity(systemPrompt, t.prompt);
        console.log(`✓ ${t.label}: ${data.length} chars`);
        return { label: t.label, data };
      } catch (err) {
        console.warn(`✗ ${t.label} failed: ${err.message}`);
        throw err;
      }
    })
  );

  const research = {};
  for (const r of results) {
    if (r.status === "fulfilled") {
      research[r.value.label] = r.value.data;
    }
  }

  if (Object.keys(research).length < 2) {
    throw new Error(`Only ${Object.keys(research).length}/5 research topics succeeded. Need at least 2. Aborting.`);
  }

  console.log(`Research complete: ${Object.keys(research).length}/5 topics succeeded.`);
  return research;
}

/* ── writing phase ── */
async function writeArticle(research, weekRange) {
  const researchBlock = Object.entries(research)
    .map(([label, data]) => `=== ${label} ===\n${data}`)
    .join("\n\n");

  const systemPrompt = "You are the content writer for American Lady Transportation (usealt.com), a freight brokerage in Willis, TX. You write weekly industry reports for freight brokers and carriers. Your tone is plain, direct, and actionable — no filler, no hedging.";

  const userPrompt = `Using the research data below, write the Weekly Freight Report for the week of ${weekRange.startStr} through ${weekRange.endStr}.

FORMAT: HTML content valid inside a <div>. Use h2, h3, p, ul/li, and strong tags. No html/body/head wrappers. No markdown.

REQUIRED SECTIONS (as h2 headings, in this exact order):
1. Market Pulse
2. Regulation & Enforcement
3. Broker Edge
4. Cross-Border Watchlist
5. Fraud & Security
6. Equipment, Fuel & Ops
7. Action Checklist for Brokers

RULES:
- Use REAL data points from the research (specific numbers, dollar amounts, percentages).
- Cite sources naturally (e.g., "per DAT data", "according to FreightWaves").
- Bold key statistics using <strong> tags.
- Target 1000-1200 words.
- Do NOT include any introductory preamble or meta-commentary. Jump straight into the data.

RESEARCH DATA:
${researchBlock}

Output ONLY the HTML content. Nothing else.`;

  console.log("Writing article from research...");
  return await callPerplexity(systemPrompt, userPrompt);
}

/* ── validation ── */
function validateArticle(html) {
  const plain = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const wordCount = plain.split(/\s+/).length;

  const refusalPhrases = [
    "i cannot generate", "i cannot create", "i'm unable to",
    "i do not have", "search results do not contain",
    "insufficient information", "i cannot confirm",
    "to deliver the accurate", "i would require",
  ];
  const lowerPlain = plain.toLowerCase();
  for (const phrase of refusalPhrases) {
    if (lowerPlain.includes(phrase)) {
      throw new Error(`Article is a refusal/error message. Found: "${phrase}"`);
    }
  }

  if (wordCount < 400) {
    throw new Error(`Article too short: ${wordCount} words (minimum 400).`);
  }

  const requiredSections = ["market pulse", "regulation", "broker edge", "cross-border", "fraud", "equipment", "action checklist"];
  const lowerHtml = html.toLowerCase();
  const missing = requiredSections.filter((s) => !lowerHtml.includes(s));
  if (missing.length > 2) {
    throw new Error(`Missing ${missing.length} required sections: ${missing.join(", ")}`);
  }

  if (!html.includes("<h2>") && !html.includes("<h2 ")) {
    throw new Error("No HTML h2 headings found.");
  }

  let cleaned = html;
  if (cleaned.startsWith("```html")) cleaned = cleaned.replace(/^```html\s*\n?/, "").replace(/\n?```\s*$/, "");
  else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*\n?/, "").replace(/\n?```\s*$/, "");

  console.log(`✓ Validation passed: ${wordCount} words, ${7 - missing.length}/7 sections.`);
  return { cleaned, excerpt: plain.substring(0, 250) + (plain.length > 250 ? "..." : "") };
}

/* ── main ── */
async function main() {
  const weekRange = getWeekRange();
  const title = `Weekly Freight Report - ${formatTitleDate()}`;

  console.log(`Generating: ${title}`);
  console.log(`Week range: ${weekRange.startStr} – ${weekRange.endStr}`);

  // Check both stores independently for idempotency.
  const existingInSupabase = await supabaseHasTitle(title);
  const existingJson = await readJsonPosts();
  const existsInJson = jsonHasTitle(existingJson, title);

  if (existingInSupabase && existsInJson) {
    console.log(`Already posted to both Supabase and JSON. Nothing to do.`);
    return;
  }

  let post;

  if (existingInSupabase && !existsInJson) {
    // Recovery path: Supabase already has it from a previous run that failed
    // before the JSON write. Reuse the same content.
    console.log("Supabase has post but JSON does not. Backfilling JSON from Supabase.");
    post = buildPost({
      title,
      content: existingInSupabase.content,
      excerpt: existingInSupabase.excerpt,
      publishedAt: existingInSupabase.published_at,
    });
  } else {
    // Normal path: generate fresh.
    const research = await gatherResearch(weekRange);
    const rawHtml = await writeArticle(research, weekRange);
    const { cleaned, excerpt } = validateArticle(rawHtml);
    post = buildPost({ title, content: cleaned, excerpt });

    if (!existingInSupabase) {
      await postToSupabase(post);
    }
  }

  if (!existsInJson) {
    await writeJsonPost(post);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  console.error("The workflow will retry on the next scheduled run, or trigger it manually from GitHub Actions.");
  process.exit(1);
});
