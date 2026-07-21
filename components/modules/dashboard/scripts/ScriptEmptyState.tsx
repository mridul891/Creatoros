"use client"

import { NotePencil, Plus } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"

type ScriptEmptyStateProps = {
  isSearch: boolean
  onCreate: () => void
}

export function ScriptEmptyState({ isSearch, onCreate }: ScriptEmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-dashed border-border bg-muted px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex w-fit text-muted-foreground">
        <NotePencil size={32} weight="duotone" />
      </div>
      <h3 className="text-[18px] font-bold text-foreground">
        {isSearch ? "No matching scripts" : "No scripts yet"}
      </h3>
      <p className="mx-auto mt-2 max-w-[460px] text-[13px] text-muted-foreground">
        {isSearch
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Start writing your first script for a brand deal or your next content piece."}
      </p>
      {!isSearch && (
        <Button
          onClick={onCreate}
          className="mt-6 h-10 cursor-pointer gap-2 bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary"
        >
          <Plus size={14} weight="bold" />
          Create Script
        </Button>
      )}
    </div>
  )
}
