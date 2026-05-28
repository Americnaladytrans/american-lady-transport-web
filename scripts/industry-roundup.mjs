/*
 * Domestic Trucking Industry News Roundup — autonomous blog post generator
 *
 * Runs every Friday via GitHub Actions cron. Posts to BOTH:
 *   1. Supabase (powers dynamic site at usealt.com)
 *   2. src/data/blog-posts.json (powers static copy site on GitHub Pages)
 *
 * Fallback chain: sonar-pro → sonar (same Perplexity API key)
 * Includes: retry logic, duplicate detection, validation gate.
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
        const timeout = setTimeout(() => controller.abort(), 90000);

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
            break;
          }
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

/* ── research phase: 4 parallel topic queries ── */
async function gatherResearch() {
  const systemPrompt = "You are a freight industry research analyst. Return factual data points, article summaries, and developments with source names and publication dates. Be specific — include numbers, company names, and regulatory references. Focus on still-relevant items, not just the past 7 days.";

  const topics = [
    {
      label: "Structural Trends & Fleet Economics",
      prompt: "Collect the most important recent articles and analyses on U.S. domestic trucking structural trends. Include: driver shortages and workforce demographics, LTL job shifts and consolidation, fleet failures and carrier attrition rates, trailer and equipment order backlogs, insurance market conditions, and nuclear verdict trends. Focus on items shaping the next 3-12 months. Include source names and dates."
    },
    {
      label: "Diesel Economics & Fuel Analysis",
      prompt: "Collect the most relevant recent articles and deep analyses on diesel fuel economics for U.S. trucking. Include: refinery capacity and utilization, crude oil supply dynamics, geopolitical impacts on fuel, fuel surcharge methodology debates, alternative fuel adoption (CNG, LNG, electric, hydrogen), renewable diesel supply, and any state fuel tax changes. Focus on analytical pieces, not just price reports. Include source names and dates."
    },
    {
      label: "Fraud, Crime & Enforcement Technology",
      prompt: "Collect the most relevant recent articles on freight fraud, cargo crime, and technology responses in U.S. domestic trucking. Include: the SAFER Transport Act status, GPS spoofing countermeasures, AI-powered fraud detection tools, carrier identity verification platforms, double-brokering enforcement trends, CDL mill investigations, chameleon carrier tactics, and cybersecurity threats to fleets. Include source names and dates."
    },
    {
      label: "Technology, Policy & Industry Outlook",
      prompt: "Collect the most relevant recent articles on trucking technology, policy developments, and industry outlook for U.S. domestic trucking. Include: autonomous trucking pilots and regulatory status, TMS and visibility platform developments, FMCSA technology initiatives, infrastructure bill impacts, truck parking solutions, EPA 2027 engine mandate effects, and major industry conference takeaways. Include source names and dates."
    }
  ];

  console.log("Starting parallel research across 4 topics...");
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
    throw new Error(`Only ${Object.keys(research).length}/4 topics succeeded. Need at least 2. Aborting.`);
  }

  console.log(`Research complete: ${Object.keys(research).length}/4 topics succeeded.`);
  return research;
}

/* ── writing phase ── */
async function writeRoundup(research) {
  const researchBlock = Object.entries(research)
    .map(([label, data]) => `=== ${label} ===\n${data}`)
    .join("\n\n");

  const systemPrompt = "You are the content writer for American Lady Transportation (usealt.com), a freight brokerage in Willis, TX. You write an Industry News Roundup covering strategic, longer-term developments in domestic trucking. Your tone is plain, direct, and informative.";

  const userPrompt = `Using the research data below, write the Domestic Trucking Industry News Roundup for ${formatTitleDate()}.

FORMAT: HTML content valid inside a <div>. Use h2, h3, p, ul/li, and strong tags. No html/body/head wrappers. No markdown.

STRUCTURE: Present 10-14 news items organized under these h2 section headings:
1. Fleet & Market Trends
2. Fuel & Cost Pressures
3. Fraud & Security Watch
4. Technology & Policy

For each news item:
- Use an <h3> tag with a concise headline
- Write 2-4 sentences summarizing the key insight
- Cite the source naturally (e.g., "per FreightWaves" or "according to Transport Topics")
- Bold the most important data point with <strong>

TONE:
- Strategic companion to the Weekly Freight Report
- Focus on what is shaping the next 3-12 months
- Actionable context for brokers and carriers
- No filler, no generic statements

End with a brief <h2>Bottom Line</h2> paragraph (3-4 sentences) synthesizing the key themes.

RESEARCH DATA:
${researchBlock}

Output ONLY HTML. Nothing else.`;

  console.log("Writing roundup from research...");
  return await callPerplexity(systemPrompt, userPrompt);
}

/* ── validation ── */
function validateRoundup(html) {
  const plain = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const wordCount = plain.split(/\s+/).length;

  const refusalPhrases = [
    "i cannot generate", "i cannot create", "i'm unable to",
    "search results do not contain", "insufficient information",
  ];
  const lowerPlain = plain.toLowerCase();
  for (const phrase of refusalPhrases) {
    if (lowerPlain.includes(phrase)) {
      throw new Error(`Roundup is a refusal message. Found: "${phrase}"`);
    }
  }

  if (wordCount < 300) throw new Error(`Too short: ${wordCount} words.`);

  if (!html.includes("<h2>") && !html.includes("<h2 ")) {
    throw new Error("No HTML h2 headings found.");
  }

  let cleaned = html;
  if (cleaned.startsWith("```html")) cleaned = cleaned.replace(/^```html\s*\n?/, "").replace(/\n?```\s*$/, "");
  else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*\n?/, "").replace(/\n?```\s*$/, "");

  console.log(`✓ Validation: ${wordCount} words.`);
  return { cleaned, excerpt: plain.substring(0, 250) + (plain.length > 250 ? "..." : "") };
}

/* ── main ── */
async function main() {
  const title = `Domestic Trucking Industry News Roundup - ${formatTitleDate()}`;
  console.log(`Generating: ${title}`);

  const existingInSupabase = await supabaseHasTitle(title);
  const existingJson = await readJsonPosts();
  const existsInJson = jsonHasTitle(existingJson, title);

  if (existingInSupabase && existsInJson) {
    console.log(`Already posted to both Supabase and JSON. Nothing to do.`);
    return;
  }

  let post;

  if (existingInSupabase && !existsInJson) {
    console.log("Supabase has post but JSON does not. Backfilling JSON from Supabase.");
    post = buildPost({
      title,
      content: existingInSupabase.content,
      excerpt: existingInSupabase.excerpt,
      publishedAt: existingInSupabase.published_at,
    });
  } else {
    const research = await gatherResearch();
    const rawHtml = await writeRoundup(research);
    const { cleaned, excerpt } = validateRoundup(rawHtml);
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
