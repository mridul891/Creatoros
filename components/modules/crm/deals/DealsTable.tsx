"use client"

import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DEAL_PRIORITIES,
  DEAL_PRIORITY_THEME,
  DEAL_STAGE_LABEL,
  DEAL_STAGES,
} from "@/enums/deal"
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
    <div className="overflow-hidden rounded-[18px] border border-border bg-card">
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-border border-b hover:bg-transparent">
              <TableHead className="min-w-[220px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider">
                Campaign
              </TableHead>
              <TableHead className="hidden min-w-[140px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider lg:table-cell">
                Brand
              </TableHead>
              <TableHead className="hidden min-w-[130px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider xl:table-cell">
                Contact
              </TableHead>
              <TableHead className="min-w-[170px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider">
                Stage
              </TableHead>
              <TableHead className="min-w-[160px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider">
                Priority
              </TableHead>
              <TableHead className="min-w-[120px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider">
                Value
              </TableHead>
              <TableHead className="hidden min-w-[100px] px-4 font-mono text-[10px] text-muted-foreground tracking-wider md:table-cell">
                Due
              </TableHead>
              <TableHead className="w-[44px] px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={`cursor-pointer border-border border-b ${DEAL_PRIORITY_THEME[item.priority].row} hover:bg-muted`}
              >
                <TableCell className="px-4 py-3">
                  <Link href={`/dashboard/deals/${item.id}`} className="block">
                    <p className="truncate font-semibold text-[13px] text-foreground">
                      {item.campaignName}
                    </p>
                  </Link>
                  <div className="mt-1 space-y-0.5 text-[11px] text-muted-foreground lg:hidden">
                    <p className="truncate">Brand: {item.brandName}</p>
                    <p className="truncate">
                      Contact: {item.contactName ?? "—"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden truncate px-4 text-[12px] text-muted-foreground lg:table-cell">
                  {item.brandName}
                </TableCell>
                <TableCell className="hidden truncate px-4 text-[12px] text-muted-foreground xl:table-cell">
                  {item.contactName ?? "—"}
                </TableCell>
                <TableCell className="px-4">
                  <select
                    value={item.stage}
                    aria-label={`Stage for ${item.campaignName}`}
                    disabled={isInlineUpdating || item.status !== "Active"}
                    onChange={(event) =>
                      onStageChange(
                        item.id,
                        event.target.value as DealListItem["stage"]
                      )
                    }
                    className="h-8 w-full cursor-pointer rounded-[8px] border border-border bg-secondary px-2 text-[11px] text-muted-foreground"
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
                    onChange={(event) =>
                      onPriorityChange(
                        item.id,
                        event.target.value as DealListItem["priority"]
                      )
                    }
                    className={`h-8 w-full cursor-pointer rounded-[8px] border px-2 text-[11px] ${DEAL_PRIORITY_THEME[item.priority].select}`}
                  >
                    {DEAL_PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="px-4 font-semibold text-[12px] text-muted-foreground">
                  {item.currency} {item.dealValue.toLocaleString()}
                </TableCell>
                <TableCell className="hidden px-4 text-[12px] text-muted-foreground md:table-cell">
                  {item.dueDate ? item.dueDate.toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label="Row actions"
                        className="h-8 w-8 cursor-pointer p-0 text-muted-foreground hover:bg-muted"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-border bg-[#121212] text-muted-foreground"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </DropdownMenuItem>
                      {item.status === "Active" ? (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onArchive(item)}
                        >
                          Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onRestore(item)}
                        >
                          Restore
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer text-[#E8402A]"
                        onClick={() => onDelete(item)}
                      >
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
