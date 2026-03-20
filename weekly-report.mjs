// weekly-report.mjs
// Standalone version — run locally with:
//   BLOG_WEBHOOK_URL=... BLOG_WEBHOOK_SECRET=... PERPLEXITY_API_KEY=... node weekly-report.mjs
//
// The canonical version lives in .github/workflows/weekly-report.yml
// Keep both in sync when making changes.

const WEBHOOK_URL = process.env.BLOG_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.BLOG_WEBHOOK_SECRET;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!WEBHOOK_URL || !WEBHOOK_SECRET || !PERPLEXITY_API_KEY) {
  throw new Error("Missing BLOG_WEBHOOK_URL, BLOG_WEBHOOK_SECRET, or PERPLEXITY_API_KEY env vars.");
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

async function callPerplexity(systemPrompt, userPrompt, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }
      const data = await res.json();
      return data.choices[0].message.content;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Attempt ${attempt + 1} failed, retrying in 5s...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

/* ── research phase ── */
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
      prompt: `What freight fraud, cargo theft, double-brokering, and cross-border developments occurred from ${weekRange.startStr} to ${weekRange.endStr}? Include: cargo theft incidents or statistics, double-brokering enforcement, CDL fraud, USDOT/MC number fraud, US-Mexico border crossings, US-Canada trade, USMCA review developments, tariff changes, Mexican SCT regulations, Canadian provincial trucking rules, and CBP enforcement actions.`
    },
    {
      label: "Fuel, Equipment & Operations",
      prompt: `What are the latest diesel fuel prices, equipment news, and operational developments in trucking from ${weekRange.startStr} to ${weekRange.endStr}? Include: EIA national average diesel price, Class 8 truck order data, used truck market, OEM announcements, electric truck news, driver pay updates, truck parking, and infrastructure projects.`
    },
    {
      label: "Economic & Geopolitical Impacts",
      prompt: `What macroeconomic and geopolitical developments from ${weekRange.startStr} to ${weekRange.endStr} are impacting North American trucking? Include: oil prices, trade policy, inflation/CPI, manufacturing PMI, weather disruptions, military conflicts affecting supply chains, and produce/agriculture shipping.`
    }
  ];

  console.log("Starting parallel research across 5 topics...");
  const results = await Promise.allSettled(
    topics.map(async (t) => {
      const data = await callPerplexity(systemPrompt, t.prompt);
      console.log(`✓ ${t.label}: ${data.length} chars`);
      return { label: t.label, data };
    })
  );

  const research = {};
  for (const r of results) {
    if (r.status === "fulfilled") {
      research[r.value.label] = r.value.data;
    } else {
      console.warn(`✗ Research failed: ${r.reason?.message}`);
    }
  }

  if (Object.keys(research).length < 3) {
    throw new Error(`Only ${Object.keys(research).length}/5 research topics succeeded. Aborting.`);
  }

  return research;
}

/* ── writing phase ── */
async function writeArticle(research, weekRange) {
  const researchBlock = Object.entries(research)
    .map(([label, data]) => `=== ${label} ===\n${data}`)
    .join("\n\n");

  const systemPrompt = `You are the content writer for American Lady Transportation (usealt.com), a freight brokerage in Willis, TX. You write weekly industry reports for small/mid-sized freight brokers and carriers. Tone: plain, direct, actionable. No filler, no hedging, no meta-commentary.`;

  const userPrompt = `Using the research data below, write the Weekly Freight Report for ${weekRange.startStr} through ${weekRange.endStr}.

FORMAT: HTML content valid inside a <div>. Use h2, h3, p, ul/li, and strong tags. No wrappers. No markdown.

REQUIRED SECTIONS (as h2 headings, in order):
1. Market Pulse — spot/contract rates, load-to-truck ratios, capacity, volumes.
2. Regulation & Enforcement — FMCSA/DOT rules, ELD, CDL, state regs.
3. Broker Edge — What brokers need to know/do. Compliance, margins, positioning.
4. Cross-Border Watchlist — US-Mexico, US-Canada, USMCA, tariffs, border ops.
5. Fraud & Security — Theft, double-brokering, CDL fraud, enforcement tools.
6. Equipment, Fuel & Ops — Diesel, truck orders, OEM news, driver pay, infrastructure.
7. Action Checklist for Brokers — 5-7 bullet points of specific actions.

RULES:
- Use REAL data (numbers, dollar amounts, percentages) from the research.
- Cite sources naturally ("per DAT", "according to FreightWaves").
- Bold key stats with <strong>. Target 1000-1200 words. Jump straight into data.

RESEARCH DATA:
${researchBlock}

Output ONLY HTML. Nothing else.`;

  console.log("Writing article from research...");
  return await callPerplexity(systemPrompt, userPrompt);
}

/* ── validation ── */
function validateArticle(html) {
  const plain = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const wordCount = plain.split(/\s+/).length;

  const refusalPhrases = [
    "i cannot generate", "i cannot create", "i'm unable to",
    "search results do not contain", "insufficient information",
    "i cannot confirm", "to deliver the accurate", "i would require",
  ];
  const lowerPlain = plain.toLowerCase();
  for (const phrase of refusalPhrases) {
    if (lowerPlain.includes(phrase)) {
      throw new Error(`Article is a refusal message. Found: "${phrase}"`);
    }
  }

  if (wordCount < 400) throw new Error(`Too short: ${wordCount} words.`);

  const requiredSections = ["market pulse", "regulation", "broker edge", "cross-border", "fraud", "equipment", "action checklist"];
  const lowerHtml = html.toLowerCase();
  const missing = requiredSections.filter((s) => !lowerHtml.includes(s));
  if (missing.length > 2) throw new Error(`Missing sections: ${missing.join(", ")}`);

  if (!html.includes("<h2>") && !html.includes("<h2 ")) {
    throw new Error("No HTML h2 headings found.");
  }

  let cleaned = html;
  if (cleaned.startsWith("```html")) cleaned = cleaned.replace(/^```html\s*\n?/, "").replace(/\n?```\s*$/, "");
  else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*\n?/, "").replace(/\n?```\s*$/, "");

  console.log(`✓ Validation: ${wordCount} words, ${7 - missing.length}/7 sections.`);
  return { cleaned, excerpt: plain.substring(0, 250) + (plain.length > 250 ? "..." : "") };
}

/* ── post ── */
async function postToWebhook(title, content, excerpt) {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": WEBHOOK_SECRET,
    },
    body: JSON.stringify({ title, content, excerpt }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook error: ${res.status} - ${text}`);
  }
  console.log("✓ Posted to blog.");
}

/* ── main ── */
async function main() {
  const weekRange = getWeekRange();
  const title = `Weekly Freight Report - ${formatTitleDate()}`;
  console.log(`Generating: ${title}`);
  console.log(`Week: ${weekRange.startStr} – ${weekRange.endStr}`);

  const research = await gatherResearch(weekRange);
  const rawHtml = await writeArticle(research, weekRange);
  const { cleaned, excerpt } = validateArticle(rawHtml);
  await postToWebhook(title, cleaned, excerpt);
  console.log("Done.");
}

main().catch((err) => { console.error("FATAL:", err.message); process.exit(1); });
