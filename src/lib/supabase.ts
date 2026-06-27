import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True when valid Supabase credentials are present in the environment. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Supabase client. When env vars are missing (e.g. before you connect your own
 * project), this stays null and the app runs in demo mode with local mock data.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
