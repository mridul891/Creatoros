import type { Prisma } from "@prisma/client"

export const DEFAULT_DELIVERABLE_INVOICE_TEMPLATE_KEY =
  "campaign-deliverable-default"

type BuildDeliverableInvoiceMetadataInput = {
  deliverableId: string
  campaignName: string
  brandName: string | null
  contactName: string | null
  contactEmail: string | null
  platform: string
  deliverableType: string
  amount: number
  currency: string
  paymentTerms: string | null
  campaignDescription: string | null
  deliverablesSummary: string | null
  brandNotes: string | null
  submissionUrl: string | null
  publishedUrl: string | null
}

export function buildDeliverableInvoiceDescription(
  input: Pick<
    BuildDeliverableInvoiceMetadataInput,
    "campaignName" | "platform" | "deliverableType"
  >
) {
  return `${input.campaignName}: ${input.platform} ${input.deliverableType}`
}

export function buildDeliverableInvoiceMetadata(
  input: BuildDeliverableInvoiceMetadataInput
): Prisma.InputJsonObject {
  const description = buildDeliverableInvoiceDescription(input)

  return {
    source: "deliverable",
    deliverableId: input.deliverableId,
    templateKey: DEFAULT_DELIVERABLE_INVOICE_TEMPLATE_KEY,
    campaignName: input.campaignName,
    brandName: input.brandName,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    platform: input.platform,
    deliverableType: input.deliverableType,
    paymentTerms: input.paymentTerms,
    campaignDescription: input.campaignDescription,
    deliverablesSummary: input.deliverablesSummary,
    brandNotes: input.brandNotes,
    submissionUrl: input.submissionUrl,
    publishedUrl: input.publishedUrl,
    lineItems: [
      {
        description,
        quantity: 1,
        amount: input.amount,
        currency: input.currency,
      },
    ],
  }
}
