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
    <div className="overflow-x-auto rounded-[14px] border border-[rgba(255,255,255,0.07)]">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] text-left">
            <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Deliverable</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Due Date</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Status</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Approval</th>
            <th className="px-4 py-3 text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Revision</th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold text-[rgba(255,255,255,0.58)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[rgba(255,255,255,0.05)] last:border-none">
              <td className="px-4 py-3">
                <p className="text-[13px] font-semibold text-white">{item.deliverableType}</p>
                <p className="text-[11px] text-[rgba(255,255,255,0.5)]">{item.platform}</p>
              </td>
              <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.72)]">{formatDate(item.dueDate)}</td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="border-[rgba(255,255,255,0.15)] text-[11px] text-[rgba(255,255,255,0.75)]">
                  {item.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.72)]">{item.approvalStatus}</td>
              <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.72)]">{item.revisionCount}</td>
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
