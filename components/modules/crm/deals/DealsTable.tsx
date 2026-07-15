"use client"

import { DotsThree } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEAL_PRIORITIES, DEAL_PRIORITY_THEME, DEAL_STAGES, DEAL_STAGE_LABEL } from "@/enums/deal"
import type { DealListItem } from "@/types/deal"

type DealsTableProps = {
  items: DealListItem[]
  isInlineUpdating: boolean
  onStageChange: (dealId: string, stage: DealListItem["stage"]) => void
  onPriorityChange: (dealId: string, priority: DealListItem["priority"]) => void
  onEdit: (deal: DealListItem) => void
  onArchive: (deal: DealListItem) => void
  onRestore: (deal: DealListItem) => void
  onDelete: (deal: DealListItem) => void
}

export function DealsTable({
  items,
  isInlineUpdating,
  onStageChange,
  onPriorityChange,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: DealsTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D]">
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-b border-[rgba(255,255,255,0.08)] hover:bg-transparent">
              <TableHead className="min-w-[220px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)]">
                Campaign
              </TableHead>
              <TableHead className="hidden min-w-[140px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)] lg:table-cell">
                Brand
              </TableHead>
              <TableHead className="hidden min-w-[130px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)] xl:table-cell">
                Contact
              </TableHead>
              <TableHead className="min-w-[170px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)]">
                Stage
              </TableHead>
              <TableHead className="min-w-[160px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)]">
                Priority
              </TableHead>
              <TableHead className="min-w-[120px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)]">
                Value
              </TableHead>
              <TableHead className="hidden min-w-[100px] px-4 font-mono text-[10px] tracking-wider text-[rgba(255,255,255,0.45)] md:table-cell">
                Due
              </TableHead>
              <TableHead className="w-[44px] px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={`cursor-pointer border-b border-[rgba(255,255,255,0.05)] ${DEAL_PRIORITY_THEME[item.priority].row} hover:bg-[rgba(255,255,255,0.09)]`}
              >
                <TableCell className="px-4 py-3">
                  <Link href={`/dashboard/deals/${item.id}`} className="block">
                    <p className="truncate text-[13px] font-semibold text-white">{item.campaignName}</p>
                  </Link>
                  <div className="mt-1 space-y-0.5 text-[11px] text-[rgba(255,255,255,0.55)] lg:hidden">
                    <p className="truncate">Brand: {item.brandName}</p>
                    <p className="truncate">Contact: {item.contactName ?? "—"}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden truncate px-4 text-[12px] text-[rgba(255,255,255,0.72)] lg:table-cell">
                  {item.brandName}
                </TableCell>
                <TableCell className="hidden truncate px-4 text-[12px] text-[rgba(255,255,255,0.58)] xl:table-cell">
                  {item.contactName ?? "—"}
                </TableCell>
                <TableCell className="px-4">
                  <select
                    value={item.stage}
                    aria-label={`Stage for ${item.campaignName}`}
                    disabled={isInlineUpdating || item.status !== "Active"}
                    onChange={(event) => onStageChange(item.id, event.target.value as DealListItem["stage"])}
                    className="h-8 w-full cursor-pointer rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[#111111] px-2 text-[11px] text-[rgba(255,255,255,0.85)]"
                  >
                    {DEAL_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {DEAL_STAGE_LABEL[stage]}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="px-4">
                  <select
                    value={item.priority}
                    aria-label={`Priority for ${item.campaignName}`}
                    disabled={isInlineUpdating || item.status !== "Active"}
                    onChange={(event) => onPriorityChange(item.id, event.target.value as DealListItem["priority"])}
                    className={`h-8 w-full cursor-pointer rounded-[8px] border px-2 text-[11px] ${DEAL_PRIORITY_THEME[item.priority].select}`}
                  >
                    {DEAL_PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="px-4 text-[12px] font-semibold text-[rgba(255,255,255,0.82)]">
                  {item.currency} {item.dealValue.toLocaleString()}
                </TableCell>
                <TableCell className="hidden px-4 text-[12px] text-[rgba(255,255,255,0.58)] md:table-cell">
                  {item.dueDate ? item.dueDate.toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label="Row actions"
                        className="h-8 w-8 cursor-pointer p-0 text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <DotsThree size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-[rgba(255,255,255,0.08)] bg-[#121212] text-[rgba(255,255,255,0.8)]"
                    >
                      <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(item)}>
                        Edit
                      </DropdownMenuItem>
                      {item.status === "Active" ? (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onArchive(item)}>
                          Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => onRestore(item)}>
                          Restore
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer text-[#E8402A]" onClick={() => onDelete(item)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
