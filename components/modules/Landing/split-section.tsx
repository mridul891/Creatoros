import { Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback"
import { WRAP_CLASS } from "./constants"

export type SplitSectionProps = {
  eyebrow: string
  title: string
  body: string
  bullets: string[]
  img: string
  imgAlt: string
  reverse?: boolean
}

export function SplitSection({
  eyebrow,
  title,
  body,
  bullets,
  img,
  imgAlt,
  reverse = false,
}: SplitSectionProps) {
  const contentOrder = reverse ? "order-1 md:order-2" : "order-1"
  const imageOrder = reverse ? "order-2 md:order-1" : "order-2"

  return (
    <section className="border-border border-t bg-background py-16 sm:py-20 lg:py-24">
      <div
        className={`${WRAP_CLASS} grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-[72px]`}
      >
        <div className={contentOrder}>
          <p className="mb-4 font-semibold text-[11px] text-primary uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
          <h2 className="mb-4 font-semibold text-[clamp(26px,3.5vw,36px)] text-foreground leading-[1.15] tracking-[-0.035em]">
            {title}
          </h2>
          <p className="mb-6 text-[14px] text-muted-foreground leading-[1.7] sm:mb-8 sm:text-[15px]">
            {body}
          </p>
          <div className="flex flex-col gap-[11px]">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={13}
                  color="var(--muted-foreground)"
                  className="mt-[3px] shrink-0"
                />
                <span className="text-[14px] text-muted-foreground leading-[1.55]">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={imageOrder}>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-black/5">
            <ImageWithFallback
              src={img}
              alt={imgAlt}
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
