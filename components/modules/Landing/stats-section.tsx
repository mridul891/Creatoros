import * as React from "react";
import { Clock, Star, TrendingUp, Users } from "lucide-react";

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback";
import { DIM, wrap } from "./constants";
import { IMG_AVATAR_5 } from "./image-urls";

export function StatsSection() {
  const stats = [
    {
      n: "3.2×",
      label: "Average revenue growth in first 6 months",
      icon: <TrendingUp size={14} color={DIM} />,
    },
    {
      n: "95%",
      label: "Of deals closed with our pipeline",
      icon: <Users size={14} color={DIM} />,
    },
    {
      n: "12h",
      label: "Saved per week on admin tasks",
      icon: <Clock size={14} color={DIM} />,
    },
  ];

  return (
    <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#080808] py-24">
      <div style={wrap}>
        <div className="mb-[72px] flex flex-wrap items-start gap-16">
          <div className="max-w-[280px]">
            <p className="mb-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(235,80,80,0.85)]">
              Business Impact
            </p>
            <h2 className="m-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(24px,3.5vw,36px)] font-semibold tracking-[-0.035em] text-white">
              Results You Can Expect
            </h2>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-y-7 gap-x-12">
            {stats.map((stat, index) => (
              <div key={index} className="border-t border-[rgba(255,255,255,0.07)] pt-5">
                <p className="mb-2 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(36px,4.5vw,48px)] font-semibold tracking-[-0.045em] text-white">
                  {stat.n}
                </p>
                <p className="m-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] leading-[1.55] text-[rgba(255,255,255,0.65)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex items-start gap-7 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-11 py-10">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[rgba(255,255,255,0.1)]">
            <ImageWithFallback
              src={IMG_AVATAR_5}
              alt="Maya Chen"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="mb-5 mt-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[17px] italic leading-[1.72] tracking-[-0.015em] text-[rgba(255,255,255,0.65)]">
              "I went from $4K/month in brand deals to $18K in under 5 months. The
              pipeline alone changed everything — I stopped losing deals to
              disorganized follow-ups."
            </p>
            <div className="flex items-center gap-[14px]">
              <div>
                <p className="mb-0.5 mt-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] font-semibold text-white">
                  Maya Chen
                </p>
                <p className="m-0 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[13px] text-[rgba(255,255,255,0.4)]">
                  Lifestyle Creator · 890K followers
                </p>
              </div>
              <div className="ml-auto font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] tracking-[1px] text-[#F59E0B]">
                ★★★★★
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
