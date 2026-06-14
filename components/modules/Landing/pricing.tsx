import { Check } from "lucide-react";

import { wrap } from "./constants";

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
  ];

  return (
    <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#050505] py-24">
      <div style={wrap}>
        <div className="mb-14 text-center">
          <p className="mb-[14px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.4)]">
            Pricing
          </p>
          <h2 className="mb-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-white">
            Simple Pricing for Serious Creators
          </h2>
          <p className="mx-auto m-0 max-w-[760px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[15px] leading-relaxed text-[rgba(255,255,255,0.65)]">
            Everything you need to manage brand deals, track sponsorships,
            automate follow-ups, and grow your creator business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={"relative flex h-full flex-col rounded-[12px] border px-6 py-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.2)] bg-[#080808] border-[rgba(255,255,255,0.08)]"}
            >
              {plan.primary && (
                <div className="pointer-events-none absolute -inset-px -z-10 rounded-[14px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),rgba(255,255,255,0.04)_45%,transparent_70%)] blur-sm" />
              )}
              {plan.badge && (
                <div className="absolute right-4 top-4 rounded-full border border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.14)] px-2.5 py-[4px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[10px] font-semibold tracking-[0.045em] text-white">
                  {plan.badge}
                </div>
              )}
              <p className="mb-1 mt-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] font-semibold text-[rgba(255,255,255,0.65)]">
                {plan.name}
              </p>
              <p className="mb-1 mt-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(28px,3vw,36px)] font-semibold tracking-[-0.04em] text-white">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="text-[14px] font-normal text-[rgba(255,255,255,0.4)]">
                    /month
                  </span>
                )}
              </p>
              <p className="mb-6 mt-0 min-h-[72px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] leading-relaxed text-[rgba(255,255,255,0.48)]">
                {plan.desc}
              </p>
              <a
                href="#"
                className={"mb-6 block rounded-[8px] px-0 py-[10px] text-center font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] font-semibold tracking-[-0.01em] no-underline transition-all duration-200 bg-white text-black hover:bg-[rgba(255,255,255,0.92)]"}
              >
                {plan.cta}
              </a>
              <div className="flex flex-1 flex-col gap-[9px]">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check
                      size={12}
                      color="rgba(255,255,255,0.45)"
                      className="shrink-0"
                    />
                    <span className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] text-[rgba(255,255,255,0.65)]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#080808] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="mb-1 mt-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] font-semibold text-white">
              Need an Enterprise Solution?
            </p>
            <p className="m-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] text-[rgba(255,255,255,0.4)]">
              Managing multiple creators or large-scale campaigns? Let&apos;s build a
              custom workflow for your team.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-[18px] py-2 text-center font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] font-semibold text-white no-underline transition-colors duration-200 hover:bg-[rgba(255,255,255,0.1)]"
          >
            Talk to Sales →
          </a>
        </div>
      </div>
    </section>
  );
}
