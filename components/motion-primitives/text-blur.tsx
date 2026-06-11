"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface TextBlurProps {
  text: string
  className?: string
  variant?: {
    hidden: { filter?: string; opacity?: number; y?: number }
    visible: { filter?: string; opacity?: number; y?: number }
  }
  duration?: number
}

const TextBlur = ({
  text,
  className,
  variant,
  duration = 0.7,
}: TextBlurProps) => {
  const defaultVariants = {
    hidden: {
      opacity: 0.92,
      y: 8,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const combinedVariants = variant || defaultVariants

  return (
    <motion.h1
      initial={false}
      animate="visible"
      transition={{
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      variants={combinedVariants}
      className={cn(className, "drop-shadow-sm")}
    >
      {text}
    </motion.h1>
  )
}

export default TextBlur