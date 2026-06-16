import { LoginForm } from "@/components/login-form"
import { createSupabaseServerClient } from "@/lib/supabase/server-client"
import { redirect } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#050505] px-6 py-10 text-white md:px-10">
      <div className="pointer-events-none absolute -left-48 -top-40 size-96 rounded-full bg-[#E8402A]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-48 size-96 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section className="hidden space-y-8 lg:block">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            NotYetLaunchedOS
          </div>
          <div className="space-y-4">
            <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight">
              The creator CRM to run your brand deal business.
            </h1>
            <p className="max-w-xl text-base text-white/65">
              NotYetLaunched helps content creators track sponsorships, invoices,
              payments, and deliverables in one beautifully organized workspace.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              "Track every deal from outreach to payout",
              "Never miss a sponsorship deadline again",
              "See pipeline, payments, and tasks in one place",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/75">
                <CheckCircle2 className="size-4 text-[#E8402A]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
