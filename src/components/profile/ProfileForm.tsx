"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { updateProfileAction } from "@/app/actions/profileActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/schemas/profile"

type ProfileFormProps = {
  name: string
  email: string
  avatarUrl: string | null
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  )
}

export function ProfileForm({ name, email, avatarUrl }: ProfileFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name,
      avatarUrl: avatarUrl ?? "",
    },
    mode: "onBlur",
  })

  const watchedName = form.watch("name")
  const watchedAvatarUrl = form.watch("avatarUrl")

  async function onSubmit(data: UpdateProfileInput) {
    setIsSubmitting(true)

    try {
      const result = await updateProfileAction(data)

      if (result.status === "error") {
        toast.error(result.message)
        return
      }

      toast.success("Profile updated.")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 500_000) {
      toast.error("Image too large — use one under 500 KB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      form.setValue("avatarUrl", String(reader.result), {
        shouldDirty: true,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex max-w-xl flex-col gap-6"
    >
      <section className="rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold text-sm tracking-[-0.01em]">
            Profile photo
          </h2>
        </div>
        <div className="flex items-center gap-4 p-4">
          {watchedAvatarUrl ? (
            // biome-ignore lint/performance/noImgElement: user-uploaded avatar data URL
            <img
              src={watchedAvatarUrl}
              alt="Profile photo"
              className="size-16 rounded-xl object-cover"
            />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-xl bg-muted font-semibold text-lg">
              {getInitials(watchedName || name)}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload photo
              </Button>
              {watchedAvatarUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => form.setValue("avatarUrl", "")}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="text-muted-foreground text-xs">
              JPG or PNG, under 500 KB.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold text-sm tracking-[-0.01em]">
            Personal information
          </h2>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-destructive text-xs">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="text-muted-foreground text-xs">
              Your sign-in email cannot be changed.
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
