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
    <section className="relative overflow-hidden bg-[#050505] pb-16 pt-28">
      <div className="pointer-events-none absolute left-1/2 top-[-240px] h-[520px] w-[820px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,60,60,0.07)_0%,transparent_65%)]" />
      <div className="relative mx-auto w-full max-w-[1100px] px-7">
        <div className="max-w-[760px]">
          <p className="mb-4 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(235,80,80,0.85)]">
            {eyebrow}
          </p>
          <h1 className="mb-5 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(34px,5vw,58px)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
            {title}
          </h1>
          <p className="mb-9 max-w-[600px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[17px] leading-[1.68] tracking-[-0.015em] text-[rgba(255,255,255,0.65)]">
            {body}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="rounded-lg bg-white px-6 py-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] font-semibold tracking-[-0.02em] text-black no-underline shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            >
              {primaryCta}
            </a>
            <a
              href="#"
              className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-6 py-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[14px] font-medium tracking-[-0.01em] text-[rgba(255,255,255,0.65)] no-underline"
            >
              {secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
