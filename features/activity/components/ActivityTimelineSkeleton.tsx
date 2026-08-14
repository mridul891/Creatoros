import { Skeleton } from "@/components/ui/skeleton"

export function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative pl-12">
          <Skeleton className="absolute top-1 left-0 h-8 w-8 rounded-full bg-muted" />
          <div className="rounded-[14px] border border-border bg-muted p-4">
            <Skeleton className="h-3 w-20 bg-muted" />
            <Skeleton className="mt-3 h-4 w-1/2 bg-muted" />
            <Skeleton className="mt-2 h-3 w-4/5 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
