// JOIER Commission Intake — Supabase Edge Function
//
// Secrets required (Supabase dashboard → Settings → Edge Functions → Secrets):
//   SUPABASE_URL              — auto-set by Supabase
//   SUPABASE_SERVICE_ROLE_KEY — auto-set by Supabase
//   RESEND_API_KEY            — resend.com (free: 3k emails/month)
//   NOTIFY_EMAIL              — e.g. joier.mnl@gmail.com

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGIN = "https://joier.art";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// WM + 6 random uppercase alphanumeric chars. Example: WMAB3Z9K
// 36^6 = ~2.2 billion combinations. Short, human-readable, low collision.
function generateRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'WM';
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

// Short, editable draft reply in JOIER voice.
// Precise, warm, calm. No filler. No luxury clichés.
function buildDraftReply(s: {
  name: string;
  piece_type: string;
  metal_pref: string;
  contact_type: string;
  contact_handle: string;
  order_reference: string;
}): string {
  const contactLine =
    s.contact_type.toLowerCase() === "email"
      ? `I'll follow up at ${s.contact_handle}.`
      : s.contact_type.toLowerCase() === "whatsapp"
      ? `I'll reach out on WhatsApp at ${s.contact_handle}.`
      : `I'll be in touch via ${s.contact_type} at ${s.contact_handle}.`;

  const metalNote =
    s.metal_pref && s.metal_pref !== "Undecided" ? ` in ${s.metal_pref}` : "";

  return `Hi ${s.name},

I've reviewed your brief for a ${s.piece_type}${metalNote}.

${contactLine} I'll send a few short questions so we can move into the design phase — first render is usually 2–3 weeks from there.

Your reference is ${s.order_reference}.

— Walter
JOIER WM Design`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  // Honeypot — bots fill hidden fields, humans don't.
  // Return a fake success so bots don't retry.
  if (data.company && String(data.company).trim() !== "") {
    return json({ success: true, order_reference: generateRef(), email_status: "sent" });
  }

  // Required field validation (budget removed - now optional)
  const required = ["name", "piece_type", "message"] as const;
  for (const field of required) {
    if (!data[field] || String(data[field]).trim() === "") {
      return json({ error: `Missing required field: ${field}` }, 400);
    }
  }

  const submission = {
    order_reference: generateRef(),
    name:           String(data.name           || "").trim().slice(0, 200),
    contact_type:   String(data.contact_type   || "").trim().slice(0, 50),
    contact_handle: String(data.contact_handle || "").trim().slice(0, 200),
    piece_type:     String(data.piece_type     || "").trim().slice(0, 200),
    metal_pref:     String(data.metal_pref     || "").trim().slice(0, 100),
    budget:         String(data.budget         || "").trim().slice(0, 100),
    message:        String(data.message        || "").trim().slice(0, 2000),
    submitted_at:   new Date().toISOString(),
  };

  // Persist — hard fail if DB write fails.
  // A submission that isn't stored is a lost lead.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error: dbError } = await supabase
    .from("commissions")
    .insert(submission);

  if (dbError) {
    console.error("DB insert failed:", dbError.message);
    return json({ error: "Failed to record your submission. Please try again." }, 500);
  }

  // Send notification email — surface status, but don't fail the submission.
  const draft = buildDraftReply(submission);

  const emailText = [
    "NEW COMMISSION INQUIRY",
    "══════════════════════════════════",
    "",
    `Reference:       ${submission.order_reference}`,
    `Name:            ${submission.name}`,
    `Contact via:     ${submission.contact_type}`,
    `Contact details: ${submission.contact_handle}`,
    `Piece type:      ${submission.piece_type}`,
    `Metal:           ${submission.metal_pref || "—"}`,
    `Budget:          ${submission.budget}`,
    `Submitted:       ${submission.submitted_at}`,
    "",
    "── Brief ──────────────────────────",
    submission.message,
    "",
    "── Suggested Reply Draft ──────────",
    draft,
    "",
    "══════════════════════════════════",
  ].join("\n");

  const resendKey  = Deno.env.get("RESEND_API_KEY");
  const notifyAddr = Deno.env.get("NOTIFY_EMAIL") || "joier.mnl@gmail.com";

  let emailStatus: "sent" | "failed" | "skipped" = "skipped";

  if (resendKey) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:    "JOIER Commissions <onboarding@resend.dev>",
          to:      [notifyAddr],
          subject: `[JOIER] New Commission — ${submission.name} / ${submission.order_reference}`,
          text:    emailText,
        }),
      });

      if (emailRes.ok) {
        emailStatus = "sent";
      } else {
        const err = await emailRes.text();
        console.error("Resend error:", err);
        emailStatus = "failed";
      }
    } catch (err) {
      console.error("Email fetch threw:", err);
      emailStatus = "failed";
    }
  }

  return json({
    success: true,
    order_reference: submission.order_reference,
    email_status: emailStatus,
  });
});
