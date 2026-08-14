"use client"

import { CrmFormDialog } from "@/components/shared/crm"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ContactField } from "@/features/contacts/types/contact"
import type { ContactFormValues } from "@/features/contacts/utils/contactForm"

type ContactFormModalProps = {
  open: boolean
  title: string
  submitLabel: string
  values: ContactFormValues
  isSubmitting: boolean
  formError?: string
  fieldErrors?: Partial<Record<ContactField, string>>
  onChange: (values: ContactFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function ContactFormModal({
  open,
  title,
  submitLabel,
  values,
  isSubmitting,
  formError,
  fieldErrors,
  onChange,
  onOpenChange,
  onSubmit,
}: ContactFormModalProps) {
  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Track the right person inside this brand to speed up outreach and follow-ups."
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="cursor-pointer border-border bg-transparent text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </>
      }
    >
      <FieldGroup className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-[11px] text-muted-foreground">
              Name *
            </FieldLabel>
            <Input
              value={values.name}
              onChange={(event) =>
                onChange({ ...values, name: event.target.value })
              }
              placeholder="Sarah Kim"
              aria-invalid={Boolean(fieldErrors?.name)}
              className="h-10 border-border bg-muted text-[13px] text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.name}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-muted-foreground">
              Position
            </FieldLabel>
            <Input
              value={values.jobTitle}
              onChange={(event) =>
                onChange({ ...values, jobTitle: event.target.value })
              }
              placeholder="Partnerships Manager"
              aria-invalid={Boolean(fieldErrors?.jobTitle)}
              className="h-10 border-border bg-muted text-[13px] text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.jobTitle}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-muted-foreground">
              Email
            </FieldLabel>
            <Input
              type="email"
              value={values.email}
              onChange={(event) =>
                onChange({ ...values, email: event.target.value })
              }
              placeholder="sarah@brand.com"
              aria-invalid={Boolean(fieldErrors?.email)}
              className="h-10 border-border bg-muted text-[13px] text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.email}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-muted-foreground">
              Phone Number
            </FieldLabel>
            <Input
              value={values.phoneNumber}
              onChange={(event) =>
                onChange({ ...values, phoneNumber: event.target.value })
              }
              placeholder="+1 555 123 4567"
              aria-invalid={Boolean(fieldErrors?.phoneNumber)}
              className="h-10 border-border bg-muted text-[13px] text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.phoneNumber}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel className="text-[11px] text-muted-foreground">
            Notes
          </FieldLabel>
          <Textarea
            value={values.notes}
            onChange={(event) =>
              onChange({ ...values, notes: event.target.value })
            }
            rows={4}
            aria-invalid={Boolean(fieldErrors?.notes)}
            className="border-border bg-muted text-[13px] text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
          />
          <FieldError>{fieldErrors?.notes}</FieldError>
        </Field>

        <Field
          orientation="horizontal"
          className="items-center rounded-[10px] border border-border bg-muted px-3 py-2.5"
        >
          <Checkbox
            checked={values.isPrimary}
            onCheckedChange={(checked) =>
              onChange({ ...values, isPrimary: checked === true })
            }
            className="border-border"
          />
          <FieldLabel className="text-[12px] text-muted-foreground">
            Mark as primary contact for this brand
          </FieldLabel>
        </Field>

        {formError ? (
          <Alert
            variant="destructive"
            className="border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.1)]"
          >
            <AlertDescription className="text-[#E8402A] text-[12px]">
              {formError}
            </AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </CrmFormDialog>
  )
}
