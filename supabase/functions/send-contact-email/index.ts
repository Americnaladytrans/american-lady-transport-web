import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const getRateLimitKey = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
};

const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetTime < now) rateLimitMap.delete(k);
    }
  }
  
  if (!record || record.resetTime < now) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const validateInput = (data: Record<string, unknown>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Honeypot check — if filled, it's a bot
  if (data._honeypot && typeof data._honeypot === 'string' && data._honeypot.trim().length > 0) {
    // Silently reject but return success to not tip off bots
    return { valid: false, errors: ['__honeypot__'] };
  }
  
  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  } else if (data.email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }
  
  if (typeof data.phone !== 'string') {
    errors.push('Phone is required');
  } else if (data.phone.length > 20) {
    errors.push('Phone must be less than 20 characters');
  }
  
  if (typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  return { valid: errors.length === 0, errors };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientKey = getRateLimitKey(req);
  if (isRateLimited(clientKey)) {
    console.warn("Rate limit exceeded for:", clientKey);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const rawData = await req.json();
    
    const validation = validateInput(rawData);
    
    // Honeypot triggered — return fake success
    if (!validation.valid && validation.errors.includes('__honeypot__')) {
      console.warn("Honeypot triggered, rejecting silently");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    
    if (!validation.valid) {
      console.error("Validation failed:", validation.errors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validation.errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const name = sanitizeHtml(rawData.name.trim());
    const email = rawData.email.trim().toLowerCase();
    const phone = sanitizeHtml(rawData.phone.trim());
    const message = sanitizeHtml(rawData.message.trim());

    console.log("Sending contact email from:", name, email);
    
    const { Resend } = await import("https://esm.sh/resend@2.0.0");
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const businessEmailResponse = await resend.emails.send({
      from: "American Lady Transport <noreply@usealt.com>",
      to: ["info@usealt.com"],
      subject: `New Contact Request from ${name}`,
      html: `
        <h1>New Contact Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("Business email sent:", businessEmailResponse);

    const customerEmailResponse = await resend.emails.send({
      from: "American Lady Transport <noreply@usealt.com>",
      to: [email],
      subject: "We received your contact request!",
      html: `
        <h1>Thank you for contacting American Lady Transport, ${name}!</h1>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>The American Lady Transport Team</p>
      `,
    });

    console.log("Customer confirmation email sent:", customerEmailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
