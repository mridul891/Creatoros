import type {
  DeliverableApprovalStatus,
  DeliverableStatus,
} from "@/features/deliverables/enums/deliverable"
import type {
  DeliverableDetail,
  DeliverableListItem,
} from "@/features/deliverables/types/deliverable"
import { formatDateOnlyInput } from "@/lib/formatting/date-input"

export type DeliverableFormValues = {
  dealId: string
  platform: string
  deliverableType: string
  dueDate: string
  status: DeliverableStatus
  approvalStatus: DeliverableApprovalStatus
  submissionUrl: string
  publishedUrl: string
  internalNotes: string
  brandNotes: string
  revisionCount: string
  orderIndex: string
}

export const EMPTY_DELIVERABLE_FORM: DeliverableFormValues = {
  dealId: "",
  platform: "Instagram",
  deliverableType: "Reel",
  dueDate: "",
  status: "Draft",
  approvalStatus: "NotSubmitted",
  submissionUrl: "",
  publishedUrl: "",
  internalNotes: "",
  brandNotes: "",
  revisionCount: "0",
  orderIndex: "",
}

function toDateInput(value: Date | null) {
  return formatDateOnlyInput(value)
}

export function deliverableToFormValues(
  deliverable: Pick<
    DeliverableListItem,
    | "dealId"
    | "platform"
    | "deliverableType"
    | "dueDate"
    | "status"
    | "approvalStatus"
    | "submissionUrl"
    | "publishedUrl"
    | "internalNotes"
    | "brandNotes"
    | "revisionCount"
    | "orderIndex"
  >
): DeliverableFormValues {
  return {
    dealId: deliverable.dealId,
    platform: deliverable.platform,
    deliverableType: deliverable.deliverableType,
    dueDate: toDateInput(deliverable.dueDate),
    status: deliverable.status,
    approvalStatus: deliverable.approvalStatus,
    submissionUrl: deliverable.submissionUrl ?? "",
    publishedUrl: deliverable.publishedUrl ?? "",
    internalNotes: deliverable.internalNotes ?? "",
    brandNotes: deliverable.brandNotes ?? "",
    revisionCount: String(deliverable.revisionCount),
    orderIndex: String(deliverable.orderIndex),
  }
}

export function deliverableDetailToFormValues(deliverable: DeliverableDetail) {
  return deliverableToFormValues(deliverable)
}

export function buildDeliverableFormData(
  values: DeliverableFormValues,
  deliverableId?: string
) {
  const formData = new FormData()
  if (deliverableId) {
    formData.set("deliverableId", deliverableId)
  }

  formData.set("dealId", values.dealId)
  formData.set("platform", values.platform)
  formData.set("deliverableType", values.deliverableType)
  formData.set("dueDate", values.dueDate)
  formData.set("status", values.status)
  formData.set("approvalStatus", values.approvalStatus)
  formData.set("submissionUrl", values.submissionUrl)
  formData.set("publishedUrl", values.publishedUrl)
  formData.set("internalNotes", values.internalNotes)
  formData.set("brandNotes", values.brandNotes)
  formData.set("revisionCount", values.revisionCount)
  formData.set("orderIndex", values.orderIndex)

  return formData
}
