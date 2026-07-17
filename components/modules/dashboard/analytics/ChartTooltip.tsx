import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";

export function ChartTooltip({ active, payload, label }: Partial<TooltipContentProps<ValueType, NameType>>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[9px] border border-border bg-card px-[14px] py-[10px] font-mono text-xs shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      <div className="mb-1.5 text-muted-foreground">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className={`${p.color === "#aaa" ? "text-[#aaa]" : p.color === "#E8402A" ? "text-[#E8402A]" : "text-foreground"} mb-0.5`}>
          {p.name}: <strong>{typeof p.value === "number" ? (p.value >= 1_000_000 ? `${(p.value / 1_000_000).toFixed(1)}M` : p.value >= 1_000 ? `${(p.value / 1_000).toFixed(0)}K` : String(p.value)) : p.value}</strong>
        </div>
      ))}
    </div>
  );
}
