import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseAnonKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
