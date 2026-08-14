import type { DealPriority, DealStage } from "@/features/deals/enums/deal"
import type { DealDetail, DealListItem } from "@/features/deals/types/deal"
import { formatDateOnlyInput } from "@/lib/formatting/date-input"

export type DealFormValues = {
  brandId: string
  contactId: string
  campaignName: string
  dealValue: string
  currency: string
  stage: DealStage
  priority: DealPriority
  startDate: string
  dueDate: string
  expectedCloseDate: string
  paymentDueDate: string
  paymentTerms: string
  campaignDescription: string
  deliverablesSummary: string
  notes: string
  source: string
  probability: string
  externalRef: string
  templateId: string
}

export const EMPTY_DEAL_FORM: DealFormValues = {
  brandId: "",
  contactId: "",
  campaignName: "",
  dealValue: "",
  currency: "USD",
  stage: "Lead",
  priority: "Medium",
  startDate: "",
  dueDate: "",
  expectedCloseDate: "",
  paymentDueDate: "",
  paymentTerms: "",
  campaignDescription: "",
  deliverablesSummary: "",
  notes: "",
  source: "",
  probability: "",
  externalRef: "",
  templateId: "",
}

function toDateInput(value: Date | null) {
  return formatDateOnlyInput(value)
}

export function dealToFormValues(
  deal: Pick<
    DealListItem,
    | "brandId"
    | "contactId"
    | "campaignName"
    | "dealValue"
    | "currency"
    | "stage"
    | "priority"
    | "startDate"
    | "dueDate"
    | "expectedCloseDate"
    | "paymentDueDate"
  > & {
    paymentTerms?: string | null
    campaignDescription?: string | null
    deliverablesSummary?: string | null
    notes?: string | null
    source?: string | null
    probability?: number | null
    externalRef?: string | null
  }
): DealFormValues {
  return {
    brandId: deal.brandId,
    contactId: deal.contactId ?? "",
    campaignName: deal.campaignName,
    dealValue: String(deal.dealValue),
    currency: deal.currency,
    stage: deal.stage,
    priority: deal.priority,
    startDate: toDateInput(deal.startDate),
    dueDate: toDateInput(deal.dueDate),
    expectedCloseDate: toDateInput(deal.expectedCloseDate),
    paymentDueDate: toDateInput(deal.paymentDueDate),
    paymentTerms: deal.paymentTerms ?? "",
    campaignDescription: deal.campaignDescription ?? "",
    deliverablesSummary: deal.deliverablesSummary ?? "",
    notes: deal.notes ?? "",
    source: deal.source ?? "",
    probability: deal.probability == null ? "" : String(deal.probability),
    externalRef: deal.externalRef ?? "",
    templateId: "",
  }
}

export function dealDetailToFormValues(deal: DealDetail) {
  return dealToFormValues(deal)
}

export function buildDealFormData(values: DealFormValues, dealId?: string) {
  const formData = new FormData()
  if (dealId) {
    formData.set("dealId", dealId)
  }

  formData.set("brandId", values.brandId)
  formData.set("contactId", values.contactId)
  formData.set("campaignName", values.campaignName)
  formData.set("dealValue", values.dealValue)
  formData.set("currency", values.currency)
  formData.set("stage", values.stage)
  formData.set("priority", values.priority)
  formData.set("startDate", values.startDate)
  formData.set("dueDate", values.dueDate)
  formData.set("expectedCloseDate", values.expectedCloseDate)
  formData.set("paymentDueDate", values.paymentDueDate)
  formData.set("paymentTerms", values.paymentTerms)
  formData.set("campaignDescription", values.campaignDescription)
  formData.set("deliverablesSummary", values.deliverablesSummary)
  formData.set("notes", values.notes)
  formData.set("source", values.source)
  formData.set("probability", values.probability)
  formData.set("externalRef", values.externalRef)
  formData.set("templateId", values.templateId)

  return formData
}
