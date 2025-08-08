import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProfileData = {
  id: string;
  name: string;
  aboutUser: string;
  socialLinks: { platform: string; userName: string }[];
  avatar: string;
  email: string;
  contactPhoneNumber: string;
  contactCountry: string;
  is_verified: boolean;
};

export type CommunitySummary = {
  role: string;
  name: string;
  avatar: string;
  url_name: string;
};

export type UserCommunities = {
  owned_communities: CommunitySummary[];
  member_communities: CommunitySummary[];
};

export type RawCommunityFull = {
  role:     string;
  name:     string;
  avatar:   string;
  url_name: string;
  [key: string]: unknown;
};

export async function getUserProfile(username: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("profile")
    .select(`
      id,
      user_metadata->name,
      user_metadata->avatar,
      user_metadata->email,
      user_metadata->contactPhoneNumber,
      user_metadata->contactCountry,
      user_metadata->aboutUser,
      user_metadata->socialLinks,
      is_verified
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

export async function getUserCommunityDetailsById(
  userId: string
): Promise<UserCommunities | null> {
  const { data, error } = await supabase
    .rpc('get_user_community_details', { u_user_id: userId });

  if (error) {
    console.error("Error fetching communities:", error);
    return null;
  }

  const owned = Array.isArray(data?.owned_communities)
    ? data.owned_communities
    : [];
  const member = Array.isArray(data?.member_communities)
    ? data.member_communities
    : [];

  const pick = (c: RawCommunityFull): CommunitySummary => ({
    role:      c.role,
    name:      c.name,
    avatar:    c.avatar,
    url_name:  c.url_name,
  });

  return {
    owned_communities:  owned.map(pick),
    member_communities: member.map(pick),
  };
}