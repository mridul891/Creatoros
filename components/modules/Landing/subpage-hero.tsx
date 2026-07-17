import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { WRAP_CLASS } from "./constants";

type SubpageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
};

export function SubpageHero({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
}: SubpageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[460px] w-[620px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(32,97,238,0.06)_0%,transparent_65%)] sm:top-[-300px] sm:h-[600px] sm:w-[900px]" />
      <div className={`${WRAP_CLASS} relative`}>
        <div className="max-w-[760px]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mb-5 text-balance text-[clamp(34px,5vw,58px)] font-medium leading-[1.02] tracking-[-0.045em] text-foreground">
            {title}
          </h1>
          <p className="mb-9 max-w-[600px] text-[17px] leading-[1.68] tracking-[-0.015em] text-muted-foreground text-pretty">
            {body}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-[7px] rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold tracking-[-0.02em] text-primary-foreground no-underline shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              {primaryCta} <ArrowRight size={15} />
            </Link>
            <Link
              href="/waitlist"
              className="rounded-lg border border-border bg-background px-6 py-3 text-[14px] font-medium tracking-[-0.01em] text-foreground no-underline transition-colors hover:bg-muted"
            >
              {secondaryCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
