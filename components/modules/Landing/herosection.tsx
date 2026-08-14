"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import AnimatedShinyText from "@/components/motion-primitives/shimmer-text"
import TextBlur from "@/components/motion-primitives/text-blur"

import { containerVariants, itemVariants } from "@/lib/animation-variants"
import { WaitlistForm } from "./waitlist-form"

export default function HeroSection() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-center backdrop-blur-sm">
            <HugeiconsIcon
              icon={SparklesIcon}
              className="h-3.5 w-3.5 text-primary"
            />
            <AnimatedShinyText className="font-medium text-sm">
              <span>Coming soon</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center">
        <span className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          NotYetLaunched
        </span>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center font-semibold text-4xl text-foreground leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          text="Never Lose Track of a Brand Deal Again."
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-lg pt-2 text-center text-base text-muted-foreground leading-relaxed sm:text-lg"
          text="Track brand deals, sponsorships, invoices, payments, and deadlines from one beautifully organized workspace built specifically for content creators."
          duration={0.8}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <WaitlistForm />
      </motion.div>
    </motion.div>
  )
}
