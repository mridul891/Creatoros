import { ArrowRight02Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { WRAP_CLASS } from "./constants"

export function FooterCTA() {
  const footerLinks = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ]

  return (
    <>
      <section className="border-border border-t bg-background px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-7 lg:py-[120px]">
        <div className="mx-auto max-w-[640px]">
          <h2 className="mt-0 mb-5 font-semibold text-[clamp(36px,5.5vw,60px)] text-foreground leading-[1.05] tracking-[-0.045em]">
            Plan the present.
            <br />
            Build the future.
          </h2>
          <p className="mx-auto mt-0 mb-9 max-w-[400px] text-base text-muted-foreground leading-[1.65]">
            Join 10,000+ creators who use NotYetLaunchedOS to grow their
            audience, close more brand deals, and build a real business.
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="flex w-full items-center justify-center gap-[7px] rounded-lg bg-primary px-6 py-3 font-semibold text-[14px] text-primary-foreground tracking-[-0.02em] no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:w-auto sm:px-7 sm:text-[15px]"
            >
              Start for free — no credit card{" "}
              <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
            </a>
            <a
              href="#"
              className="w-full rounded-lg border border-border bg-background px-[22px] py-3 font-medium text-[14px] text-foreground no-underline transition-colors hover:bg-muted sm:w-auto sm:text-[15px]"
            >
              Free forever. Upgrade anytime.
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              "No credit card required",
              "Cancel anytime",
              "99.9% uptime SLA",
            ].map((text) => (
              <span
                key={text}
                className="flex items-center gap-[5px] text-muted-foreground text-xs"
              >
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={11}
                  color="var(--muted-foreground)"
                />{" "}
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-border border-t bg-background pt-12 pb-10 sm:pt-16">
        <div className={`${WRAP_CLASS}`}>
          <div className="rounded-2xl bg-primary px-5 py-8 text-white sm:px-7 sm:py-10 lg:px-10 lg:py-12">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:mb-14 md:flex-row">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="logo"
                    width={100}
                    height={100}
                    className="brightness-0 invert"
                  />
                </div>
                <p className="mt-0 mb-5 max-w-[200px] text-[13px] text-white/80 leading-[1.6]">
                  The operating system for professional content creators.
                </p>
              </div>
              <div className="flex flex-wrap justify-start gap-4 sm:gap-5 md:justify-end">
                {footerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13px] text-white/80 no-underline transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-white/20 border-t pt-6">
              <p className="py-3 text-center font-bold text-[clamp(2rem,11vw,7.25rem)] text-white/15 leading-none tracking-tight">
                NOTYETLAUNCHED
              </p>
            </div>

            <div className="flex flex-col gap-3 border-white/20 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-white/70 text-xs">
                © 2026 NotYetLaunchedOS. All rights reserved.
              </span>
              <div className="flex flex-wrap gap-4 sm:gap-5">
                <Link
                  href="/privacy-policy"
                  className="text-white/70 text-xs no-underline transition-colors duration-150 hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="text-white/70 text-xs no-underline transition-colors duration-150 hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
