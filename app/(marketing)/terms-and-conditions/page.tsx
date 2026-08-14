import type { Metadata } from "next"
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the NotYetLaunched terms and conditions covering platform use, billing, and service responsibilities.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
}

export default function TermsAndConditionsPage() {
  return (
    <MarketingPageShell>
      <section className="mx-auto w-full max-w-4xl px-7 py-24 text-foreground">
        <p className="mb-3 text-foreground text-sm uppercase tracking-[0.08em]">
          Legal
        </p>
        <h1 className="mb-6 font-semibold text-4xl tracking-tight">
          Terms & Conditions
        </h1>
        <p className="mb-10 text-foreground text-sm">
          Last updated: June 14, 2026
        </p>

        <div className="space-y-8 text-base text-foreground leading-7">
          <section>
            <h2 className="mb-2 font-medium text-foreground text-xl">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using NotYetLaunchedOS, you agree to these Terms
              and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-medium text-foreground text-xl">
              2. Account Responsibilities
            </h2>
            <p>
              You are responsible for maintaining account security and ensuring
              that your use of the platform complies with these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-medium text-foreground text-xl">
              3. Payment and Billing
            </h2>
            <p>
              Paid plans are billed according to your selected subscription.
              Fees are non-refundable unless required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-medium text-foreground text-xl">
              4. Service Availability
            </h2>
            <p>
              We aim to keep the platform available and reliable but do not
              guarantee uninterrupted service at all times.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-medium text-foreground text-xl">
              5. Contact
            </h2>
            <p>
              For legal questions regarding these Terms, contact{" "}
              <a
                href="mailto:support@notyetlaunched.xyz"
                className="text-foreground underline underline-offset-4"
              >
                support@notyetlaunched.xyz
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </MarketingPageShell>
  )
}
