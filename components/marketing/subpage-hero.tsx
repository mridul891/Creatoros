import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { WRAP_CLASS } from "./constants"

type SubpageHeroProps = {
  eyebrow: string
  title: string
  body: string
  primaryCta: string
  secondaryCta: string
}

export function SubpageHero({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
}: SubpageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <div className="pointer-events-none absolute top-[-220px] left-1/2 h-[460px] w-[620px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(32,97,238,0.06)_0%,transparent_65%)] sm:top-[-300px] sm:h-[600px] sm:w-[900px]" />
      <div className={`${WRAP_CLASS} relative`}>
        <div className="max-w-[760px]">
          <p className="mb-4 font-semibold text-[11px] text-primary uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
          <h1 className="mb-5 text-balance font-medium text-[clamp(34px,5vw,58px)] text-foreground leading-[1.02] tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mb-9 max-w-[600px] text-pretty text-[17px] text-muted-foreground leading-[1.68] tracking-[-0.015em]">
            {body}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-[7px] rounded-lg bg-primary px-6 py-3 font-semibold text-[14px] text-primary-foreground tracking-[-0.02em] no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              {primaryCta} <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
            </Link>
            <Link
              href="/waitlist"
              className="rounded-lg border border-border bg-background px-6 py-3 font-medium text-[14px] text-foreground tracking-[-0.01em] no-underline transition-colors hover:bg-muted"
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
