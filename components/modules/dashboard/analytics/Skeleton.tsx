export function Skeleton({
  w = "100%",
  h = 20,
  r = 8,
}: {
  w?: string | number;
  h?: number;
  r?: number;
}) {
  return (
    <div
      className="bg-[linear-gradient(90deg,var(--muted-foreground)_0%,var(--muted-foreground)_50%,var(--muted-foreground)_100%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: `${h}px`,
        borderRadius: `${r}px`,
      }}
    />
  );
}
