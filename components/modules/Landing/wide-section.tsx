import { ImageWithFallback } from "@/components/modules/figma/ImageWithFallback";
import { wrap } from "./constants";

type FeatureColumn = {
  label: string;
  desc: string;
};

export type WideSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  img: string;
  imgAlt: string;
  cols: FeatureColumn[];
  animateFlow?: boolean;
};

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
    <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#080808] py-24">
      <div style={wrap}>
        <div className="mb-10 max-w-[560px]">
          <p className="mb-[14px] font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(235,80,80,0.85)]">
            {eyebrow}
          </p>
          <h2 className="mb-[14px] font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.035em] text-white">
            {title}
          </h2>
          <p className="m-0 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[15px] leading-[1.7] text-[rgba(255,255,255,0.84)]">
            {body}
          </p>
        </div>

        <div
          className={`relative mb-12 overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.08)] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_32px_80px_rgba(0,0,0,0.6)] ${animateFlow ? "before:pointer-events-none before:absolute before:inset-y-0 before:left-[-25%] before:w-[35%] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)] before:content-['']" : ""}`}
          style={animateFlow ? { animation: "wideFramePulse 8s ease-in-out infinite" } : undefined}
        >
          {animateFlow && (
            <div
              className="pointer-events-none absolute inset-y-0 left-[-25%] w-[35%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                animation: "wideSweep 4.8s ease-in-out infinite",
              }}
            />
          )}
          <ImageWithFallback
            src={img}
            alt={imgAlt}
            className={`block w-full ${animateFlow ? "motion-safe:transition-transform motion-safe:duration-700" : ""}`}
            style={animateFlow ? { animation: "wideImageFloat 9s ease-in-out infinite" } : undefined}
          />
        </div>

        <div className="grid grid-cols-4 gap-8">
          {cols.map((column, index) => (
            <div
              key={index}
              className={`border-t border-[rgba(255,255,255,0.07)] pt-5 transition-transform duration-300 ${animateFlow ? "motion-safe:hover:-translate-y-0.5" : ""}`}
              style={animateFlow ? { animation: "flowFadeIn 700ms ease-out both", animationDelay: `${index * 120}ms` } : undefined}
            >
              <p className="mb-2 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[14px] font-semibold tracking-[-0.015em] text-white">
                {column.label}
              </p>
              <p className="m-0 font-['SF_Pro_Display',_-apple-system,_BlinkMacSystemFont,_'Helvetica_Neue',_system-ui,_sans-serif] text-[13px] leading-[1.6] text-[rgba(255,255,255,0.78)]">
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
              0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.6); }
              50% { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 36px 92px rgba(0,0,0,0.62); }
            }
            @keyframes flowFadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      )}
    </section>
  );
}
