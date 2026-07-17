"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DeliverableListItem } from "@/types/deliverable"

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

export function DeliverablesTable({ items, isCreatingInvoiceId, onEdit, onCreateInvoice, onArchive, onRestore, onDelete }: DeliverablesTableProps) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-border">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-border bg-muted text-left">
            <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground">Deliverable</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground">Due Date</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground">Approval</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground">Revision</th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-none">
              <td className="px-4 py-3">
                <p className="text-[13px] font-semibold text-foreground">{item.deliverableType}</p>
                <p className="text-[11px] text-muted-foreground">{item.platform}</p>
              </td>
              <td className="px-4 py-3 text-[12px] text-muted-foreground">{formatDate(item.dueDate)}</td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="border-border text-[11px] text-muted-foreground">
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-[12px] text-muted-foreground">{item.approvalStatus}</td>
              <td className="px-4 py-3 text-[12px] text-muted-foreground">{item.revisionCount}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => onEdit(item.id)} className="h-8 cursor-pointer text-[11px]">
                    Edit
                  </Button>
                  {item.isArchived ? (
                    <>
                      <Button type="button" size="sm" variant="outline" onClick={() => onRestore(item.id)} className="h-8 cursor-pointer text-[11px]">
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
                        {isCreatingInvoiceId === item.id ? "Creating..." : "Create Invoice"}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => onArchive(item.id)} className="h-8 cursor-pointer text-[11px]">
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
