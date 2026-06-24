"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { TaskDetail } from "@/types/task"
import { TASK_STATUS_LABEL } from "@/enums/task"
import { Alert, AlertDescription } from "@/components/ui/alert"

type TaskDetailPanelProps = {
  open: boolean
  task: TaskDetail | null
  isLoading?: boolean
  loadError?: string
  onOpenChange: (open: boolean) => void
}

export function TaskDetailPanel({ open, task, isLoading = false, loadError, onOpenChange }: TaskDetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(95vw,460px)] border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] text-[rgba(255,255,255,0.82)]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-bold text-white">{task?.title ?? "Task details"}</SheetTitle>
          <SheetDescription className="text-[12px] text-[rgba(255,255,255,0.52)]">
            Detailed task context for execution tracking.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-[12px] bg-[rgba(255,255,255,0.06)]" />
            ))}
          </div>
        ) : loadError ? (
          <Alert variant="destructive" className="border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]">
            <AlertDescription className="text-[12px] text-[#E8402A]">{loadError}</AlertDescription>
          </Alert>
        ) : task ? (
          <div className="space-y-4 text-[13px]">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Status</p>
                <p className="mt-1 font-semibold text-white">{TASK_STATUS_LABEL[task.status]}</p>
              </div>
              <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Priority</p>
                <p className="mt-1 font-semibold text-white">{task.priority}</p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
              <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Description</p>
              <p className="mt-1 whitespace-pre-wrap text-[13px] text-[rgba(255,255,255,0.75)]">
                {task.description ?? "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Due Date</p>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.75)]">{task.dueDate ? task.dueDate.toLocaleDateString() : "Not set"}</p>
              </div>
           
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Created</p>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.75)]">{task.createdAt.toLocaleString()}</p>
              </div>
              <div className="rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Updated</p>
                <p className="mt-1 text-[13px] text-[rgba(255,255,255,0.75)]">{task.updatedAt.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
