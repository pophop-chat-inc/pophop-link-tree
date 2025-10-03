"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeAction(
  prevState: { error?: string; success?: string },
  formData: FormData,
  subscriberId: string
): Promise<{ error?: string; success?: string }> {
  const emailRaw = formData.get("email")
  const email = typeof emailRaw === "string" ? emailRaw.trim() : ""

  if (!email || !emailRegex.test(email)) {
    return { error: "Please enter a valid email address.", success: undefined }
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars missing in production");
  }

  try {
    const { data: userProfile, error: profileError } = await supabase
    .from("profile")
    .select("id")
    .filter("user_metadata->>email", "eq", email)
    .maybeSingle()

    if (profileError) {
      console.error(profileError)
      return { error: "Something went wrong.", success: undefined }
    }

    const user_id = userProfile?.id ?? null

    const { data: existing, error: checkError } = await supabase
      .from("newsletter_subscription")
      .select("id")
      .match({
        email,
        publisher_id: subscriberId
      })
      .maybeSingle()

    if (checkError) {
      console.error(checkError)
      return { error: "Something went wrong.", success: undefined }
    }

    if (existing) {
      return { error: "Already subscribed.", success: undefined }
    }

    const { error: insertError } = await supabase
      .from("newsletter_subscription")
      .insert({
        email,
        source: "Pop.Army",
        publisher_id: subscriberId,
        user_id,
        subscribed_status: true,
      })

    if (insertError) {
      console.error(insertError)
      return { error: "Failed to subscribe. Please try again.", success: undefined }
    }

    return { error: undefined, success: "You're subscribed!" }
  } catch (err) {
    console.error(err)
    return { error: "Unexpected error occurred.", success: undefined }
  }
}
