import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[1280px] px-9 py-7">
      <div className="mb-7 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-[220px] rounded-lg" />
          <Skeleton className="h-3.5 w-[320px] rounded-md" />
        </div>
        <Skeleton className="h-[38px] w-[140px] rounded-[10px]" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-[130px] rounded-[14px]" />
        <Skeleton className="h-[130px] rounded-[14px]" />
        <Skeleton className="h-[130px] rounded-[14px]" />
        <Skeleton className="h-[130px] rounded-[14px]" />
      </div>
    </div>
  )
}
