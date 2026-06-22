"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BrandField } from "@/types/brand"
import { BRAND_CATEGORIES } from "@/enums/brand"
import { type BrandFormValues } from "@/lib/crm/brands/brandForm"
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
  return (
    <CrmFormDialog
      open={open}
      title={title}
      description="Keep sponsor and contact details accurate for faster outreach."
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="cursor-pointer border-[rgba(255,255,255,0.1)] bg-transparent text-[rgba(255,255,255,0.75)]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="cursor-pointer bg-(--cos-primary) text-white hover:bg-(--cos-primary)"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </>
      }
    >
      <FieldGroup className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Brand Name *</FieldLabel>
            <Input
              value={values.name}
              onChange={(event) => onChange({ ...values, name: event.target.value })}
              placeholder="Glow Republic"
              aria-invalid={Boolean(fieldErrors?.name)}
              className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)] focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.name}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Category</FieldLabel>
            <Select
              value={values.category || "__none"}
              onValueChange={(category) =>
                onChange({
                  ...values,
                  category: category === "__none" ? "" : category,
                })
              }
            >
              <SelectTrigger className="h-10 w-full border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)]">
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
            <FieldError>{fieldErrors?.category}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Website</FieldLabel>
            <Input
              value={values.website}
              onChange={(event) => onChange({ ...values, website: event.target.value })}
              placeholder="https://example.com"
              aria-invalid={Boolean(fieldErrors?.website)}
              className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)] focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.website}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Contact Name</FieldLabel>
            <Input
              value={values.primaryContactName}
              onChange={(event) => onChange({ ...values, primaryContactName: event.target.value })}
              placeholder="Sarah Kim"
              aria-invalid={Boolean(fieldErrors?.primaryContactName)}
              className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)] focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.primaryContactName}</FieldError>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Contact Email</FieldLabel>
            <Input
              value={values.primaryContactEmail}
              onChange={(event) => onChange({ ...values, primaryContactEmail: event.target.value })}
              placeholder="sarah@brand.com"
              aria-invalid={Boolean(fieldErrors?.primaryContactEmail)}
              className="h-10 border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)] focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
            />
            <FieldError>{fieldErrors?.primaryContactEmail}</FieldError>
          </Field>
        </div>

        <Field>
          <FieldLabel className="text-[11px] text-[rgba(255,255,255,0.55)]">Notes</FieldLabel>
          <Textarea
            value={values.notes}
            onChange={(event) => onChange({ ...values, notes: event.target.value })}
            rows={4}
            aria-invalid={Boolean(fieldErrors?.notes)}
            className="border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[13px] text-[rgba(255,255,255,0.8)] focus-visible:border-[#E8402A] focus-visible:ring-[#E8402A]/20"
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
