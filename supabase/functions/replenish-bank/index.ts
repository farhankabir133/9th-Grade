// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const REPLENISH_SECRET = Deno.env.get("REPLENISH_SECRET") || "";
const EXPRESS_URL = Deno.env.get("APP_URL") || "http://localhost:3000";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Replenish-Secret",
};

const jsonResponse = (body: any, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

const errorResponse = (body: any, status = 500) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

async function triggerReplenish(): Promise<{ ok: boolean; status: number; body: any }> {
  const url = `${EXPRESS_URL}/api/admin/replenish`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "X-Replenish-Secret": REPLENISH_SECRET,
      },
      body: JSON.stringify({
        triggeredBy: "edge-cron",
        scheduledAt: new Date().toISOString(),
      }),
      signal: controller.signal as any,
    });

    const body = await response.json().catch(() => ({ raw: await response.text() }));
    return { ok: response.ok, status: response.status, body };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      body: { error: err.message || "Unknown network error" },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export default {
  fetch: async (_req: Request) => {
    if (_req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    console.log("[replenish-bank] Cron trigger received at", new Date().toISOString());
    console.log("[replenish-bank] Express URL:", EXPRESS_URL);

    const result = await triggerReplenish();

    console.log("[replenish-bank] Express response status:", result.status);
    console.log("[replenish-bank] Express response body:", JSON.stringify(result.body));

    if (!result.ok) {
      console.error("[replenish-bank] FAILED — Express endpoint returned non-OK. This requires attention.");
      return errorResponse({
        ok: false,
        status: result.status,
        error: "Replenishment trigger failed",
        details: result.body,
        scheduledAt: new Date().toISOString(),
      }, 502);
    }

    console.log("[replenish-bank] SUCCESS — Replenishment completed.");
    return jsonResponse({
      ok: true,
      status: result.status,
      result: result.body,
      scheduledAt: new Date().toISOString(),
    });
  },
};
