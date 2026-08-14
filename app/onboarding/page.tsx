import Link from "next/link"
import { redirect } from "next/navigation"
import { CreatorOnboardingForm } from "@/components/onboarding/creator-onboarding-form"
import { requireUser } from "@/lib/auth/require-user"
import { prisma } from "@/lib/prisma"

export default async function OnboardingPage() {
  const user = await requireUser()

  if (user.isOnboardingComplete) {
    redirect("/dashboard")
  }

  const creator = await prisma.creator.findUnique({
    where: { userId: user.id },
  })

  return (
    <div className="min-h-svh bg-white text-black">
      <div className="grid min-h-svh lg:grid-cols-2">
        <section className="relative flex flex-col p-6 md:p-10">
          <div className="flex items-center justify-center md:justify-start">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-2 px-1 py-1 font-medium"
            >
              <span className="font-semibold text-black text-sm tracking-wide">
                !notyetlaunched
              </span>
            </Link>
          </div>

          <div className="relative flex flex-1 items-center justify-center py-8 md:py-0">
            <div className="w-full max-w-md">
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
        </section>

        <section className="relative hidden p-4 lg:block">
          <div className="relative h-full w-full overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-[url('/onboarding.png')] bg-center bg-cover" />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative flex h-full flex-col justify-between p-12">
              <div />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
