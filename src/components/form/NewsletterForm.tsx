"use client"

import { useActionState } from "react" 
import { Input } from "@/components/ui/input"

import { subscribeAction } from "@/app/actions/newsletter-subscribe"
import SubmitButton from "@/components/user-interface/SubmitButton"

type NewsletterFormProps = {
  subscriberId: string
}

type NewsletterFormState = {
  error?: string;
  success?: string;
}

export default function NewsletterForm({ subscriberId }: NewsletterFormProps) {
   const [state, formAction] = useActionState(
    async (prevState: NewsletterFormState, formData: FormData) => {
      return await subscribeAction(prevState, formData, subscriberId)
    },
    { error: undefined, success: undefined }
  )

  return (
    <form action={formAction}>
      <Input type="email" name="email" placeholder="Enter your email" className={state.error ? "border-red-500" : ''} />

      {state.error && <p className="text-sm text-red-500 mt-1">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-600 mt-1">{state.success}</p>
      )}
      <SubmitButton />
    </form>
  )
}