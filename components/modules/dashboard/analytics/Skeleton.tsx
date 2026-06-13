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
      className="bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.05)_100%)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: `${h}px`,
        borderRadius: `${r}px`,
      }}
    />
  );
}
