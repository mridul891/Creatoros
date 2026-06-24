export function TasksSkeleton() {
  return (
    <div className="space-y-3 rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-[10px] bg-[rgba(255,255,255,0.08)]" />
      ))}
    </div>
  )
}
