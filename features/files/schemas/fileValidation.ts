import { z } from "zod"

import { DEAL_FILE_CATEGORIES } from "@/features/files/enums/dealFile"

export const fileCreateSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  fileName: z
    .string()
    .trim()
    .min(1, "File name is required.")
    .max(255, "File name cannot exceed 255 characters."),
  storagePath: z
    .string()
    .trim()
    .min(1, "Storage path is required.")
    .max(1000, "Storage path cannot exceed 1000 characters."),
  mimeType: z.string().trim().max(255).optional(),
  sizeBytes: z.coerce.number().int().nonnegative().optional(),
  category: z.enum(DEAL_FILE_CATEGORIES),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const fileUpdateSchema = fileCreateSchema.extend({
  fileId: z.uuid("File id is invalid."),
})

export const fileListSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  search: z.string().trim().max(120).optional(),
  archive: z.enum(["active", "archived"]).default("active"),
  category: z.enum(DEAL_FILE_CATEGORIES).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
})

export const fileArchiveSchema = z.object({
  fileId: z.uuid("File id is invalid."),
})

export type FileCreateInput = z.infer<typeof fileCreateSchema>
export type FileUpdateInput = z.infer<typeof fileUpdateSchema>
export type FileListInput = z.infer<typeof fileListSchema>
