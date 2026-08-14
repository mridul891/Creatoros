import { Skeleton } from "@/features/analytics/components/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[1280px] px-9 py-7">
      <div className="mb-7 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton w={220} h={28} r={8} />
          <Skeleton w={320} h={14} r={8} />
        </div>
        <Skeleton w={140} h={38} r={10} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Skeleton h={130} r={14} />
        <Skeleton h={130} r={14} />
        <Skeleton h={130} r={14} />
        <Skeleton h={130} r={14} />
      </div>
    </div>
  )
}
