import { MarketingPageShell } from "@/components/individualPages/marketing-page-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the NotYetLaunched privacy policy to understand how we collect, use, and protect creator and customer data.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell>
      <section className="mx-auto w-full max-w-4xl px-7 py-24 text-foreground">
        <p className="mb-3 text-sm tracking-[0.08em] text-foreground uppercase">
          Legal
        </p>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-10 text-sm text-foreground">Last updated: June 14, 2026</p>

        <div className="space-y-8 text-base leading-7 text-foreground">
          <section>
            <h2 className="mb-2 text-xl font-medium text-foreground">1. Information We Collect</h2>
            <p>
              We collect account details, usage activity, and billing information needed
              to provide and improve NotYetLaunchedOS.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-medium text-foreground">2. How We Use Information</h2>
            <p>
              Your information is used to operate the product, deliver support, process
              payments, and improve platform reliability and performance.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-medium text-foreground">3. Data Sharing</h2>
            <p>
              We do not sell your personal information. We only share data with trusted
              service providers required to run core product functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-medium text-foreground">4. Security</h2>
            <p>
              We apply industry-standard safeguards to protect your data, including
              encryption and access controls where appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-medium text-foreground">5. Contact</h2>
            <p>
              For privacy requests or questions, contact us at{" "}
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
  );
}
