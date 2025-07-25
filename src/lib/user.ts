import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProfileData = {
  name: string;
  aboutUser: string;
  socialLinks: { platform: string; userName: string }[];
  avatar: string;
  email: string;
  contactPhoneNumber: string;
  contactCountry: string;
};

export async function getUserProfile(username: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("profile")
    .select(`
      user_metadata->name,
      user_metadata->avatar,
      user_metadata->email,
      user_metadata->contactPhoneNumber,
      user_metadata->contactCountry,
      user_metadata->aboutUser,
      user_metadata->socialLinks
    `)
    .eq("user_metadata->>userName", username)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as ProfileData;
}

export type UserData = { name: string };

export async function getUniqueUsers(): Promise<UserData[]> {
  const { data, error } = await supabase
    .from("profile")
    .select("user_metadata->>name");

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  const uniqueUsers = Array.from(
    new Map(data.map(user => [user.name, user])).values()
  ) as UserData[];

  return uniqueUsers;
}