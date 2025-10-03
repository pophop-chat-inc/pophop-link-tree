import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.SUPABASE_URL as string;
const supabaseAnonKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function getOwnerCommunities() {
  const staticClickedUserId: string = "ab6f4e97-5c85-4187-92f8-141317126dc1";

  try {
    const { data, error } = await supabase
      .from("community_users")
      .select("*")
      .eq("role", "owner")
      .eq("user_id", staticClickedUserId);

    if (error) {
      console.error("Error fetching owner communities:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}