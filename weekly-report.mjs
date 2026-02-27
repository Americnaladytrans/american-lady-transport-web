// weekly-report.mjs
import fetch from "node-fetch";

const WEBHOOK_URL = process.env.BLOG_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.BLOG_WEBHOOK_SECRET;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!WEBHOOK_URL || !WEBHOOK_SECRET || !PERPLEXITY_API_KEY) {
  throw new Error("Missing BLOG_WEBHOOK_URL, BLOG_WEBHOOK_SECRET, or PERPLEXITY_API_KEY env vars.");
}

function formatTitleDate(d = new Date()) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

async function generateReportHtml() {
  const title = `Weekly Freight Report - ${formatTitleDate()}`;

  const prompt = `
Generate a weekly North American trucking industry report (US, Canada, Mexico) for small/mid-sized freight brokers and carriers, based ONLY on developments in the past 7 days.

Structure it as HTML with h2, h3, p, ul/li tags, no html or body wrappers.

Required sections (as h2 headings, in this order):
1. Market pulse
2. Regulation & enforcement
3. Broker edge
4. Cross-border watchlist
5. Fraud & security
6. Equipment, fuel & ops
7. Action checklist for brokers

Within those sections, emphasize:
- Anything impacting small/mid-size carriers and freight brokers.
- FMCSA/DOT, provincial regulators, SCT/Mexico changes.
- Double brokering, freight theft rings, identity fraud, and CDL/training fraud.
- Cross-border issues (ports of entry, USMCA, inspections, strikes, protests).
- Trends in spot vs. contract, regional imbalances, and key lanes.

Tone:
- Plain, direct language.
- Actionable takeaways for a broker like American Lady Transportation.
- No fluff, under ~1100 words.

Output STRICTLY as HTML (valid inside a div), with clear headings and bullet lists where useful.
`;

  const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: "sonar-pro",
      messages: [
        { role: "system", content: "You are an expert transportation and freight industry analyst." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!perplexityRes.ok) {
    const text = await perplexityRes.text();
    throw new Error(`Perplexity API error: ${perplexityRes.status} - ${text}`);
  }

  const data = await perplexityRes.json();
  const htmlContent = data.choices[0].message.content;

  const plain = htmlContent.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const excerpt = plain.substring(0, 250) + (plain.length > 250 ? "..." : "");

  return { title, content: htmlContent, excerpt };
}

async function postToWebhook() {
  const { title, content, excerpt } = await generateReportHtml();

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

  console.log("Weekly report posted successfully.");
}

postToWebhook().catch((err) => {
  console.error(err);
  process.exit(1);
});
