"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DEAL_PRIORITIES, DEAL_PRIORITY_THEME, DEAL_STAGES, DEAL_STAGE_LABEL, type DealPriority, type DealStage } from "@/enums/deal"
import { type DealFormValues } from "@/lib/crm/deals/dealForm"
import type { DealField } from "@/types/deal"
import { CrmFormDialog } from "../shared"

type DealFormProps = {
  open: boolean
  title: string
  submitLabel: string
  values: DealFormValues
  isSubmitting: boolean
  fieldErrors?: Partial<Record<DealField, string>>
  formError?: string
  brands: Array<{ id: string; name: string }>
  contacts: Array<{ id: string; name: string }>
  onChange: (values: DealFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function DealForm({
  open,
  title,
  submitLabel,
  values,
  isSubmitting,
  fieldErrors,
  formError,
  brands,
  contacts,
  onChange,
  onOpenChange,
  onSubmit,
}: DealFormProps) {
  const selectedPriority: DealPriority = DEAL_PRIORITIES.includes(values.priority as DealPriority)
    ? (values.priority as DealPriority)
    : "Medium"
  const priorityTheme = DEAL_PRIORITY_THEME[selectedPriority]

  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Capture campaign scope, timeline, and payment details for reliable delivery."
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-10 cursor-pointer border-border bg-transparent px-4 text-muted-foreground hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-10 cursor-pointer bg-primary px-5 text-primary-foreground shadow-[0_8px_24px_rgba(232,64,42,0.25)] hover:bg-primary"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </>
      }
    >
      <FieldGroup className="mt-2 gap-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-4 rounded-[14px] border border-border bg-muted p-4 sm:p-5">
            <div className="space-y-1">
              <p className="font-mono text-[10px] tracking-wide text-muted-foreground">Deal Basics</p>
              <p className="text-[11px] text-muted-foreground">Campaign, value, and account context.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel className="text-[11px] text-muted-foreground">Campaign Name *</FieldLabel>
                <Input
                  value={values.campaignName}
                  onChange={(event) => onChange({ ...values, campaignName: event.target.value })}
                  aria-invalid={Boolean(fieldErrors?.campaignName)}
                  className="h-10 border-border bg-muted text-[13px] text-muted-foreground"
                />
                <FieldError>{fieldErrors?.campaignName}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Deal Value *</FieldLabel>
                <Input
                  value={values.dealValue}
                  onChange={(event) => onChange({ ...values, dealValue: event.target.value })}
                  aria-invalid={Boolean(fieldErrors?.dealValue)}
                  className="h-10 border-border bg-muted text-[13px] text-muted-foreground"
                />
                <FieldError>{fieldErrors?.dealValue}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Currency *</FieldLabel>
                <Input
                  value={values.currency}
                  onChange={(event) => onChange({ ...values, currency: event.target.value.toUpperCase() })}
                  aria-invalid={Boolean(fieldErrors?.currency)}
                  className="h-10 border-border bg-muted text-[13px] text-muted-foreground"
                />
                <FieldError>{fieldErrors?.currency}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Brand *</FieldLabel>
                <Select value={values.brandId} onValueChange={(brandId) => onChange({ ...values, brandId, contactId: "" })}>
                  <SelectTrigger className="h-10 w-full border-border bg-muted text-[13px] text-muted-foreground">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors?.brandId}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Contact</FieldLabel>
                <Select
                  value={values.contactId || "__none"}
                  onValueChange={(value) => onChange({ ...values, contactId: value === "__none" ? "" : value })}
                >
                  <SelectTrigger className="h-10 w-full border-border bg-muted text-[13px] text-muted-foreground">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">No contact</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors?.contactId}</FieldError>
              </Field>

            </div>
          </div>

          <div className="space-y-4 rounded-[14px] border border-border bg-muted p-4 sm:p-5">
            <div className="space-y-1">
              <p className="font-mono text-[10px] tracking-wide text-muted-foreground">Pipeline And Dates</p>
              <p className="text-[11px] text-muted-foreground">Track movement and deadlines at a glance.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Stage *</FieldLabel>
                <Select value={values.stage} onValueChange={(stage) => onChange({ ...values, stage: stage as DealStage })}>
                  <SelectTrigger className="h-10 w-full border-border bg-muted text-[13px] text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {DEAL_STAGE_LABEL[stage]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{fieldErrors?.stage}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Priority *</FieldLabel>
                <Select
                  value={values.priority}
                  onValueChange={(priority) => onChange({ ...values, priority: priority as DealPriority })}
                >
                  <SelectTrigger
                    className={`h-10 w-full border-border bg-muted text-[13px] text-muted-foreground ${priorityTheme.select}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div
                  className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${priorityTheme.badge}`}
                >
                  Priority: {selectedPriority}
                </div>
                <FieldError>{fieldErrors?.priority}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Start Date</FieldLabel>
                <Input
                  type="date"
                  value={values.startDate}
                  onChange={(event) => onChange({ ...values, startDate: event.target.value })}
                  aria-invalid={Boolean(fieldErrors?.startDate)}
                  className="h-10 border-border bg-muted text-[13px] text-muted-foreground"
                />
                <FieldError>{fieldErrors?.startDate}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Due Date</FieldLabel>
                <Input
                  type="date"
                  value={values.dueDate}
                  onChange={(event) => onChange({ ...values, dueDate: event.target.value })}
                  aria-invalid={Boolean(fieldErrors?.dueDate)}
                  className="h-10 border-border bg-muted text-[13px] text-muted-foreground"
                />
                <FieldError>{fieldErrors?.dueDate}</FieldError>
              </Field>

              <Field>
                <FieldLabel className="text-[11px] text-muted-foreground">Payment Due Date</FieldLabel>
                <Input
                  type="date"
                  value={values.paymentDueDate}
                  onChange={(event) => onChange({ ...values, paymentDueDate: event.target.value })}
                  aria-invalid={Boolean(fieldErrors?.paymentDueDate)}
                  className="h-10 border-border bg-muted text-[13px] text-muted-foreground"
                />
                <FieldError>{fieldErrors?.paymentDueDate}</FieldError>
              </Field>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field>
            <FieldLabel className="text-[11px] text-muted-foreground">Payment Terms</FieldLabel>
            <Textarea
              rows={4}
              value={values.paymentTerms}
              onChange={(event) => onChange({ ...values, paymentTerms: event.target.value })}
              aria-invalid={Boolean(fieldErrors?.paymentTerms)}
              className="border-border bg-muted text-[13px] text-muted-foreground"
            />
            <FieldError>{fieldErrors?.paymentTerms}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-muted-foreground">Campaign Description</FieldLabel>
            <Textarea
              rows={4}
              value={values.campaignDescription}
              onChange={(event) => onChange({ ...values, campaignDescription: event.target.value })}
              aria-invalid={Boolean(fieldErrors?.campaignDescription)}
              className="border-border bg-muted text-[13px] text-muted-foreground"
            />
            <FieldError>{fieldErrors?.campaignDescription}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel className="text-[11px] text-muted-foreground">Notes</FieldLabel>
          <Textarea
            rows={4}
            value={values.notes}
            onChange={(event) => onChange({ ...values, notes: event.target.value })}
            aria-invalid={Boolean(fieldErrors?.notes)}
            className="border-border bg-muted text-[13px] text-muted-foreground"
          />
          <FieldError>{fieldErrors?.notes}</FieldError>
        </Field>

        {formError ? (
          <Alert variant="destructive" className="border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]">
            <AlertDescription className="text-[12px] text-[#E8402A]">{formError}</AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </CrmFormDialog>
  )
}
