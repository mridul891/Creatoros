import {
  BarChartIcon,
  Calendar03Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { DIM, WRAP_CLASS } from "./constants"
import {
  IMG_FEATURE_ANALYTICS,
  IMG_FEATURE_CALENDAR,
  IMG_FEATURE_MEDIA_KIT,
} from "./image-urls"

export function MadeFor() {
  const cards = [
    {
      icon: <HugeiconsIcon icon={BarChartIcon} size={15} color={DIM} />,
      eyebrow: "Analytics",
      title: "Track every metric that matters",
      desc: "Connect Instagram and YouTube and get AI-powered insights on every post. Stop guessing — start optimizing.",
      img: IMG_FEATURE_ANALYTICS,
    },
    {
      icon: <HugeiconsIcon icon={Calendar03Icon} size={15} color={DIM} />,
      eyebrow: "Content Calendar",
      title: "Plan your entire month visually",
      desc: "Drag-and-drop scheduling, status workflows, and AI-suggested posting times for maximum impact. All in one place.",
      img: IMG_FEATURE_CALENDAR,
    },
    {
      icon: <HugeiconsIcon icon={SparklesIcon} size={15} color={DIM} />,
      eyebrow: "AI Media Kit",
      title: "Your media kit, always up to date",
      desc: "Live stats from all connected platforms — AI-generated bio, shareable link, PDF export. All in one place.",
      img: IMG_FEATURE_MEDIA_KIT,
    },
  ]

  return (
    <section className="border-border border-t bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 sm:mb-12">
          <p className="mb-[14px] font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
            One connected platform
          </p>
          <h2 className="mb-[14px] font-semibold text-[clamp(28px,4vw,40px)] text-foreground tracking-[-0.035em]">
            Made for modern creators
          </h2>
          <p className="m-0 max-w-[480px] text-base text-muted-foreground leading-[1.65]">
            Every part of your creator business in one intelligent workspace —
            not five disconnected apps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex h-full flex-col bg-card px-5 pt-6 pb-5 sm:px-7 sm:pt-8 sm:pb-6"
            >
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-border bg-muted">
                    {card.icon}
                  </div>
                  <span className="font-medium text-[11px] text-muted-foreground tracking-[0.04em]">
                    {card.eyebrow}
                  </span>
                </div>
                <h3 className="mb-2.5 font-semibold text-[16px] text-foreground tracking-tight sm:text-[17px]">
                  {card.title}
                </h3>
                <p className="m-0 text-[13px] text-muted-foreground leading-[1.65] sm:text-[14px]">
                  {card.desc}
                </p>
              </div>
              <div className="mt-6 sm:mt-7">
                <ImageWithFallback
                  src={card.img}
                  alt={card.eyebrow}
                  className="block w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
