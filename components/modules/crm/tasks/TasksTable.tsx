"use client"

import { TASK_STATUSES, TASK_STATUS_LABEL } from "@/enums/task"
import type { TaskListItem } from "@/types/task"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaskRowActions } from "./TaskRowActions"

type TasksTableProps = {
  items: TaskListItem[]
  updatingTaskId: string | null
  isReadOnly: boolean
  onStatusChange: (taskId: string, status: TaskListItem["status"]) => void
  onView: (task: TaskListItem) => void
  onEdit: (task: TaskListItem) => void
  onArchive: (task: TaskListItem) => void
  onRestore: (task: TaskListItem) => void
  onDelete: (task: TaskListItem) => void
}

function getPriorityClass(priority: TaskListItem["priority"]) {
  switch (priority) {
    case "Urgent":
      return "border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.14)] text-[#FF9A8B]"
    case "High":
      return "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.14)] text-[#FDD78C]"
    case "Medium":
      return "border-[rgba(59,130,246,0.35)] bg-[rgba(59,130,246,0.14)] text-[#93C5FD]"
    default:
      return "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.14)] text-[#9CE7BA]"
  }
}

export function TasksTable({
  items,
  updatingTaskId,
  isReadOnly,
  onStatusChange,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: TasksTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border bg-card">
      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="min-w-[220px] px-4 font-mono text-[10px] tracking-wider text-muted-foreground">Task</TableHead>
              <TableHead className="min-w-[170px] px-4 font-mono text-[10px] tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="min-w-[120px] px-4 font-mono text-[10px] tracking-wider text-muted-foreground">Priority</TableHead>
              <TableHead className="min-w-[120px] px-4 font-mono text-[10px] tracking-wider text-muted-foreground">Due Date</TableHead>
              <TableHead className="hidden min-w-[90px] px-4 font-mono text-[10px] tracking-wider text-muted-foreground lg:table-cell">Order</TableHead>
              <TableHead className="w-[44px] px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              return (
                <TableRow key={item.id} className="border-b border-border hover:bg-muted">
                <TableCell className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onView(item)}
                    className="cursor-pointer text-left"
                    aria-label={`View task ${item.title}`}
                  >
                    <p className="truncate text-[13px] font-semibold text-foreground">{item.title}</p>
                  </button>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">{item.description ?? "No description provided."}</p>
                </TableCell>
                <TableCell className="px-4">
                  <select
                    value={item.status}
                    aria-label={`Status for ${item.title}`}
                    disabled={updatingTaskId === item.id || item.isArchived || isReadOnly}
                    onChange={(event) => onStatusChange(item.id, event.target.value as TaskListItem["status"])}
                    className="h-8 w-full cursor-pointer rounded-[8px] border border-border bg-secondary px-2 text-[11px] text-muted-foreground"
                  >
                    {TASK_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {TASK_STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="px-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${getPriorityClass(item.priority)}`}>
                    {item.priority}
                  </span>
                </TableCell>
                <TableCell className="px-4 text-[12px] text-muted-foreground">
                  {item.dueDate ? item.dueDate.toLocaleDateString() : "—"}
                </TableCell>
                <TableCell className="hidden px-4 text-[12px] text-muted-foreground lg:table-cell">{item.orderIndex}</TableCell>
                <TableCell className="text-right">
                  <TaskRowActions
                    task={item}
                    isReadOnly={isReadOnly}
                    onView={onView}
                    onEdit={onEdit}
                    onArchive={onArchive}
                    onRestore={onRestore}
                    onDelete={onDelete}
                  />
                </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
