import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { WRAP_CLASS } from "./constants"

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      desc: "Perfect for creators starting to manage sponsorships professionally.",
      cta: "Get Started",
      primary: false,
      features: [
        "Brand deal tracker",
        "Creator CRM",
        "Contact management",
        "Content calendar",
        "Invoice generation",
        "Basic analytics dashboard",
        "Up to 20 active deals",
        "Email reminders",
      ],
    },
    {
      name: "Growth",
      price: "$49",
      desc: "For creators actively working with brands and scaling partnerships.",
      cta: "Start Growing",
      primary: true,
      badge: "Most Popular",
      features: [
        "Everything in Starter",
        "Unlimited brand deals",
        "Revenue tracking",
        "AI-powered deal insights",
        "Automated follow-up reminders",
        "Media kit generator",
        "Advanced analytics",
        "Performance reporting",
        "Priority support",
      ],
    },
    {
      name: "Pro",
      price: "$99",
      desc: "Built for full-time creators running a serious business.",
      cta: "Go Pro",
      primary: false,
      features: [
        "Everything in Growth",
        "Advanced AI insights",
        "Contract templates",
        "Custom branding",
        "Team collaboration",
        "Multiple workspaces",
        "Revenue forecasting",
        "Advanced reporting",
        "Premium support",
      ],
    },
    {
      name: "Agency",
      price: "Custom",
      desc: "For talent managers, creator agencies, and enterprise teams.",
      cta: "Contact Sales",
      primary: false,
      features: [
        "Unlimited creators",
        "Unlimited workspaces",
        "Team dashboards",
        "White-label reporting",
        "Client management",
        "Agency analytics",
        "Dedicated account manager",
        "Priority onboarding",
        "Enterprise support",
      ],
    },
  ]

  return (
    <section className="border-border border-t bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 text-center sm:mb-14">
          <p className="mb-[14px] font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
            Pricing
          </p>
          <h2 className="mb-3 font-semibold text-[clamp(28px,4vw,40px)] text-foreground tracking-[-0.035em]">
            Simple Pricing for Serious Creators
          </h2>
          <p className="m-0 mx-auto max-w-[760px] text-[15px] text-muted-foreground leading-relaxed">
            Everything you need to manage brand deals, track sponsorships,
            automate follow-ups, and grow your creator business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex h-full flex-col rounded-[12px] border border-border bg-card px-5 py-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:px-6 sm:py-7"
            >
              {plan.primary && (
                <div className="pointer-events-none absolute -inset-px -z-10 rounded-[14px] bg-[radial-gradient(circle_at_top,var(--primary),var(--primary)_45%,transparent_70%)] opacity-10 blur-sm" />
              )}
              {plan.badge && (
                <div className="absolute top-3 right-3 rounded-full border border-border bg-muted px-2.5 py-[4px] font-semibold text-[10px] text-foreground tracking-[0.045em] sm:top-4 sm:right-4">
                  {plan.badge}
                </div>
              )}
              <p className="mt-0 mb-1 font-semibold text-[13px] text-muted-foreground">
                {plan.name}
              </p>
              <p className="mt-0 mb-1 font-semibold text-[clamp(28px,3vw,36px)] text-foreground tracking-[-0.04em]">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="font-normal text-[14px] text-muted-foreground">
                    /month
                  </span>
                )}
              </p>
              <p className="mt-0 mb-6 min-h-0 text-[13px] text-muted-foreground leading-relaxed sm:min-h-[72px]">
                {plan.desc}
              </p>
              <a
                href="#"
                className="mb-6 block rounded-[8px] bg-primary px-0 py-[10px] text-center font-semibold text-[13px] text-primary-foreground tracking-[-0.01em] no-underline transition-all duration-200 hover:bg-primary/90"
              >
                {plan.cta}
              </a>
              <div className="flex flex-1 flex-col gap-[9px]">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={12}
                      color="var(--muted-foreground)"
                      className="shrink-0"
                    />
                    <span className="text-[13px] text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[10px] border border-border bg-muted/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="mt-0 mb-1 font-semibold text-[14px] text-foreground">
              Need an Enterprise Solution?
            </p>
            <p className="m-0 text-[13px] text-muted-foreground">
              Managing multiple creators or large-scale campaigns? Let&apos;s
              build a custom workflow for your team.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 rounded-[7px] border border-border bg-background px-[18px] py-2 text-center font-semibold text-[13px] text-foreground no-underline transition-colors duration-200 hover:bg-muted"
          >
            Talk to Sales →
          </a>
        </div>
      </div>
    </section>
  )
}
