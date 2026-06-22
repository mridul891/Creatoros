"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type CrmPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CrmPagination({ page, totalPages, onPageChange }: CrmPaginationProps) {
  const canGoPrevious = page > 1
  const canGoNext = page < totalPages

  return (
    <Pagination className="mt-4 justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={!canGoPrevious}
            className="cursor-pointer border border-[rgba(255,255,255,0.12)] bg-transparent text-[11px] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={(event) => {
              event.preventDefault()
              if (canGoPrevious) {
                onPageChange(page - 1)
              }
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            className="pointer-events-none border border-[rgba(255,255,255,0.12)] bg-transparent font-mono text-[11px] text-[rgba(255,255,255,0.45)] hover:bg-transparent"
          >
            {page} / {totalPages}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={!canGoNext}
            className="cursor-pointer border border-[rgba(255,255,255,0.12)] bg-transparent text-[11px] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={(event) => {
              event.preventDefault()
              if (canGoNext) {
                onPageChange(page + 1)
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
