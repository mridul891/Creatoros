"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  createInvoiceAction,
  updateInvoiceAction,
} from "@/app/actions/invoiceActions"
import { InvoiceDocument } from "@/components/invoices/InvoiceDocument"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  INVOICE_CURRENCIES,
  INVOICE_STATUSES,
  type InvoiceFormData,
  type InvoiceFormInput,
  invoiceFormSchema,
} from "@/schemas/invoice"
import type { InvoiceDetailData } from "@/types/invoice"
import {
  computeBalanceDue,
  computeInvoiceTotals,
  formatInvoiceMoney,
} from "@/utils/invoiceCalculations"

const CURRENCY_LABELS: Record<string, string> = {
  INR: "INR — ₹",
  USD: "USD — $",
  EUR: "EUR — €",
  GBP: "GBP — £",
  AUD: "AUD — A$",
  CAD: "CAD — C$",
  AED: "AED",
  SGD: "SGD — S$",
}

function toDateStringOffset(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function defaultInvoiceFormValues(): InvoiceFormInput {
  return {
    invoiceNumber: "",
    status: "Draft",
    currency: "INR",
    issueDate: toDateStringOffset(0),
    dueDate: toDateStringOffset(15),
    seller: {
      businessName: "",
      name: "",
      email: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      taxId: "",
      logoUrl: "",
      website: "",
    },
    customer: {
      name: "",
      email: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      taxId: "",
    },
    shippingSameAsBilling: true,
    shipping: {
      name: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    items: [
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        discountPercent: 0,
      },
    ],
    discountType: "none",
    discountValue: 0,
    taxLabel: "GST",
    taxRate: 0,
    amountPaid: 0,
    paymentDetails: {
      accountName: "",
      accountNumber: "",
      ifscOrSwift: "",
      bankName: "",
      upiOrPaypal: "",
    },
    notes: "",
    terms: "",
  }
}

export function invoiceDetailToFormValues(
  invoice: InvoiceDetailData
): InvoiceFormInput {
  return {
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    currency: invoice.currency as InvoiceFormInput["currency"],
    issueDate: invoice.issuedAt,
    dueDate: invoice.dueDate ?? invoice.issuedAt,
    seller: { ...invoice.seller },
    customer: { ...invoice.customer },
    shippingSameAsBilling: invoice.shippingSameAsBilling || !invoice.shipping,
    shipping: invoice.shipping
      ? { ...invoice.shipping }
      : {
          name: "",
          phone: "",
          addressLine: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
    items: invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountPercent: item.discountPercent,
    })),
    discountType: invoice.discountType,
    discountValue: invoice.discountValue,
    taxLabel: invoice.taxLabel,
    taxRate: invoice.taxRate,
    amountPaid: invoice.amountPaid,
    paymentDetails: { ...invoice.paymentDetails },
    notes: invoice.notes,
    terms: invoice.terms,
  }
}

function normalizeSeller(
  input: InvoiceFormInput["seller"] | undefined
): InvoiceDetailData["seller"] {
  return {
    businessName: input?.businessName ?? "",
    logoUrl: input?.logoUrl ?? "",
    website: input?.website ?? "",
    name: input?.name ?? "",
    email: input?.email ?? "",
    phone: input?.phone ?? "",
    addressLine: input?.addressLine ?? "",
    city: input?.city ?? "",
    state: input?.state ?? "",
    postalCode: input?.postalCode ?? "",
    country: input?.country ?? "",
    taxId: input?.taxId ?? "",
  }
}

function normalizeCustomer(
  input: InvoiceFormInput["customer"] | undefined
): InvoiceDetailData["customer"] {
  return {
    name: input?.name ?? "",
    email: input?.email ?? "",
    phone: input?.phone ?? "",
    addressLine: input?.addressLine ?? "",
    city: input?.city ?? "",
    state: input?.state ?? "",
    postalCode: input?.postalCode ?? "",
    country: input?.country ?? "",
    taxId: input?.taxId ?? "",
  }
}

function normalizeShipping(
  input: InvoiceFormInput["shipping"] | undefined
): NonNullable<InvoiceDetailData["shipping"]> {
  return {
    name: input?.name ?? "",
    phone: input?.phone ?? "",
    addressLine: input?.addressLine ?? "",
    city: input?.city ?? "",
    state: input?.state ?? "",
    postalCode: input?.postalCode ?? "",
    country: input?.country ?? "",
  }
}

type SectionProps = {
  title: string
  description?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="font-semibold text-sm tracking-[-0.01em]">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-muted-foreground text-xs">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  )
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
}

const inputProps = { className: "bg-background" }

export function InvoiceEditor({
  mode,
  invoiceId,
  initialInvoice,
}: {
  mode: "create" | "edit"
  invoiceId?: string
  initialInvoice?: InvoiceDetailData | null
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const form = useForm<InvoiceFormInput, unknown, InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialInvoice
      ? invoiceDetailToFormValues(initialInvoice)
      : defaultInvoiceFormValues(),
    mode: "onBlur",
  })

  const { register, control, watch, setValue, formState } = form
  const { errors } = formState

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const values = watch()

  const preview = useMemo(() => {
    const safeItems = (values.items ?? []).map((item) => ({
      id: item.id || crypto.randomUUID(),
      name: item.name ?? "",
      description: item.description ?? "",
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      discountPercent: Number(item.discountPercent) || 0,
    }))

    const totals = computeInvoiceTotals(
      safeItems,
      {
        discountType: values.discountType ?? "none",
        discountValue: Number(values.discountValue) || 0,
      },
      { taxRate: Number(values.taxRate) || 0 }
    )

    const amountPaid = Number(values.amountPaid) || 0

    const paymentDetails = {
      accountName: values.paymentDetails?.accountName ?? "",
      accountNumber: values.paymentDetails?.accountNumber ?? "",
      ifscOrSwift: values.paymentDetails?.ifscOrSwift ?? "",
      bankName: values.paymentDetails?.bankName ?? "",
      upiOrPaypal: values.paymentDetails?.upiOrPaypal ?? "",
    }

    const seller = normalizeSeller(values.seller)
    const customer = normalizeCustomer(values.customer)

    return {
      invoiceNumber: values.invoiceNumber || "(draft)",
      currency: values.currency ?? "INR",
      issuedAt: values.issueDate ?? toDateStringOffset(0),
      dueDate: values.dueDate || null,
      seller,
      customer,
      shipping:
        values.shippingSameAsBilling || !values.shipping
          ? null
          : normalizeShipping(values.shipping),
      shippingSameAsBilling: values.shippingSameAsBilling ?? true,
      items: totals.items,
      discountType: values.discountType ?? "none",
      discountValue: Number(values.discountValue) || 0,
      taxLabel: values.taxLabel ?? "",
      taxRate: Number(values.taxRate) || 0,
      totals: totals,
      amountPaid,
      balanceDue: computeBalanceDue(totals.total, amountPaid),
      notes: values.notes ?? "",
      terms: values.terms ?? "",
      paymentDetails,
    }
  }, [values])

  async function onSubmit(data: InvoiceFormData) {
    setIsSubmitting(true)

    try {
      const result =
        mode === "create"
          ? await createInvoiceAction(data)
          : await updateInvoiceAction(invoiceId ?? "", data)

      if (result.status === "error") {
        toast.error(result.message)
        return
      }

      toast.success(
        mode === "create"
          ? `Invoice ${data.invoiceNumber || ""} created.`
          : "Invoice updated."
      )
      router.push(`/dashboard/invoice/${result.invoiceId}`)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDownloadPreview() {
    setIsDownloading(true)
    try {
      const { downloadInvoicePdf } = await import("@/utils/downloadInvoicePdf")
      await downloadInvoicePdf(
        preview,
        values.invoiceNumber?.trim() || "invoice-draft"
      )
      toast.success("Invoice PDF downloaded.")
    } catch {
      toast.error("Could not generate the PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 900_000) {
      toast.error("Logo too large — use one under 900 KB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setValue("seller.logoUrl", String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  const sellerError = errors.seller
  const customerError = errors.customer

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
        {/* Left: form sections */}
        <div className="flex flex-col gap-4">
          <Section title="Invoice details">
            <FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="invoiceNumber">Invoice number</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="Auto-generated if left blank"
                  {...register("invoiceNumber")}
                  {...inputProps}
                />
                {errors.invoiceNumber ? (
                  <p className="text-destructive text-xs">
                    {errors.invoiceNumber.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <ControllerWrapper
                  value={values.currency ?? "INR"}
                  onChange={(value) =>
                    setValue("currency", value as InvoiceFormData["currency"], {
                      shouldDirty: true,
                    })
                  }
                  options={INVOICE_CURRENCIES.map((code) => ({
                    value: code,
                    label: CURRENCY_LABELS[code] ?? code,
                  }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="issueDate">Invoice date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  {...register("issueDate")}
                  {...inputProps}
                />
                {errors.issueDate ? (
                  <p className="text-destructive text-xs">
                    {errors.issueDate.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                  {...inputProps}
                />
                {errors.dueDate ? (
                  <p className="text-destructive text-xs">
                    {errors.dueDate.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <ControllerWrapper
                  value={values.status ?? "Draft"}
                  onChange={(value) =>
                    setValue("status", value as InvoiceFormData["status"], {
                      shouldDirty: true,
                    })
                  }
                  options={INVOICE_STATUSES.map((status) => ({
                    value: status,
                    label: status.replace(/([a-z])([A-Z])/g, "$1 $2"),
                  }))}
                />
              </div>
            </FieldGrid>
          </Section>

          <Section
            title="Your business"
            description="Shown as the sender on the invoice."
          >
            <FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="seller.businessName">Business name</Label>
                <Input
                  id="seller.businessName"
                  {...register("seller.businessName")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller.name">Your name</Label>
                <Input
                  id="seller.name"
                  {...register("seller.name")}
                  {...inputProps}
                />
                {sellerError?.name ? (
                  <p className="text-destructive text-xs">
                    {sellerError.name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller.email">Email</Label>
                <Input
                  id="seller.email"
                  type="email"
                  {...register("seller.email")}
                  {...inputProps}
                />
                {sellerError?.email ? (
                  <p className="text-destructive text-xs">
                    {sellerError.email.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller.phone">Phone</Label>
                <Input
                  id="seller.phone"
                  {...register("seller.phone")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="seller.addressLine">Address</Label>
                <Input
                  id="seller.addressLine"
                  placeholder="Street and area"
                  {...register("seller.addressLine")}
                  {...inputProps}
                />
              </div>
              <FieldGrid>
                <div className="space-y-1.5">
                  <Label htmlFor="seller.city">City</Label>
                  <Input
                    id="seller.city"
                    {...register("seller.city")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seller.state">State / region</Label>
                  <Input
                    id="seller.state"
                    {...register("seller.state")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seller.postalCode">PIN / ZIP</Label>
                  <Input
                    id="seller.postalCode"
                    {...register("seller.postalCode")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seller.country">Country</Label>
                  <Input
                    id="seller.country"
                    {...register("seller.country")}
                    {...inputProps}
                  />
                </div>
              </FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="seller.taxId">Tax ID (PAN / GSTIN / VAT)</Label>
                <Input
                  id="seller.taxId"
                  {...register("seller.taxId")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller.website">Website</Label>
                <Input
                  id="seller.website"
                  {...register("seller.website")}
                  {...inputProps}
                />
              </div>
            </FieldGrid>

            <div className="space-y-1.5">
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload logo
                </Button>
                {values.seller?.logoUrl ? (
                  <>
                    {/* biome-ignore lint/performance/noImgElement: logo is a user-uploaded data URL */}
                    <img
                      src={values.seller.logoUrl}
                      alt="Logo preview"
                      className="h-9 w-auto max-w-[120px] object-contain"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setValue("seller.logoUrl", "")}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Optional
                  </span>
                )}
              </div>
            </div>
          </Section>

          <Section title="Bill to" description="Who receives this invoice.">
            <FieldGrid>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="customer.name">Customer or brand *</Label>
                <Input
                  id="customer.name"
                  {...register("customer.name")}
                  {...inputProps}
                />
                {customerError?.name ? (
                  <p className="text-destructive text-xs">
                    {customerError.name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer.email">Email</Label>
                <Input
                  id="customer.email"
                  type="email"
                  {...register("customer.email")}
                  {...inputProps}
                />
                {customerError?.email ? (
                  <p className="text-destructive text-xs">
                    {customerError.email.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer.phone">Phone</Label>
                <Input
                  id="customer.phone"
                  {...register("customer.phone")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="customer.addressLine">Address</Label>
                <Input
                  id="customer.addressLine"
                  {...register("customer.addressLine")}
                  {...inputProps}
                />
              </div>
              <FieldGrid>
                <div className="space-y-1.5">
                  <Label htmlFor="customer.city">City</Label>
                  <Input
                    id="customer.city"
                    {...register("customer.city")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customer.state">State / region</Label>
                  <Input
                    id="customer.state"
                    {...register("customer.state")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customer.postalCode">PIN / ZIP</Label>
                  <Input
                    id="customer.postalCode"
                    {...register("customer.postalCode")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customer.country">Country</Label>
                  <Input
                    id="customer.country"
                    {...register("customer.country")}
                    {...inputProps}
                  />
                </div>
              </FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="customer.taxId">Their tax ID</Label>
                <Input
                  id="customer.taxId"
                  placeholder="Optional"
                  {...register("customer.taxId")}
                  {...inputProps}
                />
              </div>
            </FieldGrid>
          </Section>

          <Section title="Shipping details">
            <div className="flex w-fit items-center gap-2 text-sm">
              <Checkbox
                checked={values.shippingSameAsBilling ?? true}
                onCheckedChange={(checked) =>
                  setValue("shippingSameAsBilling", checked === true, {
                    shouldDirty: true,
                  })
                }
              />
              Shipping address same as billing address
            </div>
            {values.shippingSameAsBilling ? null : (
              <FieldGrid>
                <div className="space-y-1.5">
                  <Label htmlFor="shipping.name">Ship to name</Label>
                  <Input
                    id="shipping.name"
                    {...register("shipping.name")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shipping.phone">Phone</Label>
                  <Input
                    id="shipping.phone"
                    {...register("shipping.phone")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="shipping.addressLine">Address</Label>
                  <Input
                    id="shipping.addressLine"
                    {...register("shipping.addressLine")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shipping.city">City</Label>
                  <Input
                    id="shipping.city"
                    {...register("shipping.city")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shipping.state">State / region</Label>
                  <Input
                    id="shipping.state"
                    {...register("shipping.state")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shipping.postalCode">PIN / ZIP</Label>
                  <Input
                    id="shipping.postalCode"
                    {...register("shipping.postalCode")}
                    {...inputProps}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shipping.country">Country</Label>
                  <Input
                    id="shipping.country"
                    {...register("shipping.country")}
                    {...inputProps}
                  />
                </div>
              </FieldGrid>
            )}
            {errors.shippingSameAsBilling ? (
              <p className="text-destructive text-xs">
                {errors.shippingSameAsBilling.message}
              </p>
            ) : null}
          </Section>

          <Section title="Line items">
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => {
                const itemError = errors.items?.[index]
                const watched = values.items?.[index]
                const quantity = Number(watched?.quantity) || 0
                const unitPrice = Number(watched?.unitPrice) || 0
                const discountPercent = Number(watched?.discountPercent) || 0
                const lineTotal =
                  quantity * unitPrice * (1 - discountPercent / 100)

                return (
                  <div
                    key={field.id}
                    className="rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Label
                          htmlFor={`items.${index}.name`}
                          className="sr-only"
                        >
                          Item
                        </Label>
                        <Input
                          id={`items.${index}.name`}
                          placeholder="Service or product name"
                          {...register(`items.${index}.name`)}
                          {...inputProps}
                        />
                        {itemError?.name ? (
                          <p className="text-destructive text-xs">
                            {itemError.name.message}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove item ${index + 1}`}
                        disabled={fields.length <= 1}
                        onClick={() => remove(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ✕
                      </Button>
                    </div>
                    <Input
                      placeholder="Description (optional)"
                      className="mt-2 bg-background"
                      {...register(`items.${index}.description`)}
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div className="space-y-1">
                        <Label
                          htmlFor={`items.${index}.quantity`}
                          className="text-xs"
                        >
                          Qty
                        </Label>
                        <Input
                          id={`items.${index}.quantity`}
                          type="number"
                          min="0"
                          step="any"
                          {...register(`items.${index}.quantity`)}
                          {...inputProps}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`items.${index}.unitPrice`}
                          className="text-xs"
                        >
                          Rate
                        </Label>
                        <Input
                          id={`items.${index}.unitPrice`}
                          type="number"
                          min="0"
                          step="any"
                          {...register(`items.${index}.unitPrice`)}
                          {...inputProps}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`items.${index}.discountPercent`}
                          className="text-xs"
                        >
                          Discount %
                        </Label>
                        <Input
                          id={`items.${index}.discountPercent`}
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          {...register(`items.${index}.discountPercent`)}
                          {...inputProps}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">
                          Amount
                        </span>
                        <div className="pt-1 font-medium text-sm tabular-nums">
                          {formatInvoiceMoney(
                            lineTotal,
                            values.currency ?? "INR"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {typeof errors.items?.message === "string" ? (
              <p className="text-destructive text-xs">{errors.items.message}</p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  id: crypto.randomUUID(),
                  name: "",
                  description: "",
                  quantity: 1,
                  unitPrice: 0,
                  discountPercent: 0,
                })
              }
              className="w-fit"
            >
              + Add Item
            </Button>

            <Separator />

            <FieldGrid>
              <div className="space-y-1.5">
                <Label>Invoice-level discount</Label>
                <ControllerWrapper
                  value={values.discountType ?? "none"}
                  onChange={(value) =>
                    setValue(
                      "discountType",
                      value as InvoiceFormData["discountType"],
                      { shouldDirty: true }
                    )
                  }
                  options={[
                    { value: "none", label: "None" },
                    { value: "percent", label: "Percentage %" },
                    { value: "fixed", label: "Fixed amount" },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discountValue">Discount value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step="any"
                  disabled={values.discountType === "none"}
                  {...register("discountValue")}
                  {...inputProps}
                />
                {errors.discountValue ? (
                  <p className="text-destructive text-xs">
                    {errors.discountValue.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="taxLabel">Tax label</Label>
                <Input
                  id="taxLabel"
                  placeholder="GST / VAT"
                  {...register("taxLabel")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="taxRate">Tax rate %</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  {...register("taxRate")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amountPaid">Amount already paid</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  min="0"
                  step="any"
                  {...register("amountPaid")}
                  {...inputProps}
                />
              </div>
            </FieldGrid>
          </Section>

          <Section
            title="Payment details"
            description="How the client should pay you."
          >
            <FieldGrid>
              <div className="space-y-1.5">
                <Label htmlFor="paymentDetails.accountName">Account name</Label>
                <Input
                  id="paymentDetails.accountName"
                  {...register("paymentDetails.accountName")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paymentDetails.accountNumber">
                  Account no. / IBAN
                </Label>
                <Input
                  id="paymentDetails.accountNumber"
                  {...register("paymentDetails.accountNumber")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paymentDetails.ifscOrSwift">IFSC / SWIFT</Label>
                <Input
                  id="paymentDetails.ifscOrSwift"
                  {...register("paymentDetails.ifscOrSwift")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paymentDetails.bankName">Bank name</Label>
                <Input
                  id="paymentDetails.bankName"
                  {...register("paymentDetails.bankName")}
                  {...inputProps}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="paymentDetails.upiOrPaypal">UPI / PayPal</Label>
                <Input
                  id="paymentDetails.upiOrPaypal"
                  placeholder="Optional"
                  {...register("paymentDetails.upiOrPaypal")}
                  {...inputProps}
                />
              </div>
            </FieldGrid>
          </Section>

          <Section title="Notes & terms">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Thank you for your business!"
                {...register("notes")}
                className="min-h-[70px] bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="terms">Terms & conditions</Label>
              <Textarea
                id="terms"
                placeholder="Payment due within 15 days."
                {...register("terms")}
                className="min-h-[70px] bg-background"
              />
            </div>
          </Section>
        </div>

        {/* Right: live preview */}
        <div className="xl:sticky xl:top-20">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.1em]">
              Live preview
            </p>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleDownloadPreview}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing…" : "Download PDF"}
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border shadow-sm">
            <InvoiceDocument invoice={preview} />
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 mt-2">
        <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">
          <div className="min-w-0">
            <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
              Balance due
            </p>
            <p className="truncate font-bold text-lg tabular-nums">
              {formatInvoiceMoney(preview.balanceDue, preview.currency)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadPreview}
              disabled={isDownloading}
            >
              {isDownloading ? "Preparing…" : "Download PDF"}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : mode === "create"
                  ? "Save Invoice"
                  : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function ControllerWrapper({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
