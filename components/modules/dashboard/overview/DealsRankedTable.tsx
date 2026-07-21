"use client";

import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { Deal } from "@/types/sponsorship";
import { LOGO_ACCENT_CLASS, PRIORITY_DOT_CLASS, STAGE_ACTIVE_CLASS, STAGE_CFG, fmt } from "../sponsorship/shared";

interface DealsRankedTableProps {
  deals: Deal[];
}

export function DealsRankedTable({ deals }: DealsRankedTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-[22px] py-5">
      <div className="mb-4 text-[13px] font-bold tracking-[-0.02em] text-foreground">All Deals — Value Ranked</div>
      <div className="flex flex-col">
        <div className="mb-1 grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 border-b border-border pb-[10px]">
          {["Brand", "Value", "Category", "Stage", "Priority"].map((header) => (
            <div key={header} className="font-mono text-[9px] font-bold tracking-[0.07em] text-muted-foreground">
              {header.toUpperCase()}
            </div>
          ))}
        </div>
        {deals.map((deal, index) => {
          const stageConfig = STAGE_CFG[deal.stage];
          const logoClass = LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]";

          return (
            <div
              key={deal.id}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-3 rounded-lg py-[10px] transition-colors duration-100 ${index < deals.length - 1 ? "border-b border-border" : ""}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--muted-foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <div className="flex items-center gap-[9px]">
                <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md font-mono text-[8px] font-extrabold ${logoClass}`}>
                  {deal.logo}
                </div>
                <span className="text-xs font-semibold text-foreground">{deal.brand}</span>
              </div>
              <div className="flex items-center text-xs font-extrabold tracking-[-0.03em] text-foreground">{fmt(deal.value)}</div>
              <div className="flex items-center font-mono text-[11px] text-muted-foreground">{deal.category}</div>
              <div className="flex items-center">
                <div className={`inline-flex items-center gap-1 rounded-[99px] border px-2 py-[3px] ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
                  <stageConfig.icon size={9} color={stageConfig.color} />
                  <span className="font-mono text-[9px] font-bold">{deal.stage}</span>
                </div>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className={`h-[6px] w-[6px] rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
                <span className="font-mono text-[11px] capitalize text-muted-foreground">{deal.priority}</span>
                <CaretRight size={12} color="var(--muted-foreground)" className="ml-auto" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
