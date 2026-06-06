import Image from "next/image"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { AnimatedGroup } from "@/components/motion-primitives/animated-group"
import { WaitlistForm } from "@/components/modules/Landing/waitlist-form"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Arctic Lights Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
        }}
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="mx-auto mt-8 max-w-4xl font-sans text-4xl font-medium tracking-tight text-balance md:text-6xl lg:mt-16 xl:text-6xl"
            >
              The Operating System for
            </TextEffect>
            <TextEffect
              per="word"
              preset="fade-in-blur"
              speedSegment={0.3}
              as="span"
              className="mx-auto text-primary mt-8 max-w-4xl font-sans text-4xl font-medium tracking-tight text-balance md:text-6xl lg:mt-16 xl:text-6xl"
            >
              Creator Partnerships.
            </TextEffect>

            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-balance text-muted-foreground"
            >
              Manage every sponsorship, brand collaboration, invoice, payment,
              and deadline from one streamlined workspace.
            </TextEffect>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <AnimatedGroup
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.9,
                  },
                },
              },
              item: {
                hidden: { opacity: 0, y: 12, filter: "blur(12px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    type: "spring",
                    bounce: 0.3,
                    duration: 1.5,
                  },
                },
              },
            }}
          >
            <WaitlistForm />
          </AnimatedGroup>
        </div>
      </div>
    </div>
  )
}
