"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TASK_STATUS_LABEL } from "@/features/tasks/enums/task"
import type { TaskDetail } from "@/features/tasks/types/task"

type TaskDetailPanelProps = {
  open: boolean
  task: TaskDetail | null
  isLoading?: boolean
  loadError?: string
  onOpenChange: (open: boolean) => void
}

export function TaskDetailPanel({
  open,
  task,
  isLoading = false,
  loadError,
  onOpenChange,
}: TaskDetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(95vw,460px)] border-border bg-card text-muted-foreground"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="font-bold text-foreground text-lg">
            {task?.title ?? "Task details"}
          </SheetTitle>
          <SheetDescription className="text-[12px] text-muted-foreground">
            Detailed task context for execution tracking.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-[12px] bg-muted"
              />
            ))}
          </div>
        ) : loadError ? (
          <Alert
            variant="destructive"
            className="border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]"
          >
            <AlertDescription className="text-[#E8402A] text-[12px]">
              {loadError}
            </AlertDescription>
          </Alert>
        ) : task ? (
          <div className="space-y-4 text-[13px]">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-border bg-muted p-3">
                <p className="text-[11px] text-muted-foreground">Status</p>
                <p className="mt-1 font-semibold text-foreground">
                  {TASK_STATUS_LABEL[task.status]}
                </p>
              </div>
              <div className="rounded-[12px] border border-border bg-muted p-3">
                <p className="text-[11px] text-muted-foreground">Priority</p>
                <p className="mt-1 font-semibold text-foreground">
                  {task.priority}
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-border bg-muted p-3">
              <p className="text-[11px] text-muted-foreground">Description</p>
              <p className="mt-1 whitespace-pre-wrap text-[13px] text-muted-foreground">
                {task.description ?? "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-border bg-muted p-3">
                <p className="text-[11px] text-muted-foreground">Due Date</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {task.dueDate ? task.dueDate.toLocaleDateString() : "Not set"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-border bg-muted p-3">
                <p className="text-[11px] text-muted-foreground">Created</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {task.createdAt.toLocaleString()}
                </p>
              </div>
              <div className="rounded-[12px] border border-border bg-muted p-3">
                <p className="text-[11px] text-muted-foreground">Updated</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {task.updatedAt.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
