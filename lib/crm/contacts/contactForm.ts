import type { ContactListItem } from "@/types/contact"

export type ContactFormValues = {
  name: string
  email: string
  phoneNumber: string
  jobTitle: string
  notes: string
  isPrimary: boolean
}

type ContactMutationData = {
  name: string
  email: string | null
  phoneNumber: string | null
  jobTitle: string | null
  notes: string | null
  isPrimary: boolean
}

export const EMPTY_CONTACT_FORM: ContactFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  jobTitle: "",
  notes: "",
  isPrimary: false,
}

export function contactToFormValues(contact: ContactListItem): ContactFormValues {
  return {
    name: contact.name,
    email: contact.email ?? "",
    phoneNumber: contact.phoneNumber ?? "",
    jobTitle: contact.jobTitle ?? "",
    notes: "",
    isPrimary: contact.isPrimary,
  }
}

export function contactMutationToFormValues(result: ContactMutationData): ContactFormValues {
  return {
    name: result.name,
    email: result.email ?? "",
    phoneNumber: result.phoneNumber ?? "",
    jobTitle: result.jobTitle ?? "",
    notes: result.notes ?? "",
    isPrimary: result.isPrimary,
  }
}

export function buildContactFormData(values: ContactFormValues, brandId: string, contactId?: string) {
  const formData = new FormData()
  formData.set("brandId", brandId)
  if (contactId) {
    formData.set("contactId", contactId)
  }

  formData.set("name", values.name)
  formData.set("email", values.email)
  formData.set("phoneNumber", values.phoneNumber)
  formData.set("jobTitle", values.jobTitle)
  formData.set("notes", values.notes)
  formData.set("isPrimary", String(values.isPrimary))

  return formData
}
