"use client"

import { Add01Icon, NoteEditIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"

type ScriptEmptyStateProps = {
  isSearch: boolean
  onCreate: () => void
}

export function ScriptEmptyState({
  isSearch,
  onCreate,
}: ScriptEmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-border border-dashed bg-muted px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex w-fit text-muted-foreground">
        <HugeiconsIcon icon={NoteEditIcon} size={32} />
      </div>
      <h3 className="font-bold text-[18px] text-foreground">
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
          className="mt-6 h-10 cursor-pointer gap-2 bg-primary px-5 font-semibold text-[13px] text-primary-foreground hover:bg-primary"
        >
          <HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={2} />
          Create Script
        </Button>
      )}
    </div>
  )
}
