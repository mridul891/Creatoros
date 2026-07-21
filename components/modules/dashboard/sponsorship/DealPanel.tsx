"use client";

import { Calendar, EnvelopeSimple, PencilSimple, Trash, X } from "@phosphor-icons/react/dist/ssr";
import type { Deal } from "@/types/sponsorship";
import {
  LOGO_ACCENT_CLASS,
  PRIORITY_ACTIVE_CLASS,
  PRIORITY_DOT_CLASS,
  STAGES,
  STAGE_ACTIVE_CLASS,
  STAGE_CFG,
  STAGE_DOT_CLASS,
  STAGE_TEXT_CLASS,
  type Stage,
  fmt,
} from "./shared";

interface DealPanelProps {
  deal: Deal;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onStageChange: (id: number, stage: Stage) => void;
}

export function DealPanel({ deal, onClose, onEdit, onDelete, onStageChange }: DealPanelProps) {
  const stageConfig = STAGE_CFG[deal.stage];
  const logoClass = LOGO_ACCENT_CLASS[deal.logoColor] ?? "bg-[#E8402A15] text-[#E8402A]";

  return (
    <div className="sticky top-7 w-[300px] shrink-0 self-start rounded-[18px] border border-border bg-card p-[22px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-[11px]">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[11px] font-mono text-[11px] font-extrabold ${logoClass}`}>
            {deal.logo}
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-[-0.03em] text-foreground">{deal.brand}</div>
            <div className="font-mono text-[10px] text-muted-foreground">{deal.category}</div>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer p-1 text-muted-foreground">
          <X size={15} />
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-muted p-4">
        <div className="mb-1 font-mono text-[9px] tracking-[0.07em] text-muted-foreground">DEAL VALUE</div>
        <div className="text-[30px] font-black tracking-tighter text-foreground">{fmt(deal.value)}</div>
        <div className="mt-[9px] flex gap-[6px]">
          <div className={`inline-flex items-center gap-[5px] rounded-[99px] border px-[9px] py-1 ${STAGE_ACTIVE_CLASS[deal.stage]}`}>
            <stageConfig.icon size={9} color={stageConfig.color} />
            <span className="font-mono text-[9px] font-bold">{deal.stage}</span>
          </div>
          <div
            className={`inline-flex items-center gap-[5px] rounded-[99px] px-[9px] py-1 ${PRIORITY_ACTIVE_CLASS[deal.priority].replace("border-[rgba(232,64,42,0.25)]", "").replace("border-[rgba(217,119,6,0.25)]", "").replace("border-[rgba(113,113,113,0.25)]", "")}`}
          >
            <div className={`h-[5px] w-[5px] rounded-full ${PRIORITY_DOT_CLASS[deal.priority]}`} />
            <span className="font-mono text-[9px] font-semibold capitalize">{deal.priority}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 font-mono text-[9px] tracking-[0.07em] text-muted-foreground">MOVE TO STAGE</div>
        <div className="flex flex-col gap-1">
          {STAGES.map((stage) => {
            const stageMeta = STAGE_CFG[stage];
            const active = deal.stage === stage;
            return (
              <button
                key={stage}
                onClick={() => onStageChange(deal.id, stage)}
                className={`flex cursor-pointer items-center gap-[9px] rounded-[9px] px-[11px] py-2 text-left transition-all duration-150 ${active ? `border ${STAGE_ACTIVE_CLASS[stage]}` : "border border-transparent"}`}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "var(--muted-foreground)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "none";
                }}
              >
                <stageMeta.icon size={12} color={active ? stageMeta.color : "var(--muted-foreground)"} />
                <span className={`text-[11px] ${active ? `font-bold ${STAGE_TEXT_CLASS[stage]}` : "font-normal text-muted-foreground"}`}>
                  {stage}
                </span>
                {active && <div className={`ml-auto h-[5px] w-[5px] rounded-full ${STAGE_DOT_CLASS[stage]}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-[14px]">
        <div className="mb-[9px] font-mono text-[9px] tracking-[0.07em] text-muted-foreground">CONTACT</div>
        {deal.contact && <div className="mb-[5px] text-xs font-semibold text-foreground">{deal.contact}</div>}
        {deal.email && (
          <div className="mb-[3px] flex items-center gap-[5px] font-mono text-[10px] text-muted-foreground">
            <EnvelopeSimple size={10} /> {deal.email}
          </div>
        )}
        {deal.deadline && (
          <div className="flex items-center gap-[5px] font-mono text-[10px] text-muted-foreground">
            <Calendar size={10} /> Due {deal.deadline}
          </div>
        )}
      </div>

      {deal.notes && (
        <div className="mt-4">
          <div className="mb-[6px] font-mono text-[9px] tracking-[0.07em] text-muted-foreground">NOTES</div>
          <div className="rounded-[9px] bg-muted px-3 py-[11px] text-[11px] leading-[1.65] text-muted-foreground">{deal.notes}</div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onEdit} className="flex cursor-pointer items-center justify-center gap-[5px] rounded-[9px] bg-primary p-[9px] text-[11px] font-semibold text-primary-foreground">
          <PencilSimple size={11} /> Edit
        </button>
        <button
          onClick={() => {
            onDelete(deal.id);
            onClose();
          }}
          className="flex cursor-pointer items-center justify-center gap-[5px] rounded-[9px] border border-[rgba(232,64,42,0.2)] bg-[rgba(232,64,42,0.05)] p-[9px] text-[11px] text-[#E8402A]"
        >
          <Trash size={11} /> Delete
        </button>
      </div>
    </div>
  );
}
