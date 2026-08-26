import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Metadata } from "next"
import Link from "next/link"

import { ProfileForm } from "@/components/profile/ProfileForm"
import { requireOnboardedUser } from "@/lib/auth/require-user"

export const metadata: Metadata = {
  title: "Profile",
  alternates: {
    canonical: "/profile",
  },
}

export default async function ProfilePage() {
  const user = await requireOnboardedUser()

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
          Back to dashboard
        </Link>
        <h1 className="mt-2 font-bold text-2xl tracking-[-0.03em]">Profile</h1>
        <p className="text-muted-foreground text-sm leading-[1.7]">
          Manage your account information.
        </p>
      </header>

      <main>
        <ProfileForm
          name={user.name ?? ""}
          email={user.email}
          avatarUrl={user.avatarUrl}
        />
      </main>
    </div>
  )
}
