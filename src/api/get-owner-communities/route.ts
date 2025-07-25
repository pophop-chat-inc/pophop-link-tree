import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

type ProfileData = {
  name: string;
  aboutUser: string;
  socialLinks: { platform: string; userName: string }[];
  avatar: string;
  email: string;
  contactPhoneNumber: string;
  contactCountry: string;
}

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserProfile(username: string) {
  const { data, error } = await supabase
    .from('profile')
    .select('user_metadata->name, user_metadata->avatar, user_metadata->email, user_metadata->contactPhoneNumber, user_metadata-> contactCountry, user_metadata->aboutUser, user_metadata->socialLinks')
    .eq('user_metadata->>userName', username)
    .single<ProfileData>();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}