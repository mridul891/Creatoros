import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback"
import { WRAP_CLASS } from "./constants"
import { IMG_HERO } from "./image-urls"
import { NetworkAsciiPattern } from "./NetworkAsciiPattern"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-0 sm:pt-28 lg:pt-32">
      <div className="pointer-events-none absolute top-[-220px] left-1/2 h-[460px] w-[620px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(32,97,238,0.06)_0%,transparent_65%)] sm:top-[-300px] sm:h-[600px] sm:w-[900px]" />

      {/* ASCII art patterns on sides */}
      <NetworkAsciiPattern
        side="left"
        className="absolute top-[5%] -left-4 z-0 hidden sm:block lg:-left-8 xl:left-0"
      />
      <NetworkAsciiPattern
        side="right"
        className="absolute top-[8%] -right-4 z-0 hidden sm:block lg:-right-8 xl:right-0"
      />

      <div className={`${WRAP_CLASS} relative text-center`}>
        <div className="mb-7 inline-flex items-center gap-[7px] rounded-full border border-border bg-muted px-[14px] py-[5px] sm:mb-9">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
          <span className="text-muted-foreground text-xs">
            New: AI Media Kit Generator
          </span>
        </div>

        <h1 className="mx-auto mb-5 max-w-[820px] font-medium text-[clamp(30px,8vw,60px)] text-foreground leading-[1.02] tracking-[-0.045em] sm:mb-6 sm:leading-none">
          Organize your Workflow, <br />
          Simplify <span className="text-primary italic">Your Success.</span>
        </h1>

        <p className="mx-auto mb-8 max-w-[560px] text-[16px] text-muted-foreground leading-[1.65] tracking-[-0.015em] sm:mb-10 sm:text-[18px]">
          Track every sponsorship from the first DM to the final payment.
        </p>

        <div className="mb-12 flex items-center justify-center gap-3 sm:mb-14">
          <Link
            href="/waitlist"
            className="flex items-center gap-[7px] rounded-lg bg-primary px-5 py-3 font-semibold text-[14px] text-primary-foreground tracking-[-0.02em] no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:px-[26px] sm:text-[15px]"
          >
            Get started free <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
          </Link>
        </div>
      </div>

      <div className={`${WRAP_CLASS} relative max-w-[1200px] py-8 sm:py-10`}>
        <div className="pointer-events-none absolute top-[10%] left-1/2 z-0 h-[220px] w-[85%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(32,97,238,0.08)_0%,transparent_70%)] sm:h-[300px] sm:w-[70%]" />
        <div className="relative z-1 overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-black/5">
          <ImageWithFallback
            src={IMG_HERO}
            alt="CreatorOS dashboard"
            className="block w-full"
          />
        </div>
      </div>
    </section>
  )
}
