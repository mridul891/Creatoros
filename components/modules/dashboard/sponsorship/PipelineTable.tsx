"use client";

import { DealPriority } from "@/enums/sponsorship";
import type { Deal } from "@/types/sponsorship";
import { STAGES, type Stage, fmt } from "./shared";

interface PipelineTableProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onStageChange: (id: number, stage: Stage) => void;
  onPriorityChange: (id: number, priority: DealPriority) => void;
}

export function PipelineTable({ deals, onSelectDeal, onStageChange, onPriorityChange }: PipelineTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <div className="mb-3 text-[12px] font-semibold text-muted-foreground">{deals.length} items</div>
      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[2.2fr_1.2fr_1.1fr_1.1fr_1.4fr_1fr] gap-3 border-b border-border px-2 pb-2">
            {["Content", "Stage", "Priority", "Deadline", "Contact", "Est. value"].map((header) => (
              <div key={header} className="font-mono text-[9px] tracking-[0.08em] text-muted-foreground">
                {header.toUpperCase()}
              </div>
            ))}
          </div>
          {[...deals]
            .sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage))
            .map((deal, i) => (
              <div
                key={deal.id}
                onClick={() => onSelectDeal(deal)}
                className={`grid cursor-pointer grid-cols-[2.2fr_1.2fr_1.1fr_1.1fr_1.4fr_1fr] gap-3 px-2 py-3 transition-colors ${i < deals.length - 1 ? "border-b border-border" : ""}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--muted-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                }}
              >
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-bold text-foreground">{deal.brand}</div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">{deal.category}</div>
                </div>
                <div className="flex items-center">
                  <select
                    value={deal.stage}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onStageChange(deal.id, e.target.value as Stage)}
                    className="w-full cursor-pointer rounded-[8px] border border-border bg-muted px-2 py-1.5 font-mono text-[10px] text-muted-foreground outline-none"
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <select
                    value={deal.priority}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onPriorityChange(deal.id, e.target.value as DealPriority)}
                    className="w-full cursor-pointer rounded-[8px] border border-border bg-muted px-2 py-1.5 font-mono text-[10px] capitalize text-muted-foreground outline-none"
                  >
                    {[DealPriority.HIGH, DealPriority.MEDIUM, DealPriority.LOW].map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center font-mono text-[10px] text-muted-foreground">
                  {deal.deadline === "Done" ? "Done" : deal.deadline}
                </div>
                <div className="flex items-center font-mono text-[10px] text-muted-foreground">{deal.contact || "—"}</div>
                <div className="flex items-center text-[11px] font-semibold text-muted-foreground">{fmt(deal.value)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
