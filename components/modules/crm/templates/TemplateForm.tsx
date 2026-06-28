"use client"

import { Plus, Trash2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TASK_PRIORITIES } from "@/enums/task"
import {
  EMPTY_TEMPLATE_DELIVERABLE,
  EMPTY_TEMPLATE_TASK,
  type CampaignTemplateFormValues,
} from "@/lib/crm/templates/templateForm"
import type { CampaignTemplateField } from "@/types/campaignTemplate"
import { CrmFormDialog } from "../shared"

type TemplateFormProps = {
  open: boolean
  title: string
  submitLabel: string
  values: CampaignTemplateFormValues
  isSubmitting: boolean
  fieldErrors?: Partial<Record<CampaignTemplateField, string>>
  formError?: string
  onChange: (values: CampaignTemplateFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function TemplateForm({
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
}: TemplateFormProps) {
  function updateTask(index: number, nextTask: CampaignTemplateFormValues["tasks"][number]) {
    onChange({
      ...values,
      tasks: values.tasks.map((item, taskIndex) => (taskIndex === index ? nextTask : item)),
    })
  }

  function updateDeliverable(index: number, nextDeliverable: CampaignTemplateFormValues["deliverables"][number]) {
    onChange({
      ...values,
      deliverables: values.deliverables.map((item, deliverableIndex) =>
        deliverableIndex === index ? nextDeliverable : item
      ),
    })
  }

  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Define reusable tasks and deliverables to speed up new deal setup."
      onOpenChange={onOpenChange}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-10 cursor-pointer border-[rgba(255,255,255,0.14)] bg-transparent px-4 text-[rgba(255,255,255,0.78)] hover:bg-[rgba(255,255,255,0.04)]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-10 cursor-pointer bg-(--cos-primary) px-5 text-white shadow-[0_8px_24px_rgba(232,64,42,0.25)] hover:bg-(--cos-primary)"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      }
    >
      <FieldGroup className="mt-2 gap-6">
        <div className="space-y-4 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 sm:p-5">
          <Field>
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Template Name *</FieldLabel>
            <Input
              value={values.name}
              onChange={(event) => onChange({ ...values, name: event.target.value })}
              aria-invalid={Boolean(fieldErrors?.name)}
              className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
            />
            <FieldError>{fieldErrors?.name}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Description</FieldLabel>
            <Textarea
              rows={3}
              value={values.description}
              onChange={(event) => onChange({ ...values, description: event.target.value })}
              aria-invalid={Boolean(fieldErrors?.description)}
              className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
            />
            <FieldError>{fieldErrors?.description}</FieldError>
          </Field>
        </div>

        <div className="space-y-4 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-semibold tracking-[0.04em] text-[rgba(255,255,255,0.55)]">Template Tasks *</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange({ ...values, tasks: [...values.tasks, { ...EMPTY_TEMPLATE_TASK }] })}
              className="border-[rgba(255,255,255,0.14)] bg-transparent"
            >
              <Plus className="size-3.5" />
              Add Task
            </Button>
          </div>
          <FieldError>{fieldErrors?.tasks}</FieldError>
          <div className="space-y-3">
            {values.tasks.map((task, index) => (
              <div key={`task-${index}`} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[rgba(255,255,255,0.68)]">Task {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[rgba(255,255,255,0.6)] hover:text-red-400"
                    disabled={values.tasks.length <= 1}
                    onClick={() =>
                      onChange({
                        ...values,
                        tasks: values.tasks.filter((_, taskIndex) => taskIndex !== index),
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field className="sm:col-span-2">
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Title *</FieldLabel>
                    <Input
                      value={task.title}
                      onChange={(event) => updateTask(index, { ...task, title: event.target.value })}
                      className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Priority *</FieldLabel>
                    <Select
                      value={task.priority}
                      onValueChange={(priority) => updateTask(index, { ...task, priority: priority as (typeof TASK_PRIORITIES)[number] })}
                    >
                      <SelectTrigger className="h-10 w-full border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Due In Days *</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={task.dueOffsetDays}
                      onChange={(event) => updateTask(index, { ...task, dueOffsetDays: event.target.value })}
                      className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
                    />
                  </Field>
                  <Field className="sm:col-span-2">
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Description</FieldLabel>
                    <Textarea
                      rows={2}
                      value={task.description}
                      onChange={(event) => updateTask(index, { ...task, description: event.target.value })}
                      className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] font-semibold tracking-[0.04em] text-[rgba(255,255,255,0.55)]">Template Deliverables</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange({ ...values, deliverables: [...values.deliverables, { ...EMPTY_TEMPLATE_DELIVERABLE }] })}
              className="border-[rgba(255,255,255,0.14)] bg-transparent"
            >
              <Plus className="size-3.5" />
              Add Deliverable
            </Button>
          </div>
          <FieldError>{fieldErrors?.deliverables}</FieldError>
          <div className="space-y-3">
            {values.deliverables.map((deliverable, index) => (
              <div key={`deliverable-${index}`} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0D] p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-[rgba(255,255,255,0.68)]">Deliverable {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[rgba(255,255,255,0.6)] hover:text-red-400"
                    onClick={() =>
                      onChange({
                        ...values,
                        deliverables: values.deliverables.filter((_, deliverableIndex) => deliverableIndex !== index),
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field>
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Platform *</FieldLabel>
                    <Input
                      value={deliverable.platform}
                      onChange={(event) => updateDeliverable(index, { ...deliverable, platform: event.target.value })}
                      className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Type *</FieldLabel>
                    <Input
                      value={deliverable.deliverableType}
                      onChange={(event) => updateDeliverable(index, { ...deliverable, deliverableType: event.target.value })}
                      className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
                    />
                  </Field>
                  <Field className="sm:col-span-2">
                    <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Due In Days *</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={deliverable.dueOffsetDays}
                      onChange={(event) => updateDeliverable(index, { ...deliverable, dueOffsetDays: event.target.value })}
                      className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formError ? (
          <Alert variant="destructive" className="border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]">
            <AlertDescription className="text-[12px] text-[#E8402A]">{formError}</AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </CrmFormDialog>
  )
}
