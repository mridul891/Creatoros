import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "./Skeleton";

export function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaLabel,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  loading: boolean;
}) {
  const up = delta >= 0;
  return (
    <div className="flex flex-col gap-[14px] rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] px-[22px] py-5">
      {loading ? (
        <>
          <Skeleton h={14} w={100} />
          <Skeleton h={32} w={140} />
          <Skeleton h={12} w={80} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[rgba(255,255,255,0.4)]">{label}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[rgba(255,255,255,0.05)]">
              <Icon size={15} color="rgba(255,255,255,0.4)" />
            </div>
          </div>
          <div className="text-[30px] font-bold leading-none tracking-[-0.04em] text-white">{value}</div>
          <div className="flex items-center gap-[5px]">
            {up ? <TrendingUp size={12} color="#22c55e" /> : <TrendingDown size={12} color="#E8402A" />}
            <span className={`font-mono text-xs font-semibold ${up ? "text-[#22c55e]" : "text-[#E8402A]"}`}>
              {up ? "+" : ""}
              {delta}%
            </span>
            <span className="font-mono text-[11px] text-[rgba(255,255,255,0.4)]">{deltaLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}
