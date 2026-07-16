import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getPublicUrl(path: string) {
  const { data } = supabase.storage.from("catalog-images").getPublicUrl(path);
  return data.publicUrl;
}
