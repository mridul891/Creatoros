"use client"

import type { BrandField } from "@/types/brand"
import { BRAND_CATEGORIES } from "@/enums/brand"

export type BrandFormValues = {
  name: string
  category: string
  website: string
  primaryContactName: string
  primaryContactEmail: string
  notes: string
}

type BrandFormProps = {
  title: string
  submitLabel: string
  values: BrandFormValues
  isSubmitting: boolean
  formError?: string
  fieldErrors?: Partial<Record<BrandField, string>>
  onChange: (values: BrandFormValues) => void
  onCancel: () => void
  onSubmit: () => void
}

function FormField({
  label,
  value,
  error,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  error?: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-[rgba(255,255,255,0.55)]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 text-[13px] text-[rgba(255,255,255,0.8)] outline-none focus:border-[#E8402A]"
      />
      {error ? <span className="mt-1 block text-[11px] text-[#E8402A]">{error}</span> : null}
    </label>
  )
}

export function BrandForm({
  title,
  submitLabel,
  values,
  isSubmitting,
  formError,
  fieldErrors,
  onChange,
  onCancel,
  onSubmit,
}: BrandFormProps) {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-[rgba(0,0,0,0.45)] px-4">
      <div className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-[20px] border border-[rgba(255,255,255,0.07)] bg-[#0D0D0D] p-6">
        <h3 className="text-[18px] font-bold text-white">{title}</h3>
        <p className="mt-1 text-[12px] text-[rgba(255,255,255,0.45)]">
          Keep sponsor and contact details accurate for faster outreach.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <FormField
            label="Brand Name *"
            value={values.name}
            error={fieldErrors?.name}
            placeholder="Glow Republic"
            onChange={(name) => onChange({ ...values, name })}
          />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-[rgba(255,255,255,0.55)]">Category</span>
            <select
              value={values.category}
              onChange={(event) => onChange({ ...values, category: event.target.value })}
              className="h-10 w-full cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 text-[13px] text-[rgba(255,255,255,0.8)] outline-none focus:border-[#E8402A]"
            >
              <option value="">Select category</option>
              {BRAND_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {fieldErrors?.category ? (
              <span className="mt-1 block text-[11px] text-[#E8402A]">{fieldErrors.category}</span>
            ) : null}
          </label>
          <FormField
            label="Website"
            value={values.website}
            error={fieldErrors?.website}
            placeholder="https://example.com"
            onChange={(website) => onChange({ ...values, website })}
          />
          <FormField
            label="Contact Name"
            value={values.primaryContactName}
            error={fieldErrors?.primaryContactName}
            placeholder="Sarah Kim"
            onChange={(primaryContactName) => onChange({ ...values, primaryContactName })}
          />
          <FormField
            label="Contact Email"
            value={values.primaryContactEmail}
            error={fieldErrors?.primaryContactEmail}
            placeholder="sarah@brand.com"
            onChange={(primaryContactEmail) => onChange({ ...values, primaryContactEmail })}
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[11px] font-semibold text-[rgba(255,255,255,0.55)]">Notes</span>
          <textarea
            value={values.notes}
            onChange={(event) => onChange({ ...values, notes: event.target.value })}
            rows={4}
            className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2.5 text-[13px] text-[rgba(255,255,255,0.8)] outline-none focus:border-[#E8402A]"
          />
          {fieldErrors?.notes ? (
            <span className="mt-1 block text-[11px] text-[#E8402A]">{fieldErrors.notes}</span>
          ) : null}
        </label>

        {formError ? (
          <div className="mt-4 rounded-[10px] bg-[rgba(232,64,42,0.1)] px-3 py-2 text-[12px] text-[#E8402A]">
            {formError}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="cursor-pointer rounded-[10px] border border-[rgba(255,255,255,0.1)] px-4 py-2 text-[13px] text-[rgba(255,255,255,0.75)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="cursor-pointer rounded-[10px] bg-(--cos-primary) px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
