"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Textarea } from "@/components/ui/textarea"
import { DEAL_PRIORITIES, DEAL_STAGES, DEAL_STAGE_LABEL } from "@/enums/deal"
import { type DealFormValues } from "@/lib/crm/deals/dealForm"
import type { DealField } from "@/types/deal"
import { CrmFormDialog } from "../shared"
import { CircleNotch } from "@phosphor-icons/react"
import { Separator } from "@/components/ui/separator"

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

function SectionHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function SectionDivider() {
  return <Separator />
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
  const brandOptions = brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }))

  const contactOptions = contacts.map((contact) => ({
    value: contact.id,
    label: contact.name,
  }))

  const handleChange = (field: keyof DealFormValues, value: string) => {
    onChange({ ...values, [field]: value })
  }

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
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <CircleNotch className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : submitLabel}
          </Button>
        </>
      }
    >
      <FieldGroup>
        {/* Section 1: Campaign Details */}
        <div className="space-y-4">
          <SectionHeader
            title="Campaign Details"
            description="Identify the campaign and associate it with a brand and contact."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field className="sm:col-span-2">
              <FieldLabel>Campaign Name</FieldLabel>
              <Input
                value={values.campaignName}
                onChange={(e) => handleChange("campaignName", e.target.value)}
                placeholder="e.g., Summer Collection Launch"
                aria-invalid={Boolean(fieldErrors?.campaignName)}
              />
              <FieldError>{fieldErrors?.campaignName}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Brand</FieldLabel>
              <SearchableSelect
                options={brandOptions}
                value={values.brandId}
                onValueChange={(brandId) => handleChange("brandId", brandId)}
                placeholder="Select brand"
                searchPlaceholder="Search brands..."
                noResultsMessage="No brands found"
                disabled={brandOptions.length === 0}
              />
              <FieldError>{fieldErrors?.brandId}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Contact</FieldLabel>
              <SearchableSelect
                options={contactOptions}
                value={values.contactId || ""}
                onValueChange={(contactId) => handleChange("contactId", contactId)}
                placeholder="Select contact (optional)"
                searchPlaceholder="Search contacts..."
                noResultsMessage="No contacts found"
                disabled={!values.brandId || contactOptions.length === 0}
              />
              <FieldError>{fieldErrors?.contactId}</FieldError>
            </Field>
          </div>
        </div>

        <SectionDivider />

        {/* Section 2: Deal Information */}
        <div className="space-y-4">
          <SectionHeader
            title="Deal Information"
            description="Define the financial terms and current status of the deal."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Deal Value</FieldLabel>
              <Input
                type="number"
                value={values.dealValue}
                onChange={(e) => handleChange("dealValue", e.target.value)}
                placeholder="5000"
                aria-invalid={Boolean(fieldErrors?.dealValue)}
              />
              <FieldError>{fieldErrors?.dealValue}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Currency</FieldLabel>
              <Select
                value={values.currency || "USD"}
                onValueChange={(currency) => handleChange("currency", currency)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{fieldErrors?.currency}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Stage</FieldLabel>
              <Select
                value={values.stage}
                onValueChange={(stage) => handleChange("stage", stage)}
              >
                <SelectTrigger className="w-full">
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
              <FieldLabel>Priority</FieldLabel>
              <Select
                value={values.priority}
                onValueChange={(priority) => handleChange("priority", priority)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-md ${
                            priority === "High"
                              ? "bg-red-500"
                              : priority === "Medium"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        />
                        {priority}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{fieldErrors?.priority}</FieldError>
            </Field>
          </div>
        </div>

        <SectionDivider />

        {/* Section 3: Timeline */}
        <div className="space-y-4">
          <SectionHeader
            title="Timeline"
            description="Set key dates for the campaign lifecycle."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                type="date"
                value={values.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                aria-invalid={Boolean(fieldErrors?.startDate)}
              />
              <FieldError>{fieldErrors?.startDate}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Due Date</FieldLabel>
              <Input
                type="date"
                value={values.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                aria-invalid={Boolean(fieldErrors?.dueDate)}
              />
              <FieldError>{fieldErrors?.dueDate}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Payment Due</FieldLabel>
              <Input
                type="date"
                value={values.paymentDueDate}
                onChange={(e) => handleChange("paymentDueDate", e.target.value)}
                aria-invalid={Boolean(fieldErrors?.paymentDueDate)}
              />
              <FieldError>{fieldErrors?.paymentDueDate}</FieldError>
            </Field>
          </div>
        </div>

        <SectionDivider />

        {/* Section 4: Payment */}
        <div className="space-y-4">
          <SectionHeader
            title="Payment"
            description="Define payment terms and conditions."
          />
          <div className="grid grid-cols-1 gap-4">
            <Field className="sm:col-span-2">
              <FieldLabel>Payment Terms</FieldLabel>
              <Textarea
                rows={3}
                value={values.paymentTerms}
                onChange={(e) => handleChange("paymentTerms", e.target.value)}
                placeholder="e.g., Net 30, 50% upfront..."
                aria-invalid={Boolean(fieldErrors?.paymentTerms)}
              />
              <FieldError>{fieldErrors?.paymentTerms}</FieldError>
            </Field>
          </div>
        </div>

        <SectionDivider />

        {/* Section 5: Additional Information */}
        <div className="space-y-4">
          <SectionHeader
            title="Additional Information"
            description="Add descriptive details and internal notes for the team."
          />
          <div className="grid grid-cols-1 gap-4">
            <Field>
              <FieldLabel>Campaign Description</FieldLabel>
              <Textarea
                rows={4}
                value={values.campaignDescription}
                onChange={(e) => handleChange("campaignDescription", e.target.value)}
                placeholder="Deliverables, expectations, requirements..."
                aria-invalid={Boolean(fieldErrors?.campaignDescription)}
              />
              <FieldError>{fieldErrors?.campaignDescription}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Internal Notes</FieldLabel>
              <Textarea
                rows={3}
                value={values.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Internal notes for the team..."
                aria-invalid={Boolean(fieldErrors?.notes)}
              />
              <FieldError>{fieldErrors?.notes}</FieldError>
            </Field>
          </div>
        </div>

        {formError ? (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </CrmFormDialog>
  )
}