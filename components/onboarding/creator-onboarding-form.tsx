"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AtSign, Check, Play, Sparkles, User } from "lucide-react"

import {
  CREATOR_TYPE_OPTIONS,
  CreatorType,
} from "@/enums/creators"
import {
  saveCreatorOnboarding,
  type CreatorOnboardingResult,
} from "@/app/action/creatorOnboardingActions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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

export function CreatorOnboardingForm({ initialValues }: CreatorOnboardingFormProps) {
  const router = useRouter()
  const [creatorType, setCreatorType] = useState(initialValues?.creatorType ?? "")
  const [niche, setNiche] = useState(initialValues?.niche ?? "")
  const [instagramHandle, setInstagramHandle] = useState(
    initialValues?.instagramHandle ?? ""
  )
  const [youtubeHandle, setYoutubeHandle] = useState(initialValues?.youtubeHandle ?? "")
  const [bio, setBio] = useState(initialValues?.bio ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const bioCharactersLeft = 280 - bio.length

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
        setFormError(result.message ?? "Please review your details and try again.")
        return
      }

      toast.success(result.message ?? "Onboarding complete.")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("creator.onboarding_submit_failed", { error })
      setFormError("Something went wrong while saving your profile.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-black/55 p-6 shadow-[0_30px_80px_-40px_rgba(232,64,42,0.6)] backdrop-blur-xl sm:p-8"
    >
      <FieldGroup>
        <div className="space-y-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
            <Sparkles className="size-3.5 text-[#E8402A]" />
            Step 1 of 1
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Finish your onboarding
            </h1>
            <FieldDescription className="mt-2 text-white/70">
              Add a few details so we can personalize your creator workspace.
            </FieldDescription>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
            <div className="flex items-start gap-2 text-xs text-white/70">
              <Check className="mt-0.5 size-4 shrink-0 text-[#E8402A]" />
              <p>
                Your profile helps us prioritize the deals and insights that are
                most relevant to your growth stage.
              </p>
            </div>
          </div>
        </div>

        <Field>
          <FieldLabel className="text-white">
            Creator type
          </FieldLabel>
          <div className="grid gap-2 sm:grid-cols-3">
            {CREATOR_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isSubmitting}
                onClick={() => setCreatorType(option.value)}
                aria-pressed={creatorType === option.value}
                className={cn(
                  "group flex h-11 items-center justify-center rounded-xl border bg-black/45 px-3 text-sm font-medium transition-all",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  creatorType === option.value
                    ? "border-[#E8402A]/55 bg-[#E8402A]/15 text-white shadow-[0_0_0_1px_rgba(232,64,42,0.3)]"
                    : "border-white/15 text-white/80 hover:border-white/30 hover:bg-white/6"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="creatorType" value={creatorType} />
          <FieldError>{fieldErrors.creatorType}</FieldError>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="niche" className="text-white">
              Niche
            </FieldLabel>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="niche"
                name="niche"
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
                placeholder="e.g. fitness, fashion, tech"
                maxLength={80}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.niche)}
                className="h-11 border-white/15 bg-black/50 pl-9 text-white placeholder:text-white/45"
              />
            </div>
            <FieldError>{fieldErrors.niche}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="instagramHandle" className="text-white">
              Instagram handle <span className="text-white/50">(optional)</span>
            </FieldLabel>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="instagramHandle"
                name="instagramHandle"
                value={instagramHandle}
                onChange={(event) => setInstagramHandle(event.target.value)}
                placeholder="@yourhandle"
                maxLength={30}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.instagramHandle)}
                className="h-11 border-white/15 bg-black/50 pl-9 text-white placeholder:text-white/45"
              />
            </div>
            <FieldError>{fieldErrors.instagramHandle}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="youtubeHandle" className="text-white">
              YouTube handle <span className="text-white/50">(optional)</span>
            </FieldLabel>
            <div className="relative">
              <Play className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <Input
                id="youtubeHandle"
                name="youtubeHandle"
                value={youtubeHandle}
                onChange={(event) => setYoutubeHandle(event.target.value)}
                placeholder="@yourchannel"
                maxLength={30}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.youtubeHandle)}
                className="h-11 border-white/15 bg-black/50 pl-9 text-white placeholder:text-white/45"
              />
            </div>
            <FieldError>{fieldErrors.youtubeHandle}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="bio" className="text-white">
            Bio <span className="text-white/50">(optional)</span>
          </FieldLabel>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="What do you create and who is your audience?"
            maxLength={280}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.bio)}
            className="min-h-28 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          />
          <FieldDescription className="flex items-center justify-between text-white/55">
            <span>Keep it short (max 280 characters).</span>
            <span>{bioCharactersLeft} left</span>
          </FieldDescription>
          <FieldError>{fieldErrors.bio}</FieldError>
        </Field>

        {formError ? <FieldError>{formError}</FieldError> : null}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl bg-white text-black hover:bg-white/90"
        >
          {isSubmitting ? "Saving..." : "Complete onboarding"}
        </Button>
      </FieldGroup>
    </form>
  )
}
