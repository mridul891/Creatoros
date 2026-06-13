import type { ReactNode } from "react";

import { wrap } from "./constants";

type ValuePillar = {
  icon: ReactNode;
  title: string;
  body: string;
};

type ValuePillarsProps = {
  eyebrow: string;
  title: string;
  body: string;
  pillars: ValuePillar[];
};

export function ValuePillars({ eyebrow, title, body, pillars }: ValuePillarsProps) {
  return (
    <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#080808] py-24">
      <div style={wrap}>
        <div className="mb-12 max-w-[620px]">
          <p className="mb-4 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(255,255,255,0.4)]">
            {eyebrow}
          </p>
          <h2 className="mb-4 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-white">
            {title}
          </h2>
          <p className="m-0 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[15px] leading-[1.7] text-[rgba(255,255,255,0.65)]">
            {body}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.07)] md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-[#080808] px-7 py-8">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.05)]">
                {pillar.icon}
              </div>
              <h3 className="mb-2.5 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[17px] font-semibold tracking-[-0.025em] text-white">
                {pillar.title}
              </h3>
              <p className="m-0 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[14px] leading-[1.65] text-[rgba(255,255,255,0.65)]">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
