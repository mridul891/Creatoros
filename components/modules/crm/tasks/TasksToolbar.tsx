"use client"

import { Add01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TASK_ARCHIVE_FILTERS,
  TASK_DUE_DATE_FILTERS,
  TASK_PRIORITIES,
  TASK_SORT_OPTIONS,
  TASK_STATUSES,
} from "@/enums/task"
import { CrmSearchField } from "../shared"

type TasksToolbarProps = {
  total: number
  search: string
  status: string
  priority: string
  archive: "active" | "archived"
  dueDate: "all" | "upcoming" | "overdue" | "none"
  sort: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onArchiveChange: (value: "active" | "archived") => void
  onDueDateChange: (value: "all" | "upcoming" | "overdue" | "none") => void
  onSortChange: (value: string) => void
  onCreate: () => void
  createDisabled?: boolean
}

function dueDateLabel(value: (typeof TASK_DUE_DATE_FILTERS)[number]) {
  switch (value) {
    case "upcoming":
      return "Upcoming"
    case "overdue":
      return "Overdue"
    case "none":
      return "No Due Date"
    default:
      return "All Due Dates"
  }
}

export function TasksToolbar({
  total,
  search,
  status,
  priority,
  archive,
  dueDate,
  sort,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onArchiveChange,
  onDueDateChange,
  onSortChange,
  onCreate,
  createDisabled = false,
}: TasksToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[11px] text-muted-foreground">
          {total} total tasks
        </div>
        <Button
          type="button"
          className="h-9 cursor-pointer gap-2 px-4 font-semibold text-[12px]"
          onClick={onCreate}
          disabled={createDisabled}
        >
          <HugeiconsIcon icon={Add01Icon} size={14} />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap xl:items-center">
        <CrmSearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search task title or description..."
          ariaLabel="Search tasks"
          className="w-full sm:col-span-2 lg:col-span-3 xl:w-[320px]"
        />

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-full border-border bg-card text-muted-foreground text-xs xl:w-[165px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {TASK_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item === "InProgress"
                  ? "In Progress"
                  : item === "InReview"
                    ? "In Review"
                    : item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="h-10 w-full border-border bg-card text-muted-foreground text-xs xl:w-[145px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            {TASK_PRIORITIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={archive}
          onValueChange={(value) =>
            onArchiveChange(value as "active" | "archived")
          }
        >
          <SelectTrigger className="h-10 w-full border-border bg-card text-muted-foreground text-xs xl:w-[135px]">
            <SelectValue placeholder="Archive" />
          </SelectTrigger>
          <SelectContent>
            {TASK_ARCHIVE_FILTERS.map((item) => (
              <SelectItem key={item} value={item}>
                {item === "active" ? "Active" : "Archived"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={dueDate}
          onValueChange={(value) =>
            onDueDateChange(value as "all" | "upcoming" | "overdue" | "none")
          }
        >
          <SelectTrigger className="h-10 w-full border-border bg-card text-muted-foreground text-xs xl:w-[165px]">
            <SelectValue placeholder="Due date" />
          </SelectTrigger>
          <SelectContent>
            {TASK_DUE_DATE_FILTERS.map((item) => (
              <SelectItem key={item} value={item}>
                {dueDateLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="h-10 w-full border-border bg-card text-muted-foreground text-xs xl:w-[175px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {TASK_SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "order"
                  ? "Default Order"
                  : option === "updatedAt"
                    ? "Recently Updated"
                    : option === "dueDate"
                      ? "Due Date"
                      : "Priority"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
