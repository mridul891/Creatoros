import type { ImgHTMLAttributes } from "react"

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement>

const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/heroimage.svg": { width: 1440, height: 900 },
  "/splictSection-analytics.svg": { width: 486, height: 334 },
  "/splitSection-pipeline.svg": { width: 800, height: 430 },
  "/splitSection-invoice.svg": { width: 486, height: 334 },
  "/analytics-mini.svg": { width: 400, height: 296 },
  "/calendar-mini.svg": { width: 400, height: 296 },
  "/media-kit-mini.svg": { width: 400, height: 296 },
}

export function ImageWithFallback({
  loading,
  decoding,
  src,
  width,
  height,
  ...props
}: ImageWithFallbackProps) {
  const fallbackDimensions =
    typeof src === "string" ? IMAGE_DIMENSIONS[src] : undefined
  const resolvedWidth = width ?? fallbackDimensions?.width
  const resolvedHeight = height ?? fallbackDimensions?.height

  return (
    <img
      src={src}
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      width={resolvedWidth}
      height={resolvedHeight}
      {...props}
    />
  )
}
