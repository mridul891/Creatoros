import { Check } from "lucide-react";

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback";
import { wrap } from "./constants";

export type SplitSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  img: string;
  imgAlt: string;
  reverse?: boolean;
};

export function SplitSection({
  eyebrow,
  title,
  body,
  bullets,
  img,
  imgAlt,
  reverse = false,
}: SplitSectionProps) {
  const contentOrder = reverse ? "order-2" : "order-1";
  const imageOrder = reverse ? "order-1" : "order-2";

  return (
    <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#050505] py-24">
      <div
        className="grid grid-cols-1 items-center gap-[72px] md:grid-cols-2"
        style={wrap}
      >
        <div className={contentOrder}>
          <p className="mb-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(235,80,80,0.85)]">
            {eyebrow}
          </p>
          <h2 className="mb-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(26px,3.5vw,36px)] font-semibold leading-[1.15] tracking-[-0.035em] text-white">
            {title}
          </h2>
          <p className="mb-8 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[15px] leading-[1.7] text-[rgba(255,255,255,0.84)]">
            {body}
          </p>
          <div className="flex flex-col gap-[11px]">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-2.5">
                <Check
                  size={13}
                  color="rgba(255,255,255,0.58)"
                  className="mt-[3px] shrink-0"
                />
                <span className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] leading-[1.55] text-[rgba(255,255,255,0.84)]">
                  {bullet}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={imageOrder}>
          <div className="overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.08)] shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
            <ImageWithFallback
              src={img}
              alt={imgAlt}
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
