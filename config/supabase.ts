import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedUrl: string | undefined;
let cachedAnonKey: string | undefined;
let cachedServiceRoleKey: string | undefined;
let cachedAdminClient: SupabaseClient | null = null;

function resolveEnv() {
  if (cachedUrl && cachedServiceRoleKey) return;
  if (typeof process !== "undefined") {
    cachedUrl = process.env.SUPABASE_URL;
    cachedAnonKey = process.env.SUPABASE_ANON_KEY;
    cachedServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  if (!cachedUrl && typeof import.meta !== "undefined") {
    const meta = import.meta as any;
    cachedUrl = cachedUrl || meta.env?.VITE_SUPABASE_URL || meta.env?.SUPABASE_URL;
    cachedAnonKey = cachedAnonKey || meta.env?.VITE_SUPABASE_ANON_KEY || meta.env?.SUPABASE_ANON_KEY;
  }
}

export function supabaseAsUser(accessToken: string): SupabaseClient {
  resolveEnv();
  if (!cachedUrl || !cachedAnonKey) {
    throw new Error("Missing Supabase env vars: SUPABASE_URL, SUPABASE_ANON_KEY");
  }
  return createClient(cachedUrl, cachedAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export function supabaseAdmin(): SupabaseClient {
  resolveEnv();
  if (!cachedUrl || !cachedServiceRoleKey) {
    throw new Error("Missing Supabase server env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(cachedUrl, cachedServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return cachedAdminClient;
}
