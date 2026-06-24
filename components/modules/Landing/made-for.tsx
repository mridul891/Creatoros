import * as React from "react";
import { BarChart3, Calendar, Sparkles } from "lucide-react";

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback";
import { DIM, WRAP_CLASS } from "./constants";
import {
  IMG_FEATURE_ANALYTICS,
  IMG_FEATURE_CALENDAR,
  IMG_FEATURE_MEDIA_KIT,
} from "./image-urls";

export function MadeFor() {
  const cards = [
    {
      icon: <BarChart3 size={15} color={DIM} />,
      eyebrow: "Analytics",
      title: "Track every metric that matters",
      desc: "Connect Instagram and YouTube and get AI-powered insights on every post. Stop guessing — start optimizing.",
      img: IMG_FEATURE_ANALYTICS,
    },
    {
      icon: <Calendar size={15} color={DIM} />,
      eyebrow: "Content Calendar",
      title: "Plan your entire month visually",
      desc: "Drag-and-drop scheduling, status workflows, and AI-suggested posting times for maximum impact. All in one place.",
      img: IMG_FEATURE_CALENDAR,
    },
    {
      icon: <Sparkles size={15} color={DIM} />,
      eyebrow: "AI Media Kit",
      title: "Your media kit, always up to date",
      desc: "Live stats from all connected platforms — AI-generated bio, shareable link, PDF export. All in one place.",
      img: IMG_FEATURE_MEDIA_KIT,
    },
  ];

  return (
    <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#050505] py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 sm:mb-12">
          <p className="mb-[14px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.72)]">
            One connected platform
          </p>
          <h2 className="mb-[14px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-white">
            Made for modern creators
          </h2>
          <p className="m-0 max-w-[480px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-base leading-[1.65] text-[rgba(255,255,255,0.84)]">
            Every part of your creator business in one intelligent workspace — not
            five disconnected apps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.07)] md:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index} className="flex h-full flex-col bg-[#080808] px-5 pb-5 pt-6 sm:px-7 sm:pb-6 sm:pt-8">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)]">
                    {card.icon}
                  </div>
                  <span className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[11px] font-medium tracking-[0.04em] text-[rgba(255,255,255,0.72)]">
                    {card.eyebrow}
                  </span>
                </div>
                <h3 className="mb-2.5 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[16px] font-semibold tracking-tight text-white sm:text-[17px]">
                  {card.title}
                </h3>
                <p className="m-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] leading-[1.65] text-[rgba(255,255,255,0.84)] sm:text-[14px]">
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
  );
}
