"use client"

import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  type CreatorOnboardingResult,
  saveCreatorOnboarding,
} from "@/features/onboarding/actions/creatorOnboardingActions"
import {
  CREATOR_TYPE_OPTIONS,
  type CreatorType,
} from "@/features/onboarding/enums/creators"
import { cn } from "@/lib/utils"

type CreatorOnboardingFormProps = {
  initialValues?: {
    creatorType?: CreatorType | null
    niche?: string | null
    instagramHandle?: string | null
    youtubeHandle?: string | null
    bio?: string | null
  }
}

type FieldErrors = NonNullable<CreatorOnboardingResult["fieldErrors"]>

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  )
}

export function CreatorOnboardingForm({
  initialValues,
}: CreatorOnboardingFormProps) {
  const [creatorType, setCreatorType] = useState(
    initialValues?.creatorType ?? ""
  )
  const [niche, setNiche] = useState(initialValues?.niche ?? "")
  const [instagramHandle, setInstagramHandle] = useState(
    initialValues?.instagramHandle ?? ""
  )
  const [youtubeHandle, setYoutubeHandle] = useState(
    initialValues?.youtubeHandle ?? ""
  )
  const [bio, setBio] = useState(initialValues?.bio ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFieldErrors({})
    setFormError(null)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await saveCreatorOnboarding(formData)

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {})
        setFormError(
          result.message ?? "Please review your details and try again."
        )
        return
      }

      toast.success(result.message ?? "Onboarding complete.")
    } catch (error) {
      if (isNextRedirect(error)) {
        throw error
      }

      console.error("creator.onboarding_submit_failed", { error })
      setFormError("Something went wrong while saving your profile.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <FieldGroup className="gap-8">
        <div className="space-y-3">
          <h1 className="font-semibold text-3xl text-black tracking-tight sm:text-4xl">
            Almost there
          </h1>
          <p className="text-black/50 text-sm leading-relaxed">
            Tell us a bit about yourself so we can personalize your experience.
          </p>
        </div>

        <Field>
          <FieldLabel className="font-medium text-black/40 text-xs uppercase tracking-wider">
            I am a
          </FieldLabel>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CREATOR_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isSubmitting}
                onClick={() => setCreatorType(option.value)}
                aria-pressed={creatorType === option.value}
                className={cn(
                  "relative h-12 rounded-lg border font-medium text-sm transition-all duration-200",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  creatorType === option.value
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:bg-black/2"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="creatorType" value={creatorType} />
          <FieldError>{fieldErrors.creatorType}</FieldError>
        </Field>

        <Field>
          <FieldLabel className="font-medium text-black/40 text-xs uppercase tracking-wider">
            Your niche
          </FieldLabel>
          <Input
            id="niche"
            name="niche"
            value={niche}
            onChange={(event) => setNiche(event.target.value)}
            placeholder="fitness, fashion, tech, gaming..."
            maxLength={80}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.niche)}
            className="mt-2 h-12 rounded-lg border-black/10 bg-white text-black placeholder:text-black/30 focus:border-black focus:ring-0"
          />
          <FieldError>{fieldErrors.niche}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel className="font-medium text-black/40 text-xs uppercase tracking-wider">
              Instagram
              <span className="ml-1 text-black/25 normal-case">(optional)</span>
            </FieldLabel>
            <Input
              id="instagramHandle"
              name="instagramHandle"
              value={instagramHandle}
              onChange={(event) => setInstagramHandle(event.target.value)}
              placeholder="@username"
              maxLength={30}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.instagramHandle)}
              className="mt-2 h-12 rounded-lg border-black/10 bg-white text-black placeholder:text-black/30 focus:border-black focus:ring-0"
            />
            <FieldError>{fieldErrors.instagramHandle}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="font-medium text-black/40 text-xs uppercase tracking-wider">
              YouTube
              <span className="ml-1 text-black/25 normal-case">(optional)</span>
            </FieldLabel>
            <Input
              id="youtubeHandle"
              name="youtubeHandle"
              value={youtubeHandle}
              onChange={(event) => setYoutubeHandle(event.target.value)}
              placeholder="@channel"
              maxLength={30}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.youtubeHandle)}
              className="mt-2 h-12 rounded-lg border-black/10 bg-white text-black placeholder:text-black/30 focus:border-black focus:ring-0"
            />
            <FieldError>{fieldErrors.youtubeHandle}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel className="font-medium text-black/40 text-xs uppercase tracking-wider">
            Short bio
            <span className="ml-1 text-black/25 normal-case">(optional)</span>
          </FieldLabel>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="What do you create? Who's your audience?"
            maxLength={280}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.bio)}
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-black/10 bg-white px-4 py-3 text-black text-sm outline-none transition-colors placeholder:text-black/30 focus:border-black disabled:cursor-not-allowed disabled:opacity-50"
          />
          <FieldError>{fieldErrors.bio}</FieldError>
        </Field>

        {formError ? (
          <div className="rounded-lg bg-red-50 p-3 text-red-600 text-sm">
            {formError}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg bg-black font-medium text-white transition-colors hover:bg-black/90"
        >
          {isSubmitting ? "Setting up..." : "Complete setup"}
        </Button>

        <p className="text-center text-black/40 text-xs">
          You can always update this later in settings.
        </p>
      </FieldGroup>
    </form>
  )
}
