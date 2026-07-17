"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DELIVERABLE_APPROVAL_STATUSES, DELIVERABLE_STATUSES } from "@/enums/deliverable"
import {
  DELIVERABLE_PLATFORM_SUGGESTIONS,
  DELIVERABLE_TYPE_SUGGESTIONS,
} from "@/lib/crm/deliverables/deliverableValidation"
import type { DeliverableFormValues } from "@/lib/crm/deliverables/deliverableForm"
import type { DeliverableField } from "@/types/deliverable"
import { CrmFormDialog } from "../shared"

type DeliverableFormProps = {
  open: boolean
  title: string
  submitLabel: string
  values: DeliverableFormValues
  isSubmitting: boolean
  fieldErrors: Partial<Record<DeliverableField, string>>
  formError: string
  onChange: (nextValues: DeliverableFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-[11px] text-[#E8402A]">{message}</p>
}

export function DeliverableForm({
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
}: DeliverableFormProps) {
  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Capture brand-facing campaign output and approval lifecycle."
      onOpenChange={onOpenChange}
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} className="cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[12px] text-muted-foreground">Platform</Label>
          <Select value={values.platform} onValueChange={(next) => onChange({ ...values, platform: next })}>
            <SelectTrigger className="h-10 border-border bg-card text-xs text-muted-foreground">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERABLE_PLATFORM_SUGGESTIONS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorText message={fieldErrors.platform} />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] text-muted-foreground">Deliverable Type</Label>
          <Select value={values.deliverableType} onValueChange={(next) => onChange({ ...values, deliverableType: next })}>
            <SelectTrigger className="h-10 border-border bg-card text-xs text-muted-foreground">
              <SelectValue placeholder="Deliverable type" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERABLE_TYPE_SUGGESTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorText message={fieldErrors.deliverableType} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliverable-due-date" className="text-[12px] text-muted-foreground">
            Due Date
          </Label>
          <Input
            id="deliverable-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) => onChange({ ...values, dueDate: event.target.value })}
            className="h-10 border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.dueDate} />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] text-muted-foreground">Status</Label>
          <Select value={values.status} onValueChange={(next) => onChange({ ...values, status: next as DeliverableFormValues["status"] })}>
            <SelectTrigger className="h-10 border-border bg-card text-xs text-muted-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERABLE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorText message={fieldErrors.status} />
        </div>

        <div className="space-y-2">
          <Label className="text-[12px] text-muted-foreground">Approval Status</Label>
          <Select
            value={values.approvalStatus}
            onValueChange={(next) => onChange({ ...values, approvalStatus: next as DeliverableFormValues["approvalStatus"] })}
          >
            <SelectTrigger className="h-10 border-border bg-card text-xs text-muted-foreground">
              <SelectValue placeholder="Approval status" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERABLE_APPROVAL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorText message={fieldErrors.approvalStatus} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliverable-revision-count" className="text-[12px] text-muted-foreground">
            Revision Count
          </Label>
          <Input
            id="deliverable-revision-count"
            type="number"
            min={0}
            value={values.revisionCount}
            onChange={(event) => onChange({ ...values, revisionCount: event.target.value })}
            className="h-10 border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.revisionCount} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="deliverable-submission-url" className="text-[12px] text-muted-foreground">
            Submission URL
          </Label>
          <Input
            id="deliverable-submission-url"
            value={values.submissionUrl}
            onChange={(event) => onChange({ ...values, submissionUrl: event.target.value })}
            placeholder="https://"
            className="h-10 border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.submissionUrl} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="deliverable-published-url" className="text-[12px] text-muted-foreground">
            Published URL
          </Label>
          <Input
            id="deliverable-published-url"
            value={values.publishedUrl}
            onChange={(event) => onChange({ ...values, publishedUrl: event.target.value })}
            placeholder="https://"
            className="h-10 border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.publishedUrl} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="deliverable-brand-notes" className="text-[12px] text-muted-foreground">
            Brand Notes
          </Label>
          <Textarea
            id="deliverable-brand-notes"
            value={values.brandNotes}
            onChange={(event) => onChange({ ...values, brandNotes: event.target.value })}
            rows={3}
            className="border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.brandNotes} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="deliverable-internal-notes" className="text-[12px] text-muted-foreground">
            Internal Notes
          </Label>
          <Textarea
            id="deliverable-internal-notes"
            value={values.internalNotes}
            onChange={(event) => onChange({ ...values, internalNotes: event.target.value })}
            rows={3}
            className="border-border bg-card text-[13px]"
          />
          <ErrorText message={fieldErrors.internalNotes} />
        </div>
      </div>

      {formError ? (
        <Alert variant="destructive" className="mt-4 border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]">
          <AlertDescription className="text-[12px] text-[#E8402A]">{formError}</AlertDescription>
        </Alert>
      ) : null}
    </CrmFormDialog>
  )
}
