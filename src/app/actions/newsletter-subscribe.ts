"use server"

export async function subscribeAction(
  prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const email = formData.get("email") as string

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address.", success: undefined }
  }

  // TODO: Save email in DB / API call
  console.log("✅ Subscribed with:", email)

  return { error: undefined, success: "You’re subscribed!" }
}