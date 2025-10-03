"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeAction(
  prevState: { error?: string; success?: string },
  formData: FormData,
  subscriberId : string
): Promise<{ error?: string; success?: string }> {
  const emailRaw = formData.get("email")
  const email = typeof emailRaw === "string" ? emailRaw.trim() : ""

  if (!email || !emailRegex.test(email)) {
    return { error: "Please enter a valid email address.", success: undefined }
  }

  try {
    const { data: userProfile, error: profileError } = await supabase
      .from("profile")
      .select("id")
      .eq("user_metadata->>email", email)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error(profileError)
      return { error: "Something went wrong.", success: undefined }
    }

    const user_id = userProfile?.id ?? undefined

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
        user_id: user_id,
        subscribed_status: true,
      })

    if (insertError) {
      console.error(insertError)
      return { error: "Failed to subscribe. Please try again.", success: undefined }
    }

    return { error: undefined, success: "You’re subscribed!" }
  } catch (err) {
    console.error(err)
    return { error: "Unexpected error occurred.", success: undefined }
  }
}
