"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BRAND_CATEGORIES } from "@/enums/brand"
import type { BrandFormValues } from "@/lib/crm/brands/brandForm"
import type { BrandField } from "@/types/brand"
import { CrmFormDialog } from "../shared"

type BrandFormProps = {
  open: boolean
  title: string
  submitLabel: string
  values: BrandFormValues
  isSubmitting: boolean
  formError?: string
  fieldErrors?: Partial<Record<BrandField, string>>
  onChange: (values: BrandFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function BrandForm({
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
}: BrandFormProps) {
  const websiteHintId = "brand-website-hint"
  const emailHintId = "brand-email-hint"
  const nameErrorId = "brand-name-error"
  const websiteErrorId = "brand-website-error"
  const contactNameErrorId = "brand-contact-name-error"
  const contactEmailErrorId = "brand-contact-email-error"
  const categoryErrorId = "brand-category-error"
  const notesErrorId = "brand-notes-error"

  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Keep sponsor and contact details accurate for faster outreach."
      onOpenChange={onOpenChange}
      footer={
        <Button
          type="submit"
          form="brand-form"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      }
    >
      <form
        id="brand-form"
        onSubmit={(event) => {
          event.preventDefault()
          if (isSubmitting) {
            return
          }
          onSubmit()
        }}
      >
        <FieldGroup className="mt-1">
          <div className="rounded-xl border border-border bg-muted p-4 sm:p-5">
            <div className="mb-4">
              <div className="font-semibold text-muted-foreground text-xs tracking-wide">
                Brand Details
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Start with the core identity details for this sponsor.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="font-medium text-[11px] text-muted-foreground">
                  Brand Name *
                </FieldLabel>
                <Input
                  autoFocus
                  value={values.name}
                  onChange={(event) =>
                    onChange({ ...values, name: event.target.value })
                  }
                  placeholder="Glow Republic"
                  aria-invalid={Boolean(fieldErrors?.name)}
                  aria-describedby={fieldErrors?.name ? nameErrorId : undefined}
                />
                <FieldError id={nameErrorId} className="text-[12px]">
                  {fieldErrors?.name}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel className="font-medium text-[11px] text-muted-foreground">
                  Category
                </FieldLabel>
                <Select
                  value={values.category || "__none"}
                  onValueChange={(category) =>
                    onChange({
                      ...values,
                      category: category === "__none" ? "" : category,
                    })
                  }
                >
                  <SelectTrigger
                    aria-invalid={Boolean(fieldErrors?.category)}
                    aria-describedby={
                      fieldErrors?.category ? categoryErrorId : undefined
                    }
                    className="w-full"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">Uncategorized</SelectItem>
                    {BRAND_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id={categoryErrorId} className="text-[12px]">
                  {fieldErrors?.category}
                </FieldError>
              </Field>

              <Field className="sm:col-span-2">
                <FieldLabel className="font-medium text-[11px] text-muted-foreground">
                  Website
                </FieldLabel>
                <Input
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  value={values.website}
                  onChange={(event) =>
                    onChange({ ...values, website: event.target.value })
                  }
                  placeholder="https://example.com"
                  aria-invalid={Boolean(fieldErrors?.website)}
                  aria-describedby={
                    fieldErrors?.website
                      ? `${websiteHintId} ${websiteErrorId}`
                      : websiteHintId
                  }
                />
                <FieldDescription
                  id={websiteHintId}
                  className="text-[11px] text-muted-foreground"
                >
                  Include `https://` so links open correctly.
                </FieldDescription>
                <FieldError id={websiteErrorId} className="text-[12px]">
                  {fieldErrors?.website}
                </FieldError>
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted p-4 sm:p-5">
            <div className="mb-4">
              <div className="font-semibold text-muted-foreground text-xs tracking-wide">
                Primary Contact
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Add the best person to reach out to when discussing deals.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel className="font-medium text-[11px] text-muted-foreground">
                  Contact Name
                </FieldLabel>
                <Input
                  autoComplete="name"
                  value={values.primaryContactName}
                  onChange={(event) =>
                    onChange({
                      ...values,
                      primaryContactName: event.target.value,
                    })
                  }
                  placeholder="Sarah Kim"
                  aria-invalid={Boolean(fieldErrors?.primaryContactName)}
                  aria-describedby={
                    fieldErrors?.primaryContactName
                      ? contactNameErrorId
                      : undefined
                  }
                />
                <FieldError id={contactNameErrorId} className="text-[12px]">
                  {fieldErrors?.primaryContactName}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel className="font-medium text-[11px] text-muted-foreground">
                  Contact Email
                </FieldLabel>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.primaryContactEmail}
                  onChange={(event) =>
                    onChange({
                      ...values,
                      primaryContactEmail: event.target.value,
                    })
                  }
                  placeholder="sarah@brand.com"
                  aria-invalid={Boolean(fieldErrors?.primaryContactEmail)}
                  aria-describedby={
                    fieldErrors?.primaryContactEmail
                      ? `${emailHintId} ${contactEmailErrorId}`
                      : emailHintId
                  }
                />
                <FieldDescription
                  id={emailHintId}
                  className="text-[11px] text-muted-foreground"
                >
                  We use this for outreach notifications and follow-ups.
                </FieldDescription>
                <FieldError id={contactEmailErrorId} className="text-[12px]">
                  {fieldErrors?.primaryContactEmail}
                </FieldError>
              </Field>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted p-4 sm:p-5">
            <Field>
              <FieldLabel className="font-medium text-[11px] text-muted-foreground">
                Notes
              </FieldLabel>
              <Textarea
                value={values.notes}
                onChange={(event) =>
                  onChange({ ...values, notes: event.target.value })
                }
                rows={4}
                aria-invalid={Boolean(fieldErrors?.notes)}
                aria-describedby={fieldErrors?.notes ? notesErrorId : undefined}
                placeholder="Add sponsorship history, preferences, budget notes, or campaign context."
                className="min-h-[108px] border-border bg-muted text-[13px] text-muted-foreground placeholder:text-muted-foreground focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/25"
              />
              <FieldError id={notesErrorId} className="text-[12px]">
                {fieldErrors?.notes}
              </FieldError>
            </Field>
          </div>

          {formError ? (
            <Alert
              variant="destructive"
              role="alert"
              aria-live="assertive"
              className="border-[rgba(232,64,42,0.35)] bg-[rgba(232,64,42,0.12)]"
            >
              <AlertDescription className="text-[#ff8a7c] text-[12px]">
                {formError}
              </AlertDescription>
            </Alert>
          ) : null}
        </FieldGroup>
      </form>
    </CrmFormDialog>
  )
}
