"use client";

import { MagnifyingGlass, Plus } from "@phosphor-icons/react/dist/ssr";
import { SponsorshipMode } from "@/enums/sponsorship";

interface PipelineHeaderProps {
  viewMode: SponsorshipMode;
  search: string;
  onViewChange: (view: SponsorshipMode) => void;
  onSearchChange: (search: string) => void;
  onAddContent: () => void;
}

export function PipelineHeader({
  viewMode,
  search,
  onViewChange,
  onSearchChange,
  onAddContent,
}: PipelineHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="mb-1 text-2xl font-extrabold tracking-[-0.04em] text-foreground">Content Pipeline</h1>
        <div className="text-[13px] text-muted-foreground">Track each campaign from planning to published content</div>
        <div className="mt-3 inline-flex rounded-[10px] border border-border bg-card p-1">
          {[
            { id: SponsorshipMode.TABLE, label: "Table" },
            { id: SponsorshipMode.KANBAN, label: "Kanban" },
          ].map((view) => {
            const active = viewMode === view.id;
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`cursor-pointer rounded-[8px] px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  active ? "bg-[rgba(232,64,42,0.15)] text-[#E8402A]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-[10px]">
        <div className="relative">
          <MagnifyingGlass
            size={13}
            color="var(--muted-foreground)"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search content…"
            className="h-[38px] w-[170px] rounded-[10px] border border-border bg-card pl-[34px] pr-[14px] text-xs text-muted-foreground outline-none"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#E8402A";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--muted-foreground)";
            }}
          />
        </div>
        <button
          onClick={onAddContent}
          className="flex cursor-pointer items-center gap-2 rounded-[11px] bg-primary px-5 py-[10px] text-[13px] font-bold text-primary-foreground"
        >
          <Plus size={15} /> Add Content
        </button>
      </div>
    </div>
  );
}
