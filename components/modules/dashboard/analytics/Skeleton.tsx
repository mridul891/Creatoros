export function Skeleton({
  w = "100%",
  h = 20,
  r = 8,
}: {
  w?: string | number
  h?: number
  r?: number
}) {
  return (
    <div
      className="animate-[shimmer_1.5s_infinite] bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--muted-foreground)_50%,var(--muted-foreground)_100%)]"
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: `${h}px`,
        borderRadius: `${r}px`,
      }}
    />
  )
}
