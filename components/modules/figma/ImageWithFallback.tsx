import type { ImgHTMLAttributes } from "react";

type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement>;

export function ImageWithFallback({
  loading,
  decoding,
  ...props
}: ImageWithFallbackProps) {
  return (
    <img
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      {...props}
    />
  );
}
