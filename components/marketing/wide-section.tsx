import { ImageWithFallback } from "@/components/shared/ImageWithFallback"
import { WRAP_CLASS } from "./constants"

type FeatureColumn = {
  label: string
  desc: string
}

export type WideSectionProps = {
  eyebrow: string
  title: string
  body: string
  img: string
  imgAlt: string
  cols: FeatureColumn[]
  animateFlow?: boolean
}

export function WideSection({
  eyebrow,
  title,
  body,
  img,
  imgAlt,
  cols,
  animateFlow = false,
}: WideSectionProps) {
  return (
    <section className="border-border border-t bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 max-w-[560px]">
          <p className="mb-[14px] font-semibold text-[11px] text-primary uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
          <h2 className="mb-[14px] text-balance font-semibold text-[clamp(28px,4vw,40px)] text-foreground tracking-[-0.035em]">
            {title}
          </h2>
          <p className="m-0 text-pretty text-[15px] text-muted-foreground leading-[1.7]">
            {body}
          </p>
        </div>

        <div
          className={`relative mb-10 overflow-hidden rounded-xl border border-border bg-card shadow-2xl ring-1 ring-black/5 sm:mb-12 ${animateFlow ? "before:pointer-events-none before:absolute before:inset-y-0 before:left-[-25%] before:w-[35%] before:bg-[linear-gradient(90deg,transparent,rgba(32,97,238,0.12),transparent)] before:content-['']" : ""}`}
          style={
            animateFlow
              ? { animation: "wideFramePulse 8s ease-in-out infinite" }
              : undefined
          }
        >
          {animateFlow && (
            <div
              className="pointer-events-none absolute inset-y-0 left-[-25%] w-[35%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(32,97,238,0.12), transparent)",
                animation: "wideSweep 4.8s ease-in-out infinite",
              }}
            />
          )}
          <ImageWithFallback
            src={img}
            alt={imgAlt}
            className={`block w-full ${animateFlow ? "motion-safe:transition-transform motion-safe:duration-700" : ""}`}
            style={
              animateFlow
                ? { animation: "wideImageFloat 9s ease-in-out infinite" }
                : undefined
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((column, index) => (
            <div
              key={index}
              className={`border-border border-t pt-5 transition-transform duration-300 ${animateFlow ? "motion-safe:hover:-translate-y-0.5" : ""}`}
              style={
                animateFlow
                  ? {
                      animation: "flowFadeIn 700ms ease-out both",
                      animationDelay: `${index * 120}ms`,
                    }
                  : undefined
              }
            >
              <p className="mb-2 font-semibold text-[14px] text-foreground tracking-[-0.015em]">
                {column.label}
              </p>
              <p className="m-0 text-[13px] text-muted-foreground leading-[1.6]">
                {column.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      {animateFlow && (
        <style>
          {`
            @keyframes wideImageFloat {
              0%, 100% { transform: scale(1) translateY(0px); }
              50% { transform: scale(1.01) translateY(-2px); }
            }
            @keyframes wideSweep {
              0% { transform: translateX(0%); opacity: 0; }
              15% { opacity: 1; }
              50% { opacity: 1; }
              100% { transform: translateX(360%); opacity: 0; }
            }
            @keyframes wideFramePulse {
              0%, 100% { box-shadow: 0 0 0 1px var(--border), 0 32px 80px rgba(0,0,0,0.08); }
              50% { box-shadow: 0 0 0 1px var(--border), 0 36px 92px rgba(0,0,0,0.12); }
            }
            @keyframes flowFadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              * {
                animation: none !important;
              }
            }
          `}
        </style>
      )}
    </section>
  )
}
