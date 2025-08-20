"use client"

import { useActionState } from "react" 
import { Input } from "@/components/ui/input"

import { subscribeAction } from "@/app/actions/newsletter-subscribe"
import SubmitButton from "@/components/user-interface/SubmitButton"

export default function NewsletterForm() {
  const [state, formAction] = useActionState(subscribeAction, {
    error: undefined,
    success: undefined,
  })

  return (
    <form action={formAction}>
      <Input type="email" name="email" placeholder="Enter your email" />
      {state.error && <p className="text-sm text-red-500 mt-1">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-600 mt-1">{state.success}</p>
      )}
      <SubmitButton />
    </form>
  )
}