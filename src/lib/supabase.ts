import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}

export function getPublicUrl(path: string): string {
  const client = getSupabase();
  const { data } = client.storage.from("catalog-images").getPublicUrl(path);
  return data.publicUrl;
}
