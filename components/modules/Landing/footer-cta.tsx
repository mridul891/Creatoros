import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { wrap } from "./constants";

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
      <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#050505] px-7 py-[120px] text-center">
        <div className="mx-auto max-w-[640px]">
          <h2 className="mb-5 mt-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(36px,5.5vw,60px)] font-semibold leading-[1.05] tracking-[-0.045em] text-white">
            Plan the present.
            <br />
            Build the future.
          </h2>
          <p className="mx-auto mb-9 mt-0 max-w-[400px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-base leading-[1.65] text-[rgba(255,255,255,0.84)]">
            Join 10,000+ creators who use NotYetLaunchedOS to grow their audience,
            close more brand deals, and build a real business.
          </p>
          <div className="mb-6 flex items-center justify-center gap-3">
            <a
              href="#"
              className="flex items-center gap-[7px] rounded-lg bg-white px-7 py-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[15px] font-semibold tracking-[-0.02em] text-black no-underline"
            >
              Start for free — no credit card <ArrowRight size={15} />
            </a>
            <a
              href="#"
              className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-[22px] py-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[15px] font-medium text-[rgba(255,255,255,0.84)] no-underline"
            >
              Free forever. Upgrade anytime.
            </a>
          </div>
          <div className="flex items-center justify-center gap-6">
            {[
              "No credit card required",
              "Cancel anytime",
              "99.9% uptime SLA",
            ].map((text) => (
              <span
                key={text}
                className="flex items-center gap-[5px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-xs text-[rgba(255,255,255,0.72)]"
              >
                <Check size={11} color="rgba(255,255,255,0.58)" /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(255,255,255,0.07)] bg-[#050505] pb-10 pt-16">
        <div style={wrap}>
          <div className="mb-14 flex items-start justify-between gap-8">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-white">
                  <Sparkles size={12} color="#000" />
                </div>
                <span className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] font-bold tracking-[-0.02em] text-white">
                  NotYetLaunchedOS
                </span>
              </div>
              <p className="mb-5 mt-0 max-w-[200px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] leading-[1.6] text-[rgba(255,255,255,0.78)]">
                The operating system for professional content creators.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-5">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] text-[rgba(255,255,255,0.84)] no-underline transition-colors duration-150 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

            <p className="bg-linear-to-b from-white/20 to-white/5 bg-clip-text py-3 text-center font-bold text-[clamp(2rem,11vw,7.25rem)] leading-none tracking-tight text-transparent">
              NOTYETLAUNCHED
            </p>

          <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.07)] pt-6">
            <span className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-xs text-[rgba(255,255,255,0.72)]">
              © 2026 NotYetLaunchedOS. All rights reserved.
            </span>
            <div className="flex gap-5">
              <Link
                href="/privacy-policy"
                className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-xs text-[rgba(255,255,255,0.78)] no-underline transition-colors duration-150 hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-xs text-[rgba(255,255,255,0.78)] no-underline transition-colors duration-150 hover:text-white"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
