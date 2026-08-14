import { z } from "zod"

import { CONTACT_FILTERS } from "@/features/contacts/enums/contact"

const PHONE_REGEX = /^[+()\-.\s0-9]{7,20}$/

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Contact name must be at least 2 characters.")
    .max(120, "Contact name cannot exceed 120 characters."),
  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase()
    .max(320, "Email cannot exceed 320 characters.")
    .optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(PHONE_REGEX, "Please enter a valid phone number.")
    .max(30, "Phone number cannot exceed 30 characters.")
    .optional(),
  jobTitle: z
    .string()
    .trim()
    .max(120, "Position cannot exceed 120 characters.")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(5000, "Notes cannot exceed 5000 characters.")
    .optional(),
  isPrimary: z.boolean().default(false),
})

export const contactListSchema = z.object({
  brandId: z.uuid("Brand id is invalid."),
  search: z.string().trim().max(120).optional(),
  status: z.enum(CONTACT_FILTERS).default("active"),
})

export function normalizeContactName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim()
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}
