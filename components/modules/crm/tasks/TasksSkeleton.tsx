export function TasksSkeleton() {
  return (
    <div className="space-y-3 rounded-[18px] border border-border bg-card p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-[10px] bg-muted"
        />
      ))}
    </div>
  )
}
