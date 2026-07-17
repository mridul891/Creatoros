import { TrendDown, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { Skeleton } from "./Skeleton";

export function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaLabel,
  loading,
}: {
  icon: Icon;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  loading: boolean;
}) {
  const up = delta >= 0;
  return (
    <div className="flex flex-col gap-[14px] rounded-[14px] border border-border bg-card px-[22px] py-5">
      {loading ? (
        <>
          <Skeleton h={14} w={100} />
          <Skeleton h={32} w={140} />
          <Skeleton h={12} w={80} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-muted">
              <Icon size={15} color="var(--muted-foreground)" />
            </div>
          </div>
          <div className="text-[30px] font-bold leading-none tracking-[-0.04em] text-foreground">{value}</div>
          <div className="flex items-center gap-[5px]">
            {up ? <TrendUp size={12} color="#22c55e" /> : <TrendDown size={12} color="#E8402A" />}
            <span className={`font-mono text-xs font-semibold ${up ? "text-[#22c55e]" : "text-[#E8402A]"}`}>
              {up ? "+" : ""}
              {delta}%
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{deltaLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}
