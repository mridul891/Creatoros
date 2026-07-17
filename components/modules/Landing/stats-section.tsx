import * as React from "react";
import { Clock, TrendUp, Users } from "@phosphor-icons/react/dist/ssr";


import { DIM, WRAP_CLASS } from "./constants";


export function StatsSection() {
  const stats = [
    {
      n: "3.2×",
      label: "Average revenue growth in first 6 months",
      icon: <TrendUp size={14} color={DIM} />,
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
    <section className="border-t border-border bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 flex flex-col items-start gap-8 md:mb-[72px] md:flex-row md:gap-16">
          <div className="max-w-[340px]">
            <p className="mb-3  text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
              Business Impact
            </p>
            <h2 className="m-0  text-[clamp(24px,3.5vw,36px)] font-semibold tracking-[-0.035em] text-foreground">
              Results You Can Expect
            </h2>
          </div>

          <div className="grid w-full flex-1 grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 sm:gap-y-7 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="border-t border-border pt-5">
                <p className="mb-2  text-[clamp(36px,4.5vw,48px)] font-semibold tracking-[-0.045em] text-foreground">
                  {stat.n}
                </p>
                <p className="m-0  text-[13px] leading-[1.55] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex items-start gap-7 rounded-xl border border-border bg-card px-11 py-10">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border">
            <ImageWithFallback
              src={IMG_AVATAR_5}
              alt="Maya Chen"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="mb-5 mt-0  text-[17px] italic leading-[1.72] tracking-[-0.015em] text-muted-foreground">
              "I went from $4K/month in brand deals to $18K in under 5 months. The
              pipeline alone changed everything — I stopped losing deals to
              disorganized follow-ups."
            </p>
            <div className="flex items-center gap-[14px]">
              <div>
                <p className="mb-0.5 mt-0  text-[14px] font-semibold text-foreground">
                  Maya Chen
                </p>
                <p className="m-0  text-[13px] text-muted-foreground">
                  Lifestyle Creator · 890K followers
                </p>
              </div>
              <div className="ml-auto  text-[14px] tracking-[1px] text-[#F59E0B]">
                ★★★★★
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
