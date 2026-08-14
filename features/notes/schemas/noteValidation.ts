import { z } from "zod"

export const noteCreateSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(180, "Title cannot exceed 180 characters."),
  content: z
    .string()
    .trim()
    .min(1, "Note content cannot be empty.")
    .max(20000, "Note content cannot exceed 20000 characters."),
})

export const noteUpdateSchema = noteCreateSchema.extend({
  noteId: z.uuid("Note id is invalid."),
  isPinned: z.boolean().optional(),
})

export const noteListSchema = z.object({
  dealId: z.uuid("Deal id is invalid."),
  search: z.string().trim().max(120).optional(),
  archive: z.enum(["active", "archived"]).default("active"),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
})

export const noteArchiveSchema = z.object({
  noteId: z.uuid("Note id is invalid."),
})

export type NoteCreateInput = z.infer<typeof noteCreateSchema>
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>
export type NoteListInput = z.infer<typeof noteListSchema>
