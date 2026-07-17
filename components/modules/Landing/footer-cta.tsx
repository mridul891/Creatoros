import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Image from "next/image";
import { WRAP_CLASS } from "./constants";

export function FooterCTA() {
  const footerLinks = [
    { label: "Product", href: "/product" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ];

  return (
    <>
      <section className="border-t border-border bg-background px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-7 lg:py-[120px]">
        <div className="mx-auto max-w-[640px]">
          <h2 className="mb-5 mt-0  text-[clamp(36px,5.5vw,60px)] font-semibold leading-[1.05] tracking-[-0.045em] text-foreground">
            Plan the present.
            <br />
            Build the future.
          </h2>
          <p className="mx-auto mb-9 mt-0 max-w-[400px]  text-base leading-[1.65] text-muted-foreground">
            Join 10,000+ creators who use NotYetLaunchedOS to grow their audience,
            close more brand deals, and build a real business.
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="flex w-full items-center justify-center gap-[7px] rounded-lg bg-primary px-6 py-3  text-[14px] font-semibold tracking-[-0.02em] text-primary-foreground no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:w-auto sm:px-7 sm:text-[15px]"
            >
              Start for free — no credit card <ArrowRight size={15} />
            </a>
            <a
              href="#"
              className="w-full rounded-lg border border-border bg-background px-[22px] py-3  text-[14px] font-medium text-foreground no-underline transition-colors hover:bg-muted sm:w-auto sm:text-[15px]"
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
                className="flex items-center gap-[5px]  text-xs text-muted-foreground"
              >
                <Check size={11} color="var(--muted-foreground)" /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background pb-10 pt-12 sm:pt-16">
        <div className={`${WRAP_CLASS}`}>
          <div className="rounded-2xl bg-primary px-5 py-8 text-white sm:px-7 sm:py-10 lg:px-10 lg:py-12">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 sm:mb-14 md:flex-row">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Image src="/logo.svg" alt="logo" width={100} height={100} className="brightness-0 invert" />
                </div>
                <p className="mb-5 mt-0 max-w-[200px]  text-[13px] leading-[1.6] text-white/80">
                  The operating system for professional content creators.
                </p>
              </div>
              <div className="flex flex-wrap justify-start gap-4 sm:gap-5 md:justify-end">
                {footerLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className=" text-[13px] text-white/80 no-underline transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <p className="py-3 text-center font-bold text-[clamp(2rem,11vw,7.25rem)] leading-none tracking-tight text-white/15">
                NOTYETLAUNCHED
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className=" text-xs text-white/70">
                © 2026 NotYetLaunchedOS. All rights reserved.
              </span>
              <div className="flex flex-wrap gap-4 sm:gap-5">
                <Link
                  href="/privacy-policy"
                  className=" text-xs text-white/70 no-underline transition-colors duration-150 hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className=" text-xs text-white/70 no-underline transition-colors duration-150 hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
