"use client"

import { motion } from "motion/react"
import { useMemo } from "react"

// Build a perfectly symmetric diamond of dots.
// `maxDots` must be odd so the shape has a single-dot tip and a single-dot base
// and a well-defined center row.
function buildDiamond(maxDots: number): string {
  const half = (maxDots - 1) / 2
  const rows: string[] = []

  const rowFor = (level: number) => {
    const dots = 2 * level + 1
    // Each dot occupies a 2-col cell ("· "); trimming leaves width 2*dots - 1.
    // Centering pad = (maxDots - dots) leading spaces keeps every row mirrored.
    const pad = " ".repeat(maxDots - dots)
    const body = Array.from({ length: dots }, () => "·").join(" ")
    return pad + body + pad
  }

  for (let level = 0; level <= half; level++) rows.push(rowFor(level))
  for (let level = half - 1; level >= 0; level--) rows.push(rowFor(level))

  return rows.join("\n")
}

interface NetworkAsciiPatternProps {
  side: "left" | "right"
  className?: string
}

export function NetworkAsciiPattern({
  side,
  className = "",
}: NetworkAsciiPatternProps) {
  // 29 dots wide -> 15 rows up + 14 rows down = 29 rows tall (square-ish grid).
  const asciiArt = useMemo(() => buildDiamond(29), [])
  const delay = side === "left" ? 0.2 : 0.4

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      className={`pointer-events-none select-none ${className}`}
      style={{
        willChange: "opacity, transform",
      }}
    >
      <pre
        className="font-mono text-[8px] text-gray-400/70 leading-[1.1] tracking-tight sm:text-[10px] lg:text-[12px] dark:text-gray-500/60"
        style={{
          textAlign: "center",
          whiteSpace: "pre",
        }}
        aria-hidden="true"
      >
        {asciiArt}
      </pre>
    </motion.div>
  )
}
