"use client"

import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import type { KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatShortDate } from "@/lib/format/date"
import type { BrandListItem } from "@/types/brand"

type BrandsTableProps = { items: BrandListItem[]; onEdit: (brand: BrandListItem) => void; onDelete: (brand: BrandListItem) => void }

export function BrandsTable({ items, onEdit, onDelete }: BrandsTableProps) {
  const router = useRouter()

  function navigateToBrand(brandId: string) {
    router.push(`/dashboard/brands/${brandId}`)
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, brandId: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      navigateToBrand(brandId)
    }
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]">
      <Table className="table-fixed border-collapse">
        <TableHeader className="border-b border-[rgba(255,255,255,0.07)]">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="w-[28%] px-6 py-3 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              BRAND
            </TableHead>
            <TableHead className="w-[16%] px-6 py-3 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              CATEGORY
            </TableHead>
            <TableHead className="w-[24%] px-6 py-3 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              PRIMARY CONTACT
            </TableHead>
            <TableHead className="w-[14%] px-6 py-3 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              UPDATED
            </TableHead>
            <TableHead className="w-[18%] px-6 py-3 text-right font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.4)]">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((brand) => (
            <TableRow
              key={brand.id}
              role="button"
              tabIndex={0}
              onClick={() => navigateToBrand(brand.id)}
              onKeyDown={(event) => handleRowKeyDown(event, brand.id)}
              className="cursor-pointer border-b border-[rgba(255,255,255,0.07)] bg-transparent hover:bg-[rgba(255,255,255,0.02)]"
            >
              <TableCell className="px-6 py-4">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-white">{brand.name}</div>
                  <div className="truncate text-[11px] text-[rgba(255,255,255,0.45)]">
                    {brand.website ?? "No website"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-[12px] text-[rgba(255,255,255,0.6)]">
                {brand.category ?? "—"}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="min-w-0">
                  <div className="truncate text-[12px] text-[rgba(255,255,255,0.7)]">
                    {brand.primaryContactName ?? "—"}
                  </div>
                  <div className="truncate font-mono text-[10px] text-[rgba(255,255,255,0.45)]">
                    {brand.primaryContactEmail ?? "—"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-[11px] text-[rgba(255,255,255,0.45)]">
                {formatShortDate(brand.updatedAt)}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={(event) => event.stopPropagation()}
                        className="cursor-pointer text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.06)]"
                      >
                        <MoreHorizontal />
                        <span className="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-32 border-[rgba(255,255,255,0.08)] bg-[#121212] text-[rgba(255,255,255,0.82)]"
                    >
                      <DropdownMenuItem
                        onClick={(event) => {
                          event.stopPropagation()
                          onEdit(brand)
                        }}
                        className="cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(event) => {
                          event.stopPropagation()
                          onDelete(brand)
                        }}
                        className="cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
