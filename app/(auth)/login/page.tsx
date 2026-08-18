import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/shared/LoginForm"
import { getCurrentUser } from "@/lib/auth/require-user"

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect(user.isOnboardingComplete ? "/dashboard" : "/onboarding")
  }

  return (
    <div className="min-h-svh bg-white text-black">
      <div className="pointer-events-none absolute inset-0" />
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
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
        </section>
        <section className="relative hidden p-4 lg:block">
          <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-[0_24px_90px_-45px_rgba(0,0,0,0.8)]">
            <Image
              src="/signup.png"
              alt="Blooming tree on a sunny hill"
              fill
              sizes="100vw 100vh"
              priority
              className="object-cover brightness-[0.92] saturate-[1.06]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-white/25 via-transparent to-white/10" />
          </div>
        </section>
      </div>
    </div>
  )
}
