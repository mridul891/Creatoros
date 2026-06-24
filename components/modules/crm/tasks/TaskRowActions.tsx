"use client"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { TaskListItem } from "@/types/task"

type TaskRowActionsProps = {
  task: TaskListItem
  isReadOnly: boolean
  onView: (task: TaskListItem) => void
  onEdit: (task: TaskListItem) => void
  onArchive: (task: TaskListItem) => void
  onRestore: (task: TaskListItem) => void
  onDelete: (task: TaskListItem) => void
}

export function TaskRowActions({ task, isReadOnly, onView, onEdit, onArchive, onRestore, onDelete }: TaskRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Task row actions"
          className="h-8 w-8 cursor-pointer p-0 text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)]"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-[rgba(255,255,255,0.08)] bg-[#121212] text-[rgba(255,255,255,0.8)]">
        <DropdownMenuItem className="cursor-pointer" onClick={() => onView(task)}>
          View Details
        </DropdownMenuItem>
        {!isReadOnly ? (
          <>
            <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(task)}>
              Edit
            </DropdownMenuItem>
            {task.isArchived ? (
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => onRestore(task)}>
                  Restore
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-[#E8402A]" onClick={() => onDelete(task)}>
                  Delete
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="cursor-pointer" onClick={() => onArchive(task)}>
                Archive
              </DropdownMenuItem>
            )}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
