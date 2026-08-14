"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  TASK_PRIORITIES,
  TASK_STATUS_LABEL,
  TASK_STATUSES,
  type TaskStatus,
} from "@/enums/task"
import type { TaskFormValues } from "@/lib/crm/tasks/taskForm"
import type { TaskField } from "@/types/task"
import { CrmFormDialog } from "../shared"

type TaskFormProps = {
  open: boolean
  title: string
  submitLabel: string
  values: TaskFormValues
  isSubmitting: boolean
  fieldErrors: Partial<Record<TaskField, string>>
  formError: string
  onChange: (nextValues: TaskFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  statusOptions?: readonly TaskStatus[]
  statusDisabled?: boolean
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-[#E8402A] text-[11px]">{message}</p>
}

export function TaskForm({
  open,
  title,
  submitLabel,
  values,
  isSubmitting,
  fieldErrors,
  formError,
  onChange,
  onOpenChange,
  onSubmit,
  statusOptions = TASK_STATUSES,
  statusDisabled = false,
}: TaskFormProps) {
  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Capture internal execution work for this deal."
      onOpenChange={onOpenChange}
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="task-title"
            className="text-[12px] text-muted-foreground"
          >
            Title
          </Label>
          <Input
            id="task-title"
            value={values.title}
            onChange={(event) =>
              onChange({ ...values, title: event.target.value })
            }
            placeholder="Write script"
            className="h-10 border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.title} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="task-description"
            className="text-[12px] text-muted-foreground"
          >
            Description
          </Label>
          <Textarea
            id="task-description"
            value={values.description}
            onChange={(event) =>
              onChange({ ...values, description: event.target.value })
            }
            placeholder="Describe execution notes or acceptance for this task."
            rows={4}
            className="border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.description} />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] text-muted-foreground">Status</Label>
          <Select
            value={values.status}
            onValueChange={(next) =>
              onChange({ ...values, status: next as TaskFormValues["status"] })
            }
            disabled={statusDisabled}
          >
            <SelectTrigger className="h-10 border-border bg-card text-muted-foreground text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {TASK_STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorText message={fieldErrors.status} />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] text-muted-foreground">Priority</Label>
          <Select
            value={values.priority}
            onValueChange={(next) =>
              onChange({
                ...values,
                priority: next as TaskFormValues["priority"],
              })
            }
          >
            <SelectTrigger className="h-10 border-border bg-card text-muted-foreground text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorText message={fieldErrors.priority} />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="task-due-date"
            className="text-[12px] text-muted-foreground"
          >
            Due Date
          </Label>
          <Input
            id="task-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) =>
              onChange({ ...values, dueDate: event.target.value })
            }
            className="h-10 border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.dueDate} />
        </div>
      </div>

      {formError ? (
        <Alert
          variant="destructive"
          className="mt-4 border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]"
        >
          <AlertDescription className="text-[#E8402A] text-[12px]">
            {formError}
          </AlertDescription>
        </Alert>
      ) : null}
    </CrmFormDialog>
  )
}
