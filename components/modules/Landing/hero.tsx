import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback";
import { IMG_HERO } from "./image-urls";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050505] pb-0 pt-32">
      <div className="pointer-events-none absolute left-1/2 top-[-300px] h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,60,60,0.07)_0%,transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1100px] px-7 text-center">
        <div className="mb-9 inline-flex items-center gap-[7px] rounded-full border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[5px]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F53073]" />
          <span className="font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-xs text-[rgba(255,255,255,0.84)]">
            New: AI Media Kit Generator
          </span>
         
        </div>

        <h1 className="mx-auto mb-6 max-w-[820px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[clamp(36px,5.5vw,60px)] font-medium leading-none tracking-[-0.045em] text-white">
          Your shortcut to
          everything.
        </h1>

        <p className="mx-auto mb-10 max-w-[500px] font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[18px] leading-[1.65] tracking-[-0.015em] text-[rgba(255,255,255,0.84)]">
          NotYetLaunchedOS eliminates the tool-switching chaos.
          Analytics, deals, invoicing, calendar, and AI media
          kits — all in one beautiful workspace.
        </p>

        <div className="mb-14 flex items-center justify-center gap-3">
          <Link
            href="/waitlist"
            className="flex items-center gap-[7px] rounded-lg bg-white px-[26px] py-3 font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',system-ui,sans-serif] text-[15px] font-semibold tracking-[-0.02em] text-black no-underline shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
          >
            Get started free <ArrowRight size={15} />
          </Link>
          
        </div>

        
      </div>

      <div className="relative mx-auto max-w-[1200px] px-7 py-10">
        <div className="pointer-events-none absolute left-1/2 top-[10%] z-0 h-[300px] w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(200,60,60,0.09)_0%,transparent_70%)]" />
        <div className="relative z-1 overflow-hidden rounded-t-[12px] border border-b-0 border-[rgba(255,255,255,0.1)] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_-8px_40px_rgba(0,0,0,0.5)]">
          <ImageWithFallback
            src={IMG_HERO}
            alt="CreatorOS dashboard"
            className="block w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(to_bottom,transparent,#050505)]" />
        </div>
      </div>
    </section>
  );
}
