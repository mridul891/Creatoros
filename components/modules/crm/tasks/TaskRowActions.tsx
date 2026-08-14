"use client"

import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export function TaskRowActions({
  task,
  isReadOnly,
  onView,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: TaskRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Task row actions"
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
          onClick={() => onView(task)}
        >
          View Details
        </DropdownMenuItem>
        {!isReadOnly ? (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit(task)}
            >
              Edit
            </DropdownMenuItem>
            {task.isArchived ? (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onRestore(task)}
                >
                  Restore
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-[#E8402A]"
                  onClick={() => onDelete(task)}
                >
                  Delete
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onArchive(task)}
              >
                Archive
              </DropdownMenuItem>
            )}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
