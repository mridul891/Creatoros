"use client"

import { DotsThree } from "@phosphor-icons/react/dist/ssr"
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
    <div className="overflow-hidden rounded-[18px] border border-border bg-card">
      <Table className="table-fixed border-collapse">
        <TableHeader className="border-b border-border">
          <TableRow className="border-0 hover:bg-transparent">
            <TableHead className="w-[28%] px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              BRAND
            </TableHead>
            <TableHead className="w-[16%] px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              CATEGORY
            </TableHead>
            <TableHead className="w-[24%] px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              PRIMARY CONTACT
            </TableHead>
            <TableHead className="w-[14%] px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground">
              UPDATED
            </TableHead>
            <TableHead className="w-[18%] px-6 py-3 text-right font-mono text-[10px] tracking-wider text-muted-foreground">
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
              className="cursor-pointer border-b border-border bg-transparent hover:bg-muted"
            >
              <TableCell className="px-6 py-4">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-foreground">{brand.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {brand.website ?? "No website"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-[12px] text-muted-foreground">
                {brand.category ?? "—"}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="min-w-0">
                  <div className="truncate text-[12px] text-muted-foreground">
                    {brand.primaryContactName ?? "—"}
                  </div>
                  <div className="truncate font-mono text-[10px] text-muted-foreground">
                    {brand.primaryContactEmail ?? "—"}
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-[11px] text-muted-foreground">
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
                        className="cursor-pointer text-muted-foreground hover:bg-muted"
                      >
                        <DotsThree />
                        <span className="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-32 border-border bg-[#121212] text-muted-foreground"
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
