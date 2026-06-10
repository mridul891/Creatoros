"use client"
import { motion } from "motion/react"
import TextBlur from "@/components/motion-primitives/text-blur"
import AnimatedShinyText from "@/components/motion-primitives/shimmer-text"
import { containerVariants, itemVariants } from "@/lib/animation-variants"
import { WaitlistForm } from "./waitlist-form"

export default function HeroSection() {
  return (
    <motion.div
      className="flex w-full  max-w-2xl flex-col gap-2 "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.img
        src="/logo.svg"
        alt="logo"
        className="mx-auto h-24 w-24"
        variants={itemVariants}
      />

      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-3xl font-medium tracking-tighter sm:text-5xl"
          text="A Simple Next.js Waitlist Template with Notion as CMS"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base text-[#C5C5C5] sm:text-lg"
          text="Join the waitlist to get early access of the product and recieve updates on the progress!"
          duration={0.8}
        />
      </motion.div>

      <WaitlistForm />
    </motion.div>
  )
}
