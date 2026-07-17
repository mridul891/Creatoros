import type { ReactNode } from "react";

import { WRAP_CLASS } from "./constants";

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
    <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-24">
      <div className={WRAP_CLASS}>
        <div className="mb-10 max-w-[620px] sm:mb-12">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mb-4 text-balance text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-foreground">
            {title}
          </h2>
          <p className="m-0 text-[15px] leading-[1.7] text-muted-foreground text-pretty">
            {body}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="bg-card px-6 py-7 sm:px-7 sm:py-8">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-[7px] border border-border bg-muted">
                {pillar.icon}
              </div>
              <h3 className="mb-2.5 text-[17px] font-semibold tracking-tight text-foreground">
                {pillar.title}
              </h3>
              <p className="m-0 text-[14px] leading-[1.65] text-muted-foreground">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
