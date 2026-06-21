"use client"

import { Button } from "@/components/ui/button"

type CrmPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CrmPagination({ page, totalPages, onPageChange }: CrmPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="cursor-pointer border-[rgba(255,255,255,0.12)] bg-transparent text-[11px] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
      >
        Previous
      </Button>
      <span className="font-mono text-[11px] text-[rgba(255,255,255,0.45)]">
        Page {page} / {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="cursor-pointer border-[rgba(255,255,255,0.12)] bg-transparent text-[11px] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
      >
        Next
      </Button>
    </div>
  )
}
