import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback"
import { IMG_AI_1, IMG_AI_2, IMG_AI_3, IMG_AI_4 } from "./image-urls"

export function AISection() {
  const capabilities = [
    {
      title: "Insights Engine",
      desc: "Analyzes every post across all platforms to surface patterns humans miss — best times, best formats, best hooks.",
      img: IMG_AI_1,
      pill: "Core Model",
      cardClass: "lg:col-span-1",
    },
    {
      title: "Content Recommendations",
      desc: "Weekly personalized recommendations based on your top-performing content and audience behavior.",
      img: IMG_AI_2,
      pill: "Weekly Brief",
      cardClass: "lg:col-span-1",
    },
    {
      title: "Automated Workflows",
      desc: "Set rules once — data syncs, invoices draft, and reminders fire automatically so you can focus on creating.",
      img: IMG_AI_3,
      pill: "No-Code Rules",
      cardClass: "lg:col-span-1",
    },
    {
      title: "Predictive Analytics",
      desc: "Forecast next month's reach and revenue based on your current trajectory and historical patterns.",
      img: IMG_AI_4,
      pill: "Forecasting",
      cardClass: "lg:col-span-1",
    },
  ]

  return (
    <section className="border-border border-t bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-[680px] text-center sm:mb-14">
          <div className="mb-5 inline-flex items-center gap-[7px] rounded-full border border-border bg-muted px-3 py-1.5">
            <HugeiconsIcon
              icon={SparklesIcon}
              size={12}
              color="var(--muted-foreground)"
            />
            <span className="text-[11px] text-muted-foreground">
              Powered by Claude AI
            </span>
          </div>
          <h2 className="mx-auto mb-4 font-semibold text-[30px] text-foreground leading-[1.1] tracking-[-0.03em] sm:text-[36px] lg:text-[40px]">
            Intelligence that works
            <br />
            while you create
          </h2>
          <p className="mx-auto max-w-[56ch] text-[15px] text-muted-foreground leading-[1.7] sm:text-base">
            CreatorOS AI monitors your data around the clock, surfacing the
            insights that grow your audience and revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-[#060606] lg:grid-cols-2">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className={[
                "relative flex min-h-[280px] flex-col justify-between gap-8 bg-[#060606] p-6 sm:p-8",
                "border-border border-b lg:border-b-0",
                index === 0 || index === 2
                  ? "lg:border-border lg:border-r"
                  : "",
                index >= 2 ? "lg:border-border lg:border-t" : "",
                capability.cardClass,
              ].join(" ")}
            >
              <div className="relative z-10 flex-1">
                <span className="mb-5 inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground uppercase tracking-[0.06em]">
                  {capability.pill}
                </span>
                <h3 className="mb-3 max-w-[24ch] font-medium text-[24px] text-foreground leading-[1.2] tracking-[-0.02em]">
                  {capability.title}
                </h3>
                <p className="m-0 max-w-[52ch] text-[14px] text-muted-foreground leading-[1.7]">
                  {capability.desc}
                </p>
              </div>
              <div className="relative z-10 h-[156px] w-full overflow-hidden rounded-xl border border-border bg-[#0a0a0a] p-2 sm:h-[180px]">
                <ImageWithFallback
                  src={capability.img}
                  alt={capability.title}
                  className="h-full w-full rounded-lg object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
