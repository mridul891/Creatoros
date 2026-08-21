"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { generateInvoiceAction } from "@/app/actions/invoiceActions"
import { InvoiceSuccessCard } from "@/components/invoices/InvoiceSuccessCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  type GenerateInvoiceInput,
  generateInvoiceSchema,
} from "@/schemas/invoice"
import type {
  GeneratedInvoice,
  InvoiceDraftData,
  RateCardOption,
} from "@/types/invoice"
import { formatMoney } from "@/utils/mediaKitFormatters"
import type { RateAddOn } from "@/utils/mediaKitRateBreakdown"

const FORM_FIELDS = [
  "clientName",
  "clientEmail",
  "deliverableIds",
  "issueDate",
  "dueDate",
  "notes",
] as const

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

function FieldErrorMessage({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p className="text-destructive text-xs" role="alert">
      {message}
    </p>
  )
}

/** Display-only estimate. The server always computes the authoritative total. */
function estimateInvoiceTotal(
  deliverables: RateCardOption[],
  selectedIds: string[],
  addOns: RateAddOn[],
  applyAddOns: boolean
) {
  const multipliers = applyAddOns ? addOns.map((addOn) => addOn.multiplier) : []

  return deliverables
    .filter((deliverable) => selectedIds.includes(deliverable.id))
    .reduce((sum, deliverable) => {
      const amount = multipliers.reduce(
        (total, multiplier) => total * multiplier,
        deliverable.price
      )
      return sum + Math.round(amount)
    }, 0)
}

type InvoiceFormProps = {
  draft: InvoiceDraftData
}

export function InvoiceForm({ draft }: InvoiceFormProps) {
  const [generatedInvoice, setGeneratedInvoice] =
    useState<GeneratedInvoice | null>(null)

  const form = useForm<GenerateInvoiceInput>({
    resolver: zodResolver(generateInvoiceSchema),
    mode: "onBlur",
    defaultValues: {
      clientName: "",
      clientEmail: "",
      deliverableIds: [],
      applyAddOns: false,
      issueDate: toDateInputValue(new Date()),
      dueDate: toDateInputValue(
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      ),
      notes: draft.paymentTerms,
    },
  })

  const {
    register,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = form

  const selectedDeliverableIds = watch("deliverableIds")
  const applyAddOns = watch("applyAddOns")

  const estimate = useMemo(
    () =>
      estimateInvoiceTotal(
        draft.deliverables,
        selectedDeliverableIds,
        draft.addOns,
        applyAddOns
      ),
    [applyAddOns, draft.addOns, draft.deliverables, selectedDeliverableIds]
  )

  async function onSubmit(data: GenerateInvoiceInput) {
    const result = await generateInvoiceAction(data)

    if (result.status === "error") {
      toast.error(result.message)

      for (const field of FORM_FIELDS) {
        const message = result.fieldErrors?.[field]

        if (message) {
          setError(field, { type: "server", message })
        }
      }

      return
    }

    setGeneratedInvoice(result.invoice)
    toast.success(`Invoice ${result.invoice.invoiceNumber} generated.`)
  }

  if (generatedInvoice) {
    return (
      <InvoiceSuccessCard
        invoice={generatedInvoice}
        onCreateAnother={() => setGeneratedInvoice(null)}
      />
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={isSubmitting} className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold tracking-[-0.01em]">Client</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientName">Client name</Label>
              <Input
                id="clientName"
                placeholder="Acme Brands"
                aria-invalid={Boolean(errors.clientName)}
                {...register("clientName")}
              />
              <FieldErrorMessage message={errors.clientName?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientEmail">Client email (optional)</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="billing@acme.com"
                aria-invalid={Boolean(errors.clientEmail)}
                {...register("clientEmail")}
              />
              <FieldErrorMessage message={errors.clientEmail?.message} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold tracking-[-0.01em]">
            Deliverables from your rate card
          </h2>

          {draft.deliverables.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Your media kit has no deliverables yet. Add them in the Media Kit
              editor first.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {draft.deliverables.map((deliverable) => (
                <label
                  key={deliverable.id}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      value={deliverable.id}
                      className="size-4 accent-primary"
                      {...register("deliverableIds")}
                    />
                    <span>{deliverable.title}</span>
                  </span>
                  <span className="font-medium tabular-nums">
                    {formatMoney(deliverable.price, draft.currency)}
                  </span>
                </label>
              ))}
            </div>
          )}

          <FieldErrorMessage message={errors.deliverableIds?.message} />

          {draft.addOns.length > 0 ? (
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                {...register("applyAddOns")}
              />
              <span>
                Apply rate card add-ons
                <span className="text-muted-foreground">
                  {" "}
                  ({draft.addOns.map((addOn) => addOn.label).join(", ")})
                </span>
              </span>
            </label>
          ) : null}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold tracking-[-0.01em]">Dates</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="issueDate">Issue date</Label>
              <Input
                id="issueDate"
                type="date"
                aria-invalid={Boolean(errors.issueDate)}
                {...register("issueDate")}
              />
              <FieldErrorMessage message={errors.issueDate?.message} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dueDate">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                aria-invalid={Boolean(errors.dueDate)}
                {...register("dueDate")}
              />
              <FieldErrorMessage message={errors.dueDate?.message} />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            rows={3}
            aria-invalid={Boolean(errors.notes)}
            {...register("notes")}
          />
          <FieldErrorMessage message={errors.notes?.message} />
        </section>

        <div className="sticky bottom-0 z-10 mt-auto border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-muted-foreground text-sm">
              Estimated total:{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {formatMoney(estimate, draft.currency)}
              </span>
            </p>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:ml-auto sm:w-auto"
            >
              {isSubmitting ? "Generating..." : "Generate invoice"}
            </Button>
          </div>
        </div>
      </fieldset>
    </form>
  )
}
