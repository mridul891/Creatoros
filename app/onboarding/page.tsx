import { requireUser } from "@/lib/auth/require-user"
import { prisma } from "@/lib/prisma"
import { CreatorOnboardingForm } from "@/components/onboarding/creator-onboarding-form"
import { redirect } from "next/navigation"
import { CheckCircle2, Sparkles } from "lucide-react"

export default async function OnboardingPage() {
  const user = await requireUser()

  if (user.isOnboardingComplete) {
    redirect("/dashboard")
  }

  const creator = await prisma.creator.findUnique({
    where: { userId: user.id },
  })

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#050505] px-6 py-10 text-white md:px-10">
      <div className="pointer-events-none absolute -left-48 -top-40 size-96 rounded-full bg-[#E8402A]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-48 size-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-6xl items-start gap-10 lg:grid-cols-2">
        <section className="hidden space-y-8 pt-6 lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <Sparkles className="size-3.5 text-[#E8402A]" />
            Creator setup
          </div>

          <div className="space-y-4">
            <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight">
              Let&apos;s shape your creator profile.
            </h1>
            <p className="max-w-xl text-base text-white/65">
              This takes under 2 minutes and helps personalize your deal
              pipeline, brand opportunities, and dashboard insights.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              "Tailored workflow recommendations for your creator tier",
              "Cleaner campaign matching based on your niche",
              "A dashboard customized to your growth stage",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/75">
                <CheckCircle2 className="size-4 text-[#E8402A]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full max-w-xl justify-self-center lg:justify-self-end">
          <CreatorOnboardingForm
            initialValues={{
              creatorType: creator?.creatorType ?? null,
              niche: creator?.niche ?? null,
              instagramHandle: creator?.instagramHandle ?? null,
              youtubeHandle: creator?.youtubeHandle ?? null,
              bio: creator?.bio ?? null,
            }}
          />
        </div>
      </div>
    </main>
  )
}
