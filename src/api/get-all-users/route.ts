import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

type UserData = {
  name: string;
};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing.");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function getUniqueUsers() {
  const { data, error } = await supabase
    .from("profile")
    .select("user_metadata->>name");

  if (error) {
    console.error("Error fetching users:", error);
    return null;
  }

  const uniqueUsers = Array.from(
    new Map(data.map(user => [user.name, user])).values()
  ) as UserData[];

  return uniqueUsers;
}
