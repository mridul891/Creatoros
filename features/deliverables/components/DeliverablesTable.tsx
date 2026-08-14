"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DeliverableListItem } from "@/features/deliverables/types/deliverable"

type DeliverablesTableProps = {
  items: DeliverableListItem[]
  isCreatingInvoiceId?: string | null
  onEdit: (id: string) => void
  onCreateInvoice: (id: string) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

function formatDate(value: Date | null) {
  if (!value) return "No due date"
  return value.toLocaleDateString()
}

export function DeliverablesTable({
  items,
  isCreatingInvoiceId,
  onEdit,
  onCreateInvoice,
  onArchive,
  onRestore,
  onDelete,
}: DeliverablesTableProps) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-border">
      <table className="min-w-full">
        <thead>
          <tr className="border-border border-b bg-muted text-left">
            <th className="px-4 py-3 font-semibold text-[11px] text-muted-foreground">
              Deliverable
            </th>
            <th className="px-4 py-3 font-semibold text-[11px] text-muted-foreground">
              Due Date
            </th>
            <th className="px-4 py-3 font-semibold text-[11px] text-muted-foreground">
              Status
            </th>
            <th className="px-4 py-3 font-semibold text-[11px] text-muted-foreground">
              Approval
            </th>
            <th className="px-4 py-3 font-semibold text-[11px] text-muted-foreground">
              Revision
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[11px] text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-border border-b last:border-none"
            >
              <td className="px-4 py-3">
                <p className="font-semibold text-[13px] text-foreground">
                  {item.deliverableType}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {item.platform}
                </p>
              </td>
              <td className="px-4 py-3 text-[12px] text-muted-foreground">
                {formatDate(item.dueDate)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant="outline"
                  className="border-border text-[11px] text-muted-foreground"
                >
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-[12px] text-muted-foreground">
                {item.approvalStatus}
              </td>
              <td className="px-4 py-3 text-[12px] text-muted-foreground">
                {item.revisionCount}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(item.id)}
                    className="h-8 cursor-pointer text-[11px]"
                  >
                    Edit
                  </Button>
                  {item.isArchived ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onRestore(item.id)}
                        className="h-8 cursor-pointer text-[11px]"
                      >
                        Restore
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(item.id)}
                        className="h-8 cursor-pointer text-[11px]"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onCreateInvoice(item.id)}
                        disabled={isCreatingInvoiceId === item.id}
                        className="h-8 cursor-pointer text-[11px]"
                      >
                        {isCreatingInvoiceId === item.id
                          ? "Creating..."
                          : "Create Invoice"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onArchive(item.id)}
                        className="h-8 cursor-pointer text-[11px]"
                      >
                        Archive
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
