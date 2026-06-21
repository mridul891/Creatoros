"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireOnboardedUser } from "@/lib/auth/require-user"
import {
  contactListSchema,
  contactSchema,
  sanitizeOptionalString,
} from "@/lib/crm/contacts/contactValidation"
import {
  archiveContact,
  ContactServiceError,
  createContact,
  getContact,
  listContactsByBrand,
  updateContact,
} from "@/lib/crm/contacts/contactService"
import type { ContactField, ContactListData } from "@/types/contact"

export type ContactMutationResult = {
  success: boolean
  message?: string
  data?: {
    id: string
    brandId: string
    name: string
    email: string | null
    phoneNumber: string | null
    jobTitle: string | null
    notes: string | null
    isPrimary: boolean
    status: "Active" | "Archived"
    archivedAt: Date | null
    createdAt: Date
    updatedAt: Date
  }
  fieldErrors?: Partial<Record<ContactField, string>>
}

export type ContactListResult = {
  success: boolean
  message?: string
  data?: ContactListData
}

type ContactGetResult =
  | {
      success: true
      data: ContactMutationResult["data"]
    }
  | {
      success: false
      message: string
    }

function getFieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const fields: Partial<Record<ContactField, string>> = {}

  for (const issue of error.issues) {
    const path = issue.path[0]
    if (typeof path !== "string") {
      continue
    }

    const field = path as ContactField
    if (!fields[field]) {
      fields[field] = issue.message
    }
  }

  return fields
}

function parseContactFormData(formData: FormData) {
  return contactSchema.safeParse({
    name: formData.get("name"),
    email: sanitizeOptionalString(formData.get("email")),
    phoneNumber: sanitizeOptionalString(formData.get("phoneNumber")),
    jobTitle: sanitizeOptionalString(formData.get("jobTitle")),
    notes: sanitizeOptionalString(formData.get("notes")),
    isPrimary: formData.get("isPrimary") === "true",
  })
}

function mapServiceErrorToMutationResult(error: unknown, fallbackMessage: string): ContactMutationResult {
  if (error instanceof ContactServiceError) {
    if (error.code === "DUPLICATE" && error.field) {
      return {
        success: false,
        message: error.message,
        fieldErrors: {
          [error.field]: error.message,
        },
      }
    }

    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: false,
    message: fallbackMessage,
  }
}

function revalidateContactPaths(brandId: string) {
  revalidatePath(`/dashboard/brands/${brandId}`)
  revalidatePath("/dashboard/brands")
}

export async function listContactsByBrandAction(input: {
  brandId: string
  search?: string
  status?: string
}): Promise<ContactListResult> {
  const user = await requireOnboardedUser()
  const parsed = contactListSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid list contacts request.",
    }
  }

  try {
    const data = await listContactsByBrand(user.id, parsed.data)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof ContactServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }

    console.error("contacts.list_failed", { userId: user.id, input: parsed.data, error })
    return {
      success: false,
      message: "We could not load contacts. Please try again.",
    }
  }
}

export async function getContactAction(brandId: string, contactId: string): Promise<ContactGetResult> {
  const user = await requireOnboardedUser()

  if (!brandId || !contactId) {
    return {
      success: false,
      message: "Brand and contact id are required.",
    }
  }

  try {
    const data = await getContact(user.id, brandId, contactId)
    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof ContactServiceError) {
      return {
        success: false,
        message: error.message,
      }
    }

    console.error("contacts.get_failed", { userId: user.id, brandId, contactId, error })
    return {
      success: false,
      message: "We could not load this contact. Please try again.",
    }
  }
}

export async function createContactAction(formData: FormData): Promise<ContactMutationResult> {
  const user = await requireOnboardedUser()
  const brandId = formData.get("brandId")

  if (typeof brandId !== "string" || brandId.length === 0) {
    return {
      success: false,
      message: "Brand id is required.",
    }
  }

  const parsed = parseContactFormData(formData)
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const data = await createContact(user.id, {
      brandId,
      ...parsed.data,
    })

    revalidateContactPaths(brandId)

    return {
      success: true,
      message: "Contact created successfully.",
      data,
    }
  } catch (error) {
    console.error("contacts.create_failed", { userId: user.id, brandId, error })
    return mapServiceErrorToMutationResult(error, "We could not create this contact. Please try again.")
  }
}

export async function updateContactAction(formData: FormData): Promise<ContactMutationResult> {
  const user = await requireOnboardedUser()
  const brandId = formData.get("brandId")
  const contactId = formData.get("contactId")

  if (typeof brandId !== "string" || brandId.length === 0) {
    return {
      success: false,
      message: "Brand id is required.",
    }
  }

  if (typeof contactId !== "string" || contactId.length === 0) {
    return {
      success: false,
      message: "Contact id is required.",
    }
  }

  const parsed = parseContactFormData(formData)
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: getFieldErrors(parsed.error),
    }
  }

  try {
    const data = await updateContact(user.id, {
      brandId,
      contactId,
      ...parsed.data,
    })

    revalidateContactPaths(brandId)

    return {
      success: true,
      message: "Contact updated successfully.",
      data,
    }
  } catch (error) {
    console.error("contacts.update_failed", { userId: user.id, brandId, contactId, error })
    return mapServiceErrorToMutationResult(error, "We could not update this contact. Please try again.")
  }
}

export async function archiveContactAction(brandId: string, contactId: string): Promise<ContactMutationResult> {
  const user = await requireOnboardedUser()

  if (!brandId || !contactId) {
    return {
      success: false,
      message: "Brand and contact id are required.",
    }
  }

  try {
    await archiveContact(user.id, brandId, contactId)
    revalidateContactPaths(brandId)
    return {
      success: true,
      message: "Contact archived successfully.",
    }
  } catch (error) {
    if (!(error instanceof ContactServiceError)) {
      console.error("contacts.archive_failed", { userId: user.id, brandId, contactId, error })
    }

    return mapServiceErrorToMutationResult(error, "We could not archive this contact. Please try again.")
  }
}
